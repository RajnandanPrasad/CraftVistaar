import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HANDMADE_CATEGORIES } from "../utils/handmadeFilter";

const CategoryBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeCategory = location.pathname.startsWith("/category/")
    ? decodeURIComponent(location.pathname.replace("/category/", "")).trim()
    : null;

  return (
    <div className="w-full bg-white border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        <div
          className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {HANDMADE_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-semibold transition duration-200 whitespace-nowrap ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
