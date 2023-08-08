/* 
  Ruta: /api/alertasPersonalizadas
  Personalizadas
*/

const { Router } = require("express");

const {
  obtenerAlertasPersonalizadas,
  crearAlertaPersonalizada,
} = require("../controllers/alertaPersonalizada.controller");

const router = Router();

router.get("/", obtenerAlertasPersonalizadas);

router.post("/", crearAlertaPersonalizada);

module.exports = router;
