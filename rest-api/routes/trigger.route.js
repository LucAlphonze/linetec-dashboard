/* 
  Ruta: /api/trigger
*/

const { Router } = require("express");

const {
  obtenerTrigger,
  crearTrigger,
  borrarTrigger,
  editarTrigger,
} = require("../controllers/trigger.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerTrigger);

router.post("/", verifyToken, crearTrigger);
router.delete("/delete/:triggerId", verifyToken, borrarTrigger);
router.patch("/edit/:triggerId", verifyToken, editarTrigger);

module.exports = router;
