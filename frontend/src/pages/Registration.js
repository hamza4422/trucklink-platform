import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Registration.css";
import { FaUser, FaLock } from "react-icons/fa";
import { BiSolidLogIn } from "react-icons/bi";
import { MdOutlineAlternateEmail, MdOutlinePhone } from "react-icons/md";
import { LanguageContext } from "../components/LanguageContext";
import registerText from "../translations/registerText";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [locations, setLocations] = useState([]);

  const navigate = useNavigate();
  const imageUrl = "uploads/truck_default.jpg";

  const { lang } = useContext(LanguageContext);
  const t = registerText[lang];

  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLocations([...locations, value]);
    } else {
      setLocations(locations.filter((loc) => loc !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert(t.passwordsNotMatch);
      return;
    }

    const registrationData = {
      fname,
      email,
      phoneNumber,
      password,
      locations,
      description,
      imageUrl,
    };

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || t.successRegister);
        navigate("/login");
      } else {
        alert(data.message || t.serverError);
      }
    } catch (error) {
      console.error(error);
      alert(t.serverError);
    }
  };

  const regionNames = registerText[lang].regions;

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>
          {t.title} <BiSolidLogIn />
        </h1>

        <div className="input-box">
          <input
            type="text"
            placeholder={t.fullNamePlaceholder}
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="number"
            placeholder={t.phonePlaceholder}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <MdOutlinePhone className="icon" />
        </div>

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

        <div className="input-box">
          <input
            type="password"
            placeholder={t.confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <div className="locations">
          <p>{t.locationsTitle}</p>

          <label>
            <input value="beirut" type="checkbox" onChange={handleLocationChange} />
            {regionNames.beirut[lang]}
          </label>

          <label>
            <input
              value="mountLebanon"
              type="checkbox"
              onChange={handleLocationChange}
            />
            {regionNames.mountLebanon[lang]}
          </label>

          <label>
            <input value="north" type="checkbox" onChange={handleLocationChange} />
            {regionNames.north[lang]}
          </label>

          <label>
            <input value="south" type="checkbox" onChange={handleLocationChange} />
            {regionNames.south[lang]}
          </label>

          <label>
            <input value="bekaa" type="checkbox" onChange={handleLocationChange} />
            {regionNames.bekaa[lang]}
          </label>

          <label>
            <input
              value="nabatieh"
              type="checkbox"
              onChange={handleLocationChange}
            />
            {regionNames.nabatieh[lang]}
          </label>
        </div>

        <textarea
          className="desc-input"
          placeholder={t.descPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">{t.button}</button>

        <div className="login-link">
          <p>
            {t.haveAccountText} <Link to="/login">{t.loginLink}</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
