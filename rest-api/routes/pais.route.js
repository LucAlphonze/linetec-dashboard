/* 
  Ruta: /api/paises
*/

const { Router } = require("express");

const {
  obtenerPaises,
  crearPais,
  borrarPais,
} = require("../controllers/pais.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerPaises);

router.post("/", verifyToken, crearPais);
router.delete("/delete/:paisId", verifyToken, borrarPais);

module.exports = router;
