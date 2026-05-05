import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import promo1 from '../assets/product1.jpg';
import promo2 from '../assets/product2.jpg';
import promo3 from '../assets/product3.jpg';
import promo4 from '../assets/product4.jpg';
import promo5 from '../assets/product5.jpg';
import promo6 from '../assets/product6.jpg';

const banners = [
  { image: promo1, title: "Handmade Bags", category: "Bags & Footwear" },
  { image: promo2, title: "Clay Jewelry", category: "Jewelry & Accessories" },
  { image: promo3, title: "Home Decor", category: "Home & Decor" },
  { image: promo4, title: "Wall Hangings", category: "Art & Collectibles" },
  { image: promo5, title: "Gifts", category: "Handmade Gifts" },
  { image: promo6, title: "Kitchen Crafts", category: "Kitchen & Dining" },
];

const DealBanners = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Handmade Crafts
          </h2>
        </div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-6 -mb-6"
          >
            {banners.map((banner, index) => (
              <Link
                key={index}
                to={`/category/${encodeURIComponent(banner.category)}`}
                className="flex-shrink-0 w-80 hover:scale-[1.02] transition-transform duration-300 group cursor-pointer"
              >
                <div className="h-[180px] w-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl bg-white">
                  <img 
                    src={banner.image}
                    alt={banner.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-sm font-semibold text-gray-900 shadow-lg">
                      {banner.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 shadow-xl border rounded-2xl p-4 w-16 h-16 flex items-center justify-center opacity-90 hover:opacity-100 transition-all z-10 -translate-x-6"
            aria-label="Scroll Left"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 shadow-xl border rounded-2xl p-4 w-16 h-16 flex items-center justify-center opacity-90 hover:opacity-100 transition-all z-10 translate-x-6"
            aria-label="Scroll Right"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default DealBanners;

