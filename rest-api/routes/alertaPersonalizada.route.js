/* 
  Ruta: /api/alertasPersonalizadas
  Personalizadas
*/

const { Router } = require("express");

const {
  obtenerAlertasPersonalizadas,
  crearAlertaPersonalizada,
} = require("../controllers/alertaPersonalizada.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerAlertasPersonalizadas);

router.post("/", verifyToken, crearAlertaPersonalizada);

module.exports = router;
