const { Schema, model } = require("mongoose");

const LocalidadSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  codigo_postal: {
    type: String,
  },
  id_provincia: {
    type: Schema.Types.ObjectId,
    ref: "Provincia",
    required: true,
  },
});

module.exports = model("Localidad", LocalidadSchema);
