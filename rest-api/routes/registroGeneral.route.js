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

const router = Router();
router.get("/:variable", obtenerTodos);
router.get("/", getTodos);
// router.get("/algo", renderRegistros);
router.get("/:idVariable", obtenerRegistrosGenerales);
router.post(
  "/",
  [
    // check("id_variable", "La variable es obligatorio").not().isEmpty(),
    check("fecha_lectura", "La fecha de lectura es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearRegistroGeneral
);

module.exports = router;
