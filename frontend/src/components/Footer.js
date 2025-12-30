import "../styles/Footer.css";
import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

const Footer = () => {
  const { lang, toggleLang } = useContext(LanguageContext);

  return (
    <footer className="footer">
      <p className="footer-text">
        {lang === "en"
          ? "© 2025 TruckLink. All rights reserved."
          : "© 2025 TruckLink. جميع الحقوق محفوظة."}
      </p>

      <button className="lang-btn" onClick={toggleLang}>
        {lang === "en" ? "EN" : "AR"}
      </button>
    </footer>
  );
};

export default Footer;
