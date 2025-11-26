import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderPlaced.module.css";

export default function OrderPlaced() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  const handleGoHome = () => {
    navigate("/dashboard"); // or "/" depending on your route
  };

  if (!orderId || !totalPrice) {
    return <h2>Order details not found!</h2>;
  }

  return (
    <div className={styles.container}>
      <h1>✅ Order Placed Successfully!</h1>
      <p>Your order has been received.</p>

      <div className={styles.summary}>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Total Price:</strong> ${totalPrice}</p>
      </div>

      <button className={styles.homeBtn} onClick={handleGoHome}>
        Back to Dashboard
      </button>
    </div>
  );
}
