require("dotenv").config();
var logger = require("morgan");
const path = require("path");
const { create } = require("express-handlebars");
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");

// servidor de express
const app = express();

app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  create({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main",
    extname: ".hbs",
  }).engine
);
app.set("view engine", ".hbs");

// middleware
app.use(logger("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// conexion base de datos

dbConnection();

// rutas
app.use("/api/variables", require("./routes/variable.route"));
app.use("/api/registro-general", require("./routes/registroGeneral.route"));
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
