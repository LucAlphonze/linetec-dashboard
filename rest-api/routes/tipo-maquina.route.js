/* 
  Ruta: /api/tipoMaquina
*/

const { Router } = require("express");
const {
  obtenerTiposMaquinas,
  crearTipoMaquina,
  borrarTipoMaquina,
  editarTipoMaquina,
} = require("../controllers/tipo-maquina.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerTiposMaquinas);

router.post("/", verifyToken, crearTipoMaquina);
router.delete("/delete/:tipoMaquinaId", verifyToken, borrarTipoMaquina);
router.patch("/edit/:tipoMaquinaId", verifyToken, editarTipoMaquina);

module.exports = router;
