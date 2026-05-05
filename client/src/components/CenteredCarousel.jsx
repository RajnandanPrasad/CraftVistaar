import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import promo1 from '../assets/product1.jpg';
import promo2 from '../assets/product2.jpg';
import promo3 from '../assets/product3.jpg';
import promo4 from '../assets/product4.jpg';
import promo5 from '../assets/product5.jpg';

const items = [
  { image: promo1, title: "Handmade Bags", category: "Bags & Footwear" },
  { image: promo2, title: "Clay Jewelry", category: "Jewelry & Accessories" },
  { image: promo3, title: "Home Decor", category: "Home & Decor" },
  { image: promo4, title: "Wall Hangings", category: "Art & Collectibles" },
  { image: promo5, title: "Gifts", category: "Handmade Gifts" },
];

const CenteredCarousel = () => {
  const [index, setIndex] = useState(4);
  const intervalRef = useRef(null);
  const isHovered = useRef(false);

  const extendedItems = [
    ...items.slice(-4),
    ...items,
    ...items.slice(0, 4),
  ];

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (!isHovered.current) {
          setIndex(prev => prev + 1);
        }
      }, 4000);
    };

    startInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (index >= items.length + 4) {
      setTimeout(() => {
        setIndex(4);
      }, 300);
    }

    if (index <= 3) {
      setTimeout(() => {
        setIndex(items.length + 3);
      }, 300);
    }
  }, [index, items.length]);

  const handleMouseEnter = () => {
    isHovered.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (!isHovered.current) {
          setIndex(prev => prev + 1);
        }
      }, 4000);
    };
    startInterval();
  };

  const next = () => setIndex(prev => prev + 1);
  const prev = () => setIndex(prev => prev - 1);

  return (
    <section className="py-8 bg-white" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 gap-4 px-2"
              style={{
                transform: `translateX(-${index * (100 / 4)}%)`,
              }}
            >
              {extendedItems.map((item, i) => (
                <div key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2">
                  <Link
                    to={`/category/${encodeURIComponent(item.category || item.title)}`}
                    className="block w-full rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl hover:scale-[1.03] transition-all duration-300 group"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                      <button className="mt-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                        Explore →
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:scale-110 hover:shadow-xl border rounded-full p-3 w-14 h-14 flex items-center justify-center transition-all duration-300 z-20"
            aria-label="Previous"
          >
            ◀
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:scale-110 hover:shadow-xl border rounded-full p-3 w-14 h-14 flex items-center justify-center transition-all duration-300 z-20"
            aria-label="Next"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
};

export default CenteredCarousel;
