const { Schema, model } = require("mongoose");

const TriggerSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },

  descripcion: {
    type: String,
  },
});

module.exports = model("Trigger", TriggerSchema);
