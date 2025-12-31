import { useEffect, useState, useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";
import OrderReadyCard from "../components/OrderReadyCard";
import readyOrdersText from "../translations/readyOrdersText";
import "../styles/PageOrders.css";

const ReadyOrders = () => {
  
  const { lang } = useContext(LanguageContext);
  const t = readyOrdersText[lang];
  const driver = JSON.parse(localStorage.getItem("driverData"));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!driver) return;

    fetch(`https://trucklink-platform-production.up.railway.app/orders/ready/${driver.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [driver?.id]);

  const handleDelete = (orderId) => {
    fetch("https://trucklink-platform-production.up.railway.app/orders/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      });
  };

  return (
    <div className="ready-orders-page">
      <h2 className="ready-orders-title">{t.title}</h2>

      {orders.length === 0 ? (
        <p className="no-orders">{t.noOrders}</p>
      ) : (
        <div className="ready-orders-grid">
          <div className="orders-grid">
          {orders.map((order) => (
            <OrderReadyCard
              key={order.id}
              order={order}
              onDelete={handleDelete}
            />
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyOrders;
