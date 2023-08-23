/* 
  Ruta: /api/paises
*/

const { Router } = require("express");

const { obtenerPaises, crearPais } = require("../controllers/pais.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerPaises);

router.post("/", verifyToken, crearPais);

module.exports = router;
