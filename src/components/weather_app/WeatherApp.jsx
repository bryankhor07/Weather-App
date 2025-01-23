import "./WeatherApp.css";
import search_icon from "../assets/search.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import clear_icon from "../assets/clear.png";
import sunrise_icon from "../assets/sunrise_icon.png";
import sunset_icon from "../assets/sunset_icon.png";

import { useState, useRef, useEffect, useCallback } from "react";

export default function WeatherApp() {
  const [data, setData] = useState({
    temp: "",
    humidity: "",
    wind: "",
    location: "",
    weatherImage: "",
    sunrise: "",
    sunset: "",
  });
  const cityInputRef = useRef(null);
  const api_key = "4a30f7be8f0f76d6f080f289fdb1f442";
  const [isCelsius, setIsCelsius] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const fetchWeather = useCallback(async (city) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.cod === "404") {
      showAlert("City not found");
      return;
    }
    // Extract timezone offset
    const timezoneOffset = data.timezone;

    let weatherImage = null;
    if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
      weatherImage = clear_icon;
    } else if (
      data.weather[0].icon === "02d" ||
      data.weather[0].icon === "02n"
    ) {
      weatherImage = cloud_icon;
    } else if (
      data.weather[0].icon === "03d" ||
      data.weather[0].icon === "03n"
    ) {
      weatherImage = drizzle_icon;
    } else if (
      data.weather[0].icon === "04d" ||
      data.weather[0].icon === "04n"
    ) {
      weatherImage = drizzle_icon;
    } else if (
      data.weather[0].icon === "09d" ||
      data.weather[0].icon === "09n"
    ) {
      weatherImage = rain_icon;
    } else if (
      data.weather[0].icon === "10d" ||
      data.weather[0].icon === "10n"
    ) {
      weatherImage = rain_icon;
    } else if (
      data.weather[0].icon === "13d" ||
      data.weather[0].icon === "13n"
    ) {
      weatherImage = snow_icon;
    } else {
      weatherImage = clear_icon;
    }

    setData({
      temp: Math.floor(data.main.temp),
      humidity: data.main.humidity,
      wind: Math.floor(data.wind.speed),
      location: data.name,
      weatherImage: weatherImage,
      sunrise: formatTime(data.sys.sunrise, timezoneOffset),
      sunset: formatTime(data.sys.sunset, timezoneOffset),
    });
  }, []);

  useEffect(() => {
    // Fetch default city weather when the component mounts
    fetchWeather("San Francisco");
  }, [fetchWeather]);

  const search = () => {
    const city = cityInputRef.current.value;
    if (city === "") {
      showAlert("Please enter a city");
      return;
    }
    fetchWeather(city);
  };

  const formatTime = (timestamp, timezoneOffset) => {
    // Convert the UTC timestamp to milliseconds, and apply the timezone offset
    const date = new Date((timestamp + timezoneOffset) * 1000);

    const hours = date.getUTCHours(); // Get the hours in UTC
    const minutes = date.getUTCMinutes(); // Get the minutes in UTC
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format and add leading zero to minutes
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="container">
      {alertMessage && <h1 className="alert">{alertMessage}</h1>}
      <div className="top-bar">
        <input
          type="text"
          className="city-input"
          placeholder="Search"
          ref={cityInputRef}
          onKeyDown={(e) => e.key === "Enter" && search()} // Trigger search on Enter
        />
        <div className="search-icon" onClick={search}>
          <img src={search_icon} alt="search" />
        </div>
      </div>
      <div className="weather-image">
        <img src={data.weatherImage} alt="cloud" />
      </div>
      <div className="weather-temp">
        {isCelsius ? `${data.temp}°C` : `${Math.floor(data.temp * 1.8 + 32)}°F`}
      </div>
      <div className="weather-location">{data.location}</div>
      <button onClick={toggleTemperature} className="toggle-button">
        Switch to {isCelsius ? "°F" : "°C"}
      </button>
      <div className="data-container">
        <div className="row">
          <div className="element">
            <img src={humidity_icon} alt="" className="humidity-icon" />
            <div className="data">
              <div className="humidity-percent">{data.humidity}%</div>
              <div className="humidity-text">Humidity</div>
            </div>
          </div>
          <div className="element">
            <img src={wind_icon} alt="" className="wind-icon" />
            <div className="data">
              <div className="wind-rate">{data.wind} km/h</div>
              <div className="wind-text">Wind Speed</div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="element">
            <img src={sunrise_icon} alt="" className="sunrise-icon" />
            <div className="data">
              <div className="sunrise-time">{data.sunrise}</div>
              <div className="sunrise-text">Sunrise</div>
            </div>
          </div>
          <div className="element">
            <img src={sunset_icon} alt="" className="sunset-icon" />
            <div className="data">
              <div className="sunset-time">{data.sunset}</div>
              <div className="sunset-text">Sunset</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
