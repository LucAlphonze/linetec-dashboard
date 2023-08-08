/* 
  Ruta: /api/procesos
*/

const { Router } = require("express");

const {
  obtenerProcesos,
  crearProceso,
} = require("../controllers/proceso.controller");

const router = Router();

router.get("/", obtenerProcesos);

router.post("/", crearProceso);

module.exports = router;
