/* 
  Ruta: /api/procesos
*/

const { Router } = require("express");

const {
  obtenerProcesos,
  crearProceso,
  borrarProceso,
  editarProceso,
} = require("../controllers/proceso.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerProcesos);

router.post("/", verifyToken, crearProceso);
router.delete("/delete/:procesoId", verifyToken, borrarProceso);
router.patch("/edit/:procesoId", verifyToken, editarProceso);

module.exports = router;
