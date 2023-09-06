/* 
  Ruta: /api/tipoMaquina
*/

const { Router } = require("express");
const {
  obtenerTiposMaquinas,
  crearTipoMaquina,
  borrarTipoMaquina,
} = require("../controllers/tipo-maquina.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerTiposMaquinas);

router.post("/", verifyToken, crearTipoMaquina);
router.delete("/delete/:tipoMaquinaId", verifyToken, borrarTipoMaquina);

module.exports = router;
