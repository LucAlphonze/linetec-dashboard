/* 
  Ruta: /api/procesos
*/

const { Router } = require("express");

const {
  obtenerProcesos,
  crearProceso,
  borrarProceso,
} = require("../controllers/proceso.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerProcesos);

router.post("/", verifyToken, crearProceso);
router.delete("/delete/:procesoId", verifyToken, borrarProceso);

module.exports = router;
