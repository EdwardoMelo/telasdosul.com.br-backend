const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const { validateToken } = require("../auth/auth");


router.post("/", validateToken, ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/categoria/:categoria_id", ProductController.getProductsByCategory);
router.get("/:id",  ProductController.getProductById);
router.put("/:id", validateToken, ProductController.updateProduct);
router.delete("/:id", validateToken, ProductController.deleteProduct);

module.exports = router;
