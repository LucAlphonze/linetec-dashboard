/* 
  Ruta: /api/paises
*/

const { Router } = require("express");

const {
  obtenerPaises,
  crearPais,
  borrarPais,
  editarPais,
} = require("../controllers/pais.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerPaises);

router.post("/", verifyToken, crearPais);
router.delete("/delete/:paisId", verifyToken, borrarPais);
router.patch("/edit/:paisId", verifyToken, editarPais);

module.exports = router;
