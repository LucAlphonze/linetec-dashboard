const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

let refreshTokens = [];

function genTokens(User) {
  // token expiracion 12h- refreshtoken expiracion 13h
  var token = jwt.sign(User, process.env.SECRET, { expiresIn: "12h" });
  var rToken = jwt.sign(User, process.env.RTSECRET, { expiresIn: "13m" });
  refreshTokens.push(rToken);
  return { accessToken: token, refreshToken: rToken };
}

function verifyToken(req, res, next) {
  // console.log("verify token handler: ", req.body);
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
  const User = {
    name: req.body.user,
  };
  if (rtoken == null) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(rtoken)) {
    return res.sendStatus(403);
  }

  jwt.verify(rtoken, process.env.RTSECRET, (err) => {
    if (err) {
      return res.sendStatus(403);
    }
  });
  const accessToken = jwt.sign(User, process.env.SECRET, { expiresIn: "12h" });
  const refreshToken = jwt.sign(User, process.env.RTSECRET, {
    expiresIn: "13h",
  });
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
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
