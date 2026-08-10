const db = require("../database/db");

const Mensagem = {

    salvar(conversa_id, autor, texto, callback) {

        const sql = `
            INSERT INTO mensagens (conversa_id, autor, texto)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [conversa_id, autor, texto], callback);
    },

    listar(conversa_id, callback) {

        const sql = `
            SELECT * FROM mensagens
            WHERE conversa_id = ?
            ORDER BY data_envio
        `;

        db.query(sql, [conversa_id], callback);
    }

};

module.exports = Mensagem;