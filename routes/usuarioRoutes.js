const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    const existe = await Usuario.buscarPorEmail(email);
    
    if (existe) {
      // Em vez de tela branca, volta para o cadastro com a mensagem de erro
      return res.render("cadastro", { erro: "Este e-mail já está cadastrado. Tente outro." });
    }

    await Usuario.cadastrar(nome, email, senha);
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.render("cadastro", { erro: "Erro interno ao cadastrar. Tente novamente." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario || usuario.senha !== senha) {
      // Em vez de tela branca, volta para o login com a mensagem de erro
      return res.render("login", { erro: "E-mail ou senha incorretos." });
    }

    req.session.usuarioId = usuario.id;
    return res.redirect("/perfil");
  } catch (error) {
    console.error(error);
    return res.render("login", { erro: "Erro interno ao fazer login." });
  }
});

module.exports = router;