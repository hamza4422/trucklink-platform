import React, { useEffect, useState, useContext } from "react";
import "../styles/DriverDashboard.css";
import { LanguageContext } from "../components/LanguageContext";
import dashboardText from "../translations/dashboardText";
import trucksText from "../translations/trucksText";
import { Link } from "react-router-dom";
const API = "https://trucklink-platform-production.up.railway.app";

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { lang } = useContext(LanguageContext);
  const t = dashboardText[lang];
  useEffect(() => {
    const email = localStorage.getItem("driverEmail");
    if (!email) return;

    fetch(`${API}/getDriver?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "not_found") {
          setDriver({
            ...data,
            locations: data.locations ? data.locations.split(",") : [],
          });
        }
      });
  }, []);

  if (!driver) return <h1 className="dash-loading">{t.loading}</h1>;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);
    form.append("email", driver.email);

    const res = await fetch(`${API}/uploadImage`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (data.status === "success") {
      const updated = { ...driver, imageUrl: data.imageUrl };
      setDriver(updated);
      localStorage.setItem("driverData", JSON.stringify(updated));
    }
  };

  const handleSave = async () => {
    const res = await fetch(`${API}/updateDriver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    });

    const data = await res.json();

    if (data.status === "success") {
      alert(t.saveSuccess);
      setEditMode(false);
      localStorage.setItem("driverData", JSON.stringify(driver));
    } else {
      alert(t.saveError);
    }
  };

  return (
    <div className="dash-wrapper">
      <div className="dash-card">
        <div className="dash-image-container">
          <div className="orders-section">
            <h3>
              {lang === "ar" ? "إدارة الطلبات" : "Orders Management"}
            </h3>

            <div className="orders-links">
              <Link to="/pending-orders" className="orders-link pending">
                📥 {lang === "ar" ? "الطلبات المعلّقة" : "Pending Orders"}
              </Link>

              <Link to="/ready-orders" className="orders-link ready">
                ✅ {lang === "ar" ? "الطلبات الجاهزة" : "Ready Orders"}
              </Link>
            </div>
          </div>
          <br />
          <br />
          <img
            src={`${API}/${driver.imageUrl}`}
            alt="truck"
            className="dash-image"
          />

          <label className="dash-upload-btn">
            {t.changeImage}
            <input type="file" accept="image/*" onChange={handleUpload} />
          </label>
        </div>

        {!editMode ? (
          <div className="dash-info">
            <div className="dash-row">
              <span>{t.name}:</span>
              <b>{driver.fname}</b>
            </div>

            <div className="dash-row">
              <span>{t.email}:</span>
              <b>{driver.email}</b>
            </div>

            <div className="dash-row">
              <span>{t.phone}:</span>
              <b>{driver.phoneNumber}</b>
            </div>
            
            <div className="dash-row">
              <span>{t.payPerDay}</span>
              <b>{driver.payPerDay} $</b>
            </div>

            <div className="dash-row">
              <span>{t.regions}:</span>
              <b>{driver.locations.join(", ")}</b>
            </div>

            <div className="dash-desc-box">
              <span>{t.description}:</span>
              <p>{driver.description}</p>
            </div>

            <button
              className="dash-edit-btn"
              onClick={() => setEditMode(true)}
            >
              {t.editButton}
            </button>
          </div>
        ) : (
          <div className="dash-edit">
            <input
              type="text"
              value={driver.fname}
              onChange={(e) =>
                setDriver({ ...driver, fname: e.target.value })
              }
              placeholder={t.name}
            />

            <input
              type="text"
              value={driver.phoneNumber}
              onChange={(e) =>
                setDriver({ ...driver, phoneNumber: e.target.value })
              }
              placeholder={t.phone}
            />
            <input
              type="number"
              value={driver.payPerDay}
              onChange={(e) =>
                setDriver({ ...driver, payPerDay: e.target.value })
              }
              placeholder={t.payPerDay}
            />
              <div className="dash-locations-edit">
                <p>{t.regions}</p>

                <div className="dash-locations-grid">
                  {Object.keys(t.regionsList).map((region) => (
                    <label key={region} className="dash-location-item">
                      <input
                        type="checkbox"
                        checked={driver.locations.includes(region)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDriver({
                              ...driver,
                              locations: [...driver.locations, region],
                            });
                          } else {
                            setDriver({
                              ...driver,
                              locations: driver.locations.filter((r) => r !== region),
                            });
                          }
                        }}
                      />
                      <span>{t.regionsList[region]}</span>
                    </label>
                  ))}
                </div>
              </div>


            <textarea
              value={driver.description}
              onChange={(e) =>
                setDriver({ ...driver, description: e.target.value })
              }
              placeholder={t.description}
            />

            <button className="dash-save-btn" onClick={handleSave}>
              {t.saveButton}
            </button>
          </div>
        )}
        
      </div>

    
    </div>
  );
};

export default DriverDashboard;
