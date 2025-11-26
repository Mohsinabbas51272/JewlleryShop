import { createContext, useState, useEffect } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders (for admin)
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status (admin)
  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
