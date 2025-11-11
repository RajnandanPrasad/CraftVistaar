import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import heroImg from "../assets/hero-handmade.jpg";
import CategorySection from "../components/CategorySection";
import MeetMakers from "../components/MeetMakers";
import WhyChooseCraftKart from "../components/WhyChooseCraftKart";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import CTASection from "../components/CTASection";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "🧵 How are CraftKart products made?",
      answer:
        "Each product on CraftKart is handcrafted by local artisans using eco-friendly materials and traditional techniques.",
    },
    {
      question: "🚚 How long does delivery take?",
      answer:
        "Most orders are delivered within 5–7 business days. Custom handmade products might take a bit longer to prepare.",
    },
    {
      question: "💳 What payment methods are supported?",
      answer:
        "We accept all major credit/debit cards, UPI, and secure wallet payments.",
    },
    {
      question: "🛒 Can I return or exchange an item?",
      answer:
        "Yes! You can request a return or exchange within 7 days of delivery, provided the product is unused and in original packaging.",
    },
    {
      question: "👨‍🎨 How can I become a seller?",
      answer:
        "You can register as a seller from the 'Become a Seller' page and upload your handmade products for admin approval.",
    },
    {
      question: "⚙️ How does the product approval process work?",
      answer:
        "When a seller uploads a product, it goes for admin review. Once approved, it becomes visible to customers.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const displayedFAQs = showAll ? faqs : faqs.slice(0, 3);

  useEffect(() => {
    const storedProducts = JSON.parse(
      localStorage.getItem("craftkart_products") || "[]"
    );
    setFeaturedProducts(storedProducts.slice(0, 4));
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* 🖼️ Hero Section */}
      <section className="w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-pink-100 via-white to-blue-100 px-6 md:px-12 lg:px-20 py-16 relative overflow-hidden">
        {/* Decorative Background Circles */}
        <div className="absolute top-0 left-0 w-60 h-60 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

        {/* Left Content */}
        <div className="flex flex-col gap-6 max-w-xl text-center md:text-left z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Bring{" "}
            <span className="text-blue-600">Handmade Elegance</span> to Your
            Everyday Life 🧵
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Explore a curated collection of unique handmade crafts — designed
            with passion, made with love. Perfect for home décor, gifts, and
            personal keepsakes.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              🛍️ Shop Now
            </Link>

            <Link
              to="/about"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-transform transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-10 md:mt-0 w-full md:w-1/2 flex justify-center z-10">
          <img
            src={heroImg}
            alt="Handmade Crafts"
            className="rounded-3xl shadow-2xl w-[90%] hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* 🛍️ Featured Products Section */}
      <section className="p-6 md:p-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              ✨ Featured Products
            </h2>
            <p className="text-gray-500 text-lg">
              Handpicked selection of our finest handmade crafts
            </p>
            <div className="mt-2 w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="transform transition-transform hover:scale-105"
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No featured products yet. Add some to your store!
              </p>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* 💬 FAQ Section */}
      <section className="bg-gradient-to-r from-blue-50 via-white to-pink-50 py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🙋‍♀️ Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mb-10 text-lg">
            Find quick answers to common questions about CraftKart products and
            services.
          </p>

          <div className="text-left space-y-4">
            {displayedFAQs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-md p-5 rounded-2xl hover:shadow-lg transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left text-xl font-semibold text-blue-700 focus:outline-none"
                >
                  {faq.question}
                  <span className="text-gray-500 text-2xl">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>

                {activeIndex === index && (
                  <motion.p
                    className="mt-2 text-gray-700 text-base leading-relaxed"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              View All FAQs
            </button>
          )}
        </div>

      </section>
      <CategorySection />
<MeetMakers />
<WhyChooseCraftKart />
<Testimonials />
<Newsletter />
<CTASection />

    </div>
  );
};

export default Home;
