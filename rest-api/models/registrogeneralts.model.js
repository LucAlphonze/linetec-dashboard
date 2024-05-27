const { Schema, model } = require("mongoose");

const RegistroGeneralTSSchema = Schema(
  {
    fecha_lectura: {
      type: Date,
      required: true,
    },
    metaData: [
      {
        datos: {
          type: Number,
          required: true,
        },
        id_variable: {
          type: Schema.Types.ObjectId,
          ref: "Variable",
          required: true,
        },
        _id: false,
      },
    ],
    modo: {
      type: String,
      default: "automatica",
    },
    time_stamp: {
      type: Date,
    },
  }
  // {
  //   timeseries: {
  //     timeField: "fecha_lectura",
  //     metaField: "metaData",
  //     granularity: "seconds",
  //   },
  // }
);
RegistroGeneralTSSchema.index({ fecha_lectura: -1, metaData: 1 });

const RegistroGeneralts = model("RegistroGeneralnew", RegistroGeneralTSSchema);
const lastRegistro = model("LastRegistro", RegistroGeneralTSSchema);

lastRegistro.createCollection({
  viewOn: "registrogeneralnews",
  pipeline: [
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
  ],
});
const schemas = {
  lastRegistro: lastRegistro,
  RegistroGeneralts: RegistroGeneralts,
};
module.exports = schemas;
