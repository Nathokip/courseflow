"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import TopBar from "@/components/TopBar";

type Announcement = {
  id: string;
  title: string;
  body: string;
  icon: string;
  iconColor: string;
  createdAt: string;
};

type AnnouncementFormState = {
  title: string;
  body: string;
  icon: string;
  iconColor: string;
};

const defaultForm: AnnouncementFormState = {
  title: "",
  body: "",
  icon: "campaign",
  iconColor: "primary",
};

const iconOptions = [
  "campaign",
  "event",
  "info",
  "celebration",
  "warning",
  "school",
  "schedule",
];

const colorOptions = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "tertiary", label: "Tertiary" },
  { value: "error", label: "Error" },
];

export default function AdminAnnouncementsClient({
  adminName,
}: {
  adminName: string;
}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AnnouncementFormState>(defaultForm);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const res = await fetch("/api/admin/announcements");

      if (cancelled) {
        return;
      }

      if (res.ok) {
        setAnnouncements(await res.json());
      } else {
        setError("Unable to load announcements.");
      }

      setLoading(false);
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return announcements;
    }

    return announcements.filter((announcement) =>
      [announcement.title, announcement.body, announcement.icon, announcement.iconColor]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [announcements, search]);

  function startCreate() {
    setEditingId(null);
    setForm(defaultForm);
    setError(null);
    setMessage(null);
  }

  function startEdit(announcement: Announcement) {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      body: announcement.body,
      icon: announcement.icon,
      iconColor: announcement.iconColor,
    });
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      icon: form.icon.trim(),
      iconColor: form.iconColor.trim(),
    };

    const res = await fetch(
      editingId
        ? `/api/admin/announcements/${editingId}`
        : "/api/admin/announcements",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error ?? "Unable to save announcement.");
      setSaving(false);
      return;
    }

    setMessage(editingId ? "Announcement updated." : "Announcement created.");
    setForm(defaultForm);
    setEditingId(null);
    await reloadAnnouncements();
    setSaving(false);
  }

  async function handleDelete(announcement: Announcement) {
    const confirmed = window.confirm(
      `Delete "${announcement.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    const res = await fetch(`/api/admin/announcements/${announcement.id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error ?? "Unable to delete announcement.");
      setSaving(false);
      return;
    }

    setMessage("Announcement deleted.");
    if (editingId === announcement.id) {
      startCreate();
    }
    await reloadAnnouncements();
    setSaving(false);
  }

  async function reloadAnnouncements() {
    const res = await fetch("/api/admin/announcements");
    if (res.ok) {
      setAnnouncements(await res.json());
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        title="Admin Announcements"
        showSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search announcements..."
      />

      <main className="flex-1 p-6 md:p-8 space-y-6">
        <section
          className="rounded-2xl p-6 border card-shadow"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-secondary-container) 72%, transparent), var(--color-surface))",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-secondary)" }}
              >
                Administration
              </p>
              <h1
                className="text-3xl font-bold mt-2"
                style={{ color: "var(--color-on-surface)" }}
              >
                Announcement management
              </h1>
              <p
                className="mt-2 max-w-2xl text-sm md:text-base"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Publish updates, alerts, and campus notices for students. You
                can reuse the same icon and color tokens used by the dashboard.
              </p>
              <p
                className="mt-3 text-xs font-medium uppercase tracking-[0.16em]"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Signed in as {adminName}
              </p>
            </div>

            <button
              type="button"
              onClick={startCreate}
              className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
              style={{
                borderColor: "var(--color-outline-variant)",
                color: "var(--color-on-surface)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              New announcement
            </button>
          </div>
        </section>

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

        <section className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 border card-shadow space-y-4"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-outline-variant)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {editingId ? "Edit announcement" : "Create announcement"}
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {editingId
                    ? "Update the existing notice."
                    : "Draft a new notice for the dashboard."}
                </p>
              </div>

              <button
                type="button"
                onClick={startCreate}
                className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              >
                Reset
              </button>
            </div>

            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </Field>

            <Field label="Body">
              <textarea
                required
                rows={6}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
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
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
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
                  value={form.iconColor}
                  onChange={(e) => setForm({ ...form, iconColor: e.target.value })}
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
              disabled={saving}
              className="w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-60"
              style={{
                backgroundColor: "var(--color-secondary-container)",
                color: "var(--color-on-secondary-container)",
              }}
            >
              {saving ? "Saving..." : editingId ? "Update announcement" : "Create announcement"}
            </button>
          </form>

          <div
            className="rounded-2xl p-6 border card-shadow"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-outline-variant)",
            }}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  Announcement feed
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {filteredAnnouncements.length} matching announcement{filteredAnnouncements.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {loading ? (
              <p style={{ color: "var(--color-on-surface-variant)" }}>Loading announcements...</p>
            ) : (
              <div className="space-y-3">
                {filteredAnnouncements.map((announcement) => (
                  <article
                    key={announcement.id}
                    className="rounded-xl p-4 border"
                    style={{
                      borderColor: "var(--color-outline-variant)",
                      backgroundColor: "var(--color-surface-container-lowest)",
                    }}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{ color: `var(--color-${announcement.iconColor})` }}
                          >
                            {announcement.icon}
                          </span>
                          <span className="text-xs" style={{ color: "var(--color-outline)" }}>
                            {announcement.iconColor}
                          </span>
                        </div>
                        <h3
                          className="text-base font-semibold mt-2"
                          style={{ color: "var(--color-on-surface)" }}
                        >
                          {announcement.title}
                        </h3>
                        <p
                          className="text-sm mt-1 line-clamp-3"
                          style={{ color: "var(--color-on-surface-variant)" }}
                        >
                          {announcement.body}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEdit(announcement)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"
                          style={{
                            borderColor: "var(--color-outline-variant)",
                            color: "var(--color-on-surface)",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(announcement)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
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
                ))}

                {!filteredAnnouncements.length && (
                  <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                    No announcements match your search.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
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
