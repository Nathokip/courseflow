"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock login — replace with real auth when backend is ready
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    // Simulate async login
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 800);
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
        {/* ── Left: Form ── */}
        <section className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Logo */}
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

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--color-on-surface)" }}
            >
              Welcome back
            </h2>
            <p
              className="text-base"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Please enter your academic credentials to access the portal.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
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

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                className="text-sm font-medium flex justify-between"
                htmlFor="password"
                style={{ color: "var(--color-on-surface)" }}
              >
                Password
                <a
                  href="#"
                  className="text-sm font-medium transition-colors"
                  style={{ color: "var(--color-primary)" }}
                >
                  Forgot password?
                </a>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
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

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded"
                style={{ accentColor: "var(--color-primary)" }}
              />
              <label
                htmlFor="remember"
                className="text-sm"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-error)" }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
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
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Need help? Contact{" "}
              <a
                href="#"
                className="underline"
                style={{ color: "var(--color-primary)" }}
              >
                IT Support
              </a>
            </p>
          </div>
        </section>

        {/* ── Right: Illustration (desktop only) ── */}
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
                school
              </span>
            </div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--color-on-surface)" }}
            >
              Your Academic Portal
            </h3>
            <p
              className="text-base mx-auto"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Manage your courses, track credits, and stay on top of your
              academic journey.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              {["book", "calendar_month", "grade", "groups"].map((icon) => (
                <div
                  key={icon}
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative circles */}
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
