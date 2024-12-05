/* 
  Ruta: /api/variables
*/

const { Router } = require("express");

const {
  obtenerVariables,
  crearVariable,
  obtenerVariableById,
  borrarVariable,
  editarVariable,
  obtenerVariableByNombre,
} = require("../controllers/variable.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerVariables);
router.get("/:id", obtenerVariableById);
router.get("/nombre/:nombre", obtenerVariableByNombre);

router.post("/", verifyToken, crearVariable);
router.delete("/delete/:variableId", verifyToken, borrarVariable);
router.patch("/edit/:variableId", verifyToken, editarVariable);

module.exports = router;
