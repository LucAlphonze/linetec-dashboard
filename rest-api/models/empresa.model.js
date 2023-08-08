const { Schema, model } = require("mongoose");

const EmpresaSchema = Schema({
  razon_social: {
    type: String,
    required: true,
  },
  nombre_fantasia: {
    type: String,
    required: false,
  },
  calle: {
    type: String,
    required: false,
  },
  altura: {
    type: String,
    required: false,
  },
  piso: {
    type: String,
    required: false,
  },
  departamento: {
    type: String,
    required: false,
  },
  id_localidad: {
    type: Schema.Types.ObjectId,
    ref: "Localidad",
    required: true,
  },
  rubro: {
    type: String,
    require: true,
  },
});

module.exports = model("Empresa", EmpresaSchema);
