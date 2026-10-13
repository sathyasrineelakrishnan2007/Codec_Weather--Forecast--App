import { useState } from "react";
import "./styles.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getWeather(e) {
    e.preventDefault();

    if (!city.trim()) {
      setError("Enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Weather not found");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Weather Forecast</h1>

      <form onSubmit={getWeather}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <section className="weather">
          <h2>
            {weather.city}, {weather.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
          />

          <h1>{weather.temperature}°C</h1>
          <p>{weather.description}</p>
          <p>Feels like: {weather.feelsLike}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind Speed: {weather.windSpeed} m/s</p>
        </section>
      )}
    </main>
  );
}
