"use client";

import Link from "next/link";
import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json().catch(() => null);
    setLoading(false);

    if (!res.ok) {
      setError(data?.error ?? "Unable to update password.");
      return;
    }

    setMessage(data?.message ?? "Password updated.");
    setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium"
          htmlFor="password"
          style={{ color: "var(--color-on-surface)" }}
        >
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-outline-variant)",
            color: "var(--color-on-surface)",
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium"
          htmlFor="confirmPassword"
          style={{ color: "var(--color-on-surface)" }}
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
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

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-60"
        style={{
          backgroundColor: "var(--color-primary-container)",
          color: "var(--color-on-primary-container)",
        }}
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
        <section className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="material-symbols-outlined text-4xl"
              style={{
                color: "var(--color-primary)",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              password
            </span>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-on-surface)" }}>
              Create a new password
            </h1>
          </div>

          <p className="text-base max-w-2xl" style={{ color: "var(--color-on-surface-variant)" }}>
            Set a new password for your CourseFlow account. This link can only be used once.
          </p>

          <Suspense
            fallback={
              <p className="mt-8 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                Loading…
              </p>
            }
          >
            <ResetPasswordForm />
          </Suspense>

          <p className="mt-6 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
            Need a new link?{" "}
            <Link href="/forgot-password" className="font-medium" style={{ color: "var(--color-primary)" }}>
              Request another reset
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
