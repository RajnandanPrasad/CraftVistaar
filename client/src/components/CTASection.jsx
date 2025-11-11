import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="text-center py-16 bg-gray-900 text-white">
      <h2 className="text-3xl md:text-4xl font-semibold mb-4">
        Ready to Explore Handmade Wonders?
      </h2>
      <div className="flex justify-center gap-4 mt-6">
        <Link
          to="/products"
          className="bg-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Explore Products
        </Link>
        <Link
          to="/signup"
          className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900"
        >
          Become a Seller
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
