/* 
  Ruta: /api/lineaProduccion
*/

const { Router } = require("express");
const {
  obtenerLineasProducciones,
  crearLineaProduccion,
} = require("../controllers/linea-produccion.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerLineasProducciones);

router.post("/", verifyToken, crearLineaProduccion);

module.exports = router;
