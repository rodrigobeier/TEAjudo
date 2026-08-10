const db = require("../database/db");

const Usuario = {

    cadastrar(nome, email, senha, callback) {

        const sql = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [nome, email, senha], callback);
    },

    buscarPorEmail(email, callback) {

        const sql = "SELECT * FROM usuarios WHERE email = ?";

        db.query(sql, [email], callback);
    },

    listar(callback) {

        db.query("SELECT * FROM usuarios", callback);
    }

};

module.exports = Usuario;