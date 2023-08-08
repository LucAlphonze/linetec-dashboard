/* 
  Ruta: /api/maquinas
*/

const { Router } = require("express");
const {
  obtenerMaquinas,
  maquinasPorLinea,
  crearMaquina,
} = require("../controllers/maquina.controller");

const router = Router();

router.get("/", obtenerMaquinas);
router.get("/:idLineaProduccion", maquinasPorLinea);
router.post("/", crearMaquina);

module.exports = router;
