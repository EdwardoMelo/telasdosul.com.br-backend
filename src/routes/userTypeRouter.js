const express = require("express");
const router = express.Router();
const userTypeController = require('../controllers/userTypeController');

// GET all user types
router.get("/", userTypeController.getAll);

// GET a single user type by ID
router.get("/:id", userTypeController.getById);

// POST create a new user type
router.post("/", userTypeController.create);

// PUT update a user type by ID
router.put("/:id", userTypeController.update);

// DELETE a user type by ID
router.delete("/:id", userTypeController.delete);

module.exports = router;
