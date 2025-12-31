import React, { useContext } from "react";
import "../styles/TruckCard.css";
import { FaWhatsapp } from "react-icons/fa";
import { LanguageContext } from "../components/LanguageContext";
import trucksText from "../translations/trucksText";
import { Link } from "react-router-dom";
const API = "https://trucklink-platform-production.up.railway.app";

const TruckCard = ({ driver }) => {
  const { lang } = useContext(LanguageContext);
  const labels = trucksText[lang].regionsLabels;

  const { fname, phoneNumber, locations, description } = driver;

  const getLocationLabel = (code) => labels[code] || code;

  return (
    <div className="truck-card">
      <img
        className="truck-image"
        src={`${API}/${driver.imageUrl}`}
        alt="truck"
      />

      <h2 className="truck-name">{fname}</h2>

      <p className="truck-phone">📞 {phoneNumber}</p>
      
      <p className="truck-price"> <b>{driver.payPerDay} $</b> </p>

      <div className="truck-locations">
        {locations.map((loc, index) => (
          <span key={index} className="location-tag">
            {getLocationLabel(loc)}
          </span>
        ))}
      </div>

      <p className="truck-desc">{description}</p>

      <Link to={`/create-order/${driver.id}`}>
        <button className="order-btn">
         {trucksText[lang].regionsLabels.button}
        </button>
      </Link>

    </div>
  );
};

export default TruckCard;
