import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import ordersText from "../translations/ordersText";
import { FaWhatsapp, FaTrash } from "react-icons/fa";
import "../styles/OrderReadyCard.css";

const OrderReadyCard = ({ order, onDelete }) => {
  const { lang } = useContext(LanguageContext);
  const t = ordersText[lang];

  const whatsappMessage =
    lang === "ar"
      ? `مرحباً ${order.customerName}، نحن نتواصل معك بخصوص الطلب الذي قمت بتقديمه عبر TruckLink.`
      : `Hello ${order.customerName}, we are contacting you regarding your order on TruckLink.`;

  const whatsappLink = `https://wa.me/961${order.customerPhone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="order-ready-card">
      <h3 className="order-name">{order.customerName}</h3>

      <div className="order-info">
        <p>📞 {order.customerPhone}</p>
        <p>📍 {order.region}</p>
        <p>🗓 {order.days} {t.days}</p>
        <p>💰 {order.totalPrice}$</p>
      </div>

      <div className="order-actions">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <FaWhatsapp /> {t.contact}
        </a>

        <button
            className="delete-btn"
            onClick={() => {
                const confirmDelete = window.confirm(
                lang === "ar"
                    ? "هل أنت متأكد أنك تريد حذف هذا الطلب؟"
                    : "Are you sure you want to delete this order?"
                );

                if (confirmDelete) {
                onDelete(order.id);
                }
            }}
            >
            <FaTrash /> {t.delete}
        </button>

      </div>
    </div>
  );
};

export default OrderReadyCard;
