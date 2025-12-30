import { useEffect, useState, useContext } from "react";
import OrderPendingCard from "../components/OrderPendingCard";
import { LanguageContext } from "../components/LanguageContext";
import "../styles/PageOrders.css";
const PendingOrders = () => {
  const { lang } = useContext(LanguageContext);
  const [orders, setOrders] = useState([]);
  const handleAccept = (orderId) => {
  fetch("http://localhost:5000/orders/accept", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  })
    .then((res) => res.json())
    .then(() => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    });
};

const handleReject = (orderId) => {
  fetch("http://localhost:5000/orders/reject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  })
    .then((res) => res.json())
    .then(() => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    });
};

  const driver = JSON.parse(localStorage.getItem("driverData"));


  useEffect(() => {
    fetch(`http://localhost:5000/orders/pending/${driver.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      });
  }, [driver?.id]);

  return (
    <div style={{ paddingTop: "120px", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        {lang === "ar" ? "الطلبات المعلّقة" : "Pending Orders"}
      </h2>

      {orders.length === 0 && (
        <p>
          {lang === "ar"
            ? "لا توجد طلبات معلّقة"
            : "No pending orders"}
        </p>
      )}

      <div className="orders-grid">
        {orders.map((order) => (
          <OrderPendingCard
            key={order.id}
            order={order}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </div>

    </div>
  );
};

export default PendingOrders;
