const Ticket = require("../models/Ticket");
const path = require("path");
const fs = require("fs");

// 🔹 Asegúrate de que este archivo existe en src/services/emailService.js
const  sendEmail  = require("../services/emailService");

// 🔹 Templates de correo, asegurarte de que están en src/templates/
const ticketCreatedTemplate = require("../templates/ticketCreated");
const ticketAssignedTemplate = require("../templates/ticketAssigned");
const ticketUpdatedTemplate = require("../templates/ticketUpdated");

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
    console.error(err);
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

    // ✉️ Envío de correos
    if (correoSolicitante) {
      await sendEmail(
        correoSolicitante,
        "Tu ticket fue creado",
        `Hola ${nombreSolicitante}, tu ticket ha sido registrado.`,
        ticketCreatedTemplate(nombreSolicitante, issueType)
      );
    }

    if (destinatario) {
      await sendEmail(
        destinatario,
        "Nuevo ticket asignado",
        `Tienes un nuevo ticket de ${nombreSolicitante}`,
        ticketAssignedTemplate(nombreSolicitante, issueType, description)
      );
    }

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error al crear el ticket:", err);
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

    // ✉️ Notificar al solicitante solo si existe correo
    if (ticket.correoSolicitante) {
      await sendEmail(
        ticket.correoSolicitante,
        "Actualización en tu ticket",
        `El estado de tu ticket ahora es: ${ticket.status}`,
        ticketUpdatedTemplate(ticket.nombreSolicitante, ticket.status)
      );
    }

    res.json(ticket);
  } catch (err) {
    console.error("Error al actualizar el ticket:", err);
    res.status(500).json({ msg: "Error al actualizar el ticket" });
  }
};

// GET: Exportar tickets del mes actual en CSV
exports.exportCurrentMonth = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const tickets = await Ticket.find({
      createdAt: { $gte: start, $lt: end }
    }).lean();

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

    const escapeCSV = (text) => {
      if (!text) return "";
      const str = String(text);
      return str.includes(",") ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = tickets.map(t =>
      [
        escapeCSV(t.nombreSolicitante),
        escapeCSV(t.correoSolicitante),
        escapeCSV(t.destinatario),
        escapeCSV(t.location),
        escapeCSV(t.issueType),
        escapeCSV(new Date(t.fechaLimite).toLocaleDateString()),
        escapeCSV(t.status),
        escapeCSV(new Date(t.createdAt).toLocaleDateString())
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const filename = `tickets-${now.getFullYear()}-${now.getMonth() + 1}.csv`;
    const filePath = path.join(__dirname, "../exports", filename);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, csv);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error en descarga:", err);
        res.status(500).end();
      }
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error borrando CSV:", err);
      });
    });

  } catch (err) {
    console.error("Error exportando tickets:", err);
    res.status(500).json({ msg: "Error al exportar" });
  }
};
