const { Schema, model } = require("mongoose");

const RegistroGeneralSchema = Schema({
  id_variable: {
    type: Schema.Types.ObjectId,
    ref: "Variable",
  },
  fecha_lectura: {
    type: Date,
    required: true,
  },
  valor_lectura: {
    type: Number,
    required: true,
  },
  modo: {
    type: String,
    default: "automatica",
  },
  time_stamp: {
    type: Date,
  },
});

module.exports = model("RegistroGeneral", RegistroGeneralSchema);
