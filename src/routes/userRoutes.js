
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {validateToken} = require("../auth/auth");
router.post('/login', userController.login)
router.post("/signUp", userController.signUp);
router.post('/reset-password', userController.sendPasswordResetEmail);
router.post('/', userController.createUser)
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id",validateToken,  userController.deleteUser);

module.exports = router;
