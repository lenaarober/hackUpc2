
// backend básico en Node.js para consultar vuelos
import express, { response } from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;
const apiKey = "sh967490139224896692439644109194";

app.use(cors());
app.use(express.json());

app.post("/buscar", (req, res) => {
  const { origen, fecha, destino } = req.body; // Obtener origen, fecha y destino del cuerpo de la solicitud

  // Dividir la fecha en año, mes y día
  const [year, month, day] = fecha.split("-").map(Number);

  const myHeaders = new Headers();
  myHeaders.append("x-api-key", apiKey);
  myHeaders.append("Content-Type", "application/json");

  // Construir el cuerpo de la solicitud dinámicamente
  const raw = JSON.stringify({
      query: {
          market: "UK",
          locale: "en-GB",
          currency: "GBP",
          queryLegs: [
              {
                  originPlaceId: { iata: origen }, // Usar el origen recibido
                  destinationPlaceId: { iata: destino }, // Destination fijo como "SZX"
                  date: {
                      year: year, // Año de la fecha recibida
                      month: month, // Mes de la fecha recibida
                      day: day // Día de la fecha recibida
                  }
              }
          ],
          cabinClass: "CABIN_CLASS_ECONOMY",
          adults: 1
      }
  });

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
      .catch((error) => {
          console.error("Error en create:", error);
          res.status(500).send("Error creando la búsqueda");
      });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});