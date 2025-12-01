import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import Header from "../components/Header";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { products, loading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const getImageSrc = (image) => {
    if (!image) return "/placeholder.png"; // fallback if no image
    if (image.startsWith("/uploads/")) return `http://localhost:5000${image}`; // uploaded file
    return image; // URL from user
  };

  return (
    <main>
      <Header />

      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Our Items</h1>

        {loading ? (
          <div className={styles.loader}></div>
        ) : products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <div className={styles.grid}>
            {products.map((item) => (
              <div
                className={styles.card}
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={getImageSrc(item.image)}
                  alt={item.name}
                  className={styles.image}
                />

                <h3>{item.name}</h3>
                <p>${item.price}</p>

                <button
                  className={styles.btn}
                  onClick={(e) => {
                    e.stopPropagation(); // stops navigation when clicking Add to Cart
                    addToCart(item);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
