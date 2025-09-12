const express = require('express');
const categoryController = require('../controllers/categoryController');
const { validateToken } = require('../auth/auth'); // Import the validateToken function
const router = express.Router();

// Route to get all categories
router.get('/', categoryController.getAllCategories);

// Route to get a category by ID
router.get('/:id', categoryController.getCategoryById);

// Route to create a new category
router.post('/', validateToken,  categoryController.createCategory);

// Route to update a category by ID
router.put('/:id', validateToken,  categoryController.updateCategory);

// Route to delete a category by ID
router.delete('/:id', validateToken, categoryController.deleteCategory);

module.exports = router;