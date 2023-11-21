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
          // console.log(
          //   "cambio-tiempo: ",
          //   nuevoRegistro,
          //   "old-value: ",
          //   ultimoRegistro
          // );
          return nuevoRegistro;
        } else {
          return (nuevoRegistro = 0);
        }
      } catch (error) {
        console.log(error);
        console.log("despues del post: ", ultimoRegistro);
        return error;
      }

      break;

    case "cambio-valor":
      try {
        if (
          ultimoRegistro?.valor_lectura == null ||
          ultimoRegistro.valor_lectura != nuevoRegistro.valor_lectura
        ) {
          // console.log(
          //   "cambio-valor: ",
          //   nuevoRegistro,
          //   "ultimo-registro: ",
          //   ultimoRegistro
          // );
          return nuevoRegistro;
        } else {
          return (nuevoRegistro = 0);
        }
      } catch (error) {
        console.log(error);
        console.log("despues del post: ", ultimoRegistro);
        return error;
      }

      break;
    case "cambio-porcentaje":
      var x_porciento =
        (ultimoRegistro?.valor_lectura / 100) *
        parseInt(variable.trigger_valor);
      if (
        ultimoRegistro == null ||
        Math.abs(ultimoRegistro?.valor_lectura - nuevoRegistro.valor_lectura) >=
          x_porciento
      ) {
        // console.log("cambio-porcentaje: ", nuevoRegistro);
        return nuevoRegistro;
      } else {
        return (nuevoRegistro = 0);
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
