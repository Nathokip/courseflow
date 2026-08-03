"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/courses", label: "Courses", icon: "menu_book" },
  { href: "/admin/students", label: "Students", icon: "groups" },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full z-20"
      style={{
        width: "var(--spacing-sidebar_width)",
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-outline-variant)",
        padding: "20px 12px",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--color-primary-container)" }}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ color: "var(--color-on-primary-container)", fontVariationSettings: "'FILL' 1" }}
          >
            admin_panel_settings
          </span>
        </div>
        <div>
          <p className="text-sm font-bold leading-tight" style={{ color: "var(--color-on-surface)" }}>
            CourseFlow
          </p>
          <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
            Admin Console
          </p>
        </div>
      </div>

      {/* Admin name chip */}
      <div
        className="mx-2 mb-5 px-3 py-2 rounded-lg"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
      >
        <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
          Signed in as
        </p>
        <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: "var(--color-on-surface)" }}>
          {adminName}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={
                active
                  ? {
                      backgroundColor: "var(--color-primary-container)",
                      color: "var(--color-on-primary-container)",
                      fontWeight: 700,
                    }
                  : { color: "var(--color-on-surface-variant)" }
              }
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className="pt-4 flex flex-col gap-1"
        style={{ borderTop: "1px solid var(--color-outline-variant)" }}
      >
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left"
          style={{ color: "var(--color-error)" }}
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
