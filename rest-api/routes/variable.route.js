/* 
  Ruta: /api/variables
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  obtenerVariables,
  crearVariable,
  obtenerVariableById,
  borrarVariable,
  editarVariable,
} = require("../controllers/variable.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", verifyToken, obtenerVariables);
router.get("/:id", obtenerVariableById);

router.post("/", verifyToken, crearVariable);
router.delete("/delete/:variableId", verifyToken, borrarVariable);
router.patch("/edit/:variableId", verifyToken, editarVariable);

module.exports = router;
