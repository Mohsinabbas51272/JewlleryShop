import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import styles from "./ProductDetail.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const product = products.find(p => p.id === Number(id));

  if (!product) return <h2 className={styles.notFound}>Product not found</h2>;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://localhost:5000${product.image}`
    : "https://via.placeholder.com/400";

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Product Name */}
          <h1>{product.name}</h1>

          {/* Product Image */}
          <img src={imageUrl} alt={product.name} className={styles.image} />

          {/* Price */}
          <p className={styles.price}>${product.price}</p>

          {/* Description */}
          <p className={styles.description}>
            {product.description || "No description available."}
          </p>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button
              className={styles.addBtn}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            <button className={styles.backBtn} onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
