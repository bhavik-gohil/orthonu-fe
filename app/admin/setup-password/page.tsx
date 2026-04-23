"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiCall } from "@/lib/api-client";
import { Loader2, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SetupPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await apiCall("POST", "admin/reset-password", { newPassword: password });
      await apiCall("POST", "admin/logout");
      setSuccess(true);
      () => {
        router.push("/admin/login");
      };
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-10 text-center">
          <div className="flex justify-center mb-6 text-green-500">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Password Updated!
          </h2>
          <p className="text-sm text-zinc-500 mb-8">
            Your account is now active. Please log in with your new password to
            continue.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-blue/20 hover:opacity-90 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6 text-black">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-10">
        <div className="flex flex-col items-center gap-6 mb-10">
          <Image
            src="/logo-nu.png"
            alt="OrthoNu Logo"
            width={140}
            height={30}
            className="mb-2"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Setup Your Account
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Please set a new password to activate your account
            </p>
          </div>
        </div>

        <form
          onSubmit={handleReset}
          className="flex flex-col gap-6 text-black font-sans"
        >
          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-sm animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={18} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 px-1 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-blue transition-colors"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all text-black"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 px-1 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-blue transition-colors"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-blue/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Activate Account"
            )}
          </button>

          <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
            Security tip: Use a strong password with at least 8 characters,
            including letters, numbers, and symbols.
          </p>
        </form>
      </div>
    </div>
  );
}
