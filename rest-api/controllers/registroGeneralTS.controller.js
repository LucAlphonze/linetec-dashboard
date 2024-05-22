const mongoose = require("mongoose");
const RegistroGeneralts = require("../models/registrogeneralts.model");
const Variable = require("../models/variable.model");
const { filtradoPost, filtradoPostArray } = require("./middleware.controller");

const getAllRegistrosTS = async (req, res) => {
  try {
    const registrosGeneralesTS = await RegistroGeneralts.find({})
      .limit(20)
      .sort({ fecha_lectura: -1 })
      .populate("metaData.id_variable", "nombre");
    res.status(200).json({
      ok: true,
      datos: registrosGeneralesTS,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const postRegistroTS = async (req, res) => {
  const registroGeneral = req.body.datos;
  const variables = req.body.vList;
  const lastRegistros = await getLastRegistros();

  console.log("nuevo registro: ", registroGeneral);
  console.log("variables: ", variables);
  console.log("last registros: ", lastRegistros);

  if (lastRegistros.length == 0) {
    const firstRegistro = new RegistroGeneralts(registroGeneral);
    console.log("registros filtrado si dios quiere: ", firstRegistro);
    await firstRegistro.save();
    return res.status(200).json({
      ok: true,
      datos: firstRegistro,
    });
  }
  const existeDocumento = await RegistroGeneralts.findOne({
    fecha_lectura: registroGeneral.fecha_lectura,
  });
  if (existeDocumento) {
    console.log("existe documento: ", existeDocumento);
    const filtrarDiferentes = registroGeneral.metaData.filter(
      (obj1) =>
        !existeDocumento.metaData.some(
          (obj2) =>
            obj1.id_variable._id.toString() === obj2.id_variable.toString()
        )
    );
    //ver la parte de actualizar
    console.log("metaData distinta: ", filtrarDiferentes);
    existeDocumento.metaData = [
      ...existeDocumento.metaData,
      ...filtrarDiferentes,
    ];
    console.log("documento Updateado: ", existeDocumento);
    existeDocumento.save();
    return res.status(200).json({
      ok: true,
      datos: "documento actualizado",
    });
  }

  const matchingObjects = [registroGeneral].map(
    ({ time_stamp, fecha_lectura, metaData }) => ({
      fecha_lectura: fecha_lectura,
      metaData: metaData.filter((obj1) =>
        lastRegistros.some(
          (obj2) =>
            obj1.id_variable._id.toString() ===
            obj2.metaData.id_variable.toString()
        )
      ),
      time_stamp: time_stamp,
    })
  );
  const filtrado = [registroGeneral].map(({ time_stamp, fecha_lectura }) => ({
    fecha_lectura: fecha_lectura,
    metaData: [],
    time_stamp: time_stamp,
  }));

  // Step 2: Apply a function for each match
  matchingObjects[0].metaData.forEach((match) => {
    const matchingObjectInArray2 = lastRegistros.find(
      (obj) =>
        obj.metaData.id_variable.toString() === match.id_variable._id.toString()
    );
    console.log(
      `Found matching object with id_variable ${match.id_variable._id}:`
    );
    console.log("Object from nuevos registros:", match);
    console.log(
      "Corresponding object in last registros:",
      matchingObjectInArray2
    );
    // Replace the log statement with your desired function
    switch (match.id_variable.id_trigger.nombre) {
      case "cambio-tiempo":
        try {
          let fecha_lectura_millis = new Date(
            matchingObjects[0].fecha_lectura
          ).getTime();
          let old_fecha_lectura_millis = new Date(
            matchingObjectInArray2?.fecha_lectura
          ).getTime();
          let millis = parseInt(match.id_variable.trigger_valor);
          if (
            fecha_lectura_millis > old_fecha_lectura_millis + millis ||
            old_fecha_lectura_millis == null
          ) {
            filtrado[0].metaData.push(match);
          }
          break;
        } catch (error) {
          console.log(error);
          return error;
        }

      case "cambio-valor":
        try {
          if (
            matchingObjectInArray2.metaData?.datos == null ||
            matchingObjectInArray2.metaData.datos != match.datos
          ) {
            filtrado[0].metaData.push(match);
          }
          break;
        } catch (error) {
          console.log(error);

          return error;
        }

      case "cambio-porcentaje":
        try {
          var x_porciento =
            (matchingObjectInArray2.metaData?.datos / 100) *
            parseInt(match.id_variable.trigger_valor);
          if (
            matchingObjectInArray2 == null ||
            Math.abs(matchingObjectInArray2.metaData?.datos - match.datos) >=
              x_porciento
          ) {
            // console.log("cambio-porcentaje: ", nuevoRegistro);
            filtrado[0].metaData.push(match);
          }
          break;
        } catch (error) {
          console.log(error);
          return error;
        }
      case "sin-filtro":
        filtrado[0].metaData.push(match);
        break;

      default:
        console.log("default case, breaking...");
        break;
    }
  });

  try {
    const RegFiltrado = new RegistroGeneralts(filtrado[0]);
    console.log("registros filtrado si dios quiere: ", RegFiltrado);
    await RegFiltrado.save();
    return res.status(200).json({
      ok: true,
      datos: RegFiltrado,
    });
  } catch (error) {
    return console.log("error en el api algo paso: ", error);
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

async function getLastRegistros() {
  const lastRegistros = await RegistroGeneralts.aggregate([
    {
      $unwind: {
        path: "$metaData",
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
      $limit: 12,
    },
    {
      $sort: {
        fecha_lectura: -1,
      },
    },
  ]);
  return lastRegistros;
}
module.exports = {
  getAllRegistrosTS,
  postRegistroTS,
  getRegistrosFiltrados,
  getAllInRange,
  getByIntervals,
};
