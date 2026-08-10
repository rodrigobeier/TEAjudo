const express = require("express");
const router = express.Router();

const Usuario = require("../models/usuario");

router.post("/cadastro", (req, res) => {

    const { nome, email, senha } = req.body;

    Usuario.cadastrar(nome, email, senha, (erro) => {

        if (erro) {
            console.log(erro);
            return res.send("Erro ao cadastrar.");
        }

        res.redirect("/login");

    });

});

module.exports = router;