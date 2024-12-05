require("dotenv").config({ path: "./.env" });
const mqtt = require("mqtt");
const axios = require("axios");
// Importa el módulo 'fs' para escribir el resultado en un archivo
const fs = require("fs");

var token;
var rtoken;
var decoded;
var listVariables;
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
        console.log("logeo exitoso: "); //, token, "refresh token: ", rtoken);

        decoded = parseJwt(token);
        //console.log("token decoded", decoded.exp);
      });
    await axios
      .get("http://rest-api:3001/api/variables", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        //console.log(response.status);
        listVariables = response.data;
      });
  });
});

servClient.on("message", async function (topic, message) {
  try {
    var lVariables = listVariables;
    var messageJSON = JSON.parse(message.toString());
    var fechaActual = new Date();
    var messageJSONRestApi = [];
    const api_url = "http://rest-api:3001/api/registro-general-ts/";
    for (let i = 0; i < messageJSON.length; i++) {
      if (!verificarFormatoJSON(messageJSON[i])) {
        console.log("ERROR: Formato JSON INCORRECTO");
        console.log(
          "Hora: ",
          fechaActual.toLocaleTimeString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
          }),
          " Mensaje: ",
          JSON.stringify(messageJSON[i], null, 2)
        );
        continue;
      }

      if (!esFechaHoraValida(messageJSON[i].fl)) {
        console.log("ERROR: Fomato fecha:hora INCORRECTO");
        continue;
      }

      //messageJSON.fl = dateSlicer(messageJSON.fl);
      messageJSONRestApi.push(messageJSON[i]);
      console.log(messageJSONRestApi);

      if (i === messageJSON.length - 1) {
        await axios
          .post(api_url, messageJSONRestApi, {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          })
          .then((res) => {
            console.log(`statusCode: ${res.status}`);
            console.log(res.data);
          })
          .catch(async (error) => {
            if (error.response) {
              console.log("error data: ", error.response.data);
              //console.log(error.response.status);
              if (error.response.status == 403) {
                console.log("refrescando token...");
                await axios
                  .post("http://rest-api:3001/api/refresh", { token: rtoken })
                  .then((response) => {
                    token = response.data.accessToken;
                    rtoken = response.data.refreshToken;
                    decoded = parseJwt(token);
                    console.log(
                      "token refrescado exitosamente: ",
                      token,
                      "refresh Token:",
                      rtoken
                    );
                  });
                await axios
                  .post(api_url, messageJSONRestApi, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "content-type": "application/json",
                    },
                  })
                  .then((res) => {
                    //console.log(`statusCode: ${res.status}`);
                    console.log(res.data);
                  })
                  .catch((error) => {
                    console.log("error post: ", error.response.data);
                  });
              }
            }
            return console.log("error post: ", error.response.data);
          });
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(
        "error data: ",
        error.response.data,
        "status code: ",
        error.response.status
      );
      return console.log(error);
    } else if (error.request) {
      console.log("Error request: ", error.request);
      return console.log(error);
    } else {
      console.log("else error: ", error);
      return console.log("error del servidor: ", error);
    }
  }

  return console.log("string message: ", message.toString());
});

servClient.on("error", function (error) {
  console.log(error);
  throw new Error(error.message);
});

function esFechaHoraValida(cadena) {
  // Extraer las partes de la cadena: año, mes, día, hora, minuto y segundo
  var año = parseInt(cadena.substr(0, 4));
  var mes = parseInt(cadena.substr(4, 2));
  var dia = parseInt(cadena.substr(6, 2));
  var hora = parseInt(cadena.substr(9, 2));
  var minuto = parseInt(cadena.substr(11, 2));
  var segundo = parseInt(cadena.substr(13, 2));

  // Verificar si las partes son números válidos
  if (
    isNaN(año) ||
    isNaN(mes) ||
    isNaN(dia) ||
    isNaN(hora) ||
    isNaN(minuto) ||
    isNaN(segundo)
  ) {
    return false;
  }

  // Crear un objeto Date con las partes
  var fecha = new Date(año, mes - 1, dia, hora, minuto, segundo);

  console.log(fecha);

  if (isNaN(fecha.getTime())) {
    return false;
  }

  if (
    fecha.getFullYear() === año &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia &&
    fecha.getHours() === hora &&
    fecha.getMinutes() === minuto &&
    fecha.getSeconds() === segundo
  ) {
    return true;
  }
  return false;
}

function verificarFormatoJSON(objeto) {
  try {
    // Verificar si el objeto tiene la propiedad "fl" y "metaData"
    if (!objeto.hasOwnProperty("fl") || !objeto.hasOwnProperty("metaData")) {
      return false;
    }

    // Verificar si "fl" es una cadena y "metaData" es un array
    if (typeof objeto.fl !== "string" || !Array.isArray(objeto.metaData)) {
      return false;
    }

    // Verificar la longitud del valor de la propiedad "fl"
    if (objeto.fl.length !== "20240313:152403".length) {
      return false; // La longitud del valor de "fl" debe ser de 15 caracteres
    }

    // Verificar el formato de cada objeto dentro de "metaData"
    for (var i = 0; i < objeto.metaData.length; i++) {
      var item = objeto.metaData[i];
      // Verificar si cada objeto tiene las propiedades "v" y "n" y si sus valores son del tipo esperado
      if (
        !item.hasOwnProperty("v") ||
        !item.hasOwnProperty("n") ||
        typeof item.v !== "number" ||
        typeof item.n !== "string"
      ) {
        return false;
      }
    }
    // Si se pasan todas las verificaciones, el objeto tiene el formato esperado
    return true;
  } catch (error) {
    console.error("La variable no contiene una cadena JSON válida.");
  }
  return false;
}

function generateDateList(startDate, endDate) {
  const dateList = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const formattedDate = formatDate(currentDate.toISOString());
    const regGeneral = {
      fl: formattedDate,
      metaData: [
        {
          v: generateRandomNumber(),
          n: "Corrente motore aspo",
        },
        {
          v: generateRandomNumber(),
          n: "Corrente motore degasatore",
        },
        {
          v: generateRandomNumber(),
          n: "Velocita motore degasatore",
        },
        {
          v: generateRandomNumber(),
          n: "Potenza motore degasatore",
        },
        {
          v: generateRandomNumber(),
          n: "Codice materiale",
        },
        {
          v: generateRandomNumber(),
          n: "Potenzamotore estrusore",
        },
      ],
    };
    dateList.push(regGeneral);
    currentDate.setMinutes(currentDate.getMinutes() + 1);
  }

  return dateList;
}

// Define las fechas de inicio y fin
const startDate = new Date("2024-08-03T00:00:00Z"); // Fecha de inicio
const endDate = new Date("2024-08-07T23:59:59Z"); // Fecha de fin

// Genera la lista de fechas incrementando por segundo
const dateList = generateDateList(startDate, endDate);

// Convierte la lista a formato JSON
const jsonResult = JSON.stringify(dateList, null, 2);

// Escribe el resultado en un archivo llamado 'dates.json'
fs.writeFileSync("dates.json", jsonResult);

console.log("Lista de fechas generada y guardada en dates.json");

function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}:${hours}${minutes}${seconds}`;
}

function generateRandomNumber() {
  // Genera un número aleatorio entre 1 y 100 (ambos inclusive)
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  return randomNumber;
}
