import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(buffer, mimetype) {
  if (mimetype === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text || "";
  }

  if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  return "";
}
