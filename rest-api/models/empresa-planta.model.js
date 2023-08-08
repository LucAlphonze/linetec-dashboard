const { Schema, model } = require("mongoose");

const EmpresaPlantaSchema = Schema({
  id_empresa: {
    type: Schema.Types.ObjectId,
    ref: "Empresa",
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  calle: {
    type: String,
    required: false,
  },
  altura: {
    type: String,
    required: false,
  },
  id_localidad: {
    type: Schema.Types.ObjectId,
    ref: "Localidad",
    required: true,
  },
});

module.exports = model("EmpresaPlanta", EmpresaPlantaSchema);
