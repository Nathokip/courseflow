"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetch("/api/student")
      .then(async (res) => {
        if (res.ok) setStudent(await res.json());
      })
      .catch(() => {});
  }, []);

  if (!student) {
    return (
      <>
        <TopBar title="Profile" showSearch={false} />
        <main className="flex-1 p-6 md:p-8 mx-auto w-full" style={{ maxWidth: "var(--spacing-container_max)" }}>
          <p style={{ color: "var(--color-on-surface-variant)" }}>Loading...</p>
        </main>
      </>
    );
  }

  const infoRows = [
    { label: "Full Name", value: student.name, icon: "person" },
    { label: "University Email", value: student.email, icon: "email" },
    { label: "Student ID", value: student.studentId, icon: "badge" },
    { label: "Current Semester", value: student.semester, icon: "calendar_month" },
  ];

  return (
    <>
      <TopBar title="Profile" showSearch={false} />
      <main className="flex-1 p-6 md:p-8 mx-auto w-full" style={{ maxWidth: "var(--spacing-container_max)" }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--color-on-surface)" }}>Profile</h1>
          <p className="text-base" style={{ color: "var(--color-on-surface-variant)" }}>Your academic account details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl p-8 flex flex-col items-center text-center card-shadow" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 mb-4 flex items-center justify-center text-3xl font-bold" style={{ borderColor: "var(--color-primary-fixed)", backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}>
              {student.avatarUrl ? (
                <Image src={student.avatarUrl} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                student.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-on-surface)" }}>{student.name}</h2>
            <p className="text-sm mb-1" style={{ color: "var(--color-on-surface-variant)" }}>{student.studentId}</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2"
              style={{ backgroundColor: "var(--color-tertiary-fixed)", color: "var(--color-on-tertiary-fixed)" }}>
              Active Student
            </span>

            <div className="w-full mt-6">
              <div className="flex justify-between text-xs mb-1" style={{ color: "var(--color-on-surface-variant)" }}>
                <span>Credits Enrolled</span>
                <span>{student.registeredCredits} / {student.creditLimit}</span>
              </div>
              <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: "var(--color-surface-variant)" }}>
                <div className="h-2 rounded-full" style={{ width: `${(student.registeredCredits / student.creditLimit) * 100}%`, backgroundColor: "var(--color-primary)" }} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl p-8 card-shadow" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
            <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--color-on-surface)" }}>Account Information</h3>
            <div className="space-y-4">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-primary-fixed)" }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--color-primary)" }}>{row.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--color-outline)" }}>{row.label}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--color-on-surface)" }}>{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t flex gap-3" style={{ borderColor: "var(--color-surface-variant)" }}>
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                Edit Profile
              </button>
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
                style={{ backgroundColor: "transparent", borderColor: "var(--color-outline-variant)", color: "var(--color-on-surface-variant)" }}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
