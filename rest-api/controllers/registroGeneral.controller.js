const RegistroGeneral = require("../models/registroGeneral.model");
const Variable = require("../models/variable.model");
const { filtradoPost } = require("./middleware.controller");

const obtenerTodos = async (req, res) => {
  try {
    let variable = req.params.variable;
    const registrosGenerales = await RegistroGeneral.find({
      id_variable: variable,
    })
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

const obtenerRegistrosGenerales = async (req, res) => {
  try {
    var medidas = req.params.idVariable;
    const registrosGenerales = await RegistroGeneral.findOne({
      id_variable: medidas,
    })
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

// const filtrarRegistrosGenerales = async (req, res) => {
//   try {
//     var medidas = req.params.idVariable
//     var sti = req.params.startdate;
//     var stf = req.params.enddate;
//     const registrosFiltrados = await RegistroGeneral.aggregate(
//       [
//         {
//           '$match': {
//             'id_variable': new mongoose.Types.ObjectId(medidas)
//           }
//         }, {
//           '$match': {
//             'fecha_lectura': {
//               '$gte': new Date(parseInt(sti)),
//               '$lte': new Date(parseInt(stf))
//             }
//           }
//         }, {
//           '$group': {
//             '_id': {
//               'month': {
//                 '$month': {
//                   'date': '$fecha_lectura',
//                   'timezone': '-03:00'
//                 }
//               },
//               'day': {
//                 '$dayOfMonth': {
//                   'date': '$fecha_lectura',
//                   'timezone': '-03:00'
//                 }
//               },
//               'hour': {
//                 '$hour': {
//                   'date': '$fecha_lectura',
//                   'timezone': '-03:00'
//                 }
//               },
//               "interval": {
//                 "$subtract": [
//                   { "$minute": "$fecha_lectura" },
//                   { "$mod": [{ "$minute": "$fecha_lectura" }, 15] }
//                 ]
//               }
//             },
//             'potencia': {
//               '$avg': '$valor_lectura'
//             }
//           }
//         }, {
//           '$sort': {
//             '_id': 1
//           }
//         }
//       ]
//     )
//     res.status(200).send(registrosFiltrados);

//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       error
//     });
//   }
// };

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

module.exports = {
  obtenerTodos,
  obtenerRegistrosGenerales,
  crearRegistroGeneral,
  getTodos,
  // renderRegistros,
};
