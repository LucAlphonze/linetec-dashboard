/* 
  Ruta: /api/registro-general-ts
*/
const { Router } = require("express");

const {
  getAllRegistrosTS,
  postRegistroTS,
  getAllInRange,
  getRegistrosFiltrados,
} = require("../controllers/registroGeneralTS.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();
router.get("/", verifyToken, getAllRegistrosTS);
router.get("/all/:idVariable/:startdate/:enddate/", verifyToken, getAllInRange);
router.get(
  "/granularidad/:startdate/:enddate/:granularidad",
  verifyToken,
  getRegistrosFiltrados
);
router.post("/", verifyToken, postRegistroTS);

module.exports = router;
