"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/available-courses", label: "Available Courses", icon: "list_alt" },
  { href: "/register-courses", label: "Register Courses", icon: "app_registration" },
  { href: "/my-courses", label: "My Courses", icon: "school" },
  { href: "/drop-course", label: "Drop Course", icon: "delete_sweep" },
  { href: "/profile", label: "Profile", icon: "person" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full z-20 shadow-sm"
      style={{
        width: "var(--spacing-sidebar_width)",
        backgroundColor: "var(--color-surface)",
        padding: "var(--spacing-md)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 px-2 pt-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--color-primary-container)" }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: "var(--color-on-primary-container)",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            school
          </span>
        </div>
        <div>
          <h1
            className="text-xl font-bold leading-tight"
            style={{ color: "var(--color-primary)" }}
          >
            CourseFlow
          </h1>
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Academic Portal
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out"
              style={
                isActive
                  ? {
                      color: "var(--color-secondary)",
                      backgroundColor: "var(--color-surface-container-low)",
                      borderLeft: "4px solid var(--color-secondary)",
                      fontWeight: "700",
                    }
                  : {
                      color: "var(--color-on-surface-variant)",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-primary)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--color-surface-container-low)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-on-surface-variant)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "transparent";
                }
              }}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="mt-auto pt-4"
        style={{ borderTop: "1px solid var(--color-surface-variant)" }}
      >
        <Link
          href="/login"
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ color: "var(--color-on-surface-variant)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color =
              "var(--color-error)";
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "var(--color-error-container)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color =
              "var(--color-on-surface-variant)";
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "transparent";
          }}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ color: "var(--color-error)" }}
          >
            logout
          </span>
          Logout
        </Link>
      </div>
    </aside>
  );
}
