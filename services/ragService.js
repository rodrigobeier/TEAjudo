const { GoogleGenAI } = require("@google/genai");
const { pipeline } = require("@xenova/transformers");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Banco de conhecimento em memória
let knowledgeBase = [];

/**
 * Carrega todos os arquivos .txt da pasta conteudo/ e gera embeddings
 */
async function ingestContent() {
  const conteudoDir = path.join(__dirname, "..", "conteudo");

  if (!fs.existsSync(conteudoDir)) {
    fs.mkdirSync(conteudoDir);
    console.log("⚠️ Pasta 'conteudo' criada. Adicione seus arquivos .txt nela.");
    return;
  }

  const files = fs.readdirSync(conteudoDir);
  const chunks = [];

  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  for (const file of files) {
    if (!file.endsWith(".txt") && !file.endsWith(".md")) continue;

    const content = fs.readFileSync(path.join(conteudoDir, file), "utf-8");

    const chunkSize = 500;
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      if (chunk.trim().length > 50) {
        chunks.push({
          texto: chunk.trim(),
          arquivo: file,
        });
      }
    }
  }

  for (const chunk of chunks) {
    const embedding = await extractor(chunk.texto, { pooling: "mean", normalize: true });
    chunk.embedding = Array.from(embedding.data);
  }

  knowledgeBase = chunks;
  console.log(`✅ ${chunks.length} chunks carregados na base de conhecimento.`);
}

/**
 * Encontra os chunks mais relevantes para a pergunta
 */
function findRelevantChunks(questionEmbedding, topK = 3) {
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

/**
 * Pergunta ao RAG (busca + geração com Gemini)
 */
async function askRAG(pergunta) {
  if (knowledgeBase.length === 0) {
    await ingestContent();
  }

  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const questionEmbedding = await extractor(pergunta, { pooling: "mean", normalize: true });
  const qEmbeddingArray = Array.from(questionEmbedding.data);

  const relevantChunks = findRelevantChunks(qEmbeddingArray);

  if (relevantChunks.length === 0) {
    return "Desculpe, não encontrei informações sobre esse assunto no nosso site. Que tal perguntar sobre outro tema?";
  }

  const contexto = relevantChunks.map((c) => c.texto).join("\n\n");

 const prompt = `
Você é um assistente do site TEAjudo, especializado em Transtorno do Espectro Autista.
Responda à pergunta do usuário usando APENAS as informações fornecidas abaixo.
Se a resposta não estiver no texto, diga que não encontrou a informação.

**Formate sua resposta de forma clara:**
- Use **tópicos** com marcadores (ex: "- " ou "• ") para listar itens.
- Separe cada tópico com uma quebra de linha.
- Dê preferência a respostas concisas e organizadas.

### INFORMAÇÕES DO SITE:
${contexto}

### PERGUNTA DO USUÁRIO:
${pergunta}

### SUA RESPOSTA (use apenas as informações acima):
`;

  const response = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
  });

  return response.output_text;

  
}

module.exports = { askRAG, ingestContent };