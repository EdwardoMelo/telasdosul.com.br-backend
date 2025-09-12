const express = require('express')
const variationController = require('../controllers/variationController')
const router = express.Router();

router.get('/', variationController.getAll);
router.get('/:id', variationController.getById);
router.get('/produto/:produto_id', variationController.getByProdutoId);
router.post('/', variationController.create);
router.post('/produto/:produto_id', variationController.createManyByProductId);
router.put('/:id', variationController.update);
router.delete('/:id', variationController.delete);

module.exports = router;