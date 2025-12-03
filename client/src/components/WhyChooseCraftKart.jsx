import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const WhyChooseCraftKart = () => {
  const { t } = useTranslation();
  const reasons = [
    {
      title: t("authenticHandcraftedGoods"),
      desc: t("authenticHandcraftedGoodsDesc"),
    },
    {
      title: t("supportLocalArtisans"),
      desc: t("supportLocalArtisansDesc"),
    },
    {
      title: t("ecoFriendlyPackaging"),
      desc: t("ecoFriendlyPackagingDesc"),
    },
  ];

  return (
    <section className="py-16 bg-white px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          💎 Why Choose CraftKart?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reasons.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl shadow hover:shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseCraftKart;
