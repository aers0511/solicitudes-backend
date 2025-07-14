const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    nombreSolicitante: String,
    correoSolicitante: String,
    destinatario: String,
    fechaLimite: Date,
    location: String,
    persistentError: Boolean,
    issueType: String,
    description: String,
    image: String, // ruta archivo subido
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "pendiente" },
    comments: [
      {
        text: String,
        author: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
