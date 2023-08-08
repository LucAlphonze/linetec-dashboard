/* 
  Ruta: /api/alertasPersonalizadasVar
*/

const { Router } = require("express");
const {
  obtenerAlertasPersonalizadasVar,
  crearAlertaPersonalizada,
} = require("../controllers/alertaPersonalizadaVar.controller");

const router = Router();

router.get("/", obtenerAlertasPersonalizadasVar);

router.post("/", crearAlertaPersonalizada);

module.exports = router;
