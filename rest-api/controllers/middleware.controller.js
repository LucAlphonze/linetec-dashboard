async function filtradoPost(variable, nuevoRegistro, ultimoRegistro) {
  switch (variable.id_trigger.nombre) {
    case "cambio-tiempo":
      try {
        let fecha_lectura_milis = new Date(
          nuevoRegistro.fecha_lectura
        ).getTime();
        let old_fecha_lectura_milis = new Date(
          ultimoRegistro.fecha_lectura
        ).getTime();
        let millis = parseInt(variable.trigger_valor);
        if (fecha_lectura_milis > old_fecha_lectura_milis + millis) {
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

    default:
      break;
  }
}

module.exports = {
  filtradoPost,
};
