const { Router } = require("express");

const { handleRefreshTokens } = require("../controllers/auth.controller");
const router = Router();

router.post("/", handleRefreshTokens);

module.exports = router;
