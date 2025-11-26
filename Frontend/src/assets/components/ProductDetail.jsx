import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import styles from "./ProductDetail.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  const product = products.find(p => p.id === Number(id));

  if (!product) return <h2 className={styles.notFound}>Product not found</h2>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={product.image || "https://via.placeholder.com/400"} alt={product.name} className={styles.image} />
        <div className={styles.info}>
          <h1>{product.name}</h1>
          <p>${product.price}</p>
          <p>{product.description || "No description available."}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
