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
    console.log('Carregando modelo de embeddings...');
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log('Modelo carregado!');
  }
  return extractor;
}

async function ingestContent() {
  const conteudoDir = path.join(__dirname, "..", "conteudo");
  if (!fs.existsSync(conteudoDir)) {
    fs.mkdirSync(conteudoDir);
    console.log("Pasta 'conteudo' criada. Adicione seus arquivos .txt nela.");
    return;
  }
  const files = fs.readdirSync(conteudoDir);
  const chunks = [];
  const extractor = await getExtractor();

  for (const file of files) {
    if (!file.endsWith(".txt") && !file.endsWith(".md")) continue;
    const content = fs.readFileSync(path.join(conteudoDir, file), "utf-8");
    
    // AUMENTADO PARA 1000 PARA PEGAR O TEXTO INTEIRO DOS NÍVEIS JUNTOS
    const chunkSize = 1000; 
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
  console.log(`${chunks.length} chunks carregados.`);
}

function findRelevantChunks(questionEmbedding, topK = 5) { // AUMENTADO PARA 5
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

async function askRAG(pergunta, historico = "") {
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

  const contexto = relevantChunks.map(c => c.texto).join("\n\n").slice(0, 3000);

  // NOVO PROMPT: Ensina a usar o histórico e não usar asteriscos
  const prompt = `
Você é o assistente virtual do TEAjudo, especializado em Transtorno do Espectro Autista (TEA).
Seu objetivo é ajudar pais, cuidadores e pessoas autistas com informações acolhedoras e precisas.

DIRETRIZES:
1. Use APENAS as informações do "CONTEXTO DO SITE" para responder.
2. Use o "HISTÓRICO DA CONVERSA" para entender a que o usuário se refere (por exemplo, se ele usar palavras como "eles", "isso", "detalhe mais").
3. Se a resposta não estiver no contexto, diga educadamente que não encontrou a informação no site.
4. Se o usuário pedir para detalhar mais, busque no contexto todos os detalhes disponíveis sobre o assunto.
5. Formate a resposta em tópicos ou parágrafos curtos.
6. NÃO use asteriscos (**) para formatar o texto.

### HISTÓRICO DA CONVERSA:
${historico}

### CONTEXTO DO SITE:
${contexto}

### PERGUNTA ATUAL DO USUÁRIO:
${pergunta}

### SUA RESPOSTA:
`;

  const response = await ai.interactions.create({
    model: "gemini-3.5-flash-lite", // Mantive o modelo lite que você estava usando
    input: prompt,
  });

  return response.output_text;
}

module.exports = { askRAG, ingestContent };