import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { products, loading, addProduct, deleteProduct } = useContext(ProductContext);
  const { orders, updateOrderStatus, deleteOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    file: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, file });
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  // Add product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Name & Price are required!");
      return;
    }
    try {
      await addProduct(newProduct);

      // Reset form
      setNewProduct({ name: "", price: "", description: "", image: "", file: null });
      setPreviewImage(null);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>

      {/* Add Product Form */}
      <section className={styles.addProduct}>
        <h2>Add Product</h2>
        <input
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        ></textarea>
        <input
          placeholder="Image URL (optional)"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {previewImage && (
          <div className={styles.preview}>
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>
        )}

        <button className={styles.addBtn} onClick={handleAddProduct}>
          Add Product
        </button>
      </section>

      {/* Products List */}
      <section className={styles.productList}>
        <h2>Products</h2>
        {loading ? (
          <div className={styles.loader}></div>
        ) : products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <div className={styles.grid}>
            {products.map((item) => (
              <div
                key={item.id}
                className={styles.card}
                onClick={() => navigate(`/admin/product/${item.id}`)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <img
                  src={
                    item.image.startsWith("/uploads/")
                      ? `http://localhost:5000${item.image}`
                      : item.image || "/placeholder.png"
                  }
                  alt={item.name}
                  className={styles.image}
                />
                <h3>{item.name}</h3>
                <p>${item.price}</p>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => handleDeleteProduct(item.id, e)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
{/* Orders Section */}
<section className={styles.orders}>
  <h2>Orders</h2>
  {orders.length === 0 ? (
    <p>No orders yet.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Products</th>
          <th>Order ID</th>
          <th>Total</th>
          <th>Change Status</th>
          <th>Order Delete</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          let productNames = "No items";
          if (order.items) {
            try {
              const productsInOrder = JSON.parse(order.items);
              productNames = productsInOrder
                .map((p) =>
                  p.quantity ? `${p.name} x ${ p.quantity}` : p.name
                )
                .join(", ");
            } catch {
              productNames = "Invalid items";
            }
          }

          return (
            <tr key={order.id}>
              <td>{productNames}</td>
              <td>{order.id}</td>
              <td>${order.total}</td>

              {/* Mark Delivered */}
              <td>
                {order.status === "Pending" ? (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                    className={styles.markBtn}
                  >
                    Mark Delivered
                  </button>
                ) : (
                  "Delivered"
                )}
              </td>

              {/* Delete Order */}
              <td>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this order?")) {
                      deleteOrder(order.id);
                    }
                  }}
                  className={styles.deleteBtn}
                >
                  Delete Order
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</section>

    </div>
  );
}
