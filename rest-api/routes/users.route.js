/* 
  Ruta: /api/users
*/

const { Router } = require("express");

const {
  obtenerUsers,
  obtenerUserByUserName,
  crearUser,
  updateUser,
} = require("../controllers/user.controller");

const router = Router();

router.get("/", obtenerUsers);
router.get("/:username", obtenerUserByUserName);

router.post("/", crearUser);
router.post("/:username", updateUser);

module.exports = router;
