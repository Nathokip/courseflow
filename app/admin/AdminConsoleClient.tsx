"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

type RecentCourse = {
  id: string;
  code: string;
  name: string;
  instructor: string;
  semester: string;
  enrolled: number;
  capacity: number;
};

type RecentAnnouncement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

type AdminConsoleClientProps = {
  adminName: string;
  recentCourses: RecentCourse[];
  recentAnnouncements: RecentAnnouncement[];
};

const initialAnnouncement = {
  title: "",
  body: "",
  icon: "campaign",
  iconColor: "secondary",
};

const initialCourse = {
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

const iconOptions = ["campaign", "event", "info", "celebration", "warning", "school", "schedule"];

const colorOptions = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "tertiary", label: "Tertiary" },
  { value: "error", label: "Error" },
];

export default function AdminConsoleClient({
  adminName,
  recentCourses,
  recentAnnouncements,
}: AdminConsoleClientProps) {
  const [announcement, setAnnouncement] = useState(initialAnnouncement);
  const [course, setCourse] = useState(initialCourse);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState(recentCourses);
  const [announcements, setAnnouncements] = useState(recentAnnouncements);

  const courseCountText = useMemo(
    () => `${courses.length} recent course${courses.length === 1 ? "" : "s"}`,
    [courses.length]
  );

  const announcementCountText = useMemo(
    () => `${announcements.length} recent announcement${announcements.length === 1 ? "" : "s"}`,
    [announcements.length]
  );

  function resetStatus() {
    setMessage(null);
    setError(null);
  }

  async function handleAnnouncementSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    resetStatus();

    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: announcement.title.trim(),
        body: announcement.body.trim(),
        icon: announcement.icon,
        iconColor: announcement.iconColor,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error ?? "Unable to create announcement.");
      setBusy(false);
      return;
    }

    setMessage("Announcement drafted and published.");
    setAnnouncement(initialAnnouncement);
    const created = data as RecentAnnouncement;
    setAnnouncements((current) => [created, ...current].slice(0, 4));
    setBusy(false);
  }

  async function handleCourseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    resetStatus();

    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error ?? "Unable to create course.");
      setBusy(false);
      return;
    }

    setMessage("Course added to the catalog.");
    setCourse(initialCourse);
    const created = data as RecentCourse;
    setCourses((current) => [created, ...current].slice(0, 5));
    setBusy(false);
  }

  async function handleDeleteCourse(courseId: string) {
    const confirmed = window.confirm("Delete this course? This will remove related registrations.");
    if (!confirmed) {
      return;
    }

    setBusy(true);
    resetStatus();

    const res = await fetch(`/api/admin/courses/${courseId}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error ?? "Unable to delete course.");
      setBusy(false);
      return;
    }

    setMessage("Course deleted.");
    setCourses((current) => current.filter((item) => item.id !== courseId));
    setBusy(false);
  }

  async function handleDeleteAnnouncement(announcementId: string) {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) {
      return;
    }

    setBusy(true);
    resetStatus();

    const res = await fetch(`/api/admin/announcements/${announcementId}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error ?? "Unable to delete announcement.");
      setBusy(false);
      return;
    }

    setMessage("Announcement deleted.");
    setAnnouncements((current) => current.filter((item) => item.id !== announcementId));
    setBusy(false);
  }

  return (
    <section className="space-y-6">
      {(message || error) && (
        <div
          className="rounded-xl px-4 py-3 border"
          style={{
            backgroundColor: error
              ? "var(--color-error-container)"
              : "var(--color-secondary-container)",
            borderColor: error ? "var(--color-error)" : "var(--color-secondary)",
            color: error
              ? "var(--color-on-error-container)"
              : "var(--color-on-secondary-container)",
          }}
        >
          {error ?? message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <form
          onSubmit={handleAnnouncementSubmit}
          className="rounded-2xl p-6 border card-shadow space-y-4"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>
                Draft message
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                Write an announcement for students.
              </p>
            </div>
            <Link
              href="/admin/announcements"
              className="text-sm font-semibold"
              style={{ color: "var(--color-secondary)" }}
            >
              Open full editor
            </Link>
          </div>

          <Field label="Title">
            <input
              required
              value={announcement.title}
              onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            />
          </Field>

          <Field label="Message">
            <textarea
              required
              rows={5}
              value={announcement.body}
              onChange={(e) => setAnnouncement({ ...announcement, body: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent resize-y"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Icon">
              <select
                value={announcement.icon}
                onChange={(e) => setAnnouncement({ ...announcement, icon: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              >
                {iconOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Color">
              <select
                value={announcement.iconColor}
                onChange={(e) => setAnnouncement({ ...announcement, iconColor: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-60"
            style={{
              backgroundColor: "var(--color-secondary-container)",
              color: "var(--color-on-secondary-container)",
            }}
          >
            {busy ? "Saving..." : "Publish message"}
          </button>
        </form>

        <form
          onSubmit={handleCourseSubmit}
          className="rounded-2xl p-6 border card-shadow space-y-4"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>
                Add course
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                Create a new course without leaving the admin home.
              </p>
            </div>
            <Link
              href="/admin/courses"
              className="text-sm font-semibold"
              style={{ color: "var(--color-secondary)" }}
            >
              Open full editor
            </Link>
          </div>

          <Field label="Code">
            <input
              required
              value={course.code}
              onChange={(e) => setCourse({ ...course, code: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            />
          </Field>

          <Field label="Name">
            <input
              required
              value={course.name}
              onChange={(e) => setCourse({ ...course, name: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            />
          </Field>

          <Field label="Description">
            <textarea
              required
              rows={4}
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent resize-y"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Credits">
              <input
                required
                type="number"
                min={1}
                value={course.credits}
                onChange={(e) => setCourse({ ...course, credits: Number(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </Field>

            <Field label="Capacity">
              <input
                required
                type="number"
                min={0}
                value={course.capacity}
                onChange={(e) => setCourse({ ...course, capacity: Number(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </Field>
          </div>

          <Field label="Instructor">
            <input
              required
              value={course.instructor}
              onChange={(e) => setCourse({ ...course, instructor: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            />
          </Field>

          <Field label="Schedule">
            <input
              required
              value={course.schedule}
              onChange={(e) => setCourse({ ...course, schedule: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Department">
              <input
                required
                value={course.department}
                onChange={(e) => setCourse({ ...course, department: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </Field>

            <Field label="Semester">
              <input
                required
                value={course.semester}
                onChange={(e) => setCourse({ ...course, semester: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </Field>
          </div>

          <Field label="Color">
            <select
              value={course.colorVariant}
              onChange={(e) => setCourse({ ...course, colorVariant: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 bg-transparent"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
              }}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-60"
            style={{
              backgroundColor: "var(--color-primary-container)",
              color: "var(--color-on-primary-container)",
            }}
          >
            {busy ? "Saving..." : "Create course"}
          </button>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section
          className="rounded-2xl p-6 border card-shadow"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>
                Recent courses
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                {courseCountText}
              </p>
            </div>
            <Link href="/admin/courses" className="text-sm font-semibold" style={{ color: "var(--color-secondary)" }}>
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {courses.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                No courses yet.
              </p>
            ) : (
              courses.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl p-4 border"
                  style={{
                    borderColor: "var(--color-outline-variant)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: "var(--color-primary-fixed)",
                            color: "var(--color-on-primary-fixed)",
                          }}
                        >
                          {item.code}
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-outline)" }}>
                          {item.semester}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold mt-2" style={{ color: "var(--color-on-surface)" }}>
                        {item.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                        {item.instructor}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--color-outline)" }}>
                        {item.enrolled} / {item.capacity} enrolled
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Link
                        href="/admin/courses"
                        className="px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"
                        style={{
                          borderColor: "var(--color-outline-variant)",
                          color: "var(--color-on-surface)",
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDeleteCourse(item.id)}
                        disabled={busy}
                        className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
                        style={{
                          backgroundColor: "var(--color-error-container)",
                          color: "var(--color-on-error-container)",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section
          className="rounded-2xl p-6 border card-shadow"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>
                Recent announcements
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                {announcementCountText}
              </p>
            </div>
            <Link
              href="/admin/announcements"
              className="text-sm font-semibold"
              style={{ color: "var(--color-secondary)" }}
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                No announcements yet.
              </p>
            ) : (
              announcements.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl p-4 border"
                  style={{
                    borderColor: "var(--color-outline-variant)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
                        {item.title}
                      </h3>
                      <p className="text-xs mt-1 line-clamp-3" style={{ color: "var(--color-on-surface-variant)" }}>
                        {item.body}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDeleteAnnouncement(item.id)}
                      disabled={busy}
                      className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
                      style={{
                        backgroundColor: "var(--color-error-container)",
                        color: "var(--color-on-error-container)",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/courses"
          className="rounded-2xl p-5 border card-shadow transition-colors"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
            color: "var(--color-on-surface)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-secondary)" }}>
            Courses
          </p>
          <h3 className="text-lg font-semibold mt-2">Full course editor</h3>
          <p className="text-sm mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
            Add, edit, and delete courses with the complete management view.
          </p>
        </Link>

        <Link
          href="/admin/announcements"
          className="rounded-2xl p-5 border card-shadow transition-colors"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
            color: "var(--color-on-surface)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-secondary)" }}>
            Announcements
          </p>
          <h3 className="text-lg font-semibold mt-2">Full message editor</h3>
          <p className="text-sm mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
            Draft, publish, and remove student-facing notices.
          </p>
        </Link>

        <Link
          href="/admin/students"
          className="rounded-2xl p-5 border card-shadow transition-colors"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
            color: "var(--color-on-surface)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-tertiary)" }}>
            Students
          </p>
          <h3 className="text-lg font-semibold mt-2">Student registrations</h3>
          <p className="text-sm mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
            Browse all students and see which courses each one is registered for.
          </p>
        </Link>

        <Link
          href="/dashboard"
          className="rounded-2xl p-5 border card-shadow transition-colors"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            borderColor: "var(--color-outline-variant)",
            color: "var(--color-on-surface)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-secondary)" }}>
            Portal
          </p>
          <h3 className="text-lg font-semibold mt-2">Student view</h3>
          <p className="text-sm mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
            Jump into the student experience for verification.
          </p>
        </Link>
      </section>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium" style={{ color: "var(--color-on-surface)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
