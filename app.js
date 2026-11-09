process.on('uncaughtException', (err) => {
  console.error('Exceção não tratada:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Promise rejeitada:', reason?.message || reason);
});

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session"); // <-- ADICIONADO AQUI
const { ingestContent } = require("./services/ragService");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// CONFIGURAÇÃO DA SESSÃO (DEVE FICAR ANTES DAS ROTAS)
app.use(session({
  secret: 'teajudo-chave-secreta-2026', 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Mude para true quando for para o Render
    maxAge: 1000 * 60 * 60 * 24 // 1 dia
  }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use("/", require("./routes/pages"));

app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/conversas", require("./routes/conversaRoutes"));
app.use("/api/mensagens", require("./routes/mensagemRoutes"));

ingestContent().then(() => {
  console.log("Base de conhecimento carregada!");
}).catch(err => {
  console.error("Erro ao carregar base:", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});