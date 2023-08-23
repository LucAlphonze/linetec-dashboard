/* 
  Ruta: /api/empresaPlanta
*/

const { Router } = require("express");

const {
  obtenerEmpresasPlantas,
  plantaPorEmpresa,
  crearEmpresaPlanta,
} = require("../controllers/empresa-planta.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerEmpresasPlantas);
router.get("/:idEmpresa", verifyToken, plantaPorEmpresa);

router.post("/", verifyToken, crearEmpresaPlanta);

module.exports = router;
