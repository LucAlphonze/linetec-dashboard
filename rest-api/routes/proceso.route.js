/* 
  Ruta: /api/procesos
*/

const { Router } = require("express");

const {
  obtenerProcesos,
  crearProceso,
} = require("../controllers/proceso.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerProcesos);

router.post("/", verifyToken, crearProceso);

module.exports = router;
