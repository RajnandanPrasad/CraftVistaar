import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const banners = [
  {
    title: "Handmade Bags",
    category: "Bags & Footwear",
    bg: "from-indigo-500 to-purple-500"
  },
  {
    title: "Clay Jewelry",
    category: "Jewelry & Accessories",
    bg: "from-orange-500 to-amber-500"
  },
  {
    title: "Home Decor",
    category: "Home & Decor",
    bg: "from-green-500 to-emerald-500"
  },
  {
    title: "Wall Hangings",
    category: "Art & Collectibles",
    bg: "from-blue-500 to-sky-500"
  },
  {
    title: "Gifts",
    category: "Handmade Gifts",
    bg: "from-pink-500 to-rose-500"
  },
  {
    title: "Kitchen Crafts",
    category: "Kitchen & Dining",
    bg: "from-yellow-500 to-amber-500"
  },
  {
    title: "Textiles",
    category: "Clothing & Textiles",
    bg: "from-violet-500 to-purple-500"
  },
  {
    title: "Handmade Toys",
    category: "Toys & Baby",
    bg: "from-teal-500 to-cyan-500"
  }
];

const BannerCarousel = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <section className="bg-[#f1f3f6] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Featured Handmade Crafts
        </h2>
        
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6 snap-x snap-mandatory"
          >
            {banners.map((banner, index) => (
              <Link
                key={index}
                to={`/category/${encodeURIComponent(banner.category)}`}
                className="min-w-[250px] md:min-w-[280px] flex-shrink-0 cursor-pointer group"
              >
                <div className={`h-[200px] w-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative bg-gradient-to-br from-${banner.bg}/10 to-${banner.bg}/20`}>
                  <img
                    src={`https://images.unsplash.com/photo-1558618047-3c8c76ca2338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80`}
                    alt={banner.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="block bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 shadow-lg">
                      {banner.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-xl border rounded-2xl p-3 w-14 h-14 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-300 z-20 -translate-x-6 lg:-translate-x-8"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-xl border rounded-2xl p-3 w-14 h-14 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-300 z-20 translate-x-6 lg:translate-x-8"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BannerCarousel;
