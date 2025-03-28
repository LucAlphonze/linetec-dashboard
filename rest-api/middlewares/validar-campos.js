const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(200).json({
      ok: false,
      error: errores.mapped(),
    });
  }

  next();
};

module.exports = {
  validarCampos,
};
