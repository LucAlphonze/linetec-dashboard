/* 
  Ruta: /api/trigger
*/

const { Router } = require("express");

const {
  obtenerTrigger,
  crearTrigger,
} = require("../controllers/trigger.controller");

const router = Router();

router.get("/", obtenerTrigger);

router.post("/", crearTrigger);

module.exports = router;
