const { Usuario } = require('../models/usuario');

module.exports = {
  // Listar todos os usuários
  async index(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      return res.json(usuarios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },

  // Buscar um usuário por ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  async store(req, res) {
    try {
        const { nome, email, senha } = req.body;
        // Aqui você pode adicionar validações e hash de senha
        const novoUsuario = await Usuario.create({ nome, email, senha });
        return res.status(201).json(novoUsuario);
    } catch (error) {
        console.error(error);
        // Verifica se é erro de duplicidade (código 1062 no MySQL)
        if (error.name === 'SequelizeUniqueConstraintError' || error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }
        // Outros erros
        return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

  // Atualizar um usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      await usuario.update({ nome, email, senha });
      return res.json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  // Deletar um usuário
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      await usuario.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
};