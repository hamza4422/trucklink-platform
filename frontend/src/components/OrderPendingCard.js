import "../styles/OrderCard.css";
import { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";
import ordersText from "../translations/ordersText";

const OrderPendingCard = ({ order, onAccept, onReject }) => {
  const { lang } = useContext(LanguageContext);
  const t = ordersText[lang];

  return (
    <div className="order-card">
      <h3 className="order-title">{order.customerName}</h3>

      <div className="order-row">
        <span>📍 {t.region}:</span>
        <b>{order.region}</b>
      </div>

      <div className="order-row">
        <span>🗓️ {t.days}:</span>
        <b>{order.days}</b>
      </div>

      <div className="order-row">
        <span>💰 {t.price}:</span>
        <b>{order.totalPrice} $</b>
      </div>

      <div className="order-actions">
        <button
          className="accept-btn"
          onClick={() => onAccept(order.id)}
        >
          {t.accept}
        </button>

        <button
          className="reject-btn"
          onClick={() => onReject(order.id)}
        >
          {t.reject}
        </button>
      </div>
    </div>
  );
};

export default OrderPendingCard;
