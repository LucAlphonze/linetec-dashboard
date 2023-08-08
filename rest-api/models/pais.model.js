const { Schema, model } = require("mongoose");

const PaisSchema = Schema({
  nombre: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = model("Pais", PaisSchema);
