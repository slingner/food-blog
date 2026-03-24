"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  LogOut,
  ChefHat,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--admin-border)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--admin-accent)]">
          <ChefHat className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--admin-text)] tracking-tight">
            Food Blog
          </p>
          <p className="text-[11px] text-[var(--admin-text-muted)] uppercase tracking-widest">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--admin-accent)]/10 text-[var(--admin-accent)]"
                  : "text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)]"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {item.label === "Reviews" && (
                <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--admin-accent)]/15 text-[var(--admin-accent)] text-[11px] font-semibold">
                  !
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--admin-border)]">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface-raised)] transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[var(--z-sticky)] flex items-center justify-between h-14 px-4 bg-[var(--admin-surface)] border-b border-[var(--admin-border)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--admin-accent)]">
            <ChefHat className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[var(--admin-text)]">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center w-9 h-9 rounded-md text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-raised)] transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[var(--z-overlay)] bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-[var(--z-modal)] w-64 bg-[var(--admin-surface)] flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onClick={() => setMobileOpen(false)}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-[var(--admin-surface)] border-r border-[var(--admin-border)]">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
