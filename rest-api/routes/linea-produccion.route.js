/* 
  Ruta: /api/lineaProduccion
*/

const { Router } = require("express");
const {
  obtenerLineasProducciones,
  crearLineaProduccion,
  borrarLinea,
} = require("../controllers/linea-produccion.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerLineasProducciones);

router.post("/", verifyToken, crearLineaProduccion);
router.delete("/delete/:lineaId", verifyToken, borrarLinea);

module.exports = router;
