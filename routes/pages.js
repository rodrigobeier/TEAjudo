const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/sobre', (req, res) => {
    res.render('sobre');
});

router.get('/recursos', (req, res) => {
    res.render('recursos');
});

router.get('/inclusao', (req, res) => {
    res.render('inclusao');
});

router.get('/ia', (req, res) => {
    res.render('ia');
});

router.get('/contato', (req, res) => {
    res.render('contato');
});

module.exports = router;