import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => setCartItems(prev => [...prev, item]);
  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCartItems([]);

  // New helper functions
  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  const checkout = () => clearCart();

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};
