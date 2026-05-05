import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero-handmade.jpg";
import promo1 from "../assets/product1.jpg";
import promo2 from "../assets/product3.jpg";
import promo3 from "../assets/product5.jpg";

const slides = [
  {
    title: "Discover Premium Handmade Crafts",
    subtitle: "Curated artisan collections for your home and gifts",
    cta: "Shop Now",
    image: heroImg,
  },
  {
    title: "Perfect Gifts for Every Occasion",
    subtitle: "Unique handmade pieces with personal touch",
    cta: "Browse Gifts",
    image: promo1,
  },
  {
    title: "Elevate Your Home Decor",
    subtitle: "Artisan crafted decor for modern living",
    cta: "Explore Decor",
    image: promo2,
  },
  {
    title: "Limited Time Artisan Deals",
    subtitle: "Fresh handmade arrivals just for you",
    cta: "View Deals",
    image: promo3,
  },
];

const NewHeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-beige-50 via-amber-50 to-yellow-50 border border-beige-200/50">
      <div className="grid h-[180px] md:h-[220px] lg:h-[280px] grid-cols-1 lg:grid-cols-2 items-stretch">
        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10 gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {activeSlide.title}
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {activeSlide.subtitle}
          </p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            {activeSlide.cta}
          </Link>
        </div>
        <div className="relative flex items-center justify-center p-4 md:p-6 lg:p-8">
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="h-[140px] md:h-[180px] lg:h-[220px] w-auto max-w-full object-contain rounded-xl shadow-lg ring-1 ring-white/50"
          />
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-6 md:w-8 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-amber-500 scale-125 shadow-lg"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewHeroCarousel;
