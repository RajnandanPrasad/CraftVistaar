import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { learnData } from "../../data/learnData";
import SellerSidebar from "../../components/seller/SellerSidebar";

export default function LearnPage() {
  const { t } = useTranslation();

  return (
    <div className="flex">
      <SellerSidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("learn.title")}</h1>
          <p className="text-gray-600">{t("learn.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learnData.categories.map((category) => (
            <Link
              key={category.id}
              to={`/seller/learn/${category.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
              <div className="mt-4 text-blue-600 font-medium">
                View Tutorials →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
