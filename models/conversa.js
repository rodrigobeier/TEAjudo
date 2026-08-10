const db = require("../database/db");

const Conversa = {

    criar(titulo, usuario_id, callback) {

        const sql = `
            INSERT INTO conversas (titulo, usuario_id)
            VALUES (?, ?)
        `;

        db.query(sql, [titulo, usuario_id], callback);
    },

    listar(usuario_id, callback) {

        const sql = `
            SELECT * FROM conversas
            WHERE usuario_id = ?
            ORDER BY data_criacao DESC
        `;

        db.query(sql, [usuario_id], callback);
    }

};

module.exports = Conversa;