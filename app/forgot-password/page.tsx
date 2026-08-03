"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setResetUrl("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => null);
    setLoading(false);

    if (!res.ok) {
      setError(data?.error ?? "Unable to create reset link.");
      return;
    }

    setMessage(data?.message ?? "Reset link created.");
    if (typeof data?.resetUrl === "string") {
      setResetUrl(data.resetUrl);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "var(--color-surface-container-low)" }}
    >
      <main
        className="w-full max-w-3xl rounded-2xl overflow-hidden border card-shadow"
        style={{
          backgroundColor: "var(--color-surface-container-lowest)",
          borderColor: "var(--color-outline-variant)",
        }}
      >
        <section
          className="p-8 md:p-12"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-primary-container) 70%, transparent), var(--color-surface-container-lowest))",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span
              className="material-symbols-outlined text-4xl"
              style={{
                color: "var(--color-primary)",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              lock_reset
            </span>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-on-surface)" }}>
              Reset your password
            </h1>
          </div>

          <p className="text-base max-w-2xl" style={{ color: "var(--color-on-surface-variant)" }}>
            Enter your university email and the system will generate a one-time reset link.
            In production you would send that link by email.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </div>

            {message && (
              <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
                {message}
              </p>
            )}

            {error && (
              <p className="text-sm font-medium" style={{ color: "var(--color-error)" }}>
                {error}
              </p>
            )}

            {resetUrl && (
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-outline-variant)",
                }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: "var(--color-on-surface)" }}>
                  Reset link
                </p>
                <Link
                  href={resetUrl}
                  className="text-sm font-semibold break-all"
                  style={{ color: "var(--color-primary)" }}
                >
                  {resetUrl}
                </Link>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
                style={{
                  backgroundColor: "var(--color-primary-container)",
                  color: "var(--color-on-primary-container)",
                }}
              >
                {loading ? "Generating..." : "Send reset link"}
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold border transition-colors"
                style={{
                  borderColor: "var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                Back to login
              </Link>
            </div>
          </form>

          <p className="mt-6 text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
            The generated link is valid for one hour and can only be used once.
          </p>
        </section>
      </main>
    </div>
  );
}
