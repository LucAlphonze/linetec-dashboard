/* 
  Ruta: /api/tipoMaquina
*/

const { Router } = require("express");
const {
  obtenerTiposMaquinas,
  crearTipoMaquina,
} = require("../controllers/tipo-maquina.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerTiposMaquinas);

router.post("/", verifyToken, crearTipoMaquina);

module.exports = router;
