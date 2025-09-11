function ticketUpdatedTemplate(nombreSolicitante, status) {
  return `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
      <!-- Encabezado -->
      <div style="background:#003366; color:#fff; padding:20px; text-align:center;">
        <h2 style="margin:0; font-size:20px;">Instituto Tecnológico de Sonora</h2>
        <p style="margin:5px 0 0; font-size:16px; color:#e0e7ff;">Actualización de Ticket</p>
      </div>

      <!-- Contenido -->
      <div style="padding:20px; background:#ffffff;">
        <p>Hola <b>${nombreSolicitante}</b>,</p>
        <p>Tu ticket ha cambiado de estado a:</p>
        <p style="background:#f3f4f6; padding:12px; border-radius:6px; font-weight:bold; font-size:14px; color:#374151;">
          ${status}
        </p>
        <p>Agradecemos tu paciencia y estaremos atentos a cualquier duda adicional.</p>
      </div>

      <!-- Footer -->
      <div style="background:#009639; padding:15px; text-align:center; font-size:12px; color:#ffffff;">
        © ${new Date().getFullYear()} - Sistema de Soporte Técnico<br>
        Instituto Tecnológico de Sonora
      </div>
    </div>
  `;
}

module.exports = ticketUpdatedTemplate;
