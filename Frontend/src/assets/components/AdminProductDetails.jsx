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
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product.id);
      navigate("/admin-dashboard");
    }
  };

  const handleEdit = () => {
    navigate(`/admin/product/edit/${product.id}`);
  };

  // Fix image path: use full URL for local uploads
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000${product.image}`;

  return (
    <div className={styles.container}>
      <h1>Product Details</h1>

      <div className={styles.card}>
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.image}
        />

        <h2>{product.name}</h2>
        <p className={styles.price}>${product.price}</p>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.buttons}>
          <button className={styles.editBtn} onClick={handleEdit}>
            Edit Product
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
