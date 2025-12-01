import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000/api"; // Local backend

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
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

  // Add product with optional image upload
  const addProduct = async (product) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description || "");

      // Append file if uploaded
      if (product.file) {
        formData.append("file", product.file);
      } else if (product.image) {
        // If using a URL instead of file
        formData.append("imageUrl", product.image);
      }

      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        body: formData, // Do NOT set Content-Type for FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      const newProduct = await res.json();

      // Add new product to state instantly
      setProducts((prev) => [newProduct, ...prev]);

      return newProduct; // Return the newly added product
    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Product not found on server");
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete product error:", err);
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
