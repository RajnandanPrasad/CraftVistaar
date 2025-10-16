import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
          <Link to="/products" className="text-blue-600 underline mt-4 block">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-green-600">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Total: ₹{totalPrice}</h3>
            <div className="space-x-4">
              <button
                onClick={clearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Clear Cart
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
