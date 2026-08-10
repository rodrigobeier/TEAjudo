require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

console.log('Iniciando teste...');
console.log('Chave:', process.env.GEMINI_API_KEY ? '✅ Definida' : '❌ Não definida');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    console.log('Enviando requisição para Gemini...');
    const response = await ai.interactions.create({
      model: "gemini-1.5-flash", // Use este modelo mais estável
      input: "O que é o TEA?",
    });
    console.log('Resposta:', response.output_text);
  } catch (err) {
    console.error('❌ Erro detalhado:', err);
  }
}

test();