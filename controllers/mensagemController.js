const Mensagem = require('../models/mensagem');
const { askRAG } = require('../services/ragService');

module.exports = {
  async index(req, res) {
    const { conversa_id } = req.query;
    if (!conversa_id) {
      return res.status(400).json({ error: 'conversa_id é obrigatório' });
    }
    Mensagem.listar(conversa_id, (err, mensagens) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao listar' });
      }
      return res.json(mensagens);
    });
  },

  async store(req, res) {
    console.log('[STORE] Recebido:', req.body);
    try {
      const { conversa_id, autor, texto } = req.body;

      Mensagem.salvar(conversa_id, autor, texto, async (err) => {
        if (err) {
          console.error('[STORE] Erro ao salvar:', err.message);
          return res.status(500).json({ error: 'Erro ao salvar mensagem' });
        }

        if (autor === 'usuario') {
          try {
            console.log('[STORE] Chamando askRAG...');
            const respostaIA = await askRAG(texto);
            console.log('[STORE] Resposta da IA:', respostaIA);

            Mensagem.salvar(conversa_id, 'ia', respostaIA, (errIa) => {
              if (errIa) {
                console.error('[STORE] Erro ao salvar IA:', errIa.message);
              }
              return res.status(201).json({
                mensagemUsuario: { conversa_id, autor, texto },
                mensagemIA: { conversa_id, autor: 'ia', texto: respostaIA }
              });
            });
          } catch (error) {
            console.error('[STORE] Erro no askRAG:', error.message);
            return res.status(201).json({
              mensagemUsuario: { conversa_id, autor, texto },
              erroIA: 'Erro ao gerar resposta'
            });
          }
        } else {
          return res.status(201).json({ mensagem: { conversa_id, autor, texto } });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno' });
    }
  },

  update(req, res) {
    return res.status(501).json({ error: 'Não implementado' });
  },

  destroy(req, res) {
    return res.status(501).json({ error: 'Não implementado' });
  }
};