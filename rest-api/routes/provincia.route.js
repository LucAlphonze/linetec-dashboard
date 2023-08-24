/* 
  Ruta: /api/provincias
*/

const { Router } = require("express");

const {
  obtenerProvincias,
  provinciasPorPais,
  crearProvincia,
  borrarProvincia,
} = require("../controllers/provincia.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerProvincias);
router.get("/:idPais", verifyToken, provinciasPorPais);
router.post("/", verifyToken, crearProvincia);
router.delete("/delete/:provinciaId", verifyToken, borrarProvincia);

module.exports = router;
