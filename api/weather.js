//  api/weather.js

export default async function handler(req, res) {
  // 1. Get your secret API key from environment variables
  const API_KEY = process.env.WEATHER_API_KEY;;
  const BASE_URL = "https://api.openweathermap.org/data/2.5/";

  // 2. Get the query parameters (lat, lon, or q) from the React app
  const { lat, lon, q } = req.query;

  let url;

  if (lat && lon) {
    // Build URL for current location
    url = `${BASE_URL}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`;
  } else if (q) {
    // Build URL for city search
    url = `${BASE_URL}weather?q=${q}&units=metric&APPID=${API_KEY}`;
  } else {
    // If no params, return an error
    return res.status(400).json({ message: "Missing query parameters" });
  }

  try {
    // 3. Securely fetch data on the server
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    // 4. Send the data back to your React app
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}