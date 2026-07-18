"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Watch, LogOut, X } from "lucide-react";
import { SITE_NAME_SHORT } from "@/lib/brand";
import WatchLogo from "@/components/ui/WatchLogo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/watches", label: "Watches", icon: Watch, exact: false },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  showClose?: boolean;
}

export default function AdminSidebar({ onNavigate, showClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full h-full bg-ld-dark border-r border-ld-grey/50 flex flex-col">
      <div className="p-5 border-b border-ld-grey/50 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <WatchLogo size="admin" />
          <span className="font-[family-name:var(--font-display)] text-base font-bold text-white leading-tight">
            {SITE_NAME_SHORT} <span className="text-ld-gold">Admin</span>
          </span>
        </Link>
        {showClose && (
          <button
            onClick={onNavigate}
            className="lg:hidden p-2 text-ld-silver hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive(item.href, item.exact)
                ? "bg-ld-gold/15 text-ld-gold-light border border-ld-gold/20"
                : "text-ld-light hover:bg-ld-charcoal hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-ld-grey/50 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ld-silver hover:text-ld-gold transition-colors"
        >
          View Site →
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
