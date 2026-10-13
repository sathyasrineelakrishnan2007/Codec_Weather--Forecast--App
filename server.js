const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/weather", async (req, res) => {
  const city = String(req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({
      message: "Please enter a city name"
    });
  }

  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({
      message: "API key is not configured"
    });
  }

  try {
    const url = new URL(
      "https://api.openweathermap.org/data/2.5/weather"
    );

    url.searchParams.set("q", city);
    url.searchParams.set(
      "appid",
      process.env.OPENWEATHER_API_KEY
    );
    url.searchParams.set("units", "metric");

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status === 404 ? 404 : 502).json({
        message:
          response.status === 404
            ? "City not found"
            : "Weather service error"
      });
    }

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    });
  } catch (error) {
    res.status(502).json({
      message: "Unable to fetch weather data"
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
