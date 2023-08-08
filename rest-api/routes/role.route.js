/* 
  Ruta: /api/users
*/

const { Router } = require("express");

const { obtenerRoles, crearRol } = require("../controllers/role.controller");

const router = Router();

router.get("/", obtenerRoles);
router.post("/", crearRol);

module.exports = router;
