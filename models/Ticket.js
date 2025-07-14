const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  nombreSolicitante: String,
  correoSolicitante: String,
  destinatario: String,
  fechaLimite: String,
  location: String,
  persistentError: Boolean,
  issueType: String,
  description: String,
  archivoNombre: { type: String }, // Aquí se guarda la ruta del archivo
  status: { type: String, default: "abierto" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  comments: [
    {
      text: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", TicketSchema);
