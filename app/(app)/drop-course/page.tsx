"use client";

import { useEffect, useState, useCallback } from "react";
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
  year: number;
  enrolled: number;
  capacity: number;
  colorVariant: string;
}

type DropState =
  | { status: "idle" }
  | { status: "confirming"; course: Course }
  | { status: "dropping"; course: Course }
  | { status: "error"; course: Course; message: string };

export default function DropCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [droppedCount, setDroppedCount] = useState(0);
  const [search, setSearch] = useState("");
  const [dropState, setDropState] = useState<DropState>({ status: "idle" });

  const normalizedSearch = search.trim().toLowerCase();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/courses/droppable");
      if (res.ok) {
        const data: Course[] = await res.json();
        setCourses(data);
      } else {
        const err = await res.json().catch(() => null);
        setFetchError(err?.error ?? "Failed to load your enrolled courses.");
      }
    } catch {
      setFetchError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter(
    (c) =>
      !normalizedSearch ||
      c.code.toLowerCase().includes(normalizedSearch) ||
      c.name.toLowerCase().includes(normalizedSearch) ||
      c.instructor.toLowerCase().includes(normalizedSearch) ||
      c.schedule.toLowerCase().includes(normalizedSearch) ||
      c.department.toLowerCase().includes(normalizedSearch)
  );

  function openConfirm(course: Course) {
    setDropState({ status: "confirming", course });
  }

  function closeModal() {
    setDropState({ status: "idle" });
  }

  async function confirmDrop() {
    const state = dropState;
    if (state.status !== "confirming" && state.status !== "error") return;
    const course = state.course;

    setDropState({ status: "dropping", course });

    try {
      const res = await fetch("/api/courses/drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
        setDroppedCount((n) => n + 1);
        setDropState({ status: "idle" });
      } else {
        const data = await res.json().catch(() => null);
        setDropState({
          status: "error",
          course,
          message: data?.error ?? "Failed to drop course. Please try again.",
        });
      }
    } catch {
      setDropState({
        status: "error",
        course,
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  const isModalOpen =
    dropState.status === "confirming" ||
    dropState.status === "dropping" ||
    dropState.status === "error";

  const modalCourse =
    isModalOpen ? dropState.course : null;

  const isDropping = dropState.status === "dropping";

  return (
    <>
      <TopBar
        title="Drop Course"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search enrolled courses..."
      />

      <main
        className="flex-1 p-6 md:p-8 mx-auto w-full"
        style={{ maxWidth: "var(--spacing-container_max)" }}
      >
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--color-primary)" }}
          >
            Manage Enrollments
          </p>
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: "var(--color-on-surface)" }}
          >
            Drop Course
          </h1>
          <p className="text-lg" style={{ color: "var(--color-on-surface-variant)" }}>
            Select an active enrollment below to initiate the drop procedure. Please be
            aware that dropping courses mid-semester may affect your academic standing.
          </p>
        </div>

        {/* Session success banner */}
        {droppedCount > 0 && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
            style={{
              backgroundColor: "var(--color-tertiary-fixed)",
              color: "var(--color-on-tertiary-fixed)",
            }}
          >
            <span className="material-symbols-outlined">check_circle</span>
            <span className="text-sm font-medium">
              {droppedCount} course{droppedCount > 1 ? "s" : ""} successfully dropped
              this session.
            </span>
          </div>
        )}

        {/* Fetch error */}
        {fetchError && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
            style={{
              backgroundColor: "var(--color-error-container)",
              color: "var(--color-on-error-container)",
            }}
          >
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span className="text-sm font-medium flex-1">{fetchError}</span>
            <button
              onClick={fetchCourses}
              className="text-sm font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center gap-3 py-10" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span>Loading your enrolled courses…</span>
          </div>
        ) : courses.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <span className="material-symbols-outlined text-6xl opacity-30 block mb-3">
              check_circle
            </span>
            <p className="text-lg font-medium">
              {droppedCount > 0
                ? `All done — you dropped ${droppedCount} course${droppedCount > 1 ? "s" : ""} this session.`
                : "No enrolled courses to drop."}
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <span className="material-symbols-outlined text-6xl opacity-30 block mb-3">
              search_off
            </span>
            <p className="text-lg font-medium">No matching courses found</p>
            <p className="text-sm mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDrop={() => openConfirm(course)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Popup — fixed bottom-right, no overlay */}
      {isModalOpen && modalCourse && (
        <div className="fixed bottom-6 right-6 z-50 w-96 rounded-xl bg-white border-l-4 border-red-600 shadow-xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-red-600 text-2xl leading-none mt-0.5">⚠</span>
            <div>
              <p className="text-sm font-bold text-red-600 uppercase tracking-wide mb-0.5">
                Warning — Irreversible Action
              </p>
              <p className="text-base font-semibold text-gray-900">
                Drop {modalCourse.code}?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">{modalCourse.name}</span> will
                be permanently removed from your enrollment. This cannot be undone.
              </p>
            </div>
          </div>
          {dropState.status === "error" && (
            <p className="text-sm font-medium text-red-600 mb-3 pl-9">⚠ {dropState.message}</p>
          )}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={closeModal}
              disabled={isDropping}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDrop}
              disabled={isDropping}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {isDropping ? "Dropping…" : "Yes, Drop Course"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CourseCard({
  course,
  onDrop,
}: {
  course: Course;
  onDrop: () => void;
}) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col relative overflow-hidden group transition-shadow card-shadow"
      style={{
        backgroundColor: "var(--color-surface-container-lowest)",
        borderTop: "4px solid var(--color-error)",
      }}
    >
      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-error-container) 10%, transparent), transparent)",
        }}
      />

      {/* Card header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold mb-2"
            style={{
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
            }}
          >
            {course.code}
          </span>
          <h3
            className="text-xl font-semibold leading-tight"
            style={{ color: "var(--color-on-surface)" }}
          >
            {course.name}
          </h3>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--color-error-container)" }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: "var(--color-error)",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            warning
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-6 relative z-10">
        {[
          { icon: "person", value: course.instructor },
          { icon: "schedule", value: course.schedule },
          { icon: "credit_score", value: `${course.credits} Credits` },
          {
            icon: "school",
            value: `${course.department} · Year ${course.year} · ${course.semester}`,
          },
        ].map((row) => (
          <p
            key={row.icon}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <span className="material-symbols-outlined text-[18px]">{row.icon}</span>
            {row.value}
          </p>
        ))}
      </div>

      {/* Drop button */}
      <div
        className="mt-auto pt-4 border-t relative z-10"
        style={{ borderColor: "var(--color-surface-variant)" }}
      >
        <button
          type="button"
          onClick={onDrop}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-all"
          style={{
            borderColor: "var(--color-error)",
            color: "var(--color-error)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-error)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-on-error)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-error)";
          }}
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
          Drop Course
        </button>
      </div>
    </div>
  );
}
