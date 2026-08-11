const db = require("../database/db");

const Usuario = {
  // Cadastrar um novo usuário (retorna Promise)
  cadastrar(nome, email, senha) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
      `;
      db.query(sql, [nome, email, senha], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Buscar usuário por email (para login, etc.)
  buscarPorEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM usuarios WHERE email = ?`;
      db.query(sql, [email], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  },

  // Buscar por ID
  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM usuarios WHERE id = ?`;
      db.query(sql, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  },

  // Listar todos
  listar() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM usuarios ORDER BY id`;
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = Usuario;