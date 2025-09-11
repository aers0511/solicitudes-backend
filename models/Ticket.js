const mongoose = require("mongoose");
const { generarTicket } = require('../middlewares/generarTicket.js');

const TicketSchema = new mongoose.Schema(
  {
    numeroTicket: {
      type: String,
      default: function() {
        const t = generarTicket();
        // Asignar fechaLimite en el documento
        this.fechaLimite = t.fechaLimite;
        return t.ticket;
      }
    },
    fechaLimite: {
      type: Date,
      get: (fecha) => fecha.toISOString().split("T")[0] // Mostrar solo YYYY-MM-DD
    },
    nombreSolicitante: String,
    correoSolicitante: String,
    destinatario: String,
    ubicacion: String,
    persistente: Boolean,
    tipoDeError: String,
    descripcion: String,
    estatus: { type: String, default: "pendiente" },
    comentarios: [],
  },
  {
    timestamps: true,
    toJSON: { getters: true },   // Habilitar getters al convertir a JSON
    toObject: { getters: true }  // Habilitar getters al usar toObject()
  }
);

module.exports = mongoose.model("Ticket", TicketSchema);
