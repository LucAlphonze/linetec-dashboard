require("dotenv").config({ path: "./.env" });
const mqtt = require("mqtt");
const axios = require("axios");

var token;
var rtoken;
var decoded;
var usuario = {
  username: "Admin",
  password: "Admin123$",
};
function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

const servClient = mqtt.connect(`mqtt://mosquitto:1883`, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
});
servClient.on("connect", function () {
  servClient.subscribe("rgeneral", async function (err) {
    console.log("servClient conectado");
    if (err) {
      throw new Error(`Subscribe to MQTT Broker failed: ${err.message}`);
    }
    await axios
      .post("http://rest-api:3001/api/users/login", usuario)
      .then((response) => {
        token = response.data.token;
        rtoken = response.data.rtoken;
        console.log("logeo exitoso: ", token, "refresh token: ", rtoken);

        decoded = parseJwt(token);
        console.log("token decoded", decoded.exp);
      });
  });
});

servClient.on("message", function (topic, message) {
  axios
    .get("http://rest-api:3001/api/variables", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(async (response) => {
      console.log(response.status);
      var listVariables = response.data;
      var messageJSON = JSON.parse(message.toString());
      /*
          armar algo primero: usar el nombre de la variable para hacer un get
          y sacar el ultimo registro con ese id, luego realizar todas las operaciones
          correspondientes para decidir si se guarda o no

          si el tipo de trigger es cambio de valor, guardar el ultimo valor que llega en
          trigger valor y comparar el nuevo valor con ese, si el valor es diferente se actualiza
          trigger valor y se procede a hacer el insert.

          si el tipo de trigger es tiempo chequea si el ultimo valor es al menos ese x_tiempo
          mas viejo que el nuevo valor que acaba de llegar (compara el timestamp nuevo con 
          el timestamp en la db + x_tiempo)
            */
      for (let i = 0; i < messageJSON.length; i++) {
        for (let j = 0; j < listVariables.length; j++) {
          if (messageJSON[i].n != listVariables[j].nombre) {
            console.log(
              messageJSON[i].n,
              "mensaje posisicion: ",
              i,
              listVariables[j].nombre,
              "list variable posicion: ",
              j
            );
          } else if (messageJSON[i].n == listVariables[j].nombre) {
            var ts = "";
            let timeNow = new Date();
            if (messageJSON[i].ts) {
              ts = dateSlicer(messageJSON[i]?.ts);
            }
            var pruebaJson = {
              id_variable: listVariables[j]?._id,
              valor_lectura: messageJSON[i].v,
              modo: messageJSON[i]?.m,
              time_stamp: ts,
              fecha_lectura: new Date(),
            };
            if (timeNow.getTime() > decoded.exp * 1000 - 12000) {
              console.log("refrescando el token...");
              await axios
                .post("http://rest-api:3001/api/refresh", { token: rtoken })
                .then((response) => {
                  token = response.data.accessToken;
                  rtoken = response.data.refreshToken;
                  decoded = parseJwt(token);

                  console.log(
                    "token refrescado exitosamente: ",
                    token,
                    "refresh token: ",
                    rtoken
                  );
                });
            }
            await axios
              .post(`http://rest-api:3001/api/registro-general`, pruebaJson, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "content-type": "application/json",
                },
              })
              .then((res) => {
                console.log(`statusCode: ${res.status}`);
                console.log(res.data);
              })
              .catch((error) => {
                /*
                hay que revisar esta parte y ver que pasa cuando mandamos un mensaje y justo el token se expira
                actualmente el token tiene 10m de duracion
                  */
                console.log("error post: ", error.response.data);
              });
          }
          if (j == listVariables.length) {
            j = 0;
          }
        }
      }
    })
    .catch(async (error) => {
      if (error.response) {
        console.log("error data: ", error.response.data);
        console.log(error.response.status);
        if (error.response.status == 403) {
          console.log("refrescando el token...");
          await axios
            .post("http://rest-api:3001/api/refresh", { token: rtoken })
            .then((response) => {
              token = response.data.accessToken;
              rtoken = response.data.refreshToken;
              decoded = parseJwt(token);
              console.log(
                "token refrescado exitosamente: ",
                token,
                "refresh token: ",
                rtoken
              );
            });
          await axios
            .get("http://rest-api:3001/api/variables", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(async (response) => {
              console.log(response.status);
              var listVariables = response.data;
              var messageJSON = JSON.parse(message.toString());
              for (let i = 0; i < messageJSON.length; i++) {
                for (let j = 0; j < listVariables.length; j++) {
                  if (messageJSON[i].n != listVariables[j].nombre) {
                    console.log(
                      messageJSON[i].n,
                      "mensaje posisicion: ",
                      i,
                      listVariables[j].nombre,
                      "list variable posicion: ",
                      j
                    );
                  } else if (messageJSON[i].n == listVariables[j].nombre) {
                    var ts = "";
                    if (messageJSON[i].ts) {
                      ts = dateSlicer(messageJSON[i]?.ts);
                    }
                    var pruebaJson = {
                      id_variable: listVariables[j]?._id,
                      valor_lectura: messageJSON[i].v,
                      modo: messageJSON[i]?.m,
                      time_stamp: ts,
                      fecha_lectura: new Date(),
                    };
                    await axios
                      .post(
                        `http://rest-api:3001/api/registro-general`,
                        pruebaJson,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "content-type": "application/json",
                          },
                        }
                      )
                      .then((res) => {
                        console.log(`statusCode: ${res.status}`);
                        console.log(res.data);
                      })
                      .catch((error) => {
                        console.log("error post: ", error.response.data);
                      });
                  }
                  if (j == listVariables.length) {
                    j = 0;
                  }
                }
              }
            });
          return console.log(error);
        }
        return console.log(error);
      } else if (error.request) {
        console.log("Error request: ", error.request);
        return console.log(error);
      } else {
        console.log("else error: ", error.message);
        return "error del servidor";
      }
    });

  console.log("string message: ", message.toString());
});

servClient.on("error", function (error) {
  console.log(error);
  throw new Error(error.message);
});

function dateSlicer(text) {
  var formatedDate =
    text.slice(0, 4) +
    "-" +
    text.slice(4, 6) +
    "-" +
    text.slice(6, 8) +
    ":" +
    text.slice(9, 11) +
    ":" +
    text.slice(11, 13) +
    ":" +
    text.slice(13, 15);
  return formatedDate;
}
