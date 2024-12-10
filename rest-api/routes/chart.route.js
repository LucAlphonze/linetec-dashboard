/* 
  Ruta: /api/charts
*/

const { Router } = require("express");

const {
  obtenerCharts,
  crearChart,
  borrarChart,
} = require("../controllers/chart.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerCharts);

router.post("/", verifyToken, crearChart);
router.delete("/delete/:chartId", verifyToken, borrarChart);

module.exports = router;
