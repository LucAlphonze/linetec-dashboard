/* 
  Ruta: /api/localidades
*/

const { Router } = require("express");

const {
  obtenerLocalidades,
  localidadPorProvincia,
  crearLocalidad,
} = require("../controllers/localidad.controller");

const router = Router();

router.get("/", obtenerLocalidades);
router.get("/:idProvincia", localidadPorProvincia);
router.post("/", crearLocalidad);

module.exports = router;
