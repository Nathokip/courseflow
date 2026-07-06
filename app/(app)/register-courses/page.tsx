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
  registered?: boolean;
}

const MAX_CREDITS = 18;
const departments = ["All", "Computer Science", "Mathematics", "Physics", "Software Engineering"];

export default function RegisterCoursesPage() {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [cart, setCart] = useState<Course[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, cartRes] = await Promise.all([
          fetch("/api/courses/available"),
          fetch("/api/cart"),
        ]);
        if (coursesRes.ok) setAvailableCourses(await coursesRes.json());
        if (cartRes.ok) setCart(await cartRes.json());
      } catch {
        // ignore
      }
    }
    fetchData();
  }, []);

  const cartIds = new Set(cart.map((c) => c.id));
  const totalCredits = cart.reduce((s, c) => s + c.credits, 0);
  const creditPct = Math.min((totalCredits / MAX_CREDITS) * 100, 100);

  const filtered = availableCourses.filter(
    (c) => activeFilter === "All" || c.department === activeFilter
  );

  async function addCourse(course: Course) {
    if (cartIds.has(course.id)) return;
    if (totalCredits + course.credits > MAX_CREDITS) return;
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id }),
    });
    if (res.ok) setCart((prev) => [...prev, course]);
  }

  async function removeCourse(id: string) {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: id }),
    });
    if (res.ok) setCart((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleConfirm() {
    setConfirming(true);
    setError("");
    const res = await fetch("/api/register", { method: "POST" });
    setConfirming(false);
    if (res.ok) {
      setConfirmed(true);
      setCart([]);
      async function refetch() {
        try {
          const [coursesRes, cartRes] = await Promise.all([
            fetch("/api/courses/available"),
            fetch("/api/cart"),
          ]);
          if (coursesRes.ok) setAvailableCourses(await coursesRes.json());
          if (cartRes.ok) setCart(await cartRes.json());
        } catch {
          // ignore
        }
      }
      refetch();
      setTimeout(() => setConfirmed(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed. Please try again.");
    }
  }

  return (
    <>
      <TopBar title="Course Registration" />
      <main className="flex-1 p-6 md:p-8 mx-auto w-full" style={{ maxWidth: "var(--spacing-container_max)" }}>
        <div className="mb-6 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--color-on-surface)" }}>Course Registration</h2>
            <p className="text-base" style={{ color: "var(--color-on-surface-variant)" }}>Fall Semester 2025</p>
          </div>
          <button className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: "var(--color-outline-variant)", color: "var(--color-on-surface-variant)", backgroundColor: "var(--color-surface-container-lowest)" }}>
            <span className="material-symbols-outlined text-[18px]">filter_list</span>Filter
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 space-y-6">
            <div className="flex flex-wrap gap-2">
              {departments.map((dep) => {
                const active = dep === activeFilter;
                return (
                  <button key={dep} onClick={() => setActiveFilter(dep)}
                    className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={active ? { backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)" } : { backgroundColor: "var(--color-surface-container-lowest)", color: "var(--color-on-surface-variant)", border: "1px solid var(--color-outline-variant)" }}>
                    {dep}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((course) => {
                const isFull = course.enrolled >= course.capacity;
                const inCart = cartIds.has(course.id);
                const wouldExceed = totalCredits + course.credits > MAX_CREDITS;
                return (
                  <div key={course.id} className="rounded-xl p-4 flex flex-col card-shadow"
                    style={{ backgroundColor: "var(--color-surface-container-lowest)", border: inCart ? "2px solid var(--color-primary)" : "2px solid transparent" }}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold mb-2"
                          style={{ backgroundColor: "color-mix(in srgb, var(--color-secondary-container) 20%, transparent)", color: "var(--color-secondary)" }}>{course.code}</span>
                        <h3 className="text-lg font-semibold" style={{ color: "var(--color-on-surface)" }}>{course.name}</h3>
                      </div>
                      <span className="text-sm font-bold shrink-0 ml-2" style={{ color: "var(--color-primary)" }}>{course.credits} Credits</span>
                    </div>
                    <p className="text-sm flex-1 mb-4" style={{ color: "var(--color-on-surface-variant)" }}>{course.description}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <span className="flex items-center gap-1" style={{ color: "var(--color-on-surface-variant)" }}>
                        <span className="material-symbols-outlined text-[16px]">schedule</span>{course.schedule}
                      </span>
                      <span className="flex items-center gap-1" style={{ color: isFull ? "var(--color-error)" : "var(--color-on-surface-variant)" }}>
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        {course.enrolled}/{course.capacity}{isFull && " (Full)"}
                      </span>
                    </div>
                    <button disabled={isFull || (wouldExceed && !inCart) || !!course.registered}
                      onClick={() => inCart ? removeCourse(course.id) : addCourse(course)}
                      className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                      style={course.registered ? { backgroundColor: "var(--color-tertiary-fixed)", color: "var(--color-on-tertiary-fixed)", cursor: "default" } : inCart ? { backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" } : isFull || wouldExceed ? { border: "1px solid var(--color-outline)", color: "var(--color-on-surface-variant)", opacity: 0.5, cursor: "not-allowed" } : { backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}
                      onMouseEnter={(e) => { if (!isFull && !wouldExceed && !inCart && !course.registered) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary)"; }}
                      onMouseLeave={(e) => { if (!isFull && !wouldExceed && !inCart && !course.registered) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary-container)"; }}>
                      {course.registered ? "Registered" : isFull ? "Waitlist" : inCart ? "\u2713 Added" : wouldExceed ? "Credit Limit Reached" : "Add Course"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-4 xl:sticky" style={{ top: "100px" }}>
            <div className="rounded-xl flex flex-col card-shadow overflow-hidden border"
              style={{ backgroundColor: "var(--color-surface-container-lowest)", borderColor: "var(--color-surface-variant)" }}>
              <div className="p-6 border-b" style={{ backgroundColor: "var(--color-surface-container-low)", borderColor: "var(--color-surface-variant)" }}>
                <h3 className="text-xl font-semibold" style={{ color: "var(--color-on-surface)" }}>Selected Courses</h3>
                <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>Review your schedule before confirming.</p>
              </div>
              <div className="p-6 flex-1 overflow-y-auto max-h-96">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center" style={{ color: "var(--color-on-surface-variant)" }}>
                    <span className="material-symbols-outlined text-5xl opacity-30 mb-2">shopping_cart</span>
                    <p className="text-sm">No courses selected yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((c) => (
                      <li key={c.id} className="flex justify-between items-center group">
                        <div>
                          <h4 className="text-sm font-medium" style={{ color: "var(--color-on-surface)" }}>{c.code} - {c.name}</h4>
                          <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
                            <span>{c.credits} Credits</span>
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--color-outline-variant)" }} />
                            <span>{c.schedule}</span>
                          </div>
                        </div>
                        <button onClick={() => removeCourse(c.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded" style={{ color: "var(--color-on-surface-variant)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-on-surface-variant)"; }}>
                          <span className="material-symbols-outlined text-[20px]">remove_circle_outline</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-6 border-t" style={{ backgroundColor: "var(--color-surface-bright)", borderColor: "var(--color-surface-variant)" }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base" style={{ color: "var(--color-on-surface-variant)" }}>Total Credits</span>
                  <span className="text-xl font-bold" style={{ color: "var(--color-on-surface)" }}>
                    {totalCredits} <span className="text-sm font-normal" style={{ color: "var(--color-on-surface-variant)" }}>/ {MAX_CREDITS} Max</span>
                  </span>
                </div>
                <div className="w-full rounded-full h-2 mb-6 overflow-hidden" style={{ backgroundColor: "var(--color-surface-variant)" }}>
                  <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${creditPct}%`, backgroundColor: creditPct >= 90 ? "var(--color-error)" : "var(--color-primary)" }} />
                </div>
                {error && (
                  <p className="text-sm font-medium mb-3 text-center" style={{ color: "var(--color-error)" }}>
                    {error}
                  </p>
                )}
                {confirmed ? (
                  <div className="w-full py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ backgroundColor: "var(--color-tertiary-fixed)", color: "var(--color-on-tertiary-fixed)" }}>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Registration Confirmed!
                  </div>
                ) : (
                  <button onClick={handleConfirm} disabled={cart.length === 0 || confirming}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
                    onMouseEnter={(e) => { if (cart.length > 0) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-on-primary-fixed-variant)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary)"; }}>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    {confirming ? "Registering..." : "Confirm Registration"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
