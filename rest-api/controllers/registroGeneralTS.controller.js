const mongoose = require("mongoose");
const RegistroGeneralts = require("../models/registrogeneralts.model");
const Variable = require("../models/variable.model");

const getAllRegistrosTS = async (req, res) => {
  var fecha_mes_atras = new Date();
  fecha_mes_atras.setMonth(fecha_mes_atras.getMonth() - 1);
  try {
    const variables = await getAllVariables();
    const idVariables = variables.map((variable) => variable._id);
    const lastRegistros = await getLastRegistrosFromdate(
      idVariables,
      fecha_mes_atras,
      new Date()
    );

    // Crear un diccionario para acceder rápidamente a los nombres por id_variable
    const variableMap = variables.reduce((acc, variable) => {
      acc[variable._id] = variable.nombre;
      return acc;
    }, {});

    // Reemplazar id_variable con el nombre correspondiente y cambiar la clave a "nombre"
    lastRegistros.forEach((dato) => {
      if (variableMap[dato.id_variable.toString()]) {
        dato.nombre = variableMap[dato.id_variable];
        delete dato.id_variable; // Eliminar la clave id_variable
      }
    });

    res.status(200).json({
      ok: true,
      datos: lastRegistros,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const postRegistroTS = async (req, res) => {
  const registroToInsertArray = req.body;
  const variables = await getAllVariables();
  var registroArray = [];
  console.time("postRegGeneral");

  for (let i = 0; i < registroToInsertArray.length; i++) {
    const dateTil = new Date(registroToInsertArray[i].fl);
    const dateFrom = new Date(dateTil);
    var horasARestar = 1; //0 * 24;

    const miliSegundosARestar = horasARestar * 60 * 60 * 1000;
    dateFrom.setTime(dateFrom.getTime() - miliSegundosARestar);

    let filtrado = await postRegGeneral(
      registroToInsertArray[i],
      variables,
      dateFrom,
      dateTil,
      res
    );
    if (filtrado != null) {
      registroArray.push(filtrado);
    }

    if (i === registroToInsertArray.length - 1) {
      if (registroArray.length == 0) {
        res.status(200).json({
          ok: true,
          "Datos Insertados": 0,
        });
        console.timeEnd("postRegGeneral");
        return;
      }
      res.status(200).json({
        ok: true,
        datos: registroArray,
      });
      console.timeEnd("postRegGeneral");
      return;
    }
  }
};

const getRegistrosFiltrados = async (req, res) => {
  var sti = req.params.startdate;
  var stf = req.params.enddate;
  var granularidad = req.params.granularidad;

  try {
    const registrosFiltrados = await RegistroGeneralts.aggregate([
      {
        $match: {
          fecha_lectura: {
            $gte: new Date(parseInt(sti)),
            $lte: new Date(parseInt(stf)),
          },
        },
      },
      {
        $unwind: {
          path: "$metaData",
        },
      },
      {
        $group: {
          _id: {
            id_variable: "$metaData.id_variable",
            date: {
              $dateToString: {
                date: "$fecha_lectura",
                format: "%Y-%m-%d",
              },
            },
          },
          datos: {
            $push: {
              valor_lectura: "$metaData.datos",
              fecha_lectura: "$fecha_lectura",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.id_variable",
          info: {
            $push: {
              date: "$_id.date",
              max: {
                $max: "$datos",
              },
              min: {
                $min: "$datos",
              },
              avg: {
                $avg: "$datos.valor_lectura",
              },
              sum: {
                $sum: "$datos.valor_lectura",
              },
            },
          },
        },
      },
    ]);
    res.status(200).json({
      ok: true,
      datos: registrosFiltrados,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error,
    });
  }
};

const getAllInRange = async (req, res) => {
  var idVariable = req.params.idVariable;
  var sti = req.params.startdate;
  var stf = req.params.enddate;
  try {
    const allInRange = await RegistroGeneralts.aggregate([
      {
        $unwind: {
          path: "$metaData",
        },
      },
      {
        $match: {
          $and: [
            {
              fecha_lectura: {
                $gte: new Date(parseInt(sti)),
                $lte: new Date(parseInt(stf)),
              },
              "metaData.id_variable": new mongoose.Types.ObjectId(idVariable),
            },
          ],
        },
      },
      {
        $project: {
          valor_lectura: "$metaData.datos",
          id_variable: "$metaData.id_variable",
          time_stamp: "$fecha_lectura",
        },
      },
    ]);
    res.status(200).json({
      ok: true,
      datos: allInRange,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error,
    });
  }
};

const getByIntervals = async (req, res) => {
  // desde front darle valores por default
  const inicio = new Date(parseInt(req.params.inicio));
  const final = new Date(parseInt(req.params.final));
  const binsize = parseInt(req.params.binsize);
  const unit = req.params.unit;

  try {
    const results = await RegistroGeneralts.aggregate([
      {
        $match: {
          fecha_lectura: {
            $gte: inicio,
            $lte: final,
          },
        },
      },
      {
        $unwind: {
          path: "$metaData",
        },
      },
      {
        $group: {
          _id: {
            id_variable: "$metaData.id_variable",
            date: {
              $dateTrunc: {
                date: "$fecha_lectura",
                unit: unit,
                binSize: binsize,
              },
            },
          },
          datos: {
            $push: {
              valor_lectura: "$metaData.datos",
              fecha_lectura: "$fecha_lectura",
            },
          },
        },
      },
      {
        $sort: {
          "_id.date": 1,
        },
      },
      {
        $group: {
          _id: "$_id.id_variable",
          info: {
            $push: {
              date: "$_id.date",
              max: {
                $max: "$datos",
              },
              min: {
                $min: "$datos",
              },
              avg: {
                $avg: "$datos.valor_lectura",
              },
              sum: {
                $sum: "$datos.valor_lectura",
              },
            },
          },
        },
      },
    ]);
    res.status(200).json({
      datos: results,
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      ok: false,
    });
  }
};

async function getLastRegistrosFromdate(id_variable, fromDate, dateTil) {
  const objectIdVariable = id_variable.map(
    (str) => new mongoose.Types.ObjectId(str)
  );
  const lastRegistros = await RegistroGeneralts.aggregate([
    {
      $unwind: {
        path: "$metaData",
      },
    },
    {
      $match: {
        "metaData.id_variable": {
          $in: objectIdVariable,
        },
      },
    },
    {
      $match: {
        fecha_lectura: {
          $gte: fromDate,
          $lte: dateTil,
        },
      },
    },
    {
      $sort: {
        fecha_lectura: -1,
      },
    },
    {
      $group: {
        _id: "$metaData.id_variable",
        lastTimestamp: {
          $first: "$fecha_lectura",
        },
        lastDocument: {
          $first: "$$ROOT",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$lastDocument",
      },
    },
    {
      $project: {
        //'fecha_lectura': 1,
        fl: "$fecha_lectura",
        id_variable: "$metaData.id_variable",
        v: "$metaData.datos",
      },
    },
  ]);
  return lastRegistros;
}

async function getAllVariables() {
  const allVariable = await Variable.aggregate([
    {
      $lookup: {
        from: "triggers",
        localField: "id_trigger",
        foreignField: "_id",
        as: "trigger",
      },
    },
    {
      $project: {
        _id: 1,
        nombre: 1,
        tipo_trigger: {
          $arrayElemAt: ["$trigger.nombre", 0],
        },
        trigger_valor: 1,
      },
    },
  ]);
  return allVariable;
}
//agregar el resto de parametros, probar si hace falta agregar un parametro de fecha inicio/final
// arreglar el uso de inicio final de los graficos

async function postRegGeneral(
  registroToInsert,
  variables,
  dateFrom,
  dateTil,
  res
) {
  if (!verificarFormatoJSON(registroToInsert)) {
    res.status(500).json({
      ok: false,
      datos: "Formato de JSON incorrecto",
    });
    return;
  }

  if (flToDate(registroToInsert.fl) == false) {
    res.status(500).json({
      ok: false,
      datos: "Formato de JSON incorrecto. Ver campo fl",
    });
    return;
  }

  registroToInsert.fecha_lectura = flToDate(registroToInsert.fl);
  delete registroToInsert.fl;

  // Cambiar el nombre del campo "v" por "data" en cada elemento de "metaData"
  registroToInsert.metaData.forEach((item) => {
    item.datos = item.v;
    delete item.v;
  });

  //Filtramos los datos que se ingresan, segun las variables definidas.

  // Crear un conjunto (set) de nombres del segundo JSON
  const nombresSet = new Set(variables.map((doc) => doc.nombre));

  // Filtrar los elementos del primer JSON y mantener solo aquellos que tienen una coincidencia en el segundo JSON
  const nuevoMetaData = registroToInsert.metaData.filter((item) =>
    nombresSet.has(item.n)
  );

  // Actualizar el primer JSON con el nuevo arreglo de metaData
  const registroToInsertfilter = {
    ...registroToInsert,
    metaData: nuevoMetaData,
  };

  if (registroToInsertfilter.metaData.length == 0) {
    res.status(200).json({
      ok: false,
      datos: "No hay variables en el sistema que conicida con lo enviado",
    });
    return;
  }

  // Crear un objeto de mapeo para los nombres y sus respectivos _id
  const nombreIdMap = variables.reduce((acc, doc) => {
    acc[doc.nombre] = doc._id.toString();
    return acc;
  }, {});

  // Reemplazar los nombres en el primer JSON con sus respectivos _id
  const nuevoregistroToInsert = { ...registroToInsertfilter };
  nuevoregistroToInsert.metaData.forEach((item) => {
    if (nombreIdMap.hasOwnProperty(item.n)) {
      item.n = nombreIdMap[item.n];
    }
  });

  // Cambiar el nombre del campo "n" por "id_variables" en cada elemento de "metaData"
  nuevoregistroToInsert.metaData.forEach((item) => {
    item.id_variable = item.n;
    delete item.n;
  });

  // Actualiza todos los documentos que tienen la misma fehca-hora y mismos id_variable
  const idVariablesComunes = [];
  const existeDocumentos = await RegistroGeneralts.find({
    fecha_lectura: nuevoregistroToInsert.fecha_lectura,
  });
  for (let existeDocumento of existeDocumentos) {
    if (existeDocumento) {
      // Recorremos los metaData de ambos objetos
      existeDocumento.metaData.forEach((existeItem, existeIndex) => {
        nuevoregistroToInsert.metaData.forEach((nuevoItem) => {
          // Si los id_variable coinciden, actualizamos los datos
          if (
            existeItem.id_variable.toString() ===
            nuevoItem.id_variable.toString()
          ) {
            existeDocumento.metaData[existeIndex].datos = nuevoItem.datos;
          }
        });
      });
      existeDocumento.save();

      //----Almacena los id_variables que se actualizaron
      for (const metaDatoExiste of existeDocumento.metaData) {
        // Iterar sobre los id_variable de nuevoregistroToInsert y comparar
        for (const metaDatoNuevo of nuevoregistroToInsert.metaData) {
          // Si el id_variable está en ambos objetos, agregarlo a la lista
          if (
            metaDatoExiste.id_variable.toString() ===
            metaDatoNuevo.id_variable.toString()
          ) {
            idVariablesComunes.push(metaDatoExiste.id_variable.toString());
          }
        }
      }
    }
  }

  //--- Eliminamos todas las variables que se actualizaron en documentos y se dejan unicamente las variables que se tienen que crear nuevos documentos
  nuevoregistroToInsert.metaData = nuevoregistroToInsert.metaData.filter(
    (metaDato) => {
      // Convertir el id_variable actual a cadena de texto para comparar
      const idVariableString = metaDato.id_variable.toString();
      // Verificar si el id_variable convertido está en la lista de idVariablesComunes
      return !idVariablesComunes.includes(idVariableString);
    }
  );

  //---- Puede ser que no se tenga mas datos para procesar.
  if (registroToInsertfilter.metaData.length == 0) {
    return res.status(200).json({
      ok: true,
      datos: "documento actualizado",
    });
  }

  //---- Obtener los ultimos registros de id_variables que tengan, desde 7 días atras
  const idVariables = nuevoregistroToInsert.metaData.map(
    (item) => item.id_variable
  );

  const lastRegistros = await getLastRegistrosFromdate(
    idVariables,
    dateFrom,
    dateTil
  );

  let elementosParaEliminar = [];

  for (let i = 0; i < nuevoregistroToInsert.metaData.length; i++) {
    const foundVariable = variables.find(
      (elemento) =>
        elemento._id == nuevoregistroToInsert.metaData[i].id_variable
    );

    //---- Variable sin datos anterior. Se almacena si aplicar ningun filtro.-
    if (
      lastRegistros.find(
        (registro) =>
          registro.id_variable == nuevoregistroToInsert.metaData[i].id_variable
      ) === undefined
    ) {
      continue;
    }

    switch (foundVariable.tipo_trigger) {
      case "cambio-valor":
        try {
          let valor_lasRegistros = lastRegistros.find(
            (registro) =>
              registro.id_variable ==
              nuevoregistroToInsert.metaData[i].id_variable
          ).v;
          let valor_nuevoregistroToInsert =
            nuevoregistroToInsert.metaData[i].datos;
          let trigger_valor = foundVariable.trigger_valor;
          if (typeof trigger_valor === "undefined") {
            trigger_valor = 0;
          }

          // Verificamos por valor de trigger
          if (
            Math.abs(valor_lasRegistros - valor_nuevoregistroToInsert) >=
            trigger_valor
          ) {
            //console.log('Hay cambio de valor');
          } else {
            //console.log('NO hay cambio de valor');
            elementosParaEliminar.push(i);
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case "sin-filtro":
        console.log("SIN Filtro");
        break;
      case "cambio-porcentaje":
        try {
          let valor_lasRegistros = lastRegistros.find(
            (registro) =>
              registro.id_variable ==
              nuevoregistroToInsert.metaData[i].id_variable
          ).v;
          let valor_nuevoregistroToInsert =
            nuevoregistroToInsert.metaData[i].datos;
          let trigger_valor = foundVariable.trigger_valor;
          if (typeof trigger_valor === "undefined") {
            trigger_valor = 0;
          }

          let valor_porcentaje = 0;
          if (valor_lasRegistros != 0) {
            valor_porcentaje =
              Math.abs(
                (valor_lasRegistros - valor_nuevoregistroToInsert) /
                  valor_lasRegistros
              ) * 100;
          }
          /*
          console.log('\nFILTRO POR CAMBIO DE PORCENTAJE');
          console.log('valor_lasRegistros: ' + valor_lasRegistros);
          console.log('valor_nuevoregistroToInsert: ' + valor_nuevoregistroToInsert);     
          console.log('trigger_valor: ' + trigger_valor);
          console.log('Porcentaje: ' + valor_porcentaje);
          */

          if (valor_porcentaje >= trigger_valor) {
            // console.log('HAY CAMBIOS EN PORCENTAJE');
          } else {
            //console.log('SIN CAMBIOS DE PORCENTAJE');
            elementosParaEliminar.push(i);
          }
        } catch (error) {
          console.log(error);
        }
        break;
      case "cambio-tiempo":
        try {
          let fecha_lasRegistros = new Date(
            lastRegistros.find(
              (registro) =>
                registro.id_variable ==
                nuevoregistroToInsert.metaData[i].id_variable
            ).fl
          ).getTime();
          let fecha_nuevoregistroToInsert = new Date(
            nuevoregistroToInsert.fecha_lectura
          ).getTime();
          let trigger_valor = foundVariable.trigger_valor;

          if (typeof trigger_valor === "undefined") {
            trigger_valor = 0;
          }
          //console.log('\nFILTRO POR CAMBIO DE TIEMPO');
          //console.log('fecha_lasRegistros:' + fecha_lasRegistros);
          //console.log('fecha_nuevoregistroToInsert:' + fecha_nuevoregistroToInsert);
          //console.log('Diferencia:' + Math.abs(fecha_lasRegistros - fecha_nuevoregistroToInsert));
          //console.log('trigger_valor:' + trigger_valor);

          //--- No guarda si es el mismo tiempo
          if (Math.abs(fecha_lasRegistros - fecha_nuevoregistroToInsert) == 0) {
            break;
          }

          if (
            Math.abs(fecha_lasRegistros - fecha_nuevoregistroToInsert) >=
            trigger_valor
          ) {
            //console.log('HAY CAMBIO DE TIEMPO');
          } else {
            //console.log('NO HAY CAMBIO DE TIEMPO');
            elementosParaEliminar.push(i);
          }
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        console.log("No se encontro el tipo de filtro");
        break;
    }
  }

  // Eliminar elementos marcados para eliminar
  for (let i = elementosParaEliminar.length - 1; i >= 0; i--) {
    nuevoregistroToInsert.metaData.splice(elementosParaEliminar[i], 1);
  }

  //--- No hay datos para insertar en la DB ---
  if (nuevoregistroToInsert.metaData.length == 0) {
    return null;
  }

  try {
    nuevoregistroToInsert.time_stamp = new Date();
    const RegFiltrado = new RegistroGeneralts(nuevoregistroToInsert);
    console.log("regfiltrado ", RegFiltrado);
    RegFiltrado.save();
    return RegFiltrado;
  } catch (error) {
    return console.log("error en el api algo paso: ", error);
  }
}

function verificarFormatoJSON(objeto) {
  try {
    // Verificar si el objeto tiene la propiedad "fl" y "metaData"
    if (!objeto.hasOwnProperty("fl") || !objeto.hasOwnProperty("metaData")) {
      return false;
    }

    // Verificar si "fl" es una cadena y "metaData" es un array
    if (typeof objeto.fl !== "string" || !Array.isArray(objeto.metaData)) {
      return false;
    }

    // Verificar la longitud del valor de la propiedad "fl"
    if (objeto.fl.length !== "20240313:152403".length) {
      return false; // La longitud del valor de "fl" debe ser de 15 caracteres
    }

    // Verificar el formato de cada objeto dentro de "metaData"
    for (var i = 0; i < objeto.metaData.length; i++) {
      var item = objeto.metaData[i];
      // Verificar si cada objeto tiene las propiedades "v" y "n" y si sus valores son del tipo esperado
      if (
        !item.hasOwnProperty("v") ||
        !item.hasOwnProperty("n") ||
        typeof item.v !== "number" ||
        typeof item.n !== "string"
      ) {
        return false;
      }
    }
    // Si se pasan todas las verificaciones, el objeto tiene el formato esperado
    return true;
  } catch (error) {
    console.error("La variable no contiene una cadena JSON válida.");
  }
  return false;
}

function flToDate(cadena) {
  // Extraer las partes de la cadena: año, mes, día, hora, minuto y segundo
  var año = parseInt(cadena.substr(0, 4));
  var mes = parseInt(cadena.substr(4, 2));
  var dia = parseInt(cadena.substr(6, 2));
  var hora = parseInt(cadena.substr(9, 2));
  var minuto = parseInt(cadena.substr(11, 2));
  var segundo = parseInt(cadena.substr(13, 2));

  // Verificar si las partes son números válidos
  if (
    isNaN(año) ||
    isNaN(mes) ||
    isNaN(dia) ||
    isNaN(hora) ||
    isNaN(minuto) ||
    isNaN(segundo)
  ) {
    return false;
  }

  // Crear un objeto Date con las partes
  var fecha = new Date(año, mes - 1, dia, hora, minuto, segundo);

  if (isNaN(fecha.getTime())) {
    return false;
  }

  if (
    fecha.getFullYear() === año &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia &&
    fecha.getHours() === hora &&
    fecha.getMinutes() === minuto &&
    fecha.getSeconds() === segundo
  ) {
    return fecha;
  }
  return false;
}

module.exports = {
  getAllRegistrosTS,
  postRegistroTS,
  getRegistrosFiltrados,
  getAllInRange,
  getByIntervals,
};
