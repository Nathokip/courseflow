"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !studentId || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, studentId, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <main
        className="w-full max-w-4xl flex rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface-container-lowest)",
          boxShadow:
            "0px 10px 15px -3px rgba(15,23,42,0.1), 0px 4px 6px -2px rgba(15,23,42,0.05)",
        }}
      >
        <section className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="material-symbols-outlined text-4xl"
              style={{
                color: "var(--color-primary)",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              school
            </span>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-on-surface)" }}
            >
              CourseFlow
            </h1>
          </div>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--color-on-surface)" }}
            >
              Create your account
            </h2>
            <p
              className="text-base"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Sign up to get started with CourseFlow.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                htmlFor="name"
                style={{ color: "var(--color-on-surface)" }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Alex Johnson"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow =
                    "0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-outline-variant)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                htmlFor="email"
                style={{ color: "var(--color-on-surface)" }}
              >
                University Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="student@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow =
                    "0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-outline-variant)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                htmlFor="studentId"
                style={{ color: "var(--color-on-surface)" }}
              >
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                placeholder="e.g. STU-2025-001"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow =
                    "0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-outline-variant)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                htmlFor="password"
                style={{ color: "var(--color-on-surface)" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow =
                    "0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-outline-variant)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium"
                htmlFor="confirmPassword"
                style={{ color: "var(--color-on-surface)" }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
                style={{
                  backgroundColor: "var(--color-surface-container-lowest)",
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-primary)";
                  e.target.style.boxShadow =
                    "0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-outline-variant)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-error)" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-60"
              style={{
                backgroundColor: "var(--color-primary-container)",
                color: "var(--color-on-primary)",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              }}
            >
              {loading ? "Creating account\u2026" : "Create account"}
            </button>
          </form>

          <p
            className="mt-6 text-sm text-center"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              Log in
            </Link>
          </p>
        </section>

        <section
          className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-container)" }}
        >
          <div className="text-center relative z-10">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "var(--color-primary-fixed)" }}
            >
              <span
                className="material-symbols-outlined text-7xl"
                style={{
                  color: "var(--color-primary)",
                  fontVariationSettings: "'FILL' 1",
                  fontSize: "80px",
                }}
              >
                person_add
              </span>
            </div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--color-on-surface)" }}
            >
              Join CourseFlow
            </h3>
            <p
              className="text-base mx-auto"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Register for courses, track your credits, and manage your academic
              journey all in one place.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              {["edit_note", "assignment", "trending_up", "celebration"].map(
                (icon) => (
                  <div
                    key={icon}
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-surface-container-lowest)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {icon}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-10"
            style={{ backgroundColor: "var(--color-secondary)" }}
          />
        </section>
      </main>
    </div>
  );
}
