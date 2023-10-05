/* 
  Ruta: /api/empresaPlanta
*/

const { Router } = require("express");

const {
  obtenerEmpresasPlantas,
  plantaPorEmpresa,
  crearEmpresaPlanta,
  borrarPlanta,
  editarPlanta,
} = require("../controllers/empresa-planta.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerEmpresasPlantas);
router.get("/:idEmpresa", verifyToken, plantaPorEmpresa);

router.post("/", verifyToken, crearEmpresaPlanta);
router.delete("/delete/:plantaId", verifyToken, borrarPlanta);
router.patch("/edit/:plantaId", verifyToken, editarPlanta);

module.exports = router;
