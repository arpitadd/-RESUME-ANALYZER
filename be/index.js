import express from "express";
import 'dotenv/config';
import cors from "cors";
import multer from "multer";
import { extractText } from "./src/extractText.js";
import { deterministicAtsChecks } from "./src/ats.js";
import { generateEmbedding } from "./src/generateEmbedding.js";
import { scoreRoleWithGemini } from "./src/scoreRoleWithGemini.js";
import { pool } from "./src/db.js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// MAIN ENDPOINT
app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { buffer, mimetype } = req.file;

    // 1. Extract text
    const text = await extractText(buffer, mimetype);

    // 2. Generate embedding
    const resumeEmbedding = await generateEmbedding(text);

    // 3. Fetch all roles (since embedding is TEXT)
    const { rows: allRoles } = await pool.query(
      "SELECT id, company_name, role_title, description, required_skills, embedding FROM roles"
    );

    // 4. Compute cosine similarity manually
    const scoredRoles = allRoles.map(role => {
      const roleEmbedding = JSON.parse(role.embedding); // parse string → array
      const similarity = cosineSimilarity(resumeEmbedding, roleEmbedding);
      return { ...role, similarity };
    });

    // Sort by similarity
    scoredRoles.sort((a, b) => b.similarity - a.similarity);

    // Pick top 10
    const roles = scoredRoles.slice(0, 10);

    // 5. ATS + Gemini scoring
    const recommendations = [];

    for (const role of roles) {
      const roleKeywords = role.required_skills || [];

      const ats = deterministicAtsChecks(text, roleKeywords);
      const geminiFit = await scoreRoleWithGemini(text, role);

      const finalAts = ats.ruleScore + ats.keywordScore;

      recommendations.push({
        company_name: role.company_name,
        role_title: role.role_title,
        fit_score: geminiFit.score,
        strengths: geminiFit.strengths,
        gaps: geminiFit.gaps,
        summary: geminiFit.summary,
        similarity: role.similarity,
        ats_score: finalAts,
        ats_issues: ats.issues
      });
    }

    res.json({
      ats_score: recommendations.length ? recommendations[0].ats_score : 0,
      recommendations
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Backend running on port", port));
