const { GoogleGenAI } = require("@google/genai");
const { pipeline } = require("@xenova/transformers");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let knowledgeBase = [];
let extractor = null;

async function getExtractor() {
  if (!extractor) {
    console.log('🔄 Carregando modelo de embeddings...');
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log('✅ Modelo carregado!');
  }
  return extractor;
}

async function ingestContent() {
  const conteudoDir = path.join(__dirname, "..", "conteudo");
  if (!fs.existsSync(conteudoDir)) {
    fs.mkdirSync(conteudoDir);
    console.log("⚠️ Pasta 'conteudo' criada. Adicione seus arquivos .txt nela.");
    return;
  }
  const files = fs.readdirSync(conteudoDir);
  const chunks = [];
  const extractor = await getExtractor();

  for (const file of files) {
    if (!file.endsWith(".txt") && !file.endsWith(".md")) continue;
    const content = fs.readFileSync(path.join(conteudoDir, file), "utf-8");
    const chunkSize = 400;
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      if (chunk.trim().length > 50) {
        chunks.push({ texto: chunk.trim(), arquivo: file });
      }
    }
  }

  for (const chunk of chunks) {
    const embedding = await extractor(chunk.texto, { pooling: "mean", normalize: true });
    chunk.embedding = Array.from(embedding.data);
  }

  knowledgeBase = chunks;
  console.log(`✅ ${chunks.length} chunks carregados.`);
}

function findRelevantChunks(questionEmbedding, topK = 2) {
  const similarities = knowledgeBase.map((chunk) => {
    let dot = 0;
    for (let i = 0; i < questionEmbedding.length; i++) {
      dot += questionEmbedding[i] * chunk.embedding[i];
    }
    return { ...chunk, score: dot };
  });
  similarities.sort((a, b) => b.score - a.score);
  return similarities.slice(0, topK);
}

async function askRAG(pergunta) {
  if (knowledgeBase.length === 0) {
    await ingestContent();
  }

  const extractor = await getExtractor();
  const questionEmbedding = await extractor(pergunta, { pooling: "mean", normalize: true });
  const qEmbeddingArray = Array.from(questionEmbedding.data);

  const relevantChunks = findRelevantChunks(qEmbeddingArray);
  if (relevantChunks.length === 0) {
    return "Desculpe, não encontrei informações sobre esse assunto no nosso site.";
  }

  const contexto = relevantChunks.map(c => c.texto).join("\n\n").slice(0, 1500);

  const prompt = `
Você é um assistente do site TEAjudo, especializado em TEA.
Responda APENAS com as informações abaixo. Se não souber, diga que não encontrou.

### INFORMAÇÕES DO SITE:
${contexto}

### PERGUNTA:
${pergunta}

### RESPOSTA (use apenas as informações acima):
`;

  const response = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
  });

  return response.output_text;
}

module.exports = { askRAG, ingestContent };