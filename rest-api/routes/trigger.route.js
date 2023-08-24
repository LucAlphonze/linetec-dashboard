/* 
  Ruta: /api/trigger
*/

const { Router } = require("express");

const {
  obtenerTrigger,
  crearTrigger,
  borrarTrigger,
} = require("../controllers/trigger.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerTrigger);

router.post("/", verifyToken, crearTrigger);
router.delete("/delete/:triggerId", verifyToken, borrarTrigger);

module.exports = router;
