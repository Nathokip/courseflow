"use client";

import { useEffect, useMemo, useState } from "react";

type CourseReg = {
  id: string;
  course: {
    id: string;
    code: string;
    name: string;
    credits: number;
    instructor: string;
    semester: string;
    department: string;
  };
};

type Student = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  semester: string;
  registeredCredits: number;
  maxCredits: number;
  createdAt: string;
  registrations: CourseReg[];
};

export default function AdminStudentsClient({ adminName }: { adminName: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/students")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (!cancelled) setStudents(d); })
      .catch(() => { if (!cancelled) setError("Unable to load students."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.email, s.studentId, s.semester].join(" ").toLowerCase().includes(q)
    );
  }, [students, search]);

  const totalRegs = students.reduce((n, s) => n + s.registrations.length, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-b"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-outline-variant)",
        }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-on-surface-variant)" }}>
            Admin · {adminName}
          </p>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-on-surface)" }}>
            Student Registrations
          </h1>
        </div>
        <input
          type="search"
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border px-4 py-2 text-sm outline-none w-56"
          style={{
            backgroundColor: "var(--color-surface-container-low)",
            borderColor: "var(--color-outline-variant)",
            color: "var(--color-on-surface)",
          }}
        />
      </header>

      <main className="flex-1 p-6 md:p-8 space-y-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Students", value: students.length, icon: "groups", color: "secondary" },
            { label: "Total Registrations", value: totalRegs, icon: "how_to_reg", color: "tertiary" },
            {
              label: "Avg Courses / Student",
              value: students.length ? (totalRegs / students.length).toFixed(1) : "0",
              icon: "equalizer",
              color: "primary",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border card-shadow p-5 flex items-center gap-4"
              style={{
                backgroundColor: "var(--color-surface-container-lowest)",
                borderColor: "var(--color-outline-variant)",
              }}
            >
              <span
                className="material-symbols-outlined p-3 rounded-xl text-[24px]"
                style={{
                  color: `var(--color-${s.color})`,
                  backgroundColor: `var(--color-${s.color}-fixed)`,
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {s.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-on-surface-variant)" }}>
                  {s.label}
                </p>
                <p className="text-3xl font-bold mt-0.5" style={{ color: "var(--color-on-surface)" }}>
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 border text-sm"
            style={{
              backgroundColor: "var(--color-error-container)",
              borderColor: "var(--color-error)",
              color: "var(--color-on-error-container)",
            }}
          >
            {error}
          </div>
        )}

        {/* Student list */}
        <div
          className="rounded-2xl border card-shadow overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            <h2 className="font-bold text-lg" style={{ color: "var(--color-on-surface)" }}>
              All Students
            </h2>
            <span className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              {loading ? "Loading…" : `${filtered.length} of ${students.length}`}
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              Loading students…
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-8 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              No students match your search.
            </div>
          ) : (
            <div>
              {filtered.map((student, i) => {
                const isExpanded = expandedId === student.id;
                const isLast = i === filtered.length - 1;
                return (
                  <div
                    key={student.id}
                    style={!isLast ? { borderBottom: "1px solid var(--color-outline-variant)" } : {}}
                  >
                    {/* Row */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : student.id)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 transition-colors"
                      style={{
                        backgroundColor: isExpanded ? "var(--color-surface-container-low)" : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Initials avatar */}
                        <div
                          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: "var(--color-secondary-fixed)",
                            color: "var(--color-on-secondary-fixed)",
                          }}
                        >
                          {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: "var(--color-on-surface)" }}>
                            {student.name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--color-on-surface-variant)" }}>
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="hidden sm:block text-right">
                          <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>ID</p>
                          <p className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                            {student.studentId}
                          </p>
                        </div>
                        <div className="hidden md:block text-right">
                          <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>Semester</p>
                          <p className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                            {student.semester}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>Courses</p>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {student.registrations.length}
                          </p>
                        </div>
                        <span
                          className="material-symbols-outlined text-[20px] transition-transform duration-200"
                          style={{
                            color: "var(--color-on-surface-variant)",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          expand_more
                        </span>
                      </div>
                    </button>

                    {/* Expanded registrations */}
                    {isExpanded && (
                      <div
                        className="px-6 pb-4 pt-1"
                        style={{ backgroundColor: "var(--color-surface-container-low)" }}
                      >
                        {student.registrations.length === 0 ? (
                          <p className="text-sm py-3" style={{ color: "var(--color-on-surface-variant)" }}>
                            This student has no course registrations.
                          </p>
                        ) : (
                          <div
                            className="rounded-xl border overflow-hidden"
                            style={{ borderColor: "var(--color-outline-variant)" }}
                          >
                            {/* Credits header */}
                            <div
                              className="px-4 py-2.5 flex items-center justify-between border-b text-xs font-semibold uppercase tracking-wide"
                              style={{
                                backgroundColor: "var(--color-surface)",
                                borderColor: "var(--color-outline-variant)",
                                color: "var(--color-on-surface-variant)",
                              }}
                            >
                              <span>Registered Courses</span>
                              <span
                                className="px-2 py-0.5 rounded font-bold text-xs"
                                style={{
                                  backgroundColor: "var(--color-secondary-fixed)",
                                  color: "var(--color-on-secondary-fixed)",
                                }}
                              >
                                {student.registeredCredits} / {student.maxCredits} credits
                              </span>
                            </div>

                            {student.registrations.map((reg, j) => (
                              <div
                                key={reg.id}
                                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                                style={{
                                  backgroundColor: "var(--color-surface)",
                                  borderTop: j > 0 ? "1px solid var(--color-outline-variant)" : undefined,
                                }}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className="px-2 py-0.5 rounded text-xs font-bold shrink-0"
                                    style={{
                                      backgroundColor: "var(--color-primary-fixed)",
                                      color: "var(--color-on-primary-fixed)",
                                    }}
                                  >
                                    {reg.course.code}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-on-surface)" }}>
                                      {reg.course.name}
                                    </p>
                                    <p className="text-xs truncate" style={{ color: "var(--color-on-surface-variant)" }}>
                                      {reg.course.instructor} · {reg.course.department}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-xs" style={{ color: "var(--color-outline)" }}>
                                    {reg.course.semester}
                                  </span>
                                  <span
                                    className="px-2 py-0.5 rounded text-xs font-semibold"
                                    style={{
                                      backgroundColor: "var(--color-tertiary-fixed)",
                                      color: "var(--color-on-tertiary-fixed)",
                                    }}
                                  >
                                    {reg.course.credits} cr
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
