/* 
  Ruta: /api/lineaProduccion
*/

const { Router } = require("express");
const {
  obtenerLineasProducciones,
  crearLineaProduccion,
  borrarLinea,
  lineaProduccionPorPlanta,
  editarLinea,
} = require("../controllers/linea-produccion.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerLineasProducciones);
router.get("/:idPlanta", verifyToken, lineaProduccionPorPlanta);

router.post("/", verifyToken, crearLineaProduccion);
router.delete("/delete/:lineaId", verifyToken, borrarLinea);
router.patch("/edit/:lineaId", verifyToken, editarLinea);

module.exports = router;
