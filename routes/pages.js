const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/informacoes", (req, res) => {
  res.render("inclusao");
});

router.get("/sobre", (req, res) => {
  res.render("sobre");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

// Rota do Chat: exige login
router.get("/ia", (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/login");
  }
  res.render("ia");
});

// Rota do Perfil: exige login e busca dados no banco
router.get("/perfil", async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/login");
  }

  try {
    const usuario = await Usuario.buscarPorId(req.session.usuarioId);
    res.render("perfil", { usuario });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    res.status(500).send("Erro ao carregar o perfil.");
  }
});

// Rota de Logout: encerra a sessão e volta para a home
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;