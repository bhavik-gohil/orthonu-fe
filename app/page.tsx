"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  HeartPulse,
  ChevronRight,
  Loader2,
  ArrowRight,
  Activity,
} from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import ProductCard from "@/components/shop/ProductCard";
import { ProductGroupWithProducts } from "@/lib/types";
import { apiCall } from "@/lib/api-client";
import Section from "@/components/ui/Section";
import Footer from "@/components/Footer";
import PartnerWithUsForm from "@/components/forms/PartnerWithUsForm";


export default function Home() {
  const [productGroups, setProductGroups] = useState<ProductGroupWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product groups (incl. their products) from the new API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groups: ProductGroupWithProducts[] = await apiCall("GET", "/shop/product-groups");
        setProductGroups(groups);
      } catch (error) {
        console.error("Failed to fetch product groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-black">
      <HomeNavbar />

      <main className="flex flex-col w-full font-sans">
        {/* Custom Hero Section with DETECT PREVENT HEAL Pillars */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-6 py-16 md:py-20 overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(176,224,226,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(228,213,237,0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 30%, rgba(157,213,239,0.2) 0%, transparent 40%),
              linear-gradient(135deg, #f0f8f9 0%, #FFF 40%, #f8f4fb 70%, #f0f9f5 100%)
            `,
          }}
        >
          <div className="relative z-10 max-w-5xl mx-auto space-y-6">
            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-black text-soft-dark animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Precision <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue to-atlantic-blue">
                Oral Health
              </span>
            </h1>

            {/* Detect Prevent Heal Pill - moved below Precision Oral Health */}
            <div className="flex w-full justify-center">
              <span className="flex items-center px-5 py-1.5 bg-zinc-50 rounded-full border border-brand-blue/40 font-semibold text-xs md:text-md">
                <span className="text-brand-blue">Detect</span>{" "}
                <ArrowRight
                  height={20}
                  width={40}
                  className="text-brand-blue"
                />
                <span className="text-atlantic-blue">Prevent</span>{" "}
                <ArrowRight
                  height={20}
                  width={40}
                  className="text-atlantic-blue"
                />
                <span className="text-bright-cyan">Heal</span>
                <ArrowRight
                  height={20}
                  width={40}
                  className="text-bright-cyan"
                />
                <span className="text-soft-plum">Monitor</span>
              </span>
            </div>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-sm md:text-base text-soft-dark/60 font-medium leading-relaxed">
              A closed-loop clinical + commercial system that turns every
              diagnosis into immediate patient value, standardized care, and
              captured revenue.
            </p>

            {/* DETECT PREVENT HEAL Pillars */}
            <div className="pt-8 space-y-8">
              {/* Mobile: Vertical Stack with Timeline */}
              <div className="flex flex-col md:hidden space-y-0 max-w-sm mx-auto">
                {/* DETECT - Mobile */}
                <div className="relative">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="shrink-0 relative">
                      <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center z-10 relative">
                        <Search size={20} className="text-white" />
                      </div>
                      {/* Timeline line extending to next pillar */}
                      <div className="absolute top-10 left-1/2 w-0.5 h-38 bg-brand-blue/30 -translate-x-0.5"></div>
                    </div>
                    <div className="flex-1 pt-1 pb-8">
                      <div className="mb-2">
                        <span className="text-xs font-bold tracking-widest text-brand-blue">
                          Early Warning System
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-soft-dark mb-2">
                        Detect
                      </h3>
                      <p className="text-sm text-soft-dark/70 leading-relaxed">
                        Chairside identification of conditions — halitosis,
                        caries risk, inflammation, lesions, post-op risk — using
                        simple, fast tools. Triggers action, not just
                        documentation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PREVENT - Mobile */}
                <div className="relative">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="shrink-0 relative">
                      <div className="w-10 h-10 rounded-full bg-atlantic-blue flex items-center justify-center z-10 relative">
                        <ShieldCheck size={20} className="text-white" />
                      </div>
                      {/* Timeline line extending to next pillar */}
                      <div className="absolute top-10 left-1/2 w-0.5 h-38 bg-atlantic-blue/30 -translate-x-0.5"></div>
                    </div>
                    <div className="flex-1 pt-1 pb-8">
                      <div className="mb-2">
                        <span className="text-xs font-bold tracking-widest text-atlantic-blue">
                          Microbiome Reset
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-soft-dark mb-2">
                        Prevent
                      </h3>
                      <p className="text-sm text-soft-dark/70 leading-relaxed">
                        Immediate intervention at the point of care: microbiome
                        reset, desensitization, barrier protection, dry mouth
                        support. Reduces complications and improves outcomes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* HEAL - Mobile */}
                <div className="relative">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="shrink-0 relative">
                      <div className="w-10 h-10 rounded-full bg-bright-cyan flex items-center justify-center z-10 relative">
                        <HeartPulse size={20} className="text-white" />
                      </div>
                      {/* Timeline line extending to next pillar */}
                      <div className="absolute top-10 left-1/2 w-0.5 h-38 bg-bright-cyan/30 -translate-x-0.5"></div>
                    </div>
                    <div className="flex-1 pt-1 pb-8">
                      <div className="mb-2">
                        <span className="text-xs font-bold  tracking-widest text-bright-cyan">
                          Tissue Regeneration
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-soft-dark mb-2">
                        Heal
                      </h3>
                      <p className="text-sm text-soft-dark/70 leading-relaxed">
                        Post-procedure recovery and tissue support: pain relief,
                        wound protection, regeneration. Enhances patient
                        experience and speeds healing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* MONITOR - Mobile */}
                <div className="relative">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-soft-plum flex items-center justify-center">
                        <Activity size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-2">
                        <span className="text-xs font-bold  tracking-widest text-soft-plum">
                          Continuous Care
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-soft-dark mb-2">
                        Monitor
                      </h3>
                      <p className="text-sm text-soft-dark/70 leading-relaxed">
                        Ongoing tracking and assessment of treatment outcomes,
                        patient compliance, and oral health metrics. Ensures
                        sustained results and early intervention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Horizontal Layout with Arrows */}
              <div className="hidden md:flex justify-center gap-2 lg:gap-4 max-w-4xl mx-auto">
                {/* DETECT - Desktop */}
                <div className="text-center space-y-4 flex-1">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-blue flex items-center justify-center">
                      <Search size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold tracking-wide text-brand-blue">
                        Early Warning System
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-soft-dark mb-3">
                      Detect
                    </h3>
                    <p className="text-sm text-soft-dark/70 leading-relaxed">
                      Chairside identification of conditions — halitosis, caries
                      risk, inflammation, lesions, post-op risk — using simple,
                      fast tools. Triggers action, not just documentation.
                    </p>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="shrink-0">
                  <ArrowRight size={32} className="text-brand-blue mt-4" />
                </div>

                {/* PREVENT - Desktop */}
                <div className="text-center space-y-4 flex-1">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-atlantic-blue flex items-center justify-center">
                      <ShieldCheck size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold  tracking-wide text-atlantic-blue">
                        Microbiome Reset
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-soft-dark mb-3">
                      Prevent
                    </h3>
                    <p className="text-sm text-soft-dark/70 leading-relaxed">
                      Immediate intervention at the point of care: microbiome
                      reset, desensitization, barrier protection, dry mouth
                      support. Reduces complications and improves outcomes.
                    </p>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="shrink-0">
                  <ArrowRight size={32} className="text-atlantic-blue mt-4" />
                </div>

                {/* HEAL - Desktop */}
                <div className="text-center space-y-4 flex-1">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-bright-cyan flex items-center justify-center">
                      <HeartPulse size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold tracking-wide text-bright-cyan">
                        Tissue Regeneration
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-soft-dark mb-3">
                      Heal
                    </h3>
                    <p className="text-sm text-soft-dark/70 leading-relaxed">
                      Post-procedure recovery and tissue support: pain relief,
                      wound protection, regeneration. Enhances patient
                      experience and speeds healing.
                    </p>
                  </div>
                </div>

                {/* Arrow 3 */}
                <div className="shrink-0">
                  <ArrowRight size={32} className="text-bright-cyan mt-4" />
                </div>

                {/* MONITOR - Desktop */}
                <div className="text-center space-y-4 flex-1">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-soft-plum flex items-center justify-center">
                      <Activity size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold tracking-wide text-soft-plum">
                        Continuous Care
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-soft-dark mb-3">
                      Monitor
                    </h3>
                    <p className="text-sm text-soft-dark/70 leading-relaxed">
                      Ongoing tracking and assessment of treatment outcomes,
                      patient compliance, and oral health metrics. Ensures
                      sustained results and early intervention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner With Us Form Section */}
        <section
          id="partner-form-section"
          className="py-6 md:py-8 bg-warm-gray"
        >
          <div
            className="max-w-2xl md:mx-auto p-5 md:p-8 border border-brand-blue/30 rounded-3xl bg-white mx-3"
            id="partner-with-us"
          >
            <PartnerWithUsForm />
          </div>
        </section>

        {/* Product Sections by Collection (dynamic) */}
        {!loading && productGroups.length > 0 && (
          <Section bgColor="bg-warm-gray/30">
            <div className="space-y-32">
              {productGroups
                .filter((group) => group.products.length > 0)
                .map((group) => {
                  const accentColor = group.color || "#3B82F6";
                  const isLight = !group.color; // default brand-blue
                  return (
                    <div key={group.id} className="space-y-12">
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${accentColor}20` }}
                          >
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{ backgroundColor: accentColor }}
                            />
                          </div>
                          <h2 className="text-3xl font-black text-soft-dark tracking-tight">
                            {group.name}
                          </h2>
                        </div>
                        <div className="flex-1 h-px bg-zinc-200" />
                        <Link
                          href="/shop"
                          target="_blank"
                          className="text-[10px] font-bold tracking-[0.3em] transition-colors flex items-center gap-2"
                          style={{ color: accentColor }}
                        >
                          View All <ChevronRight size={12} />
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {group.products.slice(0, 4).map((product) => (
                          <ProductCard key={product.id} product={product} hrefPrefix="/shop" linkTarget="_blank" />
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Section>
        )}

        {/* Loading State */}
        {loading && (
          <Section bgColor="bg-warm-gray">
            <div className="flex items-center justify-center min-h-[40vh]">
              <Loader2 className="animate-spin text-brand-blue" size={48} />
            </div>
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
}
