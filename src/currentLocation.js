import React, { useState, useEffect } from "react";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  let days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = () => {
  const [state, setState] = useState({
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  });

 
  const getWeather = async (lat, lon) => {
    try {
      
      const api_call = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);

      
      if (!api_call.ok) {
        console.error("API Error:", api_call.status, api_call.statusText);
        return; 
      }

      const data = await api_call.json();

      setState((prevState) => ({
        ...prevState,
        lat: lat,
        lon: lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        country: data.sys.country,
      }));

      // Icon Logic
      switch (data.weather[0].main) {
        case "Haze":
          setState((prevState) => ({ ...prevState, icon: "CLEAR_DAY" }));
          break;
        case "Clouds":
          setState((prevState) => ({ ...prevState, icon: "CLOUDY" }));
          break;
        case "Rain":
          setState((prevState) => ({ ...prevState, icon: "RAIN" }));
          break;
        case "Snow":
          setState((prevState) => ({ ...prevState, icon: "SNOW" }));
          break;
        case "Dust":
          setState((prevState) => ({ ...prevState, icon: "WIND" }));
          break;
        case "Drizzle":
          setState((prevState) => ({ ...prevState, icon: "SLEET" }));
          break;
        case "Fog":
        case "Smoke":
          setState((prevState) => ({ ...prevState, icon: "FOG" }));
          break;
        case "Tornado":
          setState((prevState) => ({ ...prevState, icon: "WIND" }));
          break;
        default:
          setState((prevState) => ({ ...prevState, icon: "CLEAR_DAY" }));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  
 
if (navigator.geolocation) {
  const options = {
    enableHighAccuracy: false, 
    timeout: 10000,            
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(
    
    (position) => {
      getWeather(position.coords.latitude, position.coords.longitude);
    },
    
    (err) => {
      console.error("Geolocation Error:", err.message);
      
      getWeather(28.67, 77.22);
      alert(
        `Could not detect your location (Error: ${err.message}). Showing default weather for Delhi.`
      );
    },
   
    options
  );
} else {
  alert("Geolocation not available in this browser.");
}

 
  useEffect(() => {
    const timerID = setInterval(() => {
        if(state.lat && state.lon) {
            getWeather(state.lat, state.lon);
        }
    }, 600000); 

    return () => {
      clearInterval(timerID);
    };
  }, [state.lat, state.lon]);

  if (state.temperatureC) {
    return (
      <React.Fragment>
        <div className="city">
          <div className="title">
            <h2>{state.city}</h2>
            <h3>{state.country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={state.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{state.main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {state.temperatureC}°<span>C</span>
              </p>
            </div>
          </div>
        </div>
        <Forcast icon={state.icon} weather={state.main} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} alt="loading" />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App <br /> & used for
          calculating Real time weather. <br /> You can decline if don't need
          weather of your current location.
        </h3>
      </React.Fragment>
    );
  }
};

export default Weather;