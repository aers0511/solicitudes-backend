function ticketAssignedTemplate(nombreSolicitante, issueType, description) {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
    <div style="background:#059669; color:#fff; padding:15px; text-align:center;">
      <h2>Nuevo Ticket Asignado</h2>
    </div>
    <div style="padding:20px;">
      <p><b>${nombreSolicitante}</b> ha creado un nuevo ticket.</p>
      <p><b>Asunto:</b> ${issueType}</p>
      <p><b>Descripción:</b></p>
      <p style="background:#f3f4f6; padding:10px; border-radius:5px;">${description}</p>
    </div>
    <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
      Sistema de Soporte Técnico
    </div>
  </div>
  `;
}

module.exports = ticketAssignedTemplate;
