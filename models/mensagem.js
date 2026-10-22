const db = require("../database/db");

const Mensagem = {
  async salvar(conversa_id, autor, texto, callback) {
    const sql = `
      INSERT INTO mensagens (conversa_id, autor, texto)
      VALUES (?, ?, ?)
    `;
    try {
      const [result] = await db.query(sql, [conversa_id, autor, texto]);
      callback(null, result);
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err.message);
      callback(err);
    }
  },

  async listar(conversa_id, callback) {
    const sql = `
      SELECT * FROM mensagens
      WHERE conversa_id = ?
      ORDER BY data_envio
    `;
    try {
      const [rows] = await db.query(sql, [conversa_id]);
      callback(null, rows);
    } catch (err) {
      console.error('Erro ao listar mensagens:', err.message);
      callback(err);
    }
  }
};

module.exports = Mensagem;