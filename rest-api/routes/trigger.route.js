/* 
  Ruta: /api/trigger
*/

const { Router } = require("express");

const {
  obtenerTrigger,
  crearTrigger,
} = require("../controllers/trigger.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerTrigger);

router.post("/", verifyToken, crearTrigger);

module.exports = router;
