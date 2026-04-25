"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import OtpVerification from "@/components/auth/OtpVerification";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/shop";

  // Redirect if already logged in (also fires after successful login sets user)
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login({ email, password });
      if (data.status === "NOT_VERIFIED") {
        setShowOtp(true);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return (
      <div className="bg-white p-12 rounded-3xl">
        <OtpVerification 
        email={email} 
        type="registration" 
        onSuccess={() => {
          window.location.href = redirect;
        }}
        onBack={() => setShowOtp(false)}
      />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md space-y-8" padding="medium">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-soft-dark tracking-tight">
          Welcome back
        </h1>
        <p className="text-soft-dark/50 font-medium">
          Please enter your details to sign in
        </p>
      </div>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="email"
            icon={<Mail size={18} />}
            placeholder="Email address"
            value={email}
            onChange={setEmail}
            required
          />
          <Input
            type="password"
            icon={<Lock size={18} />}
            placeholder="Password"
            value={password}
            onChange={setPassword}
            required
          />
        </div>

        <div className="flex w-full justify-center">
          <Button
            type="submit"
            loading={loading}
            fullWidth={false}
            icon={<ArrowRight size={16} strokeWidth={3} />}
          >
            Sign In
          </Button>
        </div>
      </form>

      <p className="text-center text-zinc-500 font-medium text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/shop/register"
          className="text-brand-blue hover:underline font-bold"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col bg-warm-gray">
      <Container
        as="main"
        className="flex-1 flex items-center justify-center py-8"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin text-brand-blue" size={36} />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </Container>
    </div>
  );
}
