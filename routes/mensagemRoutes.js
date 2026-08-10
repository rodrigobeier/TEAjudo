const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagemController');

router.get('/', mensagemController.index);
//router.get('/:id', mensagemController.show);
router.post('/', mensagemController.store);
router.put('/:id', mensagemController.update);
router.delete('/:id', mensagemController.destroy);

module.exports = router;