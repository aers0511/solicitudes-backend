const Ticket = require("../models/Ticket");
const path = require("path");
const fs = require("fs");

// GET: Tickets creados o asignados al usuario
exports.getTickets = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const tickets = await Ticket.find({
      $or: [
        { destinatario: userEmail },
        { correoSolicitante: userEmail }
      ],
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener tickets" });
  }
};

// POST: Crear ticket
exports.createTicket = async (req, res) => {
  try {
    const { nombreSolicitante, correoSolicitante, destinatario, fechaLimite, location, persistentError, issueType, description } = req.body;

    const image = req.file ? req.file.path : "";

    const ticket = new Ticket({
      nombreSolicitante,
      correoSolicitante,
      destinatario,
      fechaLimite,
      location,
      persistentError,
      issueType,
      description,
      image,
      createdBy: req.user.id,
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Error al crear el ticket" });
  }
};

// PUT: Actualizar estado y comentario
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket no encontrado" });

    const { status, comment } = req.body;

    if (status) ticket.status = status;
    if (comment) {
      ticket.comments.push({
        text: comment,
        author: req.user.name || req.user.email,
        date: new Date(),
      });
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar el ticket" });
  }
};

// GET: Exportar tickets del mes actual en CSV
exports.exportCurrentMonth = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const tickets = await Ticket.find({
      createdAt: { $gte: start, $lte: end }
    });

    if (!tickets.length) return res.status(404).json({ msg: "No hay tickets este mes" });

    const headers = [
      "Solicitante",
      "Correo",
      "Destinatario",
      "Lugar",
      "Tipo",
      "Fecha Límite",
      "Estado",
      "Fecha de Creación"
    ];

    const rows = tickets.map(t =>
      [
        t.nombreSolicitante,
        t.correoSolicitante,
        t.destinatario,
        t.location,
        t.issueType,
        new Date(t.fechaLimite).toLocaleDateString(),
        t.status,
        new Date(t.createdAt).toLocaleDateString()
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const filePath = path.join(__dirname, "../exports", `tickets-${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv);

    res.download(filePath, "tickets-mes.csv", () => {
      fs.unlink(filePath, () => {});
    });
  } catch (err) {
    res.status(500).json({ msg: "Error al exportar" });
  }
};
