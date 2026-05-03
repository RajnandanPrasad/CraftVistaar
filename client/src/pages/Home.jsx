import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
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

const dealCards = [
  {
    title: "Up to 50% Off",
    subtitle: "Selected craft essentials",
    image: promo1,
    accent: "bg-sky-100",
  },
  {
    title: "Under ₹299",
    subtitle: "Budget gifting made easy",
    image: promo2,
    accent: "bg-amber-100",
  },
  {
    title: "Trending Now",
    subtitle: "Top-rated handmade picks",
    image: promo3,
    accent: "bg-emerald-100",
  },
  {
    title: "New in",
    subtitle: "Fresh craft arrivals",
    image: heroImg,
    accent: "bg-violet-100",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-white pt-0 pb-10">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-sky-100 to-transparent" />
        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 pb-10 md:px-6 lg:grid-cols-3 lg:pb-12">
          <div className="lg:col-span-2 w-full">
            <HeroCarousel />
          </div>

          <div className="flex w-full flex-col gap-4">
            {promoCards.map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[28px] bg-white shadow-lg transition hover:-translate-y-1"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent px-5 py-4 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Limited Offer</p>
                  <h2 className="mt-2 text-xl font-semibold leading-tight">{card.title}</h2>
                  <p className="mt-1 text-sm text-slate-200">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1400px] px-4 pb-16 md:px-6">
        <section className="mt-8 grid gap-4 lg:grid-cols-4">
          {dealCards.map((deal) => (
            <div
              key={deal.title}
              className={`group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${deal.accent}`}
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{deal.subtitle}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{deal.title}</h3>
              </div>
            </div>
          ))}
        </section>

        {sectionCards.map((section) => (
          <section key={section.title} className="mt-10">
            <SectionHeader
              title={section.title}
              subtitle={section.subtitle}
              actionText={section.actionText}
              actionLink={section.actionLink}
            />
            <div className="mt-6">
              {loading ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} className={idx === 0 ? "col-span-2 row-span-2" : "col-span-1"}>
                      <ProductCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : section.products.length > 0 ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {section.products.slice(0, 10).map((product, index) => {
                    const isFeatured = index === 0;
                    return (
                      <div
                        key={product._id || product.id}
                        className={isFeatured ? "col-span-2 row-span-2" : "col-span-1"}
                      >
                        <ProductCard product={product} badge={section.badge} featured={isFeatured} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[28px] bg-white p-6 text-slate-600 shadow-sm">
                  No products available in this section.
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
      </main>
    </div>
  );
};

export default Home;
