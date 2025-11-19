import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini embedding model name:
const MODEL = "text-embedding-004";

export async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.embedContent(text);

    const embedding = result.embedding.values; // returns number[]

    return embedding;
  } catch (err) {
    console.error("Embedding error:", err);
    return result.embedding.values.map(() => 0); // return zero vector on error
  }
}
