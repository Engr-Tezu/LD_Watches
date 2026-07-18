"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { SITE_NAME_SHORT } from "@/lib/brand";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ld-black flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 w-72 z-50 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} showClose />
      </div>

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-ld-dark/95 backdrop-blur-md border-b border-ld-grey/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-ld-light hover:text-ld-gold hover:bg-ld-charcoal transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-[family-name:var(--font-display)] font-bold text-white text-sm sm:text-base">
            {SITE_NAME_SHORT} <span className="text-ld-gold">Admin</span>
          </span>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
