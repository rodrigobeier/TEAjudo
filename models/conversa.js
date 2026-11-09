const db = require("../database/db");

const Conversa = {
  async criar(titulo, usuario_id) {
    const sql = `
      INSERT INTO conversas (titulo, usuario_id)
      VALUES (?, ?)
    `;
    const [result] = await db.query(sql, [titulo, usuario_id]);
    return result.insertId;
  },

  async listar(usuario_id) {
    const sql = `
      SELECT * FROM conversas
      WHERE usuario_id = ?
      ORDER BY data_criacao DESC
    `;
    const [rows] = await db.query(sql, [usuario_id]);
    return rows;
  }
};

module.exports = Conversa;