import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import styles from "./AdminProductDetails.module.css";

export default function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, deleteProduct } = useContext(ProductContext);

  const product = products.find((p) => p.id === Number(id));

  if (!product) return <h2>Product not found</h2>;

  const handleDelete = () => {
    deleteProduct(product.id);
    navigate("/admin");
  };

  return (
    <div className={styles.container}>
      <h1>Product Details</h1>

      <div className={styles.card}>
        <img src={product.image} alt={product.name} className={styles.image} />

        <h2>{product.name}</h2>
        <p>${product.price}</p>
        <p>{product.description}</p>

        <button className={styles.deleteBtn} onClick={handleDelete}>
          Delete Product
        </button>
      </div>
    </div>
  );
}
