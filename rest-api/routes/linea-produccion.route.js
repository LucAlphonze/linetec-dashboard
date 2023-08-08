/* 
  Ruta: /api/lineaProduccion
*/

const { Router } = require("express");
const {
  obtenerLineasProducciones,
  crearLineaProduccion,
} = require("../controllers/linea-produccion.controller");

const router = Router();

router.get("/", obtenerLineasProducciones);

router.post("/", crearLineaProduccion);

module.exports = router;
