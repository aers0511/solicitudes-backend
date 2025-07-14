const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  register,
  login,
  profile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Registro con imagen avatar
router.post("/register", register);

// Login
router.post("/login", login);

// Perfil (protegido)
router.get("/profile", authMiddleware, profile);

module.exports = router;
