const express = require("express");
const PriceLineController = require("../controllers/priceLineController");
const { validateToken } = require("../auth/auth");

const router = express.Router();

router.get(
  "/produto/:produto_id",
  PriceLineController.getByProductId
);
router.post(
  "/produto/:produto_id",
  validateToken,
  PriceLineController.replaceByProductId
);

module.exports = router;
