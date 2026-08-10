const { Conversa } = require('../models/conversa');

module.exports = {
  async index(req, res) {
    try {
      const conversas = await Conversa.findAll();
      return res.json(conversas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar conversas' });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      const conversa = await Conversa.findByPk(id);
      if (!conversa) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      return res.json(conversa);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar conversa' });
    }
  },

  async store(req, res) {
    try {
      const { titulo, usuario_id } = req.body;
      const novaConversa = await Conversa.create({ titulo, usuario_id });
      return res.status(201).json(novaConversa);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar conversa' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { titulo, usuario_id } = req.body;
      const conversa = await Conversa.findByPk(id);
      if (!conversa) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      await conversa.update({ titulo, usuario_id });
      return res.json(conversa);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar conversa' });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const conversa = await Conversa.findByPk(id);
      if (!conversa) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      await conversa.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar conversa' });
    }
  }
};