import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product (Admin)
  const addProduct = async (product) => {
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete product (Admin)
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      // Remove from context state
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(`Error deleting product with id ${id}:`, err);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
