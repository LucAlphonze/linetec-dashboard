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

function filtradoPostArray(variables, nuevosRegistros, ultimosRegistros) {
  const filtrado = [nuevosRegistros].map(({ time_stamp, fecha_lectura }) => ({
    fecha_lectura: fecha_lectura,
    metaData: [],
    time_stamp: time_stamp,
  }));
  console.log(
    "variables: ",
    variables[0],
    "nuevo registros: ",
    nuevosRegistros,
    "ultimos registros: ",
    ultimosRegistros
  );
  for (let i = 0; i < nuevosRegistros.metaData.length; i++) {
    console.log("i es :", i);

    switch (variables[i].id_trigger.nombre) {
      case "cambio-tiempo":
        try {
          let fecha_lectura_millis = new Date(
            nuevosRegistros.fecha_lectura
          ).getTime();
          let old_fecha_lectura_millis = new Date(
            ultimosRegistros[i]?.fecha_lectura
          ).getTime();
          let millis = parseInt(variables[i].trigger_valor);
          if (
            fecha_lectura_millis > old_fecha_lectura_millis + millis ||
            old_time_stamp_milis == null
          ) {
            filtrado[0].metaData.push({
              datos: nuevosRegistros.metaData[i].datos,
              id_variable: nuevosRegistros.metaData[i].id_variable._id,
            });
          }
          break;
        } catch (error) {
          console.log(error);
          return error;
        }

      case "cambio-valor":
        try {
          if (
            ultimosRegistros[i].metaData?.datos == null ||
            ultimosRegistros[i].metaData.datos !=
              nuevosRegistros.metaData[i].datos
          ) {
            filtrado[0].metaData.push({
              datos: nuevosRegistros.metaData[i].datos,
              id_variable: nuevosRegistros.metaData[i].id_variable._id,
            });
          }
          break;
        } catch (error) {
          console.log(error);

          return error;
        }

      case "cambio-porcentaje":
        try {
          var x_porciento =
            (ultimosRegistros[i].metaData?.datos / 100) *
            parseInt(variables[i].trigger_valor);
          if (
            ultimosRegistros == null ||
            Math.abs(
              ultimosRegistros[i].metaData?.datos -
                nuevosRegistros.metaData[i].datos
            ) >= x_porciento
          ) {
            // console.log("cambio-porcentaje: ", nuevoRegistro);
            filtrado[0].metaData.push({
              datos: nuevosRegistros.metaData[i].datos,
              id_variable: nuevosRegistros.metaData[i].id_variable._id,
            });
          }
          break;
        } catch (error) {
          console.log(error);
          return error;
        }
      case "sin-filtro":
        filtrado[0].metaData.push({
          datos: nuevosRegistros.metaData[i].datos,

          id_variable: nuevosRegistros.metaData[i].id_variable._id,
        });
        break;

      default:
        console.log("default case, breaking...");
        break;
    }
    if (i == nuevosRegistros.metaData.length - 1) {
      return filtrado[0];
    }
  }

  return filtrado[0];
}

module.exports = {
  filtradoPost,
  filtradoPostArray,
};
