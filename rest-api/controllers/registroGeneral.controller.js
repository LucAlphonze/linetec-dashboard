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
    if (RegistroGeneral.find(registroGeneral.time_stamp).length > 0) {
      console.log(
        "registro general post error, ya existe un documento con este timestamp "
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
          fecha_lectura: {
            $gte: new Date(parseInt(sti)),
            $lte: new Date(parseInt(stf)),
          },
        },
      },
      // usamos project para definir variables que vamos a mostrar nos puede servir para
      // luego elegir la granularidad de las operaciones (mes, semana, dia , horas)
      // {
      //   $project: {year: {  $year: "$fecha_lectura",},month: {  $month: "$fecha_lectura",},day: {  $dayOfMonth: "$fecha_lectura",},weekOfMonth: {  $add: [    {      $floor: {        $divide: [          {            $dayOfMonth: "$fecha_lectura",          },          7,        ],      },    },    1,  ],},valor: "$valor_lectura",
      //   },
      // },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$fecha_lectura",
            },
          },
          respuesta: resultado,
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
module.exports = {
  obtenerTodos,
  obtenerRegistrosGeneral,
  crearRegistroGeneral,
  getTodos,
  filtrarRegistrosGenerales,
};
