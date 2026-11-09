const express = require('express');
const router = express.Router();

// O caminho correto sobe um nível (..) e entra na pasta controllers
const mensagemController = require('../controllers/mensagemController');

router.get('/', mensagemController.index);
router.post('/', mensagemController.store);

// Se você ainda não implementou update e destroy no controller, pode deixar comentado:
// router.put('/:id', mensagemController.update);
// router.delete('/:id', mensagemController.destroy);

module.exports = router;