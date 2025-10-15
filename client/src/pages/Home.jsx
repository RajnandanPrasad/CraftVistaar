import React from "react";
import Products from "./Products";

const Home = () => {
  return (
    <div className="p-4">
      {/* ✅ Navbar already shown globally, so don’t repeat here */}
      <h1 className="text-2xl font-bold mb-4 text-center">Available Products</h1>
      <Products />
    </div>
  );
};

export default Home;
