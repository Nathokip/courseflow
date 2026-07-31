"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  instructor: string;
  schedule: string;
  department: string;
  semester: string;
  enrolled: number;
  capacity: number;
  colorVariant: "primary" | "secondary" | "tertiary" | "error";
}

const semesterFilters = ["All Semesters", "Semester 1", "Semester 2"];

const departmentFilters = [
  "All Departments",
  "Computer Science",
  "Software Engineering",
  "Mathematics",
  "Physics",
];

const colorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: "var(--color-primary-fixed)", text: "var(--color-on-primary-fixed)" },
  secondary: { bg: "var(--color-secondary-fixed)", text: "var(--color-on-secondary-fixed)" },
  tertiary: { bg: "var(--color-tertiary-fixed)", text: "var(--color-on-tertiary-fixed)" },
  error: { bg: "var(--color-error-container)", text: "var(--color-on-error-container)" },
};

export default function AvailableCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeSemesterFilter, setActiveSemesterFilter] = useState("All Semesters");
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState("All Departments");
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

  useEffect(() => {
    fetch("/api/courses/available")
      .then(async (res) => {
        if (res.ok) setCourses(await res.json());
      })
      .catch(() => {});
  }, []);

  const filtered = courses.filter((c) => {
    const matchSemester =
      activeSemesterFilter === "All Semesters" ||
      (activeSemesterFilter === "Semester 1" ? c.semester === "Sem 1" : false) ||
      (activeSemesterFilter === "Semester 2" ? c.semester === "Sem 2" : false);
    const matchDepartment =
      activeDepartmentFilter === "All Departments" ||
      activeDepartmentFilter === c.department;
    const matchSearch =
      !normalizedSearch ||
      c.name.toLowerCase().includes(normalizedSearch) ||
      c.code.toLowerCase().includes(normalizedSearch) ||
      c.instructor.toLowerCase().includes(normalizedSearch);
    return matchSemester && matchDepartment && matchSearch;
  });

  return (
    <>
      <TopBar
        title="Available Courses"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search available courses..."
      />
      <main className="flex-1 p-6 md:p-8 mx-auto w-full" style={{ maxWidth: "var(--spacing-container_max)" }}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--color-on-surface)" }}>Browse Courses</h2>
          <p className="text-base" style={{ color: "var(--color-on-surface-variant)" }}>Explore and register for available classes for the upcoming semesters.</p>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-on-surface-variant)" }}>
              Semester
            </p>
            <div className="flex flex-wrap gap-2">
              {semesterFilters.map((semester) => {
                const active = semester === activeSemesterFilter;
                return (
                  <button
                    key={semester}
                    onClick={() => setActiveSemesterFilter(semester)}
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
                    {active && <span className="material-symbols-outlined text-[14px] mr-1 align-middle">check</span>}
                    {semester}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-on-surface-variant)" }}>
              Department
            </p>
            <div className="flex flex-wrap gap-2">
              {departmentFilters.map((department) => {
                const active = department === activeDepartmentFilter;
                return (
                  <button
                    key={department}
                    onClick={() => setActiveDepartmentFilter(department)}
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
                    {active && <span className="material-symbols-outlined text-[14px] mr-1 align-middle">check</span>}
                    {department}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined text-6xl opacity-30 block mb-2">search_off</span>
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const isFull = course.enrolled >= course.capacity;
              const colors = colorMap[course.colorVariant];
              return (
                <div key={course.id} className="rounded-xl p-6 flex flex-col card-shadow transition-shadow hover:card-shadow-md"
                  style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>{course.code}</span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)" }}>{course.semester}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--color-on-surface)" }}>{course.name}</h3>
                  <p className="text-sm flex-1 mb-4" style={{ color: "var(--color-on-surface-variant)" }}>{course.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                      <span className="material-symbols-outlined text-[16px]">schedule</span>{course.credits} Credits
                    </div>
                    <div className="flex items-center gap-1 text-sm" style={{ color: isFull ? "var(--color-error)" : "var(--color-on-surface-variant)" }}>
                      <span className="material-symbols-outlined text-[16px]">group</span>
                      {course.enrolled}/{course.capacity}{isFull && " (Full)"}
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-lg text-sm font-medium transition-all border"
                    style={isFull ? { backgroundColor: "transparent", color: "var(--color-outline)", borderColor: "var(--color-outline)", opacity: 0.5, cursor: "not-allowed" } : { backgroundColor: "var(--color-surface-container-low)", color: "var(--color-primary)", borderColor: "var(--color-primary)" }}
                    onMouseEnter={(e) => { if (!isFull) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-on-primary)"; } }}
                    onMouseLeave={(e) => { if (!isFull) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-surface-container-low)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-primary)"; } }}
                    disabled={isFull}>
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
