"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import { availableCourses, Course } from "@/lib/mock-data";

const departments = [
  "All Courses",
  "Semester 1",
  "Semester 2",
  "Computer Science",
  "Software Engineering",
  "Mathematics",
  "Physics",
];

const colorMap: Record<Course["colorVariant"], { bg: string; text: string }> = {
  primary: {
    bg: "var(--color-primary-fixed)",
    text: "var(--color-on-primary-fixed)",
  },
  secondary: {
    bg: "var(--color-secondary-fixed)",
    text: "var(--color-on-secondary-fixed)",
  },
  tertiary: {
    bg: "var(--color-tertiary-fixed)",
    text: "var(--color-on-tertiary-fixed)",
  },
  error: {
    bg: "var(--color-error-container)",
    text: "var(--color-on-error-container)",
  },
};

export default function AvailableCoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All Courses");
  const [search, setSearch] = useState("");

  const filtered = availableCourses.filter((c) => {
    const matchFilter =
      activeFilter === "All Courses" ||
      activeFilter === c.semester ||
      activeFilter === c.department;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <TopBar title="Available Courses" />
      <main
        className="flex-1 p-6 md:p-8 mx-auto w-full"
        style={{ maxWidth: "var(--spacing-container_max)" }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--color-on-surface)" }}
          >
            Browse Courses
          </h2>
          <p className="text-base" style={{ color: "var(--color-on-surface-variant)" }}>
            Explore and register for available classes for the upcoming semesters.
          </p>
        </div>

        {/* Search (mobile) */}
        <div
          className="flex md:hidden items-center rounded-full px-4 py-2 gap-2 border mb-4"
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
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-sm"
            style={{ color: "var(--color-on-surface)" }}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {departments.map((dep) => {
            const active = dep === activeFilter;
            return (
              <button
                key={dep}
                onClick={() => setActiveFilter(dep)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  active
                    ? {
                        backgroundColor: "var(--color-primary-container)",
                        color: "var(--color-on-primary-container)",
                        border: "1px solid var(--color-primary)",
                      }
                    : {
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-on-surface-variant)",
                        border: "1px solid var(--color-outline-variant)",
                      }
                }
              >
                {active && (
                  <span className="material-symbols-outlined text-[14px] mr-1 align-middle">
                    check
                  </span>
                )}
                {dep}
              </button>
            );
          })}
        </div>

        {/* Course Grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <span
              className="material-symbols-outlined text-6xl opacity-30 block mb-2"
            >
              search_off
            </span>
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const isFull = course.enrolled >= course.capacity;
              const colors = colorMap[course.colorVariant];

              return (
                <div
                  key={course.id}
                  className="rounded-xl p-6 flex flex-col card-shadow transition-shadow hover:card-shadow-md"
                  style={{
                    backgroundColor: "var(--color-surface-container-lowest)",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className="px-2 py-1 rounded-md text-xs font-semibold"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {course.code}
                    </span>
                    <span
                      className="px-2 py-1 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: "var(--color-surface-container)",
                        color: "var(--color-on-surface-variant)",
                      }}
                    >
                      {course.semester}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    {course.name}
                  </h3>
                  <p
                    className="text-sm flex-1 mb-4"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="flex items-center gap-1 text-sm"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      {course.credits} Credits
                    </div>
                    <div
                      className="flex items-center gap-1 text-sm"
                      style={{
                        color: isFull
                          ? "var(--color-error)"
                          : "var(--color-on-surface-variant)",
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        group
                      </span>
                      {course.enrolled}/{course.capacity}
                      {isFull && " (Full)"}
                    </div>
                  </div>

                  <button
                    className="w-full py-2 rounded-lg text-sm font-medium transition-all border"
                    style={
                      isFull
                        ? {
                            backgroundColor: "transparent",
                            color: "var(--color-outline)",
                            borderColor: "var(--color-outline)",
                            opacity: 0.5,
                            cursor: "not-allowed",
                          }
                        : {
                            backgroundColor: "var(--color-surface-container-low)",
                            color: "var(--color-primary)",
                            borderColor: "var(--color-primary)",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isFull) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "var(--color-primary)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--color-on-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isFull) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "var(--color-surface-container-low)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--color-primary)";
                      }
                    }}
                    disabled={isFull}
                  >
                    {isFull ? "Waitlist" : "View Details"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
