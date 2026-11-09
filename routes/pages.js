const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");
const Conversa = require("../models/conversa");

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

// Rota do Chat
router.get("/ia", async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/login");
  }

  try {
    let conversaId;
    let historico = await Conversa.listar(req.session.usuarioId);

    // Se a URL tiver ?nova=true (botão Nova Conversa)
    if (req.query.nova === 'true') {
      conversaId = await Conversa.criar("Nova conversa", req.session.usuarioId);
      historico = await Conversa.listar(req.session.usuarioId); // Recarrega a lista com a nova
    } 
    // Se for acesso normal (voltando de outra página, por exemplo)
    else {
      // Se já tem conversas, abre a mais recente (a primeira da lista)
      if (historico.length > 0) {
        conversaId = historico[0].id;
      } 
      // Se for o primeiro acesso dele ao chat, cria a primeira conversa
      else {
        conversaId = await Conversa.criar("Nova conversa", req.session.usuarioId);
        historico = await Conversa.listar(req.session.usuarioId);
      }
    }

    res.render("ia", { 
      conversaId: conversaId, 
      historico: historico 
    });
  } catch (error) {
    console.error("Erro no chat:", error);
    res.status(500).send("Erro ao carregar o chat.");
  }
});

// Rota do Perfil
router.get("/perfil", async (req, res) => {
  if (!req.session.usuarioId) {
    return res.redirect("/login");
  }

  try {
    const usuario = await Usuario.buscarPorId(req.session.usuarioId);
    const historico = await Conversa.listar(req.session.usuarioId);

    res.render("perfil", { usuario, historico });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    res.status(500).send("Erro ao carregar o perfil.");
  }
});

// Rota de Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;