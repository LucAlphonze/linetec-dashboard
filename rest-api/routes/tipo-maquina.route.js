/* 
  Ruta: /api/tipoMaquina
*/

const { Router } = require("express");
const {
  obtenerTiposMaquinas,
  crearTipoMaquina,
} = require("../controllers/tipo-maquina.controller");

const router = Router();

router.get("/", obtenerTiposMaquinas);

router.post("/", crearTipoMaquina);

module.exports = router;
