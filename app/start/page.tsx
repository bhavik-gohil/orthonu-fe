"use client";

import React, { useState, FormEvent } from "react";
import { apiCall } from "@/lib/api-client";
import { 
  CheckCircle2, 
  ChevronRight, 
  Monitor, 
  Package, 
  Users, 
  Loader2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function StartPilotPage() {
  const [formData, setFormData] = useState({
    name: "",
    practiceName: "",
    numberOfLocations: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiCall("POST", "/api/forms/request-pilot", {
        ...formData,
        numberOfLocations: parseInt(formData.numberOfLocations),
        submittedAt: new Date().toISOString(),
      });

      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cloud-blue flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6 border border-atlantic-blue/10 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-fresh-mint/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-fresh-mint w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-soft-dark">Thank You!</h2>
            <p className="text-soft-dark/70 font-medium">
              We'll reach out within 24 hours. — Sima, sima@orthonu.com
            </p>
          </div>
          {/* <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-atlantic-blue font-bold hover:gap-3 transition-all"
          >
            Visit our shop <ArrowRight size={16} />
          </Link> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-blue/30">
      {/* ── Section 1: Hero ── */}
      <section className="relative overflow-hidden bg-cloud-blue pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-atlantic-blue/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atlantic-blue/10 text-atlantic-blue text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck size={14} /> EDC 2026 Exclusive
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-soft-dark leading-[0.95] tracking-tighter">
              Start Your <span className="text-atlantic-blue">OrthoNu Pilot</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-soft-dark/80 leading-tight">
              Zero risk. 7–10 days. Any specialty. Any location.
            </p>
            <p className="text-lg text-soft-dark/60 font-medium max-w-xl">
              Scan this at Enterprise Dental Connect 2026 — we'll set up your pilot within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Features ── */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Feature 1 */}
            <div className="space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-atlantic-blue group-hover:scale-110 group-hover:bg-brand-blue/20 transition-all duration-300">
                <Monitor size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-soft-dark leading-snug">
                  Chrome Overlay
                </h3>
                <p className="text-soft-dark/70 font-medium leading-relaxed">
                  The Chrome overlay installed on your practice's computers — surfaces OrthoNu recommendations automatically as CDT codes are entered.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-soft-plum/10 flex items-center justify-center text-soft-plum group-hover:scale-110 group-hover:bg-soft-plum/20 transition-all duration-300">
                <Package size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-soft-dark leading-snug">
                  Full Product Supply
                </h3>
                <p className="text-soft-dark/70 font-medium leading-relaxed">
                  Full pilot product supply included — no upfront purchase required to get your teams started.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-fresh-mint/10 flex items-center justify-center text-fresh-mint group-hover:scale-110 group-hover:bg-fresh-mint/20 transition-all duration-300">
                <Users size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-soft-dark leading-snug">
                  Training & Support
                </h3>
                <p className="text-soft-dark/70 font-medium leading-relaxed">
                  Protocol cards, staff training, and outcome tracking handled by OrthoNu experts throughout the pilot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: The Form ── */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-soft-dark rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-soft-dark/30">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-atlantic-blue/20 to-transparent pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black leading-none">
                  Ready to <br/>Optimize?
                </h2>
                <p className="text-white/60 text-lg font-medium max-w-sm">
                  Complete this brief form and our team will prepare your custom pilot implementation plan.
                </p>
              </div>

              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 px-1">Name</label>
                      <input 
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:bg-white/10 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 px-1">Email</label>
                      <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:bg-white/10 transition-all font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 px-1">Practice / DSO Name</label>
                      <input 
                        required
                        type="text"
                        name="practiceName"
                        value={formData.practiceName}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:bg-white/10 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/40 px-1">Number of locations</label>
                      <input 
                        required
                        type="number"
                        name="numberOfLocations"
                        value={formData.numberOfLocations}
                        onChange={handleChange}
                        min="1"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:bg-white/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-bold px-1 animate-pulse">
                      {error}
                    </p>
                  )}

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-brand-blue text-soft-dark font-extrabold py-4 rounded-full hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>Request My Pilot <ArrowRight size={20} /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding (Minimal) */}
      <footer className="py-12 border-t border-zinc-100 bg-warm-gray/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <img src="/orthonu-you-got-this.png" alt="OrthoNu" className="h-18" />
          <p className="text-xs font-bold tracking-[0.2em] text-soft-dark/70">
            © 2026 OrthoNu. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
