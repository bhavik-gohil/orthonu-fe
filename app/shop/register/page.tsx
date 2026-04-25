"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Stethoscope,
  Hash,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Toggle from "@/components/ui/Toggle";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import OtpVerification from "@/components/auth/OtpVerification";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-warm-gray">
          <Loader2 className="animate-spin text-brand-blue" size={32} />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "regular",
    profession: "",
    npiNumber: "",
    emailProfessional: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const { register, user } = useAuth();
  const searchParams = useSearchParams();

  // Sync state from URL on load
  useEffect(() => {
    const prof = searchParams.get("professional");
    if (prof === "yes") {
      setFormData((prev) => ({ ...prev, userType: "professional" }));
    } else if (prof === "no") {
      setFormData((prev) => ({ ...prev, userType: "regular" }));
    }
  }, [searchParams]);

  // Update URL when professional toggle changes
  const toggleProfessional = (checked: boolean) => {
    const newUserType = checked ? "professional" : "regular";
    setFormData({ ...formData, userType: newUserType });

    const params = new URLSearchParams(searchParams.toString());
    params.set("professional", checked ? "yes" : "no");
    router.replace(`/shop/register?${params.toString()}`, { scroll: false });
  };

  // Redirect logged-in users away from register page
  useEffect(() => {
    if (user) {
      router.push("/shop");
    }
  }, [user, router]);

  if (user) return null;

  const validateProfessionalEmail = (email: string) => {
    const forbiddenDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    return !forbiddenDomains.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.userType === "professional") {
      if (!validateProfessionalEmail(formData.emailProfessional)) {
        setError(
          "Professional email cannot use public domains (Gmail, Yahoo, Outlook, etc.). Please use your work email.",
        );
        setLoading(false);
        return;
      }
    }

    try {
      const res = await register(formData);
      if (res.status === "PENDING_VERIFICATION") {
        setEmailForOtp(formData.email);
        setShowOtp(true);
      } else if (res.message && formData.userType === "professional") {
        setSuccess(res.message);
      } else {
        window.location.href = "/shop";
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-warm-gray">
      <Container
        as="main"
        className="flex-1 flex items-center justify-center py-8"
      >
        <Card className="w-full max-w-md space-y-8" padding="medium">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-soft-dark tracking-tight">
              Join OrthoNu 
            </h1>
            <p className="text-sm text-soft-dark/50 font-medium">
              For Precision Oral Health
            </p>
          </div>

          {showOtp ? (
            <OtpVerification 
              email={emailForOtp} 
              type="registration" 
              onSuccess={() => {
                // The cookie is already set by the backend, so a refresh will log them in
                window.location.href = "/shop";
              }}
              onBack={() => setShowOtp(false)}
            />
          ) : (
            <>
              <Alert type="error" message={error} />
              <Alert type="success" message={success} />

              {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  icon={<User size={18} />}
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                  required
                />
                <Input
                  icon={<Mail size={18} />}
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                  required
                />
              </div>

              <Input
                icon={<Lock size={18} />}
                name="password"
                type="password"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })}
                required
              />

              <Toggle
                label="Are you a Professional?"
                checked={formData.userType === "professional"}
                onChange={toggleProfessional}
              />

              {formData.userType === "professional" && (
                <div className="space-y-4 border-zinc-100 transition-all animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-xs font-bold tracking-wide text-brand-blue px-1 mb-2">
                    Professional Details
                  </h3>
                  <Select
                    icon={<Stethoscope size={18} />}
                    name="profession"
                    value={formData.profession}
                    onChange={(v) =>
                      setFormData({ ...formData, profession: v })
                    }
                    placeholder="Select Profession"
                    options={[
                      { value: "DSO", label: "DSO" },
                      { value: "OSO", label: "OSO" },
                      { value: "Professional", label: "Professional" },
                    ]}
                    required
                  />
                  <Input
                    icon={<Hash size={18} />}
                    name="npiNumber"
                    placeholder="NPI Number"
                    value={formData.npiNumber}
                    onChange={(v) => setFormData({ ...formData, npiNumber: v })}
                    required
                  />
                  <Input
                    icon={<Mail size={18} />}
                    name="emailProfessional"
                    type="email"
                    placeholder="Professional Email"
                    value={formData.emailProfessional}
                    onChange={(v) =>
                      setFormData({ ...formData, emailProfessional: v })
                    }
                    required
                    note="* Professional emails cannot use Gmail, Yahoo, or Outlook."
                  />
                </div>
              )}

              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth={false}
                  icon={<ArrowRight size={16} strokeWidth={3} />}
                >
                  Create Account
                </Button>
              </div>
            </form>
          )}

              <p className="text-center text-zinc-500 font-medium text-sm">
                Already have an account?{" "}
                <Link
                  href="/shop/login"
                  className="text-brand-blue hover:underline font-bold"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {success && (
            <div className="pt-4 text-center">
              <Link
                href="/shop"
                className="text-brand-blue hover:underline font-bold transition-all"
              >
                Return to shop
              </Link>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
}
