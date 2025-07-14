const Ticket = require("../models/Ticket");

// Correos con permisos de administrador
const isAdmin = (email) =>
  ["angel.reyes@itson.edu.mx", "vvalenzuela@itson.edu.mx"].includes(
    email.toLowerCase()
  );

// Crear nuevo ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const ticket = new Ticket({
      title,
      description,
      createdBy: req.user.id,
      image,
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creando ticket" });
  }
};

// Obtener todos los tickets (admin ve todos, usuario solo los suyos)
exports.getTickets = async (req, res) => {
  try {
    let tickets;
    if (isAdmin(req.user.email)) {
      tickets = await Ticket.find().populate("createdBy", "name email");
    } else {
      tickets = await Ticket.find({ createdBy: req.user.id });
    }

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo tickets" });
  }
};

// Obtener un ticket por ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("createdBy", "name email");
    if (!ticket) return res.status(404).json({ msg: "Ticket no encontrado" });

    const esAdmin = isAdmin(req.user.email);
    const esDueño = ticket.createdBy._id.toString() === req.user.id;

    if (!esAdmin && !esDueño) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener el ticket" });
  }
};

// Actualizar estado o añadir comentario
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ msg: "Ticket no encontrado" });

    const esAdmin = isAdmin(req.user.email);
    const esDueño = ticket.createdBy.toString() === req.user.id;

    if (!esAdmin && !esDueño) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    if (status) ticket.status = status;
    if (comment) {
      // Si el ticket ya tiene comentarios, añade uno más
      if (!Array.isArray(ticket.comments)) {
        ticket.comments = [];
      }

      ticket.comments.push({
        text: comment,
        author: req.user.email,
        date: new Date()
      });
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error actualizando ticket" });
  }
};
