function ticketAssignedTemplate(nombreSolicitante, issueType, description) {
  return `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
      <!-- Encabezado con azul ITSON -->
      <div style="background:#003366; color:#fff; padding:20px; text-align:center;">
        <h2 style="margin:0; font-size:20px;">Instituto Tecnológico de Sonora</h2>
        <p style="margin:5px 0 0; font-size:16px; color:#e0e7ff;">Nuevo Ticket de Soporte</p>
      </div>

      <!-- Contenido principal -->
      <div style="padding:20px; background:#ffffff;">
        <p><b>${nombreSolicitante}</b> ha creado un nuevo ticket en el sistema de soporte.</p>
        <p><b>Asunto:</b> ${issueType}</p>
        <p><b>Descripción:</b></p>
        <p style="background:#f3f4f6; padding:12px; border-radius:6px; font-size:14px; color:#374151;">
          ${description}
        </p>
      </div>

      <!-- Pie de página con verde ITSON -->
      <div style="background:#009639; padding:15px; text-align:center; font-size:12px; color:#ffffff;">
        Sistema de Soporte - ITSON<br>
        © ${new Date().getFullYear()} Instituto Tecnológico de Sonora
      </div>
    </div>
  `
  ;
}

module.exports = ticketAssignedTemplate;
