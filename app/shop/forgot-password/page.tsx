"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import OtpVerification from "@/components/auth/OtpVerification";

type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = (data: any) => {
    setResetToken(data.resetToken);
    setStep("reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await resetPassword({ token: resetToken, newPassword: password });
      setStep("success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-warm-gray min-h-screen">
      <Container
        as="main"
        className="flex-1 flex items-center justify-center py-12"
      >
        <Card className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500" padding="medium">
          
          {step === "email" && (
            <>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mx-auto mb-4">
                  <KeyRound size={32} />
                </div>
                <h1 className="text-3xl font-black text-soft-dark tracking-tight uppercase">
                  Forgot Password
                </h1>
                <p className="text-soft-dark/50 font-medium">
                  Enter your email to receive a verification code
                </p>
              </div>

              <Alert type="error" message={error} />

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <Input
                  type="email"
                  icon={<Mail size={18} />}
                  placeholder="Email address"
                  value={email}
                  onChange={setEmail}
                  required
                />

                <div className="flex w-full justify-center">
                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth={false}
                    icon={<ArrowRight size={16} strokeWidth={3} />}
                  >
                    Send Verification Code
                  </Button>
                </div>
              </form>

              <p className="text-center text-zinc-500 font-medium text-sm">
                Remember your password?{" "}
                <Link
                  href="/shop/login"
                  className="text-brand-blue hover:underline font-bold"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {step === "otp" && (
            <OtpVerification
              email={email}
              type="password_reset"
              onSuccess={handleOtpSuccess}
              onBack={() => setStep("email")}
            />
          )}

          {step === "reset" && (
            <>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mx-auto mb-4">
                  <Lock size={32} />
                </div>
                <h1 className="text-3xl font-black text-soft-dark tracking-tight uppercase">
                  New Password
                </h1>
                <p className="text-soft-dark/50 font-medium">
                  Create a secure password for your account
                </p>
              </div>

              <Alert type="error" message={error} />

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    type="password"
                    icon={<Lock size={18} />}
                    placeholder="New Password"
                    value={password}
                    onChange={setPassword}
                    required
                  />
                  <Input
                    type="password"
                    icon={<ShieldCheck size={18} />}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
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
                    Reset Password
                  </Button>
                </div>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200 mx-auto animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-soft-dark tracking-tight uppercase">
                  Password Reset!
                </h1>
                <p className="text-soft-dark/50 font-medium">
                  Your password has been successfully updated.
                </p>
              </div>
              <Link
                href="/shop/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:shadow-xl transition-all"
              >
                Sign In with New Password
              </Link>
            </div>
          )}

        </Card>
      </Container>
    </div>
  );
}
