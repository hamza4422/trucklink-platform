import React, { useContext } from "react";
import "../styles/About.css";
import { FaTruck, FaUsers, FaRocket, FaPhoneAlt } from "react-icons/fa";
import { LanguageContext } from "../components/LanguageContext";
import aboutText from "../translations/aboutText";

const About = () => {
  const { lang } = useContext(LanguageContext);
  const t = aboutText[lang];

  return (
    <div className="about-container">
      <section className="about-hero">
        <h1 className="about-title">{t.heroTitle}</h1>
        <p className="about-sub">{t.heroSub}</p>
      </section>

      <section className="about-section fade-up">
        <h2>{t.whoWeAreTitle}</h2>
        <p>{t.whoWeAreBody}</p>
      </section>

      <section className="about-grid fade-up delay1">
        <div className="about-card">
          <FaTruck className="about-icon" />
          <h3>{t.card1Title}</h3>
          <p>{t.card1Body}</p>
        </div>

        <div className="about-card">
          <FaUsers className="about-icon" />
          <h3>{t.card2Title}</h3>
          <p>{t.card2Body}</p>
        </div>

        <div className="about-card">
          <FaRocket className="about-icon" />
          <h3>{t.card3Title}</h3>
          <p>{t.card3Body}</p>
        </div>
      </section>

      <section className="about-section fade-up delay2">
        <h2>{t.whyTitle}</h2>
        <ul className="about-list">
          {t.whyList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="contact-cta fade-up delay3">
        <h2>{t.helpTitle}</h2>
        <p>{t.helpBody}</p>
        <a href="https://wa.me/96178963561" className="cta-btn">
          <FaPhoneAlt /> {t.helpBtn}
        </a>
      </section>
    </div>
  );
};

export default About;
