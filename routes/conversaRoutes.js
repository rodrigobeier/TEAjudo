const express = require("express");
const router = express.Router();
const Conversa = require("../models/conversa");

// Criar uma nova conversa
router.post("/", async (req, res) => {
  try {
    if (!req.session.usuarioId) {
      return res.status(401).json({ error: "Usuário não logado" });
    }

    const { titulo } = req.body;
    const novaConversaId = await Conversa.criar(titulo || "Nova conversa", req.session.usuarioId);
    
    res.status(201).json({ id: novaConversaId, titulo: titulo });
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    res.status(500).json({ error: "Erro ao criar conversa" });
  }
});

// Listar conversas do usuário logado
router.get("/", async (req, res) => {
  try {
    if (!req.session.usuarioId) {
      return res.status(401).json({ error: "Usuário não logado" });
    }

    const conversas = await Conversa.listar(req.session.usuarioId);
    res.json(conversas);
  } catch (error) {
    console.error("Erro ao listar conversas:", error);
    res.status(500).json({ error: "Erro ao listar conversas" });
  }
});

module.exports = router;