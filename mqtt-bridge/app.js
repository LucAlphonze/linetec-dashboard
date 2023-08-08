require("dotenv").config({ path: "./.env" });
const mqtt = require("mqtt");
const axios = require("axios");
const servClient = mqtt.connect(`mqtt://mosquitto:1883`, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
});
servClient.on("connect", function () {
  servClient.subscribe("rgeneral", function (err) {
    console.log("servClient conectado");
    if (err) {
      throw new Error(`Subscribe to MQTT Broker failed: ${err.message}`);
    }
  });
});

servClient.on("message", function (topic, message) {
  axios.get("http://rest-api:3001/api/variables").then((response) => {
    var listVariables = response.data;
    var messageJSON = JSON.parse(message.toString());

    console.log("list Variables: ", listVariables);
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
          var pruebaJson = {
            id_variable: listVariables[j]?._id,
            valor_lectura: messageJSON[i].v,
            fecha_lectura: new Date(),
          };
          axios
            .post(`http://rest-api:3001/api/registro-general`, pruebaJson)
            .then((res) => {
              console.log(`statusCode: ${res.status}`);
              console.log(res.data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (j == listVariables.length) {
          j = 0;
        }
      }
      // if (messageJSON[i].n == listVariables[i].nombre) {
      //   console.log("json: ", messageJSON[i], "en la posicion: ", i);

      // } else {
      //   console.log("Error en la posicion", i, "json: ", messageJSON[i]);
      // }
    }
  });

  console.log("string message: ", message.toString());
});

servClient.on("error", function (error) {
  console.log(error);
  throw new Error(error.message);
});
