/* 
  Ruta: /api/empresas
*/

const { Router } = require("express");
const {
  obtenerEmpresas,
  obtenerEmpresa,
  empresaPorLocalidad,
  crearEmpresa,
  borrarEmpresa,
  editarEmpresa,
} = require("../controllers/empresa.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerEmpresas);
router.get("/:idRubroEmpresa", verifyToken, obtenerEmpresa);
router.get("/localidad/:idLocalidad", verifyToken, empresaPorLocalidad);

router.post("/", verifyToken, crearEmpresa);
router.delete("/delete/:empresaId", verifyToken, borrarEmpresa);
router.patch("/edit/:empresaId", verifyToken, editarEmpresa);

module.exports = router;
