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

// Configuración de multer para avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// Registro con imagen avatar
router.post("/register", register);

// Login
router.post("/login", login);

// Perfil (protegido)
router.get("/profile", authMiddleware, profile);

module.exports = router;
