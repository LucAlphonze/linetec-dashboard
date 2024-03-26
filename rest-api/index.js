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
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false, limit: "20mb" }));

// conexion base de datos

dbConnection();

// rutas
app.use("/api/variables", require("./routes/variable.route"));
app.use("/api/users", require("./routes/users.route"));
app.use("/api/role", require("./routes/role.route"));
app.use("/api/paises", require("./routes/pais.route"));
app.use("/api/provincias", require("./routes/provincia.route"));
app.use("/api/localidad", require("./routes/localidad.route"));
app.use("/api/empresas", require("./routes/empresa.route"));
app.use("/api/empresa-planta", require("./routes/empresa-planta.route"));
app.use("/api/tipo-maquina", require("./routes/tipo-maquina.route"));
app.use("/api/maquinas", require("./routes/maquina.route"));
app.use("/api/proceso", require("./routes/proceso.route"));
app.use("/api/linea-produccion", require("./routes/linea-produccion.route"));
app.use("/api/registro-general", require("./routes/registroGeneral.route"));
app.use(
  "/api/registro-general-ts",
  require("./routes/registroGeneralTS.route")
);
app.use("/api/personal", require("./routes/personal.route"));
app.use("/api/trigger", require("./routes/trigger.route"));
app.use("/api/logout", require("./routes/logout.route"));
app.use("/api/refresh", require("./routes/refreshToken.route"));
app.use(
  "/api/administracion-monitoreo",
  require("./routes/administracionMonitoreo.route")
);
app.use(
  "/api/alertas-personalizadas",
  require("./routes/alertaPersonalizada.route")
);
app.use(
  "/api/alertas-personalizadas-var",
  require("./routes/alertaPersonalizadaVar.route")
);
app.use(express.static(path.join(__dirname, "public")));
module.exports = app;
