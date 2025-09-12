
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// POST /contato
router.post("/", contactController.sendMessage);

module.exports = router;