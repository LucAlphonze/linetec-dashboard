/* 
  Ruta: /api/administracionMonitoreo
*/

const { Router } = require("express");
const {
  obtenerAdministracionesMonitoreos,
  crearAdministracionMonitoreo,
} = require("../controllers/administracionMonitoreo.controller");

const router = Router();

router.get("/", obtenerAdministracionesMonitoreos);

router.post("/", crearAdministracionMonitoreo);

module.exports = router;
