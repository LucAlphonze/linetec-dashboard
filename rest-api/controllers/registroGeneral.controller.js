const mongoose = require("mongoose");
const RegistroGeneral = require("../models/registroGeneral.model");
const Variable = require("../models/variable.model");
const { filtradoPost } = require("./middleware.controller");

const obtenerTodos = async (req, res) => {
  try {
    const variable = req.params.variable;
    const registrosGenerales = await RegistroGeneral.aggregate([
      {
        $match: {
          id_variable: new mongoose.Types.ObjectId(variable),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$time_stamp",
            },
          },
          max: {
            $max: "$valor_lectura",
          },
          min: {
            $min: "$valor_lectura",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      datos: registrosGenerales,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const getTodos = async (req, res) => {
  try {
    const registrosGenerales = await RegistroGeneral.find({})
      .limit(20)
      .sort({ fecha_lectura: -1 })
      .populate("id_variable", "nombre");
    res.status(200).json({
      ok: true,
      datos: registrosGenerales,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const obtenerRegistrosGeneral = async (req, res) => {
  try {
    var idVariable = req.params.idVariable;
    const registrosGenerales = await RegistroGeneral.findOne({
      id_variable: idVariable,
    })
      .sort({ fecha_lectura: 1 })
      .populate("id_variable", "nombre");
    res.status(200).json({
      ok: true,
      datos: registrosGenerales,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const crearRegistroGeneral = async (req, res) => {
  const registroGeneral = new RegistroGeneral(req.body);
  const id_variable = registroGeneral.id_variable;
  const time_stamp = registroGeneral.time_stamp;

  try {
    const variable = await Variable.findOne({
      _id: id_variable,
    })
      .populate("id_maquina", "nombre modelo")
      .populate("id_proceso", "descripcion")
      .populate("id_trigger", "nombre descripcion");

    const ultimoRegistro = await RegistroGeneral.findOne({
      id_variable: id_variable,
    }).sort({ fecha_lectura: -1 });
    console.log(
      "ultimo registro : ",
      ultimoRegistro,
      "variable: ",
      variable,
      "registro nuevo: ",
      registroGeneral
    );
    const existeTimestamp = await RegistroGeneral.find({
      time_stamp: time_stamp,
      id_variable: id_variable,
    });

    if (existeTimestamp.length > 0) {
      console.log(
        "registro general post error, ya existe un documento con este timestamp: ",
        existeTimestamp
      );
      res.status(500).json({
        ok: false,
        datos: "ya existe un documento con este timestamp",
      });
      return;
    }
    let filtrado = await filtradoPost(
      variable,
      registroGeneral,
      ultimoRegistro
    );
    console.log("respuesta ", filtrado);

    await filtrado.save();
    res.status(200).json({
      ok: true,
      datos: filtrado,
    });
  } catch (error) {
    console.log("registro general post error: ", error);
    res.status(500).json({
      ok: false,
      datos: error,
    });
    return;
  }
};

const crearRegistroGeneralArray = async (req, res) => {
  const yaTermino = {
    error: false,
    documentosConError: [],
    documentosQuePasaron: [],
  };
  // hay que mandar los datos ordenados por fecha(time_stamp) y todos los datos deben pertenecer a la misma variable
  const registroGeneralArray = req.body["data"];
  const id_variable = registroGeneralArray[0].id_variable;
  const documentosDBSinfiltrar = await RegistroGeneral.find({
    id_variable: id_variable,
    time_stamp: {
      $gte: new Date(registroGeneralArray[0].time_stamp),
      $lte: new Date(
        registroGeneralArray[registroGeneralArray.length - 1].time_stamp
      ),
    },
  });
  const documentosFiltrados = filterArray2(
    registroGeneralArray,
    documentosDBSinfiltrar
  );
  const variable = await Variable.findOne({
    _id: id_variable,
  })
    .populate("id_maquina", "nombre modelo")
    .populate("id_proceso", "descripcion")
    .populate("id_trigger", "nombre descripcion");
  // const ultimoRegistro = await RegistroGeneral.findOne({
  //   id_variable: id_variable,
  // }).sort({ time_stamp: -1 });

  if (documentosFiltrados.length == 0) {
    console.log(yaTermino.documentosQuePasaron);

    res.status(409).json({
      ok: false,
    });
    return;
  } else {
    try {
      for (let i = 0; i < documentosFiltrados.length; i++) {
        var ultimoRegistro =
          yaTermino.documentosQuePasaron[
            yaTermino.documentosQuePasaron.length - 1
          ];
        if (i == 0) {
          ultimoRegistro = await RegistroGeneral.findOne({
            id_variable: id_variable,
            time_stamp: { $lt: documentosFiltrados[0].time_stamp },
          }).sort({ time_stamp: -1 });

          // console.log("ultimo registro i = 0: ", ultimoRegistro);
          // console.log(
          //   "documento filtrado posicion 0: ",
          //   documentosFiltrados[0]
          // );
        }
        console.log("indice: ", i);
        let filtrado = await filtradoPost(
          variable,
          new RegistroGeneral(documentosFiltrados[i]),
          ultimoRegistro
        );

        if (filtrado != 0) {
          yaTermino.documentosQuePasaron.push(filtrado);
          // console.log(
          //   "ultimo registro: ",
          //   ultimoRegistro,
          //   "documentos que pasaron: ",
          //   yaTermino.documentosQuePasaron
          // );
        }

        if (i == documentosFiltrados.length - 1) {
          // console.log("Documentos que pasaron", yaTermino.documentosQuePasaron);
          await RegistroGeneral.insertMany(yaTermino.documentosQuePasaron);
          res.status(200).json({
            ok: true,
            // datos: yaTermino.documentosQuePasaron,
            documentosInsertados: yaTermino.documentosQuePasaron.length,
          });
          return;
        }
      }
    } catch (error) {
      console.log("registro general post error: ", error);
      res.status(500).json({
        ok: false,
        datos: error,
      });
      return;
    }
  }
};

const filtrarRegistrosGenerales = async (req, res) => {
  var idVariable = req.params.idVariable;
  var sti = req.params.startdate;
  var stf = req.params.enddate;
  var operacion = req.params.operacion;
  const resultado = determinarOperacion(operacion);
  console.log("resultado: ", resultado, "operacion: ", operacion);
  try {
    const registrosFiltrados = await RegistroGeneral.aggregate([
      {
        $match: {
          id_variable: new mongoose.Types.ObjectId(idVariable),
        },
      },
      {
        $match: {
          time_stamp: {
            $gte: new Date(parseInt(sti)),
            $lte: new Date(parseInt(stf)),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$time_stamp",
            },
          },
          respuesta: { $max: "$valor_lectura" },
          min: { $min: "$valor_lectura" },
          avg: { $avg: "$valor_lectura" },
          sum: { $sum: "$valor_lectura" },
        },
      },
      {
        $sort: {
          _id: 1,
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

const filtrarRegistrosGenerales2 = async (req, res) => {
  // var idVariable = req.params.idVariable;
  var sti = req.params.startdate;
  var stf = req.params.enddate;
  var granularidad = req.params.granularidad;
  const resultado = determinarGranularidad(granularidad);
  try {
    const registrosFiltrados = await RegistroGeneral.aggregate([
      {
        $match: {
          time_stamp: {
            $gte: new Date(parseInt(sti)),
            $lte: new Date(parseInt(stf)),
          },
        },
      },
      {
        $group: {
          _id: {
            id_variable: "$id_variable",
            date: {
              $dateToString: {
                date: "$time_stamp",
                format: "%Y-%m-%d",
              },
            },
          },
          datos: {
            $push: {
              valor_lectura: "$valor_lectura",
              time_stamp: "$time_stamp",
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
    const allInRange = await RegistroGeneral.find({
      id_variable: idVariable,
      time_stamp: {
        $gte: new Date(parseInt(sti)),
        $lte: new Date(parseInt(stf)),
      },
    }).sort({ time_stamp: 1 });
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

function determinarOperacion(operacion) {
  let resultado;
  switch (operacion) {
    case "min":
      resultado = '{"$min": "$valor_lectura"}';
      if (resultado != "") {
        resultado = JSON.parse(resultado);
        return resultado;
      }
      break;

    case "max":
      resultado = '{"$max": "$valor_lectura"}';
      if (resultado != "") {
        resultado = JSON.parse(resultado);
        return resultado;
      }
      break;

    case "sum":
      resultado = '{"$sum": "$valor_lectura"}';
      if (resultado != "") {
        resultado = JSON.parse(resultado);
        return resultado;
      }
      break;

    case "avg":
      resultado = '{"$avg": "$valor_lectura"}';
      if (resultado != "") {
        resultado = JSON.parse(resultado);
        return resultado;
      }
      break;

    default:
      resultado = "caso no encontrado";
      if (resultado != "") {
        return resultado;
      }
      break;
  }
  console.log("resultado: ", resultado, "operacion: ", operacion);
}

function determinarGranularidad(escalaTiempo) {
  let resultado;
  switch (escalaTiempo) {
    case "month":
      resultado = "%Y-%m";
      if (resultado != "") {
        return resultado;
      }
      break;

    case "day":
      resultado = "%Y-%m-%d";
      if (resultado != "") {
        return resultado;
      }
      break;

    case "hour":
      resultado = "%Y-%m-%dT%H:00";
      if (resultado != "") {
        return resultado;
      }
      break;

    default:
      resultado = "%Y-%m-%d";
      if (resultado != "") {
        return resultado;
      }
      break;
  }
  console.log("resultado: ", resultado);
}

function filterArray2(source, removals) {
  const removeSet = new Set(
    removals.map((entry) => new Date(entry.time_stamp).toISOString())
  );
  return source.filter(
    (entry) => !removeSet.has(new Date(entry.time_stamp).toISOString())
  );
}

module.exports = {
  obtenerTodos,
  obtenerRegistrosGeneral,
  crearRegistroGeneral,
  crearRegistroGeneralArray,
  getTodos,
  filtrarRegistrosGenerales,
  filtrarRegistrosGenerales2,
  getAllInRange,
};
