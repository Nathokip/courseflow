"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  semester: string;
  avatarUrl: string;
  registeredCredits: number;
  maxCredits: number;
  creditLimit: number;
  registrationDeadline: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  schedule: string;
  instructor: string;
  department: string;
  colorVariant: string;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  icon: string;
  iconColor: string;
}

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentRes, coursesRes, announcementsRes] = await Promise.all([
          fetch("/api/student"),
          fetch("/api/courses/registered"),
          fetch("/api/announcements"),
        ]);
        if (studentRes.ok) setStudent(await studentRes.json());
        if (coursesRes.ok) setCourses(await coursesRes.json());
        if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !student) {
    return (
      <>
        <TopBar title="Dashboard" />
        <main className="flex-1 p-6 md:p-8 mx-auto w-full" style={{ maxWidth: "var(--spacing-container_max)" }}>
          <p style={{ color: "var(--color-on-surface-variant)" }}>Loading...</p>
        </main>
      </>
    );
  }

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const creditsRemaining = student.creditLimit - totalCredits;

  const stats = [
    { label: "Registered Courses", value: courses.length.toString(), icon: "book", iconBg: "var(--color-primary-fixed)", iconColor: "var(--color-primary)", large: true },
    { label: "Credits Remaining", value: creditsRemaining.toString(), icon: "toll", iconBg: "var(--color-secondary-fixed)", iconColor: "var(--color-secondary)", large: true },
    { label: "Current Semester", value: student.semester, icon: "calendar_month", iconBg: "var(--color-tertiary-fixed)", iconColor: "var(--color-tertiary)", large: false },
    { label: "Registration Deadline", value: student.registrationDeadline, icon: "warning", iconBg: "transparent", iconColor: "var(--color-error)", large: false, isAlert: true },
  ];

  const quickActions = [
    { href: "/register-courses", icon: "app_registration", label: "Register Courses", primary: true },
    { href: "/my-courses", icon: "school", label: "View My Courses", primary: false },
    { href: "/drop-course", icon: "delete_sweep", label: "Drop Course", primary: false },
  ];

  return (
    <>
      <TopBar title="Dashboard" />
      <main className="flex-1 p-6 md:p-8 mx-auto w-full" style={{ maxWidth: "var(--spacing-container_max)" }}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--color-on-surface)" }}>
            Welcome back, {student.name.split(" ")[0]}
          </h2>
          <p className="text-lg" style={{ color: "var(--color-on-surface-variant)" }}>
            Here is an overview of your academic progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="md:col-span-3 flex flex-col justify-between rounded-xl p-6 card-shadow" style={{
              backgroundColor: stat.isAlert ? "color-mix(in srgb, var(--color-error-container) 10%, var(--color-surface-container-lowest))" : "var(--color-surface-container-lowest)",
              border: stat.isAlert ? "1px solid var(--color-error-container)" : "1px solid transparent",
            }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium" style={{ color: stat.isAlert ? "var(--color-error)" : "var(--color-on-surface-variant)" }}>{stat.label}</span>
                <span className="material-symbols-outlined p-1 rounded-full text-[22px]" style={{ color: stat.iconColor, backgroundColor: stat.isAlert ? "transparent" : stat.iconBg }}>{stat.icon}</span>
              </div>
              <span className={stat.large ? "text-5xl font-bold" : "text-2xl font-semibold"} style={{ color: "var(--color-on-surface)" }}>{stat.value}</span>
            </div>
          ))}

          <div className="md:col-span-8 rounded-xl p-6 card-shadow flex flex-col" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-on-surface)" }}>Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href} className="flex flex-col items-center justify-center text-center rounded-lg p-4 transition-all duration-200 gap-2"
                  style={action.primary ? { backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary)" } : { backgroundColor: "var(--color-surface-container)", color: "var(--color-primary)", border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; if (action.primary) { el.style.backgroundColor = "var(--color-primary)"; el.style.color = "var(--color-on-primary)"; } else { el.style.backgroundColor = "var(--color-surface-variant)"; } }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; if (action.primary) { el.style.backgroundColor = "var(--color-primary-container)"; el.style.color = "var(--color-on-primary)"; } else { el.style.backgroundColor = "var(--color-surface-container)"; } }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>{action.icon}</span>
                  <span className="text-sm font-bold">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 rounded-xl p-6 card-shadow" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>Recent Announcements</h3>
              <button className="text-xs font-semibold transition-colors" style={{ color: "var(--color-primary)" }}>View All</button>
            </div>
            <ul className="space-y-1 divide-y" style={{ borderColor: "var(--color-surface-variant)" }}>
              {announcements.map((ann) => (
                <li key={ann.id} className="py-2">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 text-[18px] shrink-0" style={{ color: `var(--color-${ann.iconColor})` }}>{ann.icon}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--color-on-surface)" }}>{ann.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--color-on-surface-variant)" }}>{ann.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl p-6 card-shadow" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>Current Courses</h3>
            <Link href="/my-courses" className="text-xs font-semibold transition-colors" style={{ color: "var(--color-primary)" }}>View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-surface-variant)" }}>
                  {["Code", "Course", "Credits", "Schedule", "Instructor"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 text-xs font-semibold" style={{ color: "var(--color-outline)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--color-surface-container)" }}>
                    <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed)" }}>{c.code}</span></td>
                    <td className="py-3 pr-4 font-medium" style={{ color: "var(--color-on-surface)" }}>{c.name}</td>
                    <td className="py-3 pr-4" style={{ color: "var(--color-on-surface-variant)" }}>{c.credits}</td>
                    <td className="py-3 pr-4" style={{ color: "var(--color-on-surface-variant)" }}>{c.schedule}</td>
                    <td className="py-3" style={{ color: "var(--color-on-surface-variant)" }}>{c.instructor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
