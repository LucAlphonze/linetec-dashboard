/* 
  Ruta: /api/registroGeneral
*/

const { Router } = require("express");

// const { check } = require("express-validator");
// const { validarCampos } = require("../middlewares/validar-campos");

const {
  obtenerTodos,
  obtenerRegistrosGeneral,
  crearRegistroGeneral,
  getTodos,
  filtrarRegistrosGenerales,
  crearRegistroGeneralArray,
  filtrarRegistrosGenerales2,
  getAllInRange,
} = require("../controllers/registroGeneral.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();
router.get("/all/:variable", obtenerTodos);
router.get("/all/:idVariable/:startdate/:enddate/", getAllInRange);
router.get("/", verifyToken, getTodos);
router.get(
  "/filter/:idVariable/:startdate/:enddate/:operacion",
  filtrarRegistrosGenerales
);
router.get(
  "/granularidad/:startdate/:enddate/:granularidad",
  filtrarRegistrosGenerales2
);
router.get("/:idVariable", obtenerRegistrosGeneral);
router.post("/", verifyToken, crearRegistroGeneral);
router.post("/array", verifyToken, crearRegistroGeneralArray);

module.exports = router;
