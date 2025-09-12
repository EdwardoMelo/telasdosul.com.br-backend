const express = require('express');
const subCategoryController = require('../controllers/subCategoryController');
const validateToken = require('../auth/auth').validateToken; // Import the validateToken function

const router = express.Router();

// Route to get all subcategories
router.get("/", subCategoryController.getAll);

// Route to get a single subcategory by ID
router.get('/:id', subCategoryController.getById);

// Route to create a new subcategory
router.post('/', validateToken, subCategoryController.create);

router.post('/categoria/:categoria_id', validateToken, subCategoryController.createManyByCategoryId)

// Route to update a subcategory by ID
router.put('/:id', validateToken, subCategoryController.update);

// Route to delete a subcategory by ID
router.delete('/:id', validateToken, subCategoryController.delete);

module.exports = router;