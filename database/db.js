const mysql = require("mysql2");
require("dotenv").config();

// Cria um pool de conexões (recomendado para aplicações web)
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Lucas2008",
    database: process.env.DB_NAME || "TEAjudo",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Se a variável DB_SSL for "true", ativa SSL (necessário para Aiven)
    ssl: {
    rejectUnauthorized: false
}
});

// Testa a conexão (opcional, mas útil)
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
        return;
    }
    console.log("Banco de dados conectado!");
    connection.release(); // libera a conexão de volta ao pool
});

// Exporta o pool com suporte a promises (async/await)
module.exports = pool.promise();