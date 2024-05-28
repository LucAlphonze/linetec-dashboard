require("dotenv").config({ path: "./.env" });
const mqtt = require("mqtt");
const axios = require("axios");

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
        console.log("logeo exitoso: ");//, token, "refresh token: ", rtoken);

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
    var messageJSONRestApi;
    const api_url = "http://rest-api:3001/api/registro-general-ts/";

    if( !verificarFormatoJSON(messageJSON)){
      console.log("ERROR: Formato JSON INCORRECTO");
      console.log("Hora: ", fechaActual.toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
      " Mensaje: ", JSON.stringify(messageJSON, null, 2));
      return;
    }

    if( !esFechaHoraValida(messageJSON.fl) ){
      console.log("ERROR: Fomato fecha:hora INCORRECTO");
      return;
    }  

    //messageJSON.fl = dateSlicer(messageJSON.fl);
    messageJSONRestApi = messageJSON;
    console.log(messageJSONRestApi)  

    await axios
      .post( api_url, messageJSONRestApi,  
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
              .post(api_url, messageJSONRestApi,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                  },
                }
              )
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
  if (isNaN(año) || isNaN(mes) || isNaN(dia) || isNaN(hora) || isNaN(minuto) || isNaN(segundo)) {
    return false;
  }

  // Crear un objeto Date con las partes
  var fecha = new Date(año, mes - 1, dia, hora, minuto, segundo);

  console.log(fecha)

  if(isNaN(fecha.getTime())){
    return false;
  }

  if( fecha.getFullYear() === año &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia &&
    fecha.getHours() === hora &&
    fecha.getMinutes() === minuto &&
    fecha.getSeconds() === segundo ){
      return(true);
    }
  return false;
}

function verificarFormatoJSON(objeto) {
  try {
    // Verificar si el objeto tiene la propiedad "fl" y "metaData"
    if (!objeto.hasOwnProperty('fl') || !objeto.hasOwnProperty('metaData')) {
      return false;
    }

    // Verificar si "fl" es una cadena y "metaData" es un array
    if (typeof objeto.fl !== 'string' || !Array.isArray(objeto.metaData)) {
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
      if (!item.hasOwnProperty('v') || !item.hasOwnProperty('n') || typeof item.v !== 'number' || typeof item.n !== 'string') {
        return false;
      }
    }
    // Si se pasan todas las verificaciones, el objeto tiene el formato esperado
    return true;
  } catch (error) {
    console.error('La variable no contiene una cadena JSON válida.');
  }
  return false
}


// [
//   {
//     fl: "20210315:171858",
//     metaData: [
//       {
//         v: 0.6296,
//         n: "TagliTagliaf",
//       },
//       {
//         v: 1.6412,
//         n: "Pressioneestrusione",
//       },
//       {
//         v: 0.6296,
//         n: "Temperaturaestrusione",
//       },
//       {
//         v: 0.6296,
//         n: "Vuoto",
//       },
//       {
//         v: 0.6412,
//         n: "Correntemotoreestrusore",
//       },
//       {
//         v: 0.6412,
//         n: "Velocitamotoreestrusore",
//       },
//       {
//         v: 0.6412,
//         n: "Potenzamotoreestrusore",
//       },
//     ],
//     ts: "20210315:171858",
//   },
// ];

// [
//   {
//     _id: '657a051796126234e81623cb',
//     nombre: 'TagliTagliaf',
//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-01T03:00:00.000Z'
//   },
//   {
//     _id: '6544fde05c4420c935a5aa65',
//     nombre: 'Pressioneestrusione',
//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-02T03:00:00.000Z'
//   },
//   {
//     _id: '6544fdff5c4420c935a5aa6f',
//     nombre: 'Temperaturaestrusione',
//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-03T03:00:00.000Z'
//   },
//   {
//     _id: '6544fe155c4420c935a5aa79',
//     nombre: 'Vuoto',
//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-04T03:00:00.000Z'
//   },
//   {
//     _id: '6544fe375c4420c935a5aa83',
//     nombre: 'Correntemotoreestrusore',
//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-05T03:00:00.000Z'
//   },
//   {
//     _id: '6544fe505c4420c935a5aa8d',
//     nombre: 'Velocitamotoreestrusore',

//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-06T03:00:00.000Z'
//   },
//   {
//     _id: '6544fe6b5c4420c935a5aa97',
//     nombre: 'Potenzamotoreestrusore',

//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-07T03:00:00.000Z'
//   },
//   {
//     _id: '6544fe805c4420c935a5aaa1',
//     nombre: 'Correntemotoreaspo',

//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-08T03:00:00.000Z'
//   },
//   {
//     _id: '6544fe9d5c4420c935a5aaab',
//     nombre: 'Correntemotoredegasatore',

//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-09T03:00:00.000Z'
//   },
//   {
//     _id: '6544feb15c4420c935a5aab5',
//     nombre: 'Velocitamotoredegasatore',

//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-10T03:00:00.000Z'
//   },
//   {
//     _id: '6544fece5c4420c935a5aabf',
//     nombre: 'Potenzamotoredegasatore',

//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-11T03:00:00.000Z'
//   },
//   {
//     _id: '6544fee85c4420c935a5aac9',
//     nombre: 'Codicemateriale',

//     trigger_valor: '',
//     __v: 0,
//     time_stamp: '2023-12-12T03:00:00.000Z'
//   }
// ]

// [{
//   "fl": "20240326:101137",
//   "metaData": [
//     {
//       "v": 16,
//       "n": "TagliTagliaf"
//     },
//     {
//       "v": 23,
//       "n": "Pressioneestrusione"
//     },
//     {
//       "v": 19,
//       "n": "Temperaturaestrusione"
//     },
//     {
//       "v": 30,
//       "n": "Vuoto"
//     },
//     {
//       "v": 27,
//       "n":"Correntemotoreestrusore"
//     },
//     {
//       "v": 18,
//       "n": "Velocitamotoreestrusore"
//     },
//     {
//       "v": 22,
//       "n": "Potenzamotoreestrusore"
//     },
//     {
//       "v": 24,
//       "n": "Correntemotoreaspo"
//     },
//     {
//       "v": 27,
//       "n": "Correntemotoredegasatore"
//     },
//     {
//       "v": 10,
//       "n": "Velocitamotoredegasatore"
//     },
//     {
//       "v": 15,
//       "n":"Potenzamotoredegasatore"
//     },
//     {
//       "v": 13,
//       "n": "Codicemateriale"
//     }
//   ],
//   "ts": "20240326:101137"
// }]
