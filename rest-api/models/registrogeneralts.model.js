const { Schema, model } = require("mongoose");

const RegistroGeneralTSSchema = Schema({
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
});

module.exports = model("RegistroGeneralts", RegistroGeneralTSSchema);
