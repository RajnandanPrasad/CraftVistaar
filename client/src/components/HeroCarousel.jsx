import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero-handmade.jpg";
import promo1 from "../assets/product1.jpg";
import promo2 from "../assets/product3.jpg";
import promo3 from "../assets/product5.jpg";

const slides = [
  {
    title: "Elevate your home with premium craft picks",
    subtitle: "Curated collections, fresh launches, and exclusive offers",
    cta: "Shop home favorites",
    image: heroImg,
    label: "Best sellers",
  },
  {
    title: "Gifts for every celebration",
    subtitle: "Discover curated artisan gifts for every budget",
    cta: "Browse gifts",
    image: promo1,
    label: "Gift deals",
  },
  {
    title: "Style your space with designer decor",
    subtitle: "Trending handmade pieces for modern homes",
    cta: "Explore decor",
    image: promo2,
    label: "New arrivals",
  },
  {
    title: "Daily flash offers on artisan crafts",
    subtitle: "Shop limited-time deals on trending handmade favorites",
    cta: "View deals",
    image: promo3,
    label: "Flash sale",
  },
];

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-2xl ring-1 ring-slate-800/70 transition-all duration-300">
      <div className="grid min-h-[520px] gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-6 p-8 sm:p-10 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-200">
            {activeSlide.label}
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {activeSlide.title}
            </h1>
            <p className="max-w-xl text-base text-slate-200 md:text-lg">
              {activeSlide.subtitle}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-300/30 transition hover:bg-amber-300"
            >
              {activeSlide.cta}
            </Link>
            <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-200 shadow-inner shadow-white/5">
              <p className="font-semibold">Crafted for every home</p>
              <p className="mt-1 text-slate-300">Beautiful, made-by-hand finds that feel premium.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-full rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-amber-400" : "bg-slate-600/60 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="h-full w-full object-cover transition duration-700 ease-out"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
