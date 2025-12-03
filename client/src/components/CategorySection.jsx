import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CategorySection = () => {
  const { t } = useTranslation();
  const categories = [
  { name: t("pottery"), img: "https://imgs.search.brave.com/l82D086_Ply30MUaWSUjcUMrFOf5AMICcVz0tz9N3yw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQx/Mzc0NDk5Ni9waG90/by9wb3R0ZXJ5LW1h/a2VyLWFydGlzdC1v/ci1kZXNpZ25lci1t/b2xkaW5nLWFuZC1i/dWlsZGluZy1hbi1v/YmplY3Qtd2l0aC1j/bGF5LWF0LWEtZmFj/dG9yeS1zdHVkaW8u/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PWQ3b1JrY2RUQS05/TEZPZ3RFMEY2UzBN/dzJraFRtR1lKdGZ3/ZTR3WDgwN2c9" },
  { name: t("jewelry"), img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3" },
  { name: t("textiles"), img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246" },
  { name: t("homeDecor"), img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          🧶 {t("shopByCategory")}
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          {t("exploreVarietyCrafts")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              to={`/products?category=${cat.name.toLowerCase()}`}
              key={cat.name}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform hover:scale-105"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="h-48 w-full object-cover"
              />
              <h3 className="py-4 text-lg font-semibold text-blue-700">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
