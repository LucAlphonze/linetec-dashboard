/* 
  Ruta: /api/users
*/

const { Router } = require("express");

const {
  obtenerUsers,
  obtenerUserByUserName,
  crearUser,
  updateUser,
  login,
  borrarUsuario,
} = require("../controllers/user.controller");
const { verifyToken } = require("../controllers/auth.controller");

const router = Router();

router.get("/", obtenerUsers);
router.get("/:username", obtenerUserByUserName);

router.post("/", crearUser);
router.post("/login", login);
router.post("/:username", updateUser);
router.delete("/delete/:usuarioId", verifyToken, borrarUsuario);

module.exports = router;
