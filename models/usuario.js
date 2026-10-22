const db = require("../database/db");

const Usuario = {
  async cadastrar(nome, email, senha) {
    const sql = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [nome, email, senha]);
    return result;
  },

  async buscarPorEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    const [rows] = await db.query(sql, [email]);
    return rows[0];
  },

  async buscarPorId(id) {
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  async listar() {
    const sql = `SELECT * FROM usuarios ORDER BY id`;
    const [rows] = await db.query(sql);
    return rows;
  }
};

module.exports = Usuario;