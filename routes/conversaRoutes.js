const express = require('express');
const router = express.Router();
const conversaController = require('../controllers/conversaController');

router.get('/', conversaController.index);
router.get('/:id', conversaController.show);
router.post('/', conversaController.store);
router.put('/:id', conversaController.update);
router.delete('/:id', conversaController.destroy);

module.exports = router;