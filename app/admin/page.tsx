import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import prisma from "@/lib/prisma";

export default async function AdminHomePage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/login");

  const [studentCount, courseCount, registrationCount] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.course.count(),
    prisma.registration.count(),
  ]);

  const stats = [
    { label: "Total Courses", value: courseCount, icon: "menu_book", href: "/admin/courses", color: "primary" },
    { label: "Total Students", value: studentCount, icon: "groups", href: "/admin/students", color: "secondary" },
    { label: "Total Registrations", value: registrationCount, icon: "how_to_reg", href: "/admin/students", color: "tertiary" },
  ];

  const actions = [
    { href: "/admin/courses", icon: "menu_book", label: "Manage Courses", desc: "Add or delete courses from the catalog.", color: "primary" },
    { href: "/admin/students", icon: "groups", label: "View Students", desc: "See all students and their registered courses.", color: "secondary" },
  ];

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-on-surface-variant)" }}>
          Signed in as {admin.name}
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "var(--color-on-surface)" }}>
          Admin Dashboard
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--color-on-surface-variant)" }}>
          Manage courses and monitor student registrations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl p-6 border card-shadow flex items-center gap-5 transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--color-surface-container-lowest)",
              borderColor: "var(--color-outline-variant)",
            }}
          >
            <span
              className="material-symbols-outlined text-[28px] p-3 rounded-xl"
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
              <p className="text-4xl font-bold mt-1" style={{ color: "var(--color-on-surface)" }}>
                {s.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--color-on-surface)" }}>
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-2xl p-6 border card-shadow flex items-start gap-4 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--color-surface-container-lowest)",
                borderColor: "var(--color-outline-variant)",
              }}
            >
              <span
                className="material-symbols-outlined text-[28px] p-3 rounded-xl shrink-0"
                style={{
                  color: `var(--color-${a.color})`,
                  backgroundColor: `var(--color-${a.color}-fixed)`,
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                {a.icon}
              </span>
              <div>
                <p className="text-base font-bold" style={{ color: "var(--color-on-surface)" }}>
                  {a.label}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  {a.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
