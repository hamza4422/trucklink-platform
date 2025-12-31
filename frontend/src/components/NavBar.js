import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/trucklink_inverted.png";
import ReorderIcon from "@mui/icons-material/Reorder";
import { LanguageContext } from "./LanguageContext";
import navbarText from "../translations/navbarText";

const NavBar = () => {
  const [openLinks, setOpenLinks] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { lang } = useContext(LanguageContext);
  const t = navbarText[lang];

  useEffect(() => {
    const driverData = localStorage.getItem("driverData");
    setIsLogged(!!driverData);
  }, [location]);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const hideList = () => {
    if (openLinks) setOpenLinks(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("driverData");
    setIsLogged(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" onClick={hideList}>
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <nav className={`navbar ${openLinks ? "open" : ""}`}>
        <button onClick={toggleNavbar} className="menuButton">
          <ReorderIcon />
        </button>

        <div className="link">
          <Link onClick={hideList} to="/">
            {t.home}
          </Link>
          <Link onClick={hideList} to="/about">
            {t.about}
          </Link>
          <Link onClick={hideList} to="/trucks">
            {t.trucks}
          </Link>
          <Link onClick={hideList} to="/weather">
            {t.weather}
          </Link>
          {isLogged ? (
            <>
              <Link onClick={hideList} to="/dashboard">
                {t.dashboard}
              </Link>
              <span onClick={handleLogout} className="logout-btn">
                {t.logout}
              </span>
            </>
          ) : (
            <>
              <Link onClick={hideList} to="/login">
                {t.login}
              </Link>
              <Link onClick={hideList} to="/registration">
                {t.register}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
