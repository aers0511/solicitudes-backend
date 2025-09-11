function ticketCreatedTemplate(nombreSolicitante, issueType) {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
      <!-- Encabezado institucional -->
      <div style="background:#003366; color:#fff; padding:20px; text-align:center;">
        <h2 style="margin:0; font-size:20px;">Instituto Tecnológico de Sonora</h2>
        <p style="margin:5px 0 0; font-size:16px; color:#e0e7ff;">Confirmación de Ticket</p>
      </div>

      <!-- Contenido -->
      <div style="padding:20px; background:#ffffff;">
        <p>Hola <b>${nombreSolicitante}</b>,</p>
        <p>Tu solicitud de soporte ha sido registrada exitosamente con el asunto:</p>
        <p style="background:#f3f4f6; padding:12px; border-radius:6px; font-weight:bold; font-size:14px; color:#374151;">
          ${issueType}
        </p>
        <p>Un agente del área de soporte se pondrá en contacto contigo en breve.</p>
      </div>

      <!-- Footer -->
      <div style="background:#009639; padding:15px; text-align:center; font-size:12px; color:#ffffff;">
        © ${new Date().getFullYear()} - Sistema de Soporte Técnico<br>
        Instituto Tecnológico de Sonora
      </div>
    </div>
  `;
}

module.exports = ticketCreatedTemplate;
