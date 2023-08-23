/* 
  Ruta: /api/localidades
*/

const { Router } = require("express");

const {
  obtenerLocalidades,
  localidadPorProvincia,
  crearLocalidad,
} = require("../controllers/localidad.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerLocalidades);
router.get("/:idProvincia", verifyToken, localidadPorProvincia);
router.post("/", verifyToken, crearLocalidad);

module.exports = router;
