/* 
  Ruta: /api/paises
*/

const { Router } = require("express");

const { obtenerPaises, crearPais } = require("../controllers/pais.controller");

const router = Router();

router.get("/", obtenerPaises);

router.post("/", crearPais);

module.exports = router;
