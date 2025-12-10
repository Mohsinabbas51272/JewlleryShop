import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h2 className={styles.logo} onClick={() => navigate("/")}>
          Jewellery Shop
        </h2>

        <div
          className={styles.cart}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          🛒 Cart ({cartItems.length})
          {showDropdown && cartItems.length > 0 && (
            <div className={styles.dropdown}>
              {cartItems.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("/uploads/")
                          ? `http://localhost:5000${item.image}` // backend URL
                          : item.image // full URL
                        : "/placeholder.png" // fallback if no image
                    }
                    alt={item.name}
                  />{" "}
                  <div>
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeBtn}
                  >
                    ❌
                  </button>
                </div>
              ))}

              <button
                className={styles.viewCartBtn}
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
