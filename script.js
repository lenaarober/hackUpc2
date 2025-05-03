// backend básico en Node.js para consultar vuelos
import express, { response } from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;
const apiKey = "sh967490139224896692439644109194";

app.use(cors());
app.use(express.json());

// create para el post
app.post("/buscar", (req, res) => {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "sh967490139224896692439644109194");
    myHeaders.append("Content-Type", "text/plain");
    
    const raw = "{\n  \"query\": {\n    \"market\": \"UK\",\n    \"locale\": \"en-GB\",\n    \"currency\": \"GBP\",\n    \"queryLegs\": [\n      {\n        \"originPlaceId\": {\"iata\": \"BCN\"},\n        \"destinationPlaceId\": {\"iata\": \"SZX\"},\n        \"date\": {\n          \"year\": 2025,\n          \"month\": 10,\n          \"day\": 30\n        }\n      }\n    ],\n    \"cabinClass\": \"CABIN_CLASS_ECONOMY\",\n    \"adults\": 1\n  }\n}";
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch("https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Token de sesión:", result.sessionToken);        
        res.json(result);
          })
        .catch(error => {
            console.error("Error en create:", error);
            res.status(500).send("Error creando la búsqueda");
        });
});

//llega hasta aqui
app.post("/poll/:token", (req, res) => {
    const sessionToken = req.params.token;

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
    };

    const pollUrl = `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/${sessionToken}`;

    fetch(pollUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            res.json(result);
            console.log("test")
        })
        .catch(error => {
            console.error("Error en poll:", error);
            res.status(500).send("Error al consultar resultados");
        });
});



//
// app.get("/prueba", (req, res) => {
//     const myHeaders = new Headers();
// myHeaders.append("x-api-key", "sh967490139224896692439644109194");

// const requestOptions = {
//   method: "GET",
//   headers: myHeaders,
//   redirect: "follow"
// };

// fetch("https://partners.api.skyscanner.net/apiservices/v3/culture/currencies", requestOptions)
//   .then((response) => response.text())
//   .then((result) => {
//     console.log("test")
//     res.send(result)
// })
//   .catch((error) => console.error(error));
// });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});