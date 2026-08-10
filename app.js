const express = require("express");
const path = require("path");
const db = require("./database/db.js");
const app = express();

// Configurações da view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // explícito, mas opcional

// Middlewares
app.use(express.json());              // para ler requisições com JSON
app.use(express.urlencoded({ extended: true })); // para ler formulários HTML
app.use(express.static(path.join(__dirname, "public")));

// Rotas
// Rotas de páginas (front-end)
app.use("/", require("./routes/pages.js"));

// Rotas de API (back-end)
app.use("/api/usuarios", require("./routes/usuarioRoutes.js"));
app.use("/api/conversas", require("./routes/conversaRoutes.js"));
app.use("/api/mensagens", require("./routes/mensagemRoutes.js"));

// ✅ CORRETO (CommonJS)
const { ingestContent } = require("./services/ragService.js");

// Carrega a base de conhecimento ao iniciar
ingestContent().then(() => {
  console.log("📚 Base de conhecimento carregada!");
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});