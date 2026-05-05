import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductCarousel = ({ title = "Featured Crafts", products = [], className = "" }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className={`bg-[#f1f3f6] py-8 px-4 md:px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.slice(0, 12).map((product) => (
              <div 
                key={product._id || product.id}
                className="min-w-[200px] md:min-w-[220px] flex-shrink-0 snap-center"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/90 hover:bg-white shadow-lg border rounded-full p-2 w-12 h-12 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 z-10"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/90 hover:bg-white shadow-lg border rounded-full p-2 w-12 h-12 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-200 z-10"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;

