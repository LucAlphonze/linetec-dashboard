/* 
  Ruta: /api/empresaPlanta
*/

const { Router } = require("express");

const {
  obtenerEmpresasPlantas,
  plantaPorEmpresa,
  crearEmpresaPlanta,
} = require("../controllers/empresa-planta.controller");

const router = Router();

router.get("/", obtenerEmpresasPlantas);
router.get("/:idEmpresa", plantaPorEmpresa);

router.post("/", crearEmpresaPlanta);

module.exports = router;
