"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const next = searchParams.get("next") || "/admin";
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md bg-white border border-champagne-200 rounded-2xl p-8 shadow-sm"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-gold-600 font-medium">
        Rab & Lee
      </p>
      <h1 className="font-serif text-3xl text-champagne-900 mt-2 mb-2">
        Admin Login
      </h1>
      <p className="text-sm text-champagne-600 mb-6">
        Enter the admin password to manage the gallery.
      </p>

      <label className="block text-sm font-medium text-champagne-800 mb-2">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-champagne-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
        autoFocus
        required
      />

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-3 rounded-lg bg-gold-600 text-white font-medium hover:bg-gold-700 disabled:opacity-60 transition-colors"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Suspense fallback={<div className="text-champagne-600">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
