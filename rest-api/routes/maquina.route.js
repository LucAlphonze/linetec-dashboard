/* 
  Ruta: /api/maquinas
*/

const { Router } = require("express");
const {
  obtenerMaquinas,
  maquinasPorLinea,
  crearMaquina,
  borrarMaquina,
  editarMaquina,
} = require("../controllers/maquina.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerMaquinas);
router.get("/:idLineaProduccion", verifyToken, maquinasPorLinea);
router.post("/", verifyToken, crearMaquina);
router.delete("/delete/:maquinaId", verifyToken, borrarMaquina);
router.patch("/edit/:maquinaId", verifyToken, editarMaquina);

module.exports = router;
