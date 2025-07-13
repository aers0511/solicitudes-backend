const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createTicket,
  getTickets,
  updateTicket,
} = require("../controllers/ticketController");
const authMiddleware = require("../middleware/authMiddleware");

// Configuración multer para subir imágenes (varias)
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

// Crear ticket con imágenes (protegido)
router.post("/", authMiddleware, upload.array("images", 5), createTicket);

// Obtener tickets (protegido)
router.get("/", authMiddleware, getTickets);

// Actualizar ticket (protegido)
router.put("/:id", authMiddleware, updateTicket);

module.exports = router;
