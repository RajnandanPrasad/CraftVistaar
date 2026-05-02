import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("craftkart_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("craftkart_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add product to cart
const addToCart = (product) => {
  setCartItems((prev) => {
    const existing = prev.find(
      (item) => item._id === product._id || item.id === product._id
    );

    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error(`Only ${product.stock} items available`);
        return prev;
      }

      toast.success(`${product.title} added to cart`); // ✅ here

      return prev.map((item) =>
        item._id === product._id || item.id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    // ✅ New product
    toast.success(`${product.title} added to cart`);

    return [
      ...prev,
      {
        ...product,
        id: product._id,
        _id: product._id,
        quantity: 1,
      },
    ];
  });
};

  // ✅ Update quantity of a product
const updateQuantity = (id, quantity) => {
  setCartItems((prev) =>
    prev.map((item) => {
      if (item.id === id || item._id === id) {

        // 🔴 Block exceeding stock
        if (quantity > item.stock) {
          toast.error(`Only ${item.stock} available`);
          return item; // keep old value
        }

        // 🔴 Remove properly (without null)
        if (quantity <= 0) {
          return { ...item, quantity: 0 };
        }

        return { ...item, quantity };
      }
      return item;
    }).filter(item => item.quantity > 0) // remove safely
  );
};

  // ✅ Remove product from cart
const removeFromCart = (id) => {
  setCartItems((prev) =>
    prev.filter((item) => item.id !== id && item._id !== id)
  );
};

  // ✅ Clear all items
  const clearCart = () => setCartItems([]);

  // ✅ Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // ✅ Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
