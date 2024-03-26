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
  },
  {
    timeseries: {
      timeField: fecha_lectura,
      metaField: metaData,
      granularity: "seconds",
    },
  }
);
RegistroGeneralTSSchema.index({ metaData: 1, fecha_lectura: -1 });

module.exports = model("RegistroGeneralts", RegistroGeneralTSSchema);
