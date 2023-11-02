async function filtradoPost(variable, nuevoRegistro, ultimoRegistro) {
  switch (variable.id_trigger.nombre) {
    case "cambio-tiempo":
      try {
        let fecha_lectura_milis = new Date(
          nuevoRegistro.fecha_lectura
        ).getTime();
        let old_fecha_lectura_milis = new Date(
          ultimoRegistro?.fecha_lectura ? ultimoRegistro.fecha_lectura : null
        ).getTime();
        let millis = parseInt(variable.trigger_valor);
        if (
          fecha_lectura_milis > old_fecha_lectura_milis + millis ||
          old_fecha_lectura_milis == null
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
          null || ultimoRegistro?.valor_lectura != nuevoRegistro.valor_lectura)
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
