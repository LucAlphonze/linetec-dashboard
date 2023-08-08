/* 
  Ruta: /api/provincias
*/

const { Router } = require("express");

const {
  obtenerProvincias,
  provinciasPorPais,
  crearProvincia,
} = require("../controllers/provincia.controller");

const router = Router();

router.get("/", obtenerProvincias);
router.get("/:idPais", provinciasPorPais);
router.post("/", crearProvincia);

module.exports = router;
