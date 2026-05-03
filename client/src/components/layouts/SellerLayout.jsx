import React, { useState } from "react";
import { useUser } from "../../context/useUser";
import SellerSidebar from "../seller/SellerSidebar";
import { Menu, X } from "lucide-react";

export default function SellerLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="md:hidden bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 shadow-sm hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-900">{title || "Seller Panel"}</p>
          <p className="text-xs text-slate-500">Manage your storefront on the go</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
          <span>{user?.name?.split(" ")[0] || "Seller"}</span>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40">
          <div className="w-72 max-w-[80vw] bg-gray-900 text-white p-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-semibold">Seller Panel</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg bg-slate-800 p-2 text-slate-200 hover:bg-slate-700"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SellerSidebar onLinkClick={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-72 flex-col bg-gray-900 text-white border-r border-slate-800">
          <SellerSidebar />
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm px-4 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{title || "Seller Dashboard"}</h1>
                <p className="text-sm text-slate-500 mt-1">Quick access to your products, orders, profile and analytics.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">{user?.name || "Seller"}</div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
