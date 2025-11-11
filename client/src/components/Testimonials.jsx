import React from "react";

const Testimonials = () => {
  const reviews = [
    {
      name: "Riya",
      msg: "Beautiful pottery! Fast delivery and amazing quality.",
    },
    { name: "Amit", msg: "Loved the handmade jewelry. Perfect for gifting!" },
    {
      name: "Sneha",
      msg: "CraftKart connects me with authentic Indian crafts ❤️",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-50 via-white to-pink-50 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          💬 What Our Customers Say
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {reviews.map((t) => (
            <div
              key={t.name}
              className="bg-white p-6 rounded-2xl shadow w-72 hover:shadow-lg transition"
            >
              <p className="italic text-gray-600 mb-3">“{t.msg}”</p>
              <h3 className="font-bold text-blue-700">{t.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
