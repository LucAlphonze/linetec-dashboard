const { Schema, model } = require("mongoose");

const ProcesoSchema = Schema({
  descripcion: {
    type: String,
    required: true,
  },
});

module.exports = model("Proceso", ProcesoSchema);
