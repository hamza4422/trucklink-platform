import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaLock } from "react-icons/fa";
import { BiSolidLogIn } from "react-icons/bi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { LanguageContext } from "../components/LanguageContext";
import loginText from "../translations/loginText";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { lang } = useContext(LanguageContext);
  const t = loginText[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert(t.successWelcome(data.user.fname));
        localStorage.setItem("driverEmail", data.user.email);
        localStorage.setItem("driverData", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert(t.errorServer);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>
          {t.title} <BiSolidLogIn />
        </h1>

        <div className="input-box">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <MdOutlineAlternateEmail className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <button type="submit">{t.button}</button>

        <div className="register-link">
          <p>
            {t.noAccountText} <Link to="/registration">{t.registerLink}</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
