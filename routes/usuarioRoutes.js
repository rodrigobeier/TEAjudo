const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const existe = await Usuario.buscarPorEmail(email);
    if (existe) return res.status(400).send("E-mail já cadastrado.");

    await Usuario.cadastrar(nome, email, senha);
    return res.redirect("/login");
  } catch (error) {
    return res.status(500).send("Erro ao cadastrar.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario || usuario.senha !== senha) {
      return res.status(400).send("E-mail ou senha incorretos.");
    }

    req.session.usuarioId = usuario.id;
    return res.redirect("/perfil");
  } catch (error) {
    return res.status(500).send("Erro no login.");
  }
});

module.exports = router;