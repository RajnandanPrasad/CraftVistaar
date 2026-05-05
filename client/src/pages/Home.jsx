import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import CenteredCarousel from "../components/CenteredCarousel";
import { fetchProducts } from "../api/products";
import { filterHandmadeProducts, HANDMADE_CATEGORIES } from "../utils/handmadeFilter";
import heroImg from "../assets/hero-handmade.jpg";
import promo1 from "../assets/product1.jpg";
import promo2 from "../assets/product3.jpg";
import promo3 from "../assets/product5.jpg";
import promo4 from "../assets/product2.jpg";
import promo6 from "../assets/product4.jpg";

const fallbackProducts = [
  {
    _id: "hm-1",
    title: "Handwoven Cotton Cushion",
    description: "Soft artisan stitching for cozy living spaces.",
    price: 349,
    category: "Textiles",
    images: [promo4],
    stock: 26,
  },
  {
    _id: "hm-2",
    title: "Wooden Spice Box Set",
    description: "Hand-carved organizer crafted by local artisans.",
    price: 499,
    category: "Wood Crafts",
    images: [promo6],
    stock: 18,
  },
  {
    _id: "hm-3",
    title: "Pottery Tea Cup Duo",
    description: "Glazed matte finish cups with natural textures.",
    price: 299,
    category: "Pottery",
    images: [promo1],
    stock: 14,
  },
  {
    _id: "hm-4",
    title: "Handmade Mirror Frame",
    description: "Decorative wall accent with artisan detailing.",
    price: 799,
    category: "Home Decor",
    images: [promo2],
    stock: 9,
  },
];

const features = [
  { icon: "🧵", title: "Handmade Quality", desc: "Crafted with love" },
  { icon: "🔒", title: "Secure Payment", desc: "100% safe checkout" },
  { icon: "🚚", title: "Fast Delivery", desc: "Quick shipping" },
  { icon: "📞", title: "Customer Support", desc: "24/7 help" },
];

const faqs = [
  {
    question: "Are all products handmade?",
    answer: "Yes, all products are crafted by verified artisans.",
  },
  {
    question: "Do you offer returns?",
    answer: "Yes, easy return policy available.",
  },
  {
    question: "How long is delivery?",
    answer: "Usually 3-7 business days.",
  },
];

const promoCards = [
  {
    title: "Buy 1 Get 1 Ready",
    subtitle: "Limited-time store offers",
    image: promo3,
  },
  {
    title: "Daily Flash Deals",
    subtitle: "Up to 50% off curated crafts",
    image: promo2,
  },
  {
    title: "Under ₹299",
    subtitle: "Affordable handmade favorites",
    image: promo1,
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const productList = await fetchProducts();
        if (!mounted) return;
        const handmadeProducts = filterHandmadeProducts(productList || []);
        setProducts(handmadeProducts.length > 0 ? handmadeProducts : fallbackProducts);
        setCategories(HANDMADE_CATEGORIES);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
        if (!mounted) return;
        setProducts(fallbackProducts);
        setCategories(HANDMADE_CATEGORIES);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const trendingProducts = products.slice(0, 8);
  const bestDeals = [...products]
    .sort((a, b) => (a.price || 0) - (b.price || 0))
    .slice(0, 8);
  const topPicks = products.slice(2, 10);
  const categoryCards = categories.length > 0 ? categories : HANDMADE_CATEGORIES;

  const sectionCards = [
    {
      title: "Trending Handmade",
      subtitle: "Curated artisan favorites with premium, handcrafted style.",
      actionLink: "/products",
      actionText: "Shop trending",
      badge: "Trending",
      products: trendingProducts,
    },
    {
      title: "Best Artisan Picks",
      subtitle: "Top-rated handmade treasures selected for talented creators.",
      actionLink: "/products",
      actionText: "Explore picks",
      badge: "Best Seller",
      products: bestDeals,
    },
    {
      title: "Handmade Deals",
      subtitle: "Exclusive offers on premium craft pieces for everyday elegance.",
      actionLink: "/products",
      actionText: "View offers",
      badge: "Limited Offer",
      products: topPicks,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-gray-50 text-slate-900 min-h-screen">
      <main className="mx-auto max-w-[1400px] px-4 pb-16 md:px-6">
        <div className="mt-6 md:mt-8">
          <CenteredCarousel />
        </div>

        {sectionCards.map((section) => (
          <section key={section.title} className="mt-12 rounded-3xl bg-white/80 backdrop-blur-sm p-8 shadow-2xl border border-white/50">
            <SectionHeader
              title={section.title}
              subtitle={section.subtitle}
              actionText={section.actionText}
              actionLink={section.actionLink}
            />
            <div className="mt-8">
              {loading ? (
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-fr">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                  ))}
                </div>
              ) : section.products.length > 0 ? (
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-fr">
                  {section.products.slice(0, 10).map((product, index) => {
                    const isFeatured = index === 0;
                    return (
                      <div
                        key={product._id || product.id}
                        className={isFeatured ? "col-span-2 row-span-2 lg:col-span-1 lg:row-span-1" : "col-span-1"}
                      >
                        <ProductCard product={product} badge={section.badge} featured={isFeatured} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-3xl bg-gradient-to-r from-slate-100 to-gray-100 text-slate-500 shadow-inner">
                  No products available yet
                </div>
              )}
            </div>
          </section>
        ))}

        <section className="mt-10 rounded-[32px] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-500">Collections</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Browse by category</h2>
            </div>
            <p className="text-sm text-slate-500 max-w-xl">
              Explore popular collections across home decor, gifting, jewellery and more.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCards.map((category, idx) => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden bg-slate-200">
                  <img
                    src={[promo1, promo2, promo3, heroImg, promo1, promo2][idx]}
                    alt={category}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-700">{category}</p>
                  <p className="mt-2 text-sm text-slate-500">Shop unique handmade picks for every style.</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <div className="mt-16 max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Why Choose Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((item) => (
              <div key={item.title} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-white/50 hover:-translate-y-2">
                <div className="text-4xl md:text-5xl mb-4 mx-auto">{item.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Artisan Story Section */}
        <section className="mt-20 max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 shadow-2xl">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Meet Our Artisans</h2>
              <p className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Discover handcrafted products made with passion by skilled artisans across India.
              </p>
              <Link 
                to="/products" 
                className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Explore Stories →
              </Link>
            </div>
            <div className="w-full lg:w-[450px] lg:flex-shrink-0">
              <img 
                src={promo2} 
                alt="Artisan crafting handmade products"
                className="w-full rounded-2xl object-cover shadow-2xl h-[300px] md:h-[400px] lg:h-[450px]" 
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-24 max-w-4xl mx-auto px-4 md:px-6 pb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <button
                  className="w-full text-left p-8 font-semibold text-xl hover:text-orange-600 transition-colors duration-200 flex justify-between items-center group"
                  onClick={() => toggle(i)}
                >
                  <span>{faq.question}</span>
                  <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                    {openIndex === i ? '−' : '+'}
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-8 pb-8 pt-4">
                    <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
