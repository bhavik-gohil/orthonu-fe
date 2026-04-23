"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiCall } from "@/lib/api-client";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiCall("POST", "admin/login", { email, password });
      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="min-h-screen flex items-center justify-center p-0 bg-zinc-50/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="w-full flex justify-center">
        <Card
          padding="medium"
          className="max-w-md shadow-2xl shadow-brand-blue/5 border-zinc-100/50"
        >
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center text-white shadow-xl shadow-brand-blue/20">
                <ShieldCheck size={32} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-soft-dark tracking-wide  leading-none">
                  Console Access
                </h1>
                <p className="text-sm font-medium text-soft-dark/40">
                  Administrative gate for OrthoNu systems.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
              {error && (
                <Alert
                  type="error"
                  message={error}
                  className="rounded-xl border-rose-100"
                />
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold  tracking-wide text-zinc-400 ml-1">
                  Command Identity
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-blue transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                    placeholder="admin@orthonu.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold  tracking-wide text-zinc-400 ml-1">
                  Override Protocol
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-blue transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-blue text-white rounded-xl text-xs font-bold  tracking-wide shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <span>Authentication</span>
                )}
              </button>
            </form>

            <div className="text-[9px] font-bold  tracking-widest text-zinc-300 pt-4">
              &copy; {new Date().getFullYear()} OrthoNU Tech Systems.
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
