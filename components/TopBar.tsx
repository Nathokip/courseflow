"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import { mockStudent } from "@/lib/mock-data";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function TopBar({
  title,
  showSearch = true,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search courses...",
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const currentSearchValue = searchValue ?? internalSearchValue;
  const handleSearchChange = onSearchChange ?? setInternalSearchValue;

  return (
    <header
      className="flex justify-between items-center w-full px-6 py-3 sticky top-0 z-10 shadow-sm"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* Left: Title or Search */}
      <div className="flex items-center gap-4">
        {/* Mobile menu (placeholder) */}
        <button
          className="md:hidden p-2 rounded-full transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Desktop title */}
        {title && (
          <h2
            className="hidden md:block text-xl font-semibold"
            style={{ color: "var(--color-on-surface)" }}
          >
            {title}
          </h2>
        )}

        {/* Search bar */}
        {showSearch && (
          <div
            className="hidden md:flex items-center rounded-full px-4 py-2 gap-2 border transition-all w-72 focus-within:ring-2"
            style={{
              backgroundColor: "var(--color-surface-container-low)",
              borderColor: "var(--color-outline-variant)",
            }}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ color: "var(--color-outline)" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={currentSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm"
              style={{ color: "var(--color-on-surface)" }}
            />
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all"
          style={{ color: "var(--color-on-surface-variant)" }}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-surface-container-high)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          <span className="material-symbols-outlined">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-full relative transition-all"
          style={{ color: "var(--color-on-surface-variant)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-surface-container-high)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          <span className="material-symbols-outlined">notifications</span>
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-error)" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full overflow-hidden border cursor-pointer ml-1 flex items-center justify-center text-sm font-semibold"
          style={{ borderColor: "var(--color-outline-variant)", backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}
        >
          {mockStudent.avatarUrl ? (
            <Image
              src={mockStudent.avatarUrl}
              alt="Student Avatar"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          ) : (
            mockStudent.name.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
}
