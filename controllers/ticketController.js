const Ticket = require("../models/Ticket");

const isAdmin = (email) =>
  ["angel.reyes@itson.edu.mx", "vvalenzuela@itson.edu.mx"].includes(
    email.toLowerCase()
  );

exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.file ? `/uploads/${file.filename}`: null;

    const ticket = new Ticket({
      title,
      description,
      createdBy: req.user.id,
      images,
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creando ticket" });
  }
};

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
    if (comment) ticket.comment = comment;

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error actualizando ticket" });
  }
};
