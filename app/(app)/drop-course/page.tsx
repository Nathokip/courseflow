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
  colorVariant: string;
}

export default function DropCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pendingDrop, setPendingDrop] = useState<Course | null>(null);
  const [dropped, setDropped] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const normalizedSearch = search.trim().toLowerCase();

  useEffect(() => {
    fetch("/api/courses/droppable")
      .then(async (res) => {
        if (res.ok) setCourses(await res.json());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      !normalizedSearch ||
      course.code.toLowerCase().includes(normalizedSearch) ||
      course.name.toLowerCase().includes(normalizedSearch) ||
      course.instructor.toLowerCase().includes(normalizedSearch) ||
      course.schedule.toLowerCase().includes(normalizedSearch) ||
      course.department.toLowerCase().includes(normalizedSearch)
  );

  function openModal(course: Course) {
    setPendingDrop(course);
  }

  function cancelDrop() {
    setPendingDrop(null);
  }

  async function confirmDrop() {
    if (!pendingDrop) return;
    const res = await fetch("/api/courses/drop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: pendingDrop.id }),
    });
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== pendingDrop.id));
      setDropped((prev) => [...prev, pendingDrop.id]);
    }
    setPendingDrop(null);
  }

  return (
    <>
      <TopBar
        title="Drop Course"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search enrolled courses..."
      />
      <main className="flex-1 p-6 md:p-8 mx-auto w-full relative" style={{ maxWidth: "var(--spacing-container_max)" }}>
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--color-primary)" }}>Manage Enrollments</p>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--color-on-surface)" }}>Drop Course</h1>
          <p className="text-lg" style={{ color: "var(--color-on-surface-variant)" }}>
            Select an active enrollment below to initiate the drop procedure. Please be aware that dropping courses mid-semester may affect your academic standing. Proceed with caution.
          </p>
        </div>

        {dropped.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
            style={{ backgroundColor: "var(--color-tertiary-fixed)", color: "var(--color-on-tertiary-fixed)" }}>
            <span className="material-symbols-outlined">check_circle</span>
            <span className="text-sm font-medium">{dropped.length} course{dropped.length > 1 ? "s" : ""} successfully dropped.</span>
          </div>
        )}

        {loading ? (
          <p style={{ color: "var(--color-on-surface-variant)" }}>Loading...</p>
        ) : courses.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined text-6xl opacity-30 block mb-3">check_circle</span>
            <p className="text-lg font-medium">No enrolled courses to drop.</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined text-6xl opacity-30 block mb-3">search_off</span>
            <p className="text-lg font-medium">No matching courses found</p>
            <p className="text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="rounded-xl p-6 flex flex-col relative overflow-hidden group transition-shadow card-shadow hover:card-shadow-md"
                style={{ backgroundColor: "var(--color-surface-container-lowest)", borderTop: "4px solid var(--color-error)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-error-container) 10%, transparent), transparent)" }} />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold mb-2"
                      style={{ backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface)" }}>{course.code}</span>
                    <h3 className="text-xl font-semibold leading-tight" style={{ color: "var(--color-on-surface)" }}>{course.name}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-error-container)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--color-error)", fontVariationSettings: "'FILL' 1" }}>warning</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 relative z-10">
                  {[
                    { icon: "person", value: course.instructor },
                    { icon: "schedule", value: course.schedule },
                    { icon: "credit_score", value: `${course.credits} Credits` },
                  ].map((row) => (
                    <p key={row.icon} className="flex items-center gap-1 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                      <span className="material-symbols-outlined text-[18px]">{row.icon}</span>
                      {row.value}
                    </p>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t relative z-10" style={{ borderColor: "var(--color-surface-variant)" }}>
                  <button onClick={() => openModal(course)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-all"
                    style={{ borderColor: "var(--color-error)", color: "var(--color-error)", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-error)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-on-error)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)"; }}>
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                    Drop Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {pendingDrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-lg rounded-2xl p-8 flex flex-col relative" style={{ backgroundColor: "var(--color-surface-container-lowest)", boxShadow: "0px 10px 15px -3px rgba(15,23,42,0.1), 0px 4px 6px -2px rgba(15,23,42,0.05)" }}>
            <button onClick={cancelDrop} className="absolute top-4 right-4 p-2 rounded-full transition-colors" style={{ color: "var(--color-outline)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-surface-container-low)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-error-container)" }}>
                <span className="material-symbols-outlined text-[28px]" style={{ color: "var(--color-error)", fontVariationSettings: "'FILL' 1" }}>error</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>Confirm Drop Action</h2>
                <p className="text-sm font-medium" style={{ color: "var(--color-error)" }}>Critical Action Required</p>
              </div>
            </div>

            <div className="rounded-lg p-4 mb-4 border" style={{ backgroundColor: "var(--color-surface-container)", borderColor: "var(--color-error-container)" }}>
              <p className="text-sm mb-1" style={{ color: "var(--color-on-surface)" }}>You are about to permanently drop the following course:</p>
              <p className="text-lg font-bold" style={{ color: "var(--color-on-surface)" }}>{pendingDrop.name} ({pendingDrop.code})</p>
            </div>

            <p className="text-base mb-8" style={{ color: "var(--color-on-surface-variant)" }}>
              Dropping this course will remove <strong style={{ color: "var(--color-on-surface)" }}>{pendingDrop.credits} credits</strong> from your current semester total. This action cannot be undone and may drop you below the full-time enrollment requirement.
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={cancelDrop} className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "transparent", color: "var(--color-on-surface-variant)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-surface-container-high)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                Cancel \u2014 Keep Course
              </button>
              <button onClick={confirmDrop} className="px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-opacity"
                style={{ backgroundColor: "var(--color-error)", color: "var(--color-on-error)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                Yes, Drop Course
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
