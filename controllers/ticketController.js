const Ticket = require("../models/Ticket");
const { sendEmail } = require("../services/emailService");
const generarTicket = require("../middlewares/generarTicket");

// Templates de correo
const ticketCreatedTemplate = require("../templates/ticketCreated");
const ticketAssignedTemplate = require("../templates/ticketAssigned");
const ticketUpdatedTemplate = require("../templates/ticketUpdated");

/**
 * GET: Obtener tickets del usuario autenticado
 * Devuelve todos los tickets donde el usuario es solicitante o destinatario
 */
exports.getTickets = async (req, res) => {
  const userEmail = req.user.email;

  try {
    // Buscar tickets por correo del solicitante o destinatario
    const tickets = await Ticket.find({
      $or: [{ destinatario: userEmail }, { correoSolicitante: userEmail }],
    })
      // Seleccionamos solo los campos necesarios, incluyendo numeroTicket
      .select(
        "numeroTicket nombreSolicitante correoSolicitante persistente destinatario fechaLimite ubicacion tipoDeError descripcion estatus comentarios"
      )
      .sort({ createdAt: -1 }); // Orden descendente por fecha de creación

    // Devolver los tickets al frontend/Postman
    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error al obtener tickets:", err);
    res.status(500).json({ msg: "Error al obtener tickets" });
  }
};

/**
 * POST: Crear un nuevo ticket
 * Genera un numeroTicket, calcula la fecha límite considerando días hábiles
 * y envía correos de notificación al solicitante y destinatario
 */
exports.createTicket = async (req, res) => {
  try {
    const {
      nombreSolicitante,
      correoSolicitante,
      destinatario,
      ubicacion, // ahora se envía desde el frontend
      persistente,
      tipoDeError,
      descripcion,
    } = req.body;

    if (
      !nombreSolicitante ||
      !correoSolicitante ||
      !tipoDeError ||
      !descripcion
    ) {
      return res.status(400).json({ msg: "Campos obligatorios incompletos." });
    }

    const { ticket: numeroTicket, fechaLimite } = generarTicket();

    const imagen = req.file ? req.file.path : "";

    // Determinar ubicación final según destinatario
    let ubicacionFinal = "";
    if (destinatario === "vvalenzuela@itson.edu.mx") {
      ubicacionFinal = req.user.campus || "No especificado";
    } else {
      ubicacionFinal = ubicacion || "No especificado";
    }

    const ticket = new Ticket({
      numeroTicket,
      nombreSolicitante,
      correoSolicitante,
      destinatario,
      fechaLimite,
      ubicacion: ubicacionFinal,
      persistente: persistente || false,
      tipoDeError,
      descripcion,
      imagen,
      creadoPor: req.user.id,
    });

    await ticket.save();

    const emails = [];
    if (correoSolicitante) {
      emails.push(
        sendEmail(
          correoSolicitante,
          "Tu solicitud fue creada",
          `Hola ${nombreSolicitante}, tu solicitud ha sido registrada.`,
          ticketCreatedTemplate(nombreSolicitante, tipoDeError)
        )
      );
    }

    if (destinatario) {
      emails.push(
        sendEmail(
          destinatario,
          "Nueva solicitud asignada",
          `Tienes una nueva solicitud de ${nombreSolicitante}`,
          ticketAssignedTemplate(nombreSolicitante, tipoDeError, descripcion)
        )
      );
    }

    Promise.allSettled(emails).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected")
          console.error(`Error enviando correo ${i}:`, r.reason);
      });
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error al crear el ticket:", err);
    res.status(500).json({ msg: "Error al crear el ticket" });
  }
};

/**
 * PUT: Actualizar estado del ticket y agregar comentarios
 * @param {string} req.params.id - ID del ticket a actualizar
 * @param {string} req.body.status - Nuevo estado del ticket (opcional)
 * @param {string} req.body.comment - Comentario adicional (opcional)
 */
exports.updateTicket = async (req, res) => {
  try {
    // Buscar ticket por ID
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "Ticket no encontrado" });

    const { estatus, comentarios } = req.body;

    // Actualizar estado si se envió
    if (estatus) ticket.estatus = estatus;

    // Agregar comentario si se envió
    if (comentarios) {
      ticket.comentarios = comentarios;
    }

    // Guardar cambios en la base de datos
    await ticket.save();

    // Enviar notificación al solicitante (si tiene correo)
    if (ticket.correoSolicitante) {
      sendEmail(
        ticket.correoSolicitante,
        "Actualización en tu solicitud",
        `El estado de tu solicitud ahora es: ${ticket.estatus}`,
        ticketUpdatedTemplate(ticket.nombreSolicitante, ticket.estatus)
      ).catch((err) =>
        console.error("Error enviando correo de actualización:", err)
      );
    }

    // Devolver ticket actualizado al frontend
    res.status(200).json(ticket);
  } catch (err) {
    console.error("Error al actualizar el ticket:", err);
    res.status(500).json({ msg: "Error al actualizar el ticket" });
  }
};
