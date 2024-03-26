/* 
  Ruta: /api/registro-general-ts
*/
const { Router } = require("express");

const {
  getAllRegistrosTS,
  postRegistroTS,
} = require("../controllers/registroGeneralTS.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();
router.get("/", verifyToken, getAllRegistrosTS);
router.post("/", verifyToken, postRegistroTS);

module.exports = router;
