const { Usuario } = require('../models/usuario');

module.exports = {
  // Listar todos os usuários
  async index(req, res) {
    try {
      Usuario.listar((err, usuarios) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao listar usuários' });
        }
        return res.json(usuarios);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },

  // Buscar um usuário por ID
  async show(req, res) {
    try {
      const { id } = req.params;
      Usuario.buscarPorId(id, (err, usuario) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        if (!usuario) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.json(usuario);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  // Criar um novo usuário (cadastro)
  async store(req, res) {
    try {
      const { nome, email, senha } = req.body;

      // Chama o método salvar do modelo (com callback)
      Usuario.salvar(nome, email, senha, (err, result) => {
        if (err) {
          console.error('Erro no cadastro:', err);
          // Verifica se é erro de e-mail duplicado (código 1062 no MySQL)
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
          }
          return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
        // Sucesso: retorna o ID do novo usuário (ou mensagem)
        return res.status(201).json({
          message: 'Usuário criado com sucesso!',
          id: result.insertId // se o banco retornar insertId
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno' });
    }
  },

  // Atualizar um usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      Usuario.atualizar(id, nome, email, senha, (err, result) => {
        if (err) {
          console.error(err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'E-mail já está em uso.' });
          }
          return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.json({ message: 'Usuário atualizado com sucesso!' });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  // Deletar um usuário
  async destroy(req, res) {
    try {
      const { id } = req.params;

      Usuario.deletar(id, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.status(204).send(); // sem conteúdo
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
};