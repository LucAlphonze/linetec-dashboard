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
        console.log("logeo exitoso: ", token, "refresh token: ", rtoken);

        decoded = parseJwt(token);
        console.log("token decoded", decoded.exp);
      });
    await axios
      .get("http://rest-api:3001/api/variables", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        console.log(response.status);
        listVariables = response.data;
      });
  });
});

servClient.on("message", async function (topic, message) {
  try {
    var lVariables = listVariables;
    var messageJSON = JSON.parse(message.toString());

    console.log("mensaje: ", messageJSON, "lista variables: ", lVariables);

    const variableMapObject = lVariables.reduce(
      (map, { nombre, _id, id_trigger, trigger_valor }) => {
        let variable = map.get(nombre) || [];
        variable.push({ nombre, _id, id_trigger, trigger_valor });
        return map.set(nombre, variable[0]);
      },
      new Map()
    );

    const array = messageJSON.map(({ fl, ts, metaData }) => ({
      fecha_lectura: dateSlicer(fl),
      metaData: metaData.map(({ n, v }) => ({
        datos: v,
        id_variable: variableMapObject.get(n),
      })),
      time_stamp: new Date(),
    }));
    const vList = messageJSON[0].metaData.map(({ n }) =>
      variableMapObject.get(n)
    );

    console.log("documento formateado: ", array[0], "variables: ", vList);
    await axios
      .post(
        `http://rest-api:3001/api/registro-general-ts`,
        { datos: array[0], vList: vList },
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
          console.log(error.response.status);
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
              .post(
                `http://rest-api:3001/api/registro-general-ts`,
                { datos: array[0], vList: vList },
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
