import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // all products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Fetch all products from backend ---
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data); // REPLACE instead of appending to prevent duplicates
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Add product (Admin) ---
  const addProduct = async (product) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);

      if (product.file) {
        formData.append("file", product.file);
      } else if (product.image) {
        formData.append("imageUrl", product.image);
      }

      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      // After successful add, refetch all products from backend
      await fetchProducts();

    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Delete product (Admin) ---
  const deleteProduct = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Product not found on server");
        throw new Error("Failed to delete product");
      }

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== id));

    } catch (err) {
      console.error(`Error deleting product with id ${id}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
