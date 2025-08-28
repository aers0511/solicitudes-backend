function ticketUpdatedTemplate(nombreSolicitante, status) {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
    <div style="background:#f59e0b; color:#fff; padding:15px; text-align:center;">
      <h2>Actualización de Ticket</h2>
    </div>
    <div style="padding:20px;">
      <p>Hola <b>${nombreSolicitante}</b>,</p>
      <p>Tu ticket ha cambiado de estado:</p>
      <p style="background:#f3f4f6; padding:10px; border-radius:5px; font-weight:bold;">${status}</p>
      <p>Gracias por tu paciencia.</p>
    </div>
    <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
      © ${new Date().getFullYear()} - Sistema de Soporte Técnico
    </div>
  </div>
  `;
}

module.exports = ticketUpdatedTemplate;
