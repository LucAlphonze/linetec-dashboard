/* 
  Ruta: /api/personal
*/

const { Router } = require("express");

const {
  obtenerPersonal,
  crearPersonal,
} = require("../controllers/personal.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerPersonal);

router.post("/", verifyToken, crearPersonal);

module.exports = router;
