const { Schema, model } = require("mongoose");

const ChartSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  variables: {
    type: Array,
    required: true,
  },
});

module.exports = model("Chart", ChartSchema);
