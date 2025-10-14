import React from "react";
import { Link } from "react-router-dom";


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // if you also stored user data
  alert("Logged out successfully");
  window.location.href = "/login"; // redirect to login page
};


const products = [
  { id: 1, name: "Handmade Vase", price: 200 },
  { id: 2, name: "Wooden Frame", price: 150 },
  { id: 3, name: "Jute Bag", price: 100 },
];

export default function Products() {
  return (
    <div>
      <h2>Available Products</h2>
      <button onClick={handleLogout}>Logout</button>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ₹{p.price}{" "}
            <Link to={`/buy/${p.id}`}>Buy</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
