async function filtradoPost(variable, nuevoRegistro, ultimoRegistro) {
  switch (variable.id_trigger.nombre) {
    case "cambio-tiempo":
      try {
        let time_stamp_milis = new Date(nuevoRegistro.time_stamp).getTime();
        let old_time_stamp_milis = new Date(
          ultimoRegistro?.time_stamp ? ultimoRegistro.time_stamp : null
        ).getTime();
        let millis = parseInt(variable.trigger_valor);
        if (
          time_stamp_milis > old_time_stamp_milis + millis ||
          old_time_stamp_milis == null
        ) {
          console.log(
            "cambio-tiempo: ",
            nuevoRegistro,
            "old-value: ",
            ultimoRegistro
          );
          return nuevoRegistro;
        }
      } catch (error) {
        console.log(error);
        console.log("despues del post: ", ultimoRegistro);
        return error;
      }

      break;

    case "cambio-valor":
      if (
        (ultimoRegistro =
          null || ultimoRegistro.valor_lectura != nuevoRegistro.valor_lectura)
      ) {
        console.log("cambio-valor ", nuevoRegistro);
        return nuevoRegistro;
      }
      break;
    case "cambio-porcentaje":
      var x_porciento =
        (ultimoRegistro?.valor_lectura_ / 100) *
        parseInt(variable.trigger_valor);
      if (
        (ultimoRegistro =
          null ||
          Math.abs(
            ultimoRegistro?.valor_lectura - nuevoRegistro.valor_lectura
          ) >= x_porciento)
      ) {
        console.log("cambio-porcentaje: ", nuevoRegistro);
        return nuevoRegistro;
      }
      break;
    case "sin-filtro":
      return nuevoRegistro;
      break;

    default:
      console.log("default case, breaking...");
      break;
  }
}

module.exports = {
  filtradoPost,
};
