const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Lucas2008",
    database: process.env.DB_NAME || "TEAjudo",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,  
    ssl: {
        rejectUnauthorized: false
    }
});
pool.on('error', (err) => {
    console.error('Erro na pool:', err.message);
});

// Testa a conexão
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
        return;
    }
    console.log("Banco de dados conectado!");
    connection.release();
});

module.exports = pool.promise();