"use client";

import TopBar from "@/components/TopBar";
import { registeredCourses, mockStudent } from "@/lib/mock-data";

const colorMap = {
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

export default function MyCoursesPage() {
  const totalCredits = registeredCourses.reduce((s, c) => s + c.credits, 0);

  return (
    <>
      <TopBar title="My Courses" />
      <main
        className="flex-1 p-6 md:p-8 mx-auto w-full"
        style={{ maxWidth: "var(--spacing-container_max)" }}
      >
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ color: "var(--color-on-surface)" }}
            >
              My Registered Courses
            </h1>
            <p className="text-base" style={{ color: "var(--color-on-surface-variant)" }}>
              View and manage your current academic enrollment.
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg border self-start md:self-auto"
            style={{
              backgroundColor: "var(--color-surface-container-low)",
              borderColor: "var(--color-surface-variant)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--color-tertiary)" }}
            >
              info
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--color-on-surface)" }}>
              Total Credits:{" "}
              <strong style={{ color: "var(--color-tertiary)" }}>
                {totalCredits}
              </strong>{" "}
              / {mockStudent.creditLimit}
            </span>
          </div>
        </div>

        {/* Course Grid */}
        {registeredCourses.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <span className="material-symbols-outlined text-6xl opacity-30 block mb-3">
              school
            </span>
            <p className="text-lg font-medium">No courses registered yet.</p>
            <p className="text-sm mt-1">
              Head to Register Courses to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {registeredCourses.map((course) => {
              const colors = colorMap[course.colorVariant];

              return (
                <div
                  key={course.id}
                  className="rounded-xl p-6 flex flex-col card-shadow border transition-all duration-300"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "var(--color-surface-variant)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "transparent";
                  }}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {course.code}
                      </span>
                      <h3
                        className="text-lg font-semibold mt-2"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {course.name}
                      </h3>
                    </div>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full shrink-0 ml-2"
                      style={{
                        backgroundColor: "var(--color-tertiary-fixed)",
                        color: "var(--color-on-tertiary-fixed)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--color-tertiary)" }}
                      />
                      Registered
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm flex-1 mb-4 line-clamp-2"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {course.description}
                  </p>

                  {/* Details */}
                  <div className="flex flex-col gap-2 mt-auto mb-4">
                    {[
                      { label: "Credits", value: `${course.credits}.0` },
                      {
                        label: "Registered On",
                        value: course.registeredOn ?? "—",
                      },
                      { label: "Instructor", value: course.instructor },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between items-center py-1.5 border-b last:border-none"
                        style={{
                          borderColor:
                            "var(--color-surface-container-highest)",
                        }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-outline)" }}
                        >
                          {row.label}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--color-on-surface)" }}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className="mt-2 pt-4 border-t"
                    style={{ borderColor: "var(--color-surface-container-high)" }}
                  >
                    <button
                      className="w-full border py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "var(--color-primary-fixed)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--color-on-primary-fixed)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--color-primary)";
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
