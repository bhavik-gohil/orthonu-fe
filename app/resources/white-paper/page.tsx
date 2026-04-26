"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { apiCall } from "@/lib/api-client";
import {
  Download,
  CheckCircle,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

const inputCls =
  "w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm text-soft-dark placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

export default function WhitePaperPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await apiCall("POST", "/api/forms/white-paper", {
        ...form,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      // Auto-trigger download
      const a = document.createElement("a");
      a.href = "/OrthoNu-White-Paper-2025.pdf";
      a.download = "OrthoNu-White-Paper-2025.pdf";
      a.click();
    } catch (err: any) {
      setErrors({
        submit:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-brand-blue text-white py-20 md:py-28 px-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 50%, white 0%, transparent 55%)",
            }}
          />
          <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                <ChevronLeft size={14} /> Resources
              </Link>
              <div className="space-y-2">
                <p className="text-lg font-extrabold tracking-wide text-white/50">
                  OrthoNu® White Paper:
                </p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Revolutionizing Oral Self-Care
                </h1>
                <p className="text-xl text-white/80 font-medium">
                  How Orthodontists Are Redefining Comfort, Prevention, and
                  Patient Experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Banner image below hero ───────────────────────────────────── */}
        <div className="flex w-full  justify-center  pt-16 px-4">
          <Image
            src="/white-paper-orthonu.webp"
            alt="OrthoNu White Paper 2025"
            width={1440}
            height={400}
            className="object-cover w-5xl rounded-3xl"
            priority
          />
        </div>

        {/* ── Content + Form ────────────────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid  gap-16">
            {/* Left: article content */}
            <div className="space-y-10">
              {/* Executive Summary */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-soft-dark">
                  Executive Summary
                </h2>
                <p className="text-soft-dark/70 leading-relaxed">
                  Orthodontic innovation has transformed digital design and
                  treatment precision — but self-care has lagged behind. Between
                  office visits, millions of patients struggle with pain,
                  irritation, and oral hygiene challenges that traditional
                  products can't solve.
                </p>
                <p className="text-soft-dark/70 leading-relaxed">
                  The OrthoNu® Oral Relief Collection changes that. Developed by
                  orthodontists for orthodontic patients, these
                  professional-grade, dissolvable, and biocompatible products
                  soothe discomfort, protect tissues, and promote healing. The
                  Collection's four flagship solutions — Chillin' Strips™,
                  Comfort Tape™, mouth-aid™, and OrthoChewz™ — create the first
                  comprehensive self-care system designed to improve outcomes
                  and reduce emergency visits.
                </p>
              </div>

              {/* What You'll Learn */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-soft-dark">
                  What You'll Learn
                </h2>
                <ul className="space-y-3">
                  {[
                    "The hidden costs of orthodontic emergencies and patient discomfort",
                    "How new bioadhesive and dissolvable technologies outperform wax and gels",
                    "Why orthodontic self-care represents a new category in oral health",
                    "Clinical insights from practicing orthodontists who helped shape the Oral Relief Collection",
                    "The measurable impact on patient satisfaction, adherence, and practice efficiency",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className="text-brand-blue shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-soft-dark/70 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-soft-dark">
                  Key Takeaways
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Users size={20} />,
                      title: "Redefining Oral Self-Care",
                      body: "The Oral Relief Collection empowers patients to manage everyday discomfort safely between visits.",
                    },
                    {
                      icon: <TrendingUp size={20} />,
                      title: "Scientifically Designed",
                      body: "Each product uses dissolvable bioadhesive matrices and biocompatible ingredients that soothe, protect, and heal.",
                    },
                    {
                      icon: <ShieldCheck size={20} />,
                      title: "Practice Benefits",
                      body: "Reduce after-hours calls, reclaim chair time, and elevate the standard of care.",
                    },
                    {
                      icon: <Award size={20} />,
                      title: "Regulatory Confidence",
                      body: "All products designed under FDA Class I (510k exempt) and manufactured under ISO 13485 standards.",
                    },
                  ].map(({ icon, title, body }) => (
                    <div
                      key={title}
                      className="flex gap-4 p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-soft-dark">
                          {title}
                        </p>
                        <p className="text-xs text-soft-dark/60 leading-relaxed mt-0.5">
                          {body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why It Matters */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-soft-dark">
                  Why It Matters
                </h2>
                <p className="text-soft-dark/70 leading-relaxed">
                  For orthodontists, patient comfort isn't just about
                  convenience — it's about outcomes. By bridging the gap between
                  professional treatment and at-home care, OrthoNu® is helping
                  practices save time, reduce costs, and build stronger patient
                  relationships.
                </p>
                <p className="text-soft-dark/70 leading-relaxed">
                  This white paper details how clinical innovation and
                  scientific empathy are transforming orthodontic self-care into
                  a new pillar of oral health.
                </p>
              </div>
            </div>
          </div>
          {/* Right: download form */}
          <div ref={formRef} className="max-w-5xl mx-auto grid  gap-16">
            <div className="sticky top-24">
              {submitted ? (
                <div className="bg-white border border-zinc-100 rounded-2xl p-8 shadow-lg text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-soft-dark">
                      Your download is ready!
                    </h3>
                    <p className="text-sm text-soft-dark/60">
                      The PDF should have started downloading automatically. If
                      not, click below.
                    </p>
                  </div>
                  <a
                    href="/OrthoNu-White-Paper-2025.pdf"
                    download="OrthoNu-White-Paper-2025.pdf"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all shadow-lg shadow-brand-blue/20"
                  >
                    <Download size={16} strokeWidth={3} />
                    Download PDF
                  </a>
                </div>
              ) : (
                <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-lg">
                  {/* Mobile/tablet: image on top, form below. Desktop: image left, form right */}
                  <div className="flex flex-col md:flex-row">
                    {/* Preview image — A4 proportions (400×572) */}
                    <div className="relative w-full md:w-72 shrink-0 aspect-400/572 md:aspect-auto">
                      <Image
                        src="/white-paper-preview-400x572.webp"
                        alt="OrthoNu White Paper Preview"
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6 flex-1">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-soft-dark">
                          Download the White Paper
                        </h3>
                        <p className="text-sm text-soft-dark/50">
                          Enter your details for instant access to the free PDF.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">
                              First Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Jane"
                              value={form.firstName}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  firstName: e.target.value,
                                }))
                              }
                              className={inputCls}
                            />
                            {errors.firstName && (
                              <p className="text-[10px] text-rose-500">
                                {errors.firstName}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Smith"
                              value={form.lastName}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  lastName: e.target.value,
                                }))
                              }
                              className={inputCls}
                            />
                            {errors.lastName && (
                              <p className="text-[10px] text-rose-500">
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-zinc-500">
                            Email *
                          </label>
                          <input
                            type="email"
                            placeholder="jane@practice.com"
                            value={form.email}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                          {errors.email && (
                            <p className="text-[10px] text-rose-500">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {errors.submit && (
                          <p className="text-xs text-rose-500 font-medium bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
                            {errors.submit}
                          </p>
                        )}

                        {/* <div className="flex w-full justify-center"> */}
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full font-semibold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5"
                        >
                          {submitting ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <>
                              <Download size={16} strokeWidth={3} /> Download
                            </>
                          )}
                        </button>
                        {/* </div> */}

                        <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                          By submitting, you agree to receive occasional updates
                          from OrthoNu. We respect your privacy and will never
                          share your information.
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
