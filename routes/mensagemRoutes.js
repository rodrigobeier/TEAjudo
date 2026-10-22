const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagemController');

router.get('/', mensagemController.index);        // GET /api/mensagens?conversa_id=1
router.post('/', mensagemController.store);       // POST /api/mensagens
router.put('/:id', mensagemController.update);
router.delete('/:id', mensagemController.destroy);

module.exports = router;