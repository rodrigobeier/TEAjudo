const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

// Rota de cadastro (com tratamento de erros)
router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se o e-mail já existe
    const existe = await Usuario.buscarPorEmail(email);
    if (existe) {
      return res.status(400).send("Este e-mail já está cadastrado.");
    }

    // Tenta cadastrar
    await Usuario.cadastrar(nome, email, senha);
    return res.redirect("/login");
  } catch (error) {
    console.error("Erro no cadastro:", error);
    // Se for erro de duplicidade (código 1062)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).send("Este e-mail já está cadastrado.");
    }
    // Qualquer outro erro
    return res.status(500).send("Erro interno ao cadastrar. Tente novamente.");
  }
});

module.exports = router;