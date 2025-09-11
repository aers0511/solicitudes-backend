require("dotenv").config();
const nodemailer = require("nodemailer");

// Configuración del transporte de Nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación de Gmail
  },
});

// Función para enviar correos
async function sendEmail(to, subject, text, html) {
  try {
    return await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text, // mensaje plano
      html, // HTML del template
    });
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
}

module.exports = { sendEmail };
