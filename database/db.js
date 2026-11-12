const mysql = require("mysql2");
const fs = require("fs"); // Necessário para ler o certificado
const path = require("path"); // Necessário para montar o caminho
require("dotenv").config();

// Monta o caminho para o arquivo ca.pem que está na pasta certs
const caPath = path.join(__dirname, '..', 'certs', 'ca.pem');

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Lucas2008",
    database: process.env.DB_NAME || "TEAjudo",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000, // Aumentei para 30s para dar mais tempo
    
    // CONFIGURAÇÃO CORRETA PARA O AIVEN:
    ssl: {
        ca: fs.readFileSync(caPath), // Lê o certificado que você baixou
        rejectUnauthorized: true     // Agora pode validar com segurança
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