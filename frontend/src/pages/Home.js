import React, { useContext } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { FaCloudSun, FaUserLock, FaSearch, FaInfoCircle } from "react-icons/fa";
import image from "../assets/HomePage.png";
import { LanguageContext } from "../components/LanguageContext";
import homeText from "../translations/homeText";

const Home = () => {
  const { lang } = useContext(LanguageContext);
  const t = homeText[lang]; 

  return (
    <div className="home-container">

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-sub">{t.heroSub}</p>

          <div className="hero-buttons">
            <Link to="/trucks" className="btn-main">{t.btnSearch}</Link>
            <Link to="/login" className="btn-secondary">{t.btnLogin}</Link>
          </div>
        </div>

        <div className="hero-img-box">
          <img src={image} className="hero-img" alt="truck" />
        </div>
      </section>

      <section className="section-grid">

        <div className="section-card fade-up delay1">
          <FaSearch className="sec-icon" />
          <h3>{t.sec1Title}</h3>
          <p>{t.sec1Desc}</p>
          <Link to="/trucks" className="sec-btn">{t.sec1Btn}</Link>
        </div>

        <div className="section-card fade-up delay1">
          <FaUserLock className="sec-icon" />
          <h3>{t.sec2Title}</h3>
          <p>{t.sec2Desc}</p>
          <Link to="/login" className="sec-btn">{t.sec2Btn}</Link>
        </div>

        <div className="section-card fade-up delay2">
          <FaCloudSun className="sec-icon" />
          <h3>{t.sec3Title}</h3>
          <p>{t.sec3Desc}</p>
          <Link to="/weather" className="sec-btn">{t.sec3Btn}</Link>
        </div>

        <div className="section-card fade-up delay3">
          <FaInfoCircle className="sec-icon" />
          <h3>{t.sec4Title}</h3>
          <p>{t.sec4Desc}</p>
          <Link to="/about" className="sec-btn">{t.sec4Btn}</Link>
        </div>

      </section>

    </div>
  );
};

export default Home;
