import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <header className={styles.header}>
      <h2 onClick={() => navigate("/")}>Jewllery Shop</h2>

      <div className={styles.cart} onClick={toggleDropdown}>
        🛒 Cart ({cartItems.length})

        {showDropdown && cartItems.length > 0 && (
          <div className={styles.dropdown}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <img src={item.image} alt={item.name} />
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
    </header>
  );
}
