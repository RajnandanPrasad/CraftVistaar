import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">CraftKart</h3>
            <p className="text-gray-300 text-sm">
              {t("discoverHandmadeCrafts")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition">{t("home")}</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition">{t("products")}</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400 transition">{t("cart")}</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("account")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-blue-400 transition">{t("login")}</Link></li>
              <li><Link to="/signup" className="hover:text-blue-400 transition">{t("signup")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("contact")}</h4>
            <p className="text-gray-300 text-sm">
              {t("email")}: support@craftkart.com<br />
              {t("phone")}: +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
