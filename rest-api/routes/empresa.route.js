/* 
  Ruta: /api/empresas
*/

const { Router } = require("express");
const {
  obtenerEmpresas,
  obtenerEmpresa,
  empresaPorLocalidad,
  crearEmpresa,
} = require("../controllers/empresa.controller");

const router = Router();

router.get("/", obtenerEmpresas);
router.get("/:idRubroEmpresa", obtenerEmpresa);
router.get("/localidad/:idLocalidad", empresaPorLocalidad);

router.post("/", crearEmpresa);

module.exports = router;
