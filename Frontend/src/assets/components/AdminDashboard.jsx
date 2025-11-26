import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { products, addProduct, deleteProduct } = useContext(ProductContext);
  const { orders, updateOrderStatus } = useContext(OrderContext);
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Name & Price are required!");
      return;
    }
    addProduct({ ...newProduct, price: Number(newProduct.price) });
    setNewProduct({ name: "", price: "", image: "", description: "" });
  };

  const handleDeleteProduct = (id, e) => {
    e.stopPropagation(); // Prevent navigating to product detail
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
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        ></textarea>
        <button onClick={handleAddProduct}>Add Product</button>
      </section>

      {/* Products List */}
      <section className={styles.productList}>
        <h2>Products</h2>
        {products.length === 0 ? (
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
                <img src={item.image} alt={item.name} className={styles.image} />
                <h3>{item.name}</h3>
                <p>${item.price}</p>

                {/* Delete Button */}
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
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>${order.total}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status === "Pending" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, "Delivered")
                        }
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
