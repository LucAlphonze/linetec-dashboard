/* 
  Ruta: /api/administracionMonitoreo
*/

const { Router } = require("express");
const {
  obtenerAdministracionesMonitoreos,
  crearAdministracionMonitoreo,
} = require("../controllers/administracionMonitoreo.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerAdministracionesMonitoreos);

router.post("/", verifyToken, crearAdministracionMonitoreo);

module.exports = router;
