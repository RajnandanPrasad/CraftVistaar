import React from "react";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const reviews = [
    {
      name: t("riya"),
      msg: t("riyaTestimonial"),
    },
    { name: t("amit"), msg: t("amitTestimonial") },
    {
      name: t("sneha"),
      msg: t("snehaTestimonial"),
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
