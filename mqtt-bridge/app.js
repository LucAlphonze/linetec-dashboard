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
  var messageJSON = JSON.parse(message.toString());

  for (let i = 0; i < messageJSON.length; i++) {
    console.log("json: ", messageJSON[i], "en la posicion: ", i);
    var pruebaJson = {
      id_variable: messageJSON[i]?.id
        ? messageJSON[i].id
        : "64be9904e707de188fdd5349",
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
  console.log("string message: ", message.toString());
});

servClient.on("error", function (error) {
  console.log(error);
  throw new Error(error.message);
});
