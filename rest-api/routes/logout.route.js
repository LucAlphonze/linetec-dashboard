const { Router } = require("express");

const { handleDelete } = require("../controllers/auth.controller");
const router = Router();

router.delete("/", handleDelete);

module.exports = router;
