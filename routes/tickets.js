// routes/tickets.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { createTicket, getTickets, getTicketById, updateTicket } = require("../controllers/ticketController");
const authMiddleware = require("../middlewares/authMiddleware");

// Ruta para crear ticket con archivo (campo: archivo)
router.post("/tickets", auth, upload.single("file"), createTicket);


// Obtener todos los tickets del usuario autenticado
router.get("/", authMiddleware, getTickets);

// Obtener un ticket por ID
router.get("/:id", authMiddleware, getTicketById);

// Actualizar un ticket (por ejemplo para marcar como resuelto o añadir comentario)
router.put("/:id", authMiddleware, updateTicket);

module.exports = router;
