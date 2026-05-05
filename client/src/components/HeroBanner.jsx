import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import promo1 from '../assets/product1.jpg';
import promo2 from '../assets/product2.jpg';
import promo3 from '../assets/product3.jpg';
import promo4 from '../assets/product4.jpg';
import promo5 from '../assets/product5.jpg';
import promo6 from '../assets/product6.jpg';

const banners = [
  {
    title: "Handmade Gifts Sale",
    subtitle: "Up to 50% off on unique artisan gifts",
    cta: "Shop Gifts Now",
    image: promo1,
    link: "/products"
  },
  {
    title: "Trending Handmade Crafts",
    subtitle: "Discover the most loved artisan creations",
    cta: "Explore Trending",
    image: promo2,
    link: "/products"
  },
  {
    title: "Festive Handmade Collection",
    subtitle: "Perfect gifts for every celebration",
    cta: "Shop Festive",
    image: promo3,
    link: "/products"
  },
  {
    title: "Home Decor Essentials",
    subtitle: "Elevate your space with artisan crafts",
    cta: "View Home Decor",
    image: promo4,
    link: "/products"
  },
  {
    title: "Kitchen & Dining",
    subtitle: "Handcrafted pieces for everyday use",
    cta: "Shop Kitchen",
    image: promo5,
    link: "/products"
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh handmade treasures just in",
    cta: "See New Arrivals",
    image: promo6,
    link: "/products"
  }
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-slate-50 to-gray-50">
      <div className={`h-[220px] md:h-[280px] lg:h-[320px] flex items-center px-6 md:px-12 lg:px-20`}>
        {/* Left Text */}
        <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
            {currentBanner.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
            {currentBanner.subtitle}
          </p>
          <Link
            to={currentBanner.link}
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            {currentBanner.cta} →
          </Link>
        </div>

        {/* Right Image */}
        <div className="hidden lg:block w-1/2 h-full relative">
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="h-full w-full object-cover rounded-2xl shadow-2xl absolute inset-0"
          />
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-600 scale-125 shadow-lg'
                : 'bg-white/60 hover:bg-white shadow-md'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

