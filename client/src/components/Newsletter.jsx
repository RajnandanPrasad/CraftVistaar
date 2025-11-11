import React from "react";

const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-100 to-blue-100 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        ✉️ Stay Updated!
      </h2>
      <p className="text-gray-600 mb-6 text-lg">
        Subscribe for exclusive offers, artisan stories, and new craft arrivals.
      </p>
      <div className="flex justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 w-72 rounded-l-lg border border-gray-300"
        />
        <button
          onClick={() => alert('Thank you for subscribing!')}
          className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700"
        >
          Subscribe
        </button>
      </div>
    </section>
  );
};

export default Newsletter;
