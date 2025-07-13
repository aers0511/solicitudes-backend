const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Ticket = require("../models/Ticket");

// Crear ticket con imágenes (varias)
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  const { title, description } = req.body;

  try {
    const imagesPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const ticket = new Ticket({
      title,
      description,
      createdBy: req.user.id,
      images: imagesPaths,
    });

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creando ticket");
  }
});

// Obtener tickets (admin todos, user solo propios)
router.get("/", auth, async (req, res) => {
  try {
    let tickets;
    if (req.user.role === "admin") {
      tickets = await Ticket.find()
        .populate("createdBy assignedTo comments.createdBy")
        .exec();
    } else {
      tickets = await Ticket.find({ createdBy: req.user.id })
        .populate("createdBy assignedTo comments.createdBy")
        .exec();
    }
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo tickets");
  }
});

// Actualizar ticket (estado, asignación, comentarios)
router.put("/:id", auth, async (req, res) => {
  const { status, assignedTo, comment } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket no encontrado" });

    if (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (comment) {
      ticket.comments.push({
        text: comment,
        createdBy: req.user.id,
      });
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error actualizando ticket");
  }
});

module.exports = router;
