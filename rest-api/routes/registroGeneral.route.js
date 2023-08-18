/* 
  Ruta: /api/registroGeneral
*/

const { Router } = require("express");

const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  obtenerTodos,
  obtenerRegistrosGenerales,
  crearRegistroGeneral,
  getTodos,
} = require("../controllers/registroGeneral.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();
router.get("/all/:variable", obtenerTodos);
router.get("/", verifyToken, getTodos);
// router.get("/algo", renderRegistros);
router.get("/:idVariable", obtenerRegistrosGenerales);
router.post("/", verifyToken, crearRegistroGeneral);

module.exports = router;
