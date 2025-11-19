import dotenv from "dotenv";
import { Client } from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();

  // ✔ Correct columns
  const roles = await client.query(
    "SELECT id, role_title, description FROM roles"
  );

  for (const role of roles.rows) {
    console.log("Embedding for:", role.role_title);

    const text = `${role.role_title}\n${role.description}`;

    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    // ✔ Convert to valid JSON array string
    const vectorString = JSON.stringify(embedding);

    await client.query(
      `UPDATE roles SET embedding = $1 WHERE id = $2`,
      [vectorString, role.id]
    );

    console.log("Saved embedding for:", role.role_title);
  }

  await client.end();
  console.log("Embedding generation complete!");
}

run().catch(console.error);
