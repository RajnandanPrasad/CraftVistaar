import { useRef } from "react";

export default function SectionSlider({ children, sectionId }) {
  const sliderRef = useRef(null);

  const scrollBy = (direction) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction * sliderRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:hidden">
        {children}
      </div>

      <div className="relative hidden lg:block">
        <div
          ref={sliderRef}
          className="scrollbar-none flex gap-4 overflow-x-auto pb-2 pt-2 pr-4 scroll-smooth snap-x snap-mandatory"
        >
          {children}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="group absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white lg:flex"
          aria-label={`Scroll ${sectionId} left`}
        >
          <span className="text-xl font-semibold text-slate-700">‹</span>
        </button>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="group absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white lg:flex"
          aria-label={`Scroll ${sectionId} right`}
        >
          <span className="text-xl font-semibold text-slate-700">›</span>
        </button>
      </div>
    </div>
  );
}
