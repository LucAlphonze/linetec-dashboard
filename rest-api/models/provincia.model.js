const { Schema, model } = require("mongoose");

const ProvinciaSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  id_pais: {
    type: Schema.Types.ObjectId,
    ref: "Pais",
    required: true,
  },
});

module.exports = model("Provincia", ProvinciaSchema);
