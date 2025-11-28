import { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://backend-qnfdn1gj1-maarjojo99-makers-projects.vercel.app/api/orders"
      );

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order
  const updateOrderStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text:
        newStatus === "Delivered"
          ? "This will mark the order as delivered and remove it."
          : `Change status to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `https://backend-qnfdn1gj1-maarjojo99-makers-projects.vercel.app/api/orders/${Number(
          id
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      if (newStatus === "Delivered") {
        await deleteOrder(id);
        toast.success("Order delivered & removed!");
      } else {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === Number(id) ? { ...o, status: newStatus } : o
          )
        );
        toast.success(`Order updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating order");
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      const res = await fetch(
        `https://backend-qnfdn1gj1-maarjojo99-makers-projects.vercel.app/api/orders/${Number(
          id
        )}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        if (res.status === 404) throw new Error("Order not found");
        throw new Error("Failed to delete order");
      }

      setOrders((prev) => prev.filter((o) => o.id !== Number(id)));
      toast.success("Order deleted!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
