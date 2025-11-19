import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model used for reasoning
const MODEL = "gemini-2.5-flash";

export async function scoreRoleWithGemini(resumeText, role) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `
You are an ATS + Job Fit Analyzer.
Compare this resume with the given job role.
Return ONLY valid JSON. No extra text.

### Resume:
${resumeText}

### Role:
Company: ${role.company_name}
Title: ${role.role_title}
Description: ${role.description}
Required Skills: ${JSON.stringify(role.required_skills)}

### Output JSON Format:
{
  "score": number (0-100),
  "strengths": [list of strings],
  "gaps": [list of strings],
  "summary": "short summary"
}

Make sure:
- Score is an integer between 0-100.
- JSON only. No markdown.
    `;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    // Remove accidental markdown wrappers
    if (text.startsWith("```")) {
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    // Parse JSON safely
    const data = JSON.parse(text);

    return {
      score: data.score ?? 0,
      strengths: data.strengths ?? [],
      gaps: data.gaps ?? [],
      summary: data.summary ?? "",
    };

  } catch (err) {
    console.error("Gemini scoring error:", err);
    return {
      score: 0,
      strengths: [],
      gaps: [],
      summary: "Unable to generate summary due to an internal error."
    };
  }
}
