"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Course = {
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
};

type FormState = {
  code: string;
  name: string;
  description: string;
  credits: number;
  instructor: string;
  schedule: string;
  department: string;
  semester: string;
  capacity: number;
  colorVariant: string;
};

const blank: FormState = {
  code: "",
  name: "",
  description: "",
  credits: 3,
  instructor: "",
  schedule: "",
  department: "",
  semester: "Sem 1",
  capacity: 30,
  colorVariant: "primary",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium" style={{ color: "var(--color-on-surface)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border px-3 py-2.5 text-sm bg-transparent outline-none focus:ring-2";
}

function inputStyle() {
  return {
    borderColor: "var(--color-outline-variant)",
    color: "var(--color-on-surface)",
  };
}

export default function AdminCoursesClient({ adminName }: { adminName: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(blank);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function showToast(type: "ok" | "err", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  }

  async function load() {
    const res = await fetch("/api/admin/courses");
    if (res.ok) setCourses(await res.json());
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.code, c.name, c.department, c.semester, c.instructor].join(" ").toLowerCase().includes(q)
    );
  }, [courses, search]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        credits: Number(form.credits),
        capacity: Number(form.capacity),
      }),
    });
    const data = await res.json().catch(() => null);
    setSaving(false);
    if (!res.ok) { showToast("err", data?.error ?? "Failed to create course."); return; }
    showToast("ok", `Course "${form.name}" added.`);
    setForm(blank);
    await load();
  }

  async function handleDelete(course: Course) {
    if (!window.confirm(`Delete "${course.code} – ${course.name}"? This also removes all student registrations for it.`)) return;
    setSaving(true);
    const res = await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => null);
    setSaving(false);
    if (!res.ok) { showToast("err", data?.error ?? "Failed to delete course."); return; }
    showToast("ok", "Course deleted.");
    await load();
  }

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
            Course Management
          </h1>
        </div>
        <input
          type="search"
          placeholder="Search courses…"
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

      {/* Toast */}
      {toast && (
        <div
          className="mx-6 mt-4 rounded-xl px-4 py-3 text-sm font-medium border"
          style={{
            backgroundColor: toast.type === "ok" ? "var(--color-primary-container)" : "var(--color-error-container)",
            borderColor: toast.type === "ok" ? "var(--color-primary)" : "var(--color-error)",
            color: toast.type === "ok" ? "var(--color-on-primary-container)" : "var(--color-on-error-container)",
          }}
        >
          {toast.text}
        </div>
      )}

      <main className="flex-1 p-6 md:p-8 grid lg:grid-cols-[420px_1fr] gap-8 items-start">
        {/* Add Course Form */}
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border card-shadow p-6 space-y-4 sticky top-24"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span
              className="material-symbols-outlined p-2 rounded-xl text-[22px]"
              style={{
                color: "var(--color-primary)",
                backgroundColor: "var(--color-primary-fixed)",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              add_circle
            </span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-on-surface)" }}>
                Add New Course
              </h2>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                Fill in the details and submit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Course Code">
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. CSC 201" className={inputCls()} style={inputStyle()} />
            </Field>
            <Field label="Semester">
              <input required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
                placeholder="e.g. Sem 1" className={inputCls()} style={inputStyle()} />
            </Field>
          </div>

          <Field label="Course Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Data Structures" className={inputCls()} style={inputStyle()} />
          </Field>

          <Field label="Description">
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief course description…" className={`${inputCls()} resize-none`} style={inputStyle()} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Instructor">
              <input required value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                placeholder="Dr. Smith" className={inputCls()} style={inputStyle()} />
            </Field>
            <Field label="Department">
              <input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="Computer Science" className={inputCls()} style={inputStyle()} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Credits">
              <input required type="number" min={1} value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                className={inputCls()} style={inputStyle()} />
            </Field>
            <Field label="Capacity">
              <input required type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className={inputCls()} style={inputStyle()} />
            </Field>
            <Field label="Schedule">
              <input required value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                placeholder="Mon 9 AM" className={inputCls()} style={inputStyle()} />
            </Field>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl py-3 text-sm font-bold transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
            }}
          >
            {saving ? "Adding…" : "Add Course"}
          </button>
        </form>

        {/* Course List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: "var(--color-on-surface)" }}>
              Course Catalog
            </h2>
            <span className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              {filtered.length} of {courses.length} courses
            </span>
          </div>

          {loading ? (
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>No courses found.</p>
          ) : (
            filtered.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border card-shadow p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderColor: "var(--color-outline-variant)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: "var(--color-primary-fixed)",
                        color: "var(--color-on-primary-fixed)",
                      }}
                    >
                      {course.code}
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-outline)" }}>
                      {course.semester}
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-outline)" }}>
                      {course.credits} cr
                    </span>
                  </div>
                  <p className="font-semibold truncate" style={{ color: "var(--color-on-surface)" }}>
                    {course.name}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-on-surface-variant)" }}>
                    {course.instructor} · {course.department} · {course.schedule}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                    {course.enrolled} / {course.capacity} enrolled
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleDelete(course)}
                  disabled={saving}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-error-container)",
                    color: "var(--color-on-error-container)",
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
