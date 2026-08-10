const Mensagem = require('../models/mensagem'); // importação correta (sem desestruturação)
const { askRAG } = require('../services/ragService');

module.exports = {
  // 1. LISTAR MENSAGENS DE UMA CONVERSA
  async index(req, res) {
    const { conversa_id } = req.query;
    if (!conversa_id) {
      return res.status(400).json({ error: 'conversa_id é obrigatório' });
    }

    Mensagem.listar(conversa_id, (err, mensagens) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao listar mensagens' });
      }
      return res.json(mensagens);
    });
  },

  // 2. CRIAR UMA NOVA MENSAGEM (E CHAMAR A IA)
  async store(req, res) {
    try {
      const { conversa_id, autor, texto } = req.body;

      // Salva a mensagem do usuário
      Mensagem.salvar(conversa_id, autor, texto, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao salvar mensagem' });
        }

        // Se a mensagem veio de um usuário, chama a IA
        if (autor === 'usuario') {
          try {
            const respostaIA = await askRAG(texto);

            // Salva a resposta da IA
            Mensagem.salvar(conversa_id, 'ia', respostaIA, (errIa, resultIa) => {
              if (errIa) {
                console.error(errIa);
                return res.status(201).json({
                  mensagemUsuario: { conversa_id, autor, texto },
                  erroIA: 'Erro ao salvar resposta da IA'
                });
              }
              return res.status(201).json({
                mensagemUsuario: { conversa_id, autor, texto },
                mensagemIA: { conversa_id, autor: 'ia', texto: respostaIA }
              });
            });
          } catch (error) {
            console.error(error);
            return res.status(201).json({
              mensagemUsuario: { conversa_id, autor, texto },
              erroIA: 'Erro ao gerar resposta da IA'
            });
          }
        } else {
          // Se for mensagem da IA ou sistema, retorna apenas ela
          return res.status(201).json({ mensagem: { conversa_id, autor, texto } });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao processar mensagem' });
    }
  },

  // 3. (OPCIONAL) ATUALIZAR MENSAGEM
  async update(req, res) {
    try {
      const { id } = req.params;
      const { texto } = req.body;
      // Se você tiver um método de atualização no modelo, use-o aqui.
      // Exemplo: Mensagem.atualizar(id, texto, callback)
      // Como não temos, retornamos erro.
      return res.status(501).json({ error: 'Atualização não implementada' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
  },

  // 4. DELETAR MENSAGEM
  async destroy(req, res) {
    try {
      const { id } = req.params;
      // Se você tiver um método de deletar no modelo, use-o aqui.
      // Exemplo: Mensagem.deletar(id, callback)
      // Como não temos, retornamos erro.
      return res.status(501).json({ error: 'Deleção não implementada' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar mensagem' });
    }
  }

};