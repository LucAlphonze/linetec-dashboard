const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

let refreshTokens = [];

function genTokens(User) {
  // token expiracion 12h- refreshtoken expiracion 13h
  var token = jwt.sign(User, process.env.SECRET, { expiresIn: "10m" });
  var rToken = jwt.sign(User, process.env.RTSECRET, { expiresIn: "10m" });
  refreshTokens.push(rToken);
  return { accessToken: token, refreshToken: rToken };
}

function verifyToken(req, res, next) {
  console.log("verify token handler: ", req.body, req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

const handleRefreshTokens = (req, res) => {
  const rtoken = req.body.token;

  if (rtoken == null) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(rtoken)) {
    return res.sendStatus(403);
  }

  jwt.verify(rtoken, process.env.RTSECRET, (err, User) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(User, process.env.SECRET);
    res.json({ accessToken: accessToken });
  });
};

const handleDelete = (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
};

module.exports = {
  genTokens,
  verifyToken,
  handleRefreshTokens,
  handleDelete,
};
