/* 
  Ruta: /api/alertasPersonalizadasVar
*/

const { Router } = require("express");
const {
  obtenerAlertasPersonalizadasVar,
  crearAlertaPersonalizada,
} = require("../controllers/alertaPersonalizadaVar.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerAlertasPersonalizadasVar);

router.post("/", verifyToken, crearAlertaPersonalizada);

module.exports = router;
