import React, { useEffect, useState, useContext } from "react";
import "../styles/Trucks.css";
import TruckCard from "../components/TruckCard";
import { LanguageContext } from "../components/LanguageContext";
import trucksText from "../translations/trucksText";

const API = "http://localhost:5000";

const Trucks = () => {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState("all");

  const { lang } = useContext(LanguageContext);
  const t = trucksText[lang];

  useEffect(() => {
    fetch(`${API}/drivers`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((d) => ({
          ...d,
          locations:
            typeof d.locations === "string"
              ? d.locations.split(",")
              : Array.isArray(d.locations)
              ? d.locations
              : [],
        }));

        setDrivers(formatted);
      })
      .catch((err) => console.error("Error loading drivers:", err));
  }, []);

  const filteredDrivers =
    filter === "all"
      ? drivers
      : drivers.filter((d) => d.locations.includes(filter));

  const labels = t.regionsLabels;

  return (
    <div className="trucks-page">
      <h1 className="title">{t.title}</h1>

      <div className="filter-container">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">{t.filterAll}</option>
          <option value="beirut">{labels.beirut}</option>
          <option value="mountLebanon">{labels.mountLebanon}</option>
          <option value="north">{labels.north}</option>
          <option value="south">{labels.south}</option>
          <option value="bekaa">{labels.bekaa}</option>
          <option value="nabatieh">{labels.nabatieh}</option>
        </select>
      </div>

      <div className="trucks-grid">
        {filteredDrivers.map((driver, index) => (
          <TruckCard key={index} driver={driver} />
        ))}
      </div>
    </div>
  );
};

export default Trucks;
