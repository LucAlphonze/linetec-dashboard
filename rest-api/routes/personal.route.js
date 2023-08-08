/* 
  Ruta: /api/personal
*/

const { Router } = require("express");

const {
  obtenerPersonal,
  crearPersonal,
} = require("../controllers/personal.controller");

const router = Router();

router.get("/", obtenerPersonal);

router.post("/", crearPersonal);

module.exports = router;
