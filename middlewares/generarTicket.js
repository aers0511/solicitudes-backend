// middlewares/generarTicket.js
module.exports = function () {
  const pad = (num) => num.toString().padStart(2, "0");

  const formatFecha = (date) => {
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    return `${yyyy}${mm}${dd}`;
  };

  const fechaCreacion = new Date();

  // Calcular fecha límite sumando 2 días hábiles
  let diasAgregados = 0;
  let fechaLimite = new Date(fechaCreacion);

  while (diasAgregados < 2) {
    fechaLimite.setDate(fechaLimite.getDate() + 1);
    const diaSemana = fechaLimite.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) {
      // 0 = domingo, 6 = sábado
      diasAgregados++;
    }
  }

  const fechaCreacionStr = formatFecha(fechaCreacion);
  const fechaLimiteStr = formatFecha(fechaLimite);

  // Número aleatorio de 4 dígitos
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const ticket = `T-${fechaCreacionStr}-${fechaLimiteStr}-${randomNumber}`;

  return {
    ticket,
    fechaCreacion,
    fechaLimite,
  };
};
