function ticketCreatedTemplate(nombreSolicitante, issueType) {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
    <div style="background:#4f46e5; color:#fff; padding:15px; text-align:center;">
      <h2>Sistema de Soporte Técnico</h2>
    </div>
    <div style="padding:20px;">
      <p>Hola <b>${nombreSolicitante}</b>,</p>
      <p>Tu ticket ha sido creado exitosamente con el asunto:</p>
      <p style="background:#f3f4f6; padding:10px; border-radius:5px; font-weight:bold;">${issueType}</p>
      <p>Pronto un agente se pondrá en contacto contigo.</p>
    </div>
    <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
      © ${new Date().getFullYear()} - Sistema de Soporte Técnico
    </div>
  </div>
  `;
}

module.exports = ticketCreatedTemplate;
