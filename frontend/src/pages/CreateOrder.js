import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext , useEffect } from "react";
import { LanguageContext } from "../components/LanguageContext";
import createOrderText from "../translations/createOrderText";
import "../styles/CreateOrder.css";


const CreateOrder = () => {
    const { driverId } = useParams();
    const { lang } = useContext(LanguageContext);
    const t = createOrderText[lang];
    const [driver, setDriver] = useState(null);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        customerName: "",
        customerPhone: "",
        region: "",
        days: "",
    });
    const totalPrice =driver && form.days? Number(form.days) * Number(driver.payPerDay): 0;
    const handleSubmit = () => {
        if (
            !form.customerName ||
            !form.customerPhone ||
            !form.region ||
            !form.days
        ) {
            alert(lang === "ar" ? "يرجى تعبئة جميع الحقول" : "Please fill all fields");
            return;
        }

        fetch("http://localhost:5000/createOrder", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            driver_id: driverId,
            customerName: form.customerName,
            customerPhone: form.customerPhone,
            region: form.region,
            days: Number(form.days),
            totalPrice: totalPrice,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.status === "success") {
                alert(
                lang === "ar"
                    ? "تم إرسال الطلب بنجاح"
                    : "Order sent successfully"
                );
                navigate("/Trucks");
            } else {
                alert("Error");
            }
            });
    };

    useEffect(() => {
        fetch(`http://localhost:5000/driver/${driverId}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.status !== "not_found") {
            setDriver(data);
            }
        });
    }, [driverId]);

  return (
    <div className="create-order-page">
        <div className="create-order-card">
        <h2 className="create-order-title">{t.title}</h2>

        <input
            placeholder={t.customerName}
            value={form.customerName}
            onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
            }
        />

        <input
            placeholder={t.phone}
            value={form.customerPhone}
            onChange={(e) =>
            setForm({ ...form, customerPhone: e.target.value })
            }
        />

        <select
            value={form.region}
            onChange={(e) =>
            setForm({ ...form, region: e.target.value })
            }
        >
            <option value="">
            {lang === "ar" ? "اختر المنطقة" : "Select region"}
            </option>

            {driver &&
            driver.locations.map((loc) => (
                <option key={loc} value={loc}>
                {loc}
                </option>
            ))}
        </select>

        <input
            type="number"
            min="1"
            placeholder={t.days}
            value={form.days}
            onChange={(e) =>
            setForm({ ...form, days: e.target.value })
            }
        />

        {driver && (
            <p className="total-price">
            💰 {lang === "ar" ? "السعر الإجمالي" : "Total Price"}: {totalPrice} $
            </p>
        )}

        <button className="submit-btn" onClick={handleSubmit}>
            {t.submit}
        </button>

        <p className="driver-id">
            Driver ID: {driverId}
        </p>
        </div>
    </div>
    );
};

export default CreateOrder;
