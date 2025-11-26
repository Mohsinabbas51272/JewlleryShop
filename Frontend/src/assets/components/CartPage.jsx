import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate total price
  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  // Checkout function
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const totalPrice = getTotalPrice();

      // Send order to backend
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total: totalPrice,
          status: "Pending",
          date: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to place order. Try again.");

      const order = await res.json();
      console.log("Order placed:", order);

      // Clear cart
      clearCart();

      // Navigate to OrderPlaced page
      navigate("/order-placed", {
        state: { orderId: order.id, totalPrice, items: order.items },
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <h2 className={styles.empty}>Your cart is empty!</h2>
      ) : (
        <>
          <div className={styles.cartList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.cartImage} />
                <div className={styles.details}>
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div className={styles.total}>
            <h2>Total: ${getTotalPrice()}</h2>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
