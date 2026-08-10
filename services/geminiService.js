const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Função simples para perguntar ao Gemini
 */
async function askGemini(pergunta) {
  const response = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: pergunta,
  });
  return response.output_text;
}

module.exports = { askGemini };