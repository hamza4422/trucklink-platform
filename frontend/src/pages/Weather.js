import React, { useState, useEffect, useContext } from "react";
import "../styles/Weather.css";
import { LanguageContext } from "../components/LanguageContext";
import weatherText from "../translations/weatherText";

const API_KEY = process.env.REACT_APP_WEATHER_KEY;

const Weather = () => {
  const { lang } = useContext(LanguageContext);
  const t = weatherText[lang];

  const regionKeys = [
    "lebanon",
    "beirut",
    "mountLebanon",
    "north",
    "south",
    "bekaa",
    "nabatiye",
  ];

  const [dataMap, setDataMap] = useState({});
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!API_KEY) {
      setError(t.error);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const promises = regionKeys.map((code) => {
          const cityName = t.apiCities[code];
          return fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
              cityName
            )},LB&appid=${API_KEY}&units=metric&lang=${lang}`,
            { signal: controller.signal }
          ).then((res) =>
            res.json().then((json) => ({ code, json }))
          );
        });

        const results = await Promise.all(promises);
        const map = {};
        let hasAnySuccess = false;

        results.forEach(({ code, json }) => {
          if (json.cod === 200) {
            map[code] = json;
            hasAnySuccess = true;
          }
        });

        if (!hasAnySuccess) {
          setError(t.error);
          setDataMap({});
        } else {
          setDataMap(map);
        }

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Lebanon,LB&appid=${API_KEY}&units=metric&lang=${lang}`,
          { signal: controller.signal }
        );

        const forecastJson = await forecastRes.json();

        if (forecastJson.cod === "200") {
          const daily = {};
          forecastJson.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0];
            if (!daily[date]) daily[date] = item;
          });
          setForecast(Object.values(daily).slice(0, 5));
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    return () => controller.abort();
  }, [lang, t]);

  const mainData = dataMap["lebanon"] || dataMap["beirut"];
  const otherRegions = regionKeys.filter((k) => k !== "lebanon");

  const formatTime = (dt) => {
    if (!dt) return "";
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString(lang === "ar" ? "ar-LB" : "en-LB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="weather-page" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="weather-overlay" />

      <div className="weather-content">
        <header className="weather-header">
          <h1 className="weather-title">{t.title}</h1>
          <p className="weather-sub">{t.subtitle}</p>
        </header>

        {loading && <p className="weather-loading">{t.loading}</p>}
        {error && !loading && <p className="weather-error">{error}</p>}

        {!loading && !error && mainData && (
          <>
            <section className="weather-main-card">
              <div className="main-left">
                <h2 className="main-title">{t.mainBoxTitle}</h2>
                <p className="main-region">{t.regions["lebanon"]}</p>

                <div className="main-temp-row">
                  <span className="main-temp">
                    {Math.round(mainData.main.temp)}°C
                  </span>
                  <span className="main-desc">
                    {mainData.weather[0].description}
                  </span>
                </div>

                <div className="main-details">
                  <span>{t.feels}: {Math.round(mainData.main.feels_like)}°C</span>
                  <span>{t.humidity}: {mainData.main.humidity}%</span>
                  <span>{t.wind}: {mainData.wind.speed} km/h</span>
                </div>

                <p className="main-update">
                  {t.lastUpdate}: {formatTime(mainData.dt)}
                </p>
              </div>

              <div className="main-right">
                <img
                  className="main-icon"
                  src={`https://openweathermap.org/img/wn/${mainData.weather[0].icon}@4x.png`}
                  alt="icon"
                />
              </div>
            </section>

            
            <section className="forecast-section">
              <h2 className="forecast-title">
                {lang === "ar"
                  ? "توقعات الطقس في لبنان لخمسة أيام"
                  : "Lebanon 5-Day Forecast"}
              </h2>

              <div className="forecast-grid">
                {forecast.map((day, i) => (
                  <div className="forecast-card" key={i}>
                    <h4>
                      {new Date(day.dt * 1000).toLocaleDateString(
                        lang === "ar" ? "ar-LB" : "en-LB",
                        { weekday: "long", day: "numeric", month: "short" }
                      )}
                    </h4>

                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt="icon"
                    />

                    <p>{day.weather[0].description}</p>
                    <span>{Math.round(day.main.temp)}°C</span>
                  </div>
                ))}
              </div>
            </section>

            
            <section className="weather-grid">
              {otherRegions.map((code) => {
                const w = dataMap[code];
                return (
                  <div className="weather-mini-card" key={code}>
                    <h3 className="mini-title">{t.regions[code]}</h3>

                    {w ? (
                      <>
                        <div className="mini-top">
                          <img
                            className="mini-icon"
                            src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
                            alt="icon"
                          />
                          <span className="mini-temp">
                            {Math.round(w.main.temp)}°C
                          </span>
                        </div>

                        <p className="mini-desc">{w.weather[0].description}</p>
                        <div className="mini-details">
                          <span>{t.humidity}: {w.main.humidity}%</span>
                          <span>{t.wind}: {w.wind.speed} km/h</span>
                        </div>
                      </>
                    ) : (
                      <p className="mini-loading">{t.loading}</p>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
