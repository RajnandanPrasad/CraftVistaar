import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { learnData } from "../../data/learnData";
import SellerSidebar from "../../components/seller/SellerSidebar";

export default function LearnVideos() {
  const { t } = useTranslation();
  const { categoryId } = useParams();

  const category = learnData.categories.find(cat => cat.id === categoryId);

  if (!category) {
    return (
      <div className="flex">
        <SellerSidebar />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Category not found</h1>
          <Link to="/seller/learn" className="text-blue-600 hover:underline">
            {t("learn.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link to="/seller/learn" className="text-blue-600 hover:underline mb-4 inline-block">
            ← {t("learn.back")}
          </Link>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{video.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">{video.level}</span>
                </div>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center block"
                >
                  {t("learn.watch")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
