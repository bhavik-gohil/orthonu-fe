"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShieldCheck,
  HeartPulse,
  ChevronRight,
  Loader2,
  ArrowRight,
  Activity,
  Quote,
  GraduationCap,
  Award,
} from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import ProductCard from "@/components/shop/ProductCard";
import { ProductGroupWithProducts } from "@/lib/types";
import { apiCall } from "@/lib/api-client";
import Section from "@/components/ui/Section";
import Footer from "@/components/Footer";
import PartnerWithUsForm from "@/components/forms/PartnerWithUsForm";
import { getShopUrl } from "@/lib/subdomains";

const PILLARS = [
  {
    icon: Search,
    label: "Early Warning System",
    title: "Detect",
    desc: "Chairside identification of conditions — halitosis, caries risk, inflammation, lesions, post-op risk — using simple, fast tools. Triggers action, not just documentation.",
    color: "var(--nu-blue)",
    textClass: "text-brand-blue",
    bgClass: "bg-brand-blue",
  },
  {
    icon: ShieldCheck,
    label: "Microbiome Reset",
    title: "Prevent",
    desc: "Immediate intervention at the point of care: microbiome reset, desensitization, barrier protection, dry mouth support. Reduces complications and improves outcomes.",
    color: "var(--atlantic-blue)",
    textClass: "text-atlantic-blue",
    bgClass: "bg-atlantic-blue",
  },
  {
    icon: HeartPulse,
    label: "Tissue Regeneration",
    title: "Heal",
    desc: "Post-procedure recovery and tissue support: pain relief, wound protection, regeneration. Enhances patient experience and speeds healing.",
    color: "var(--bright-cyan)",
    textClass: "text-bright-cyan",
    bgClass: "bg-bright-cyan",
  },
  {
    icon: Activity,
    label: "Continuous Care",
    title: "Monitor",
    desc: "Ongoing tracking and assessment of treatment outcomes, patient compliance, and oral health metrics. Ensures sustained results and early intervention.",
    color: "var(--soft-plum)",
    textClass: "text-soft-plum",
    bgClass: "bg-soft-plum",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "This is so innovative. It is going to revolutionize orthodontic care.",
    name: "Philippe Salah",
    title: "CEO, Dental Monitoring",
  },
  {
    quote:
      "Tweakz is a genius product. It is going to change the way patients manage their oral care once they leave the office.",
    name: "Dr. Jamie Reynolds",
    title: "Orthodontic Partners, OrthoFi & Reynolds Orthodontics",
  },
  {
    quote:
      "Tweakz is better than the instruments we use in the office. My whole team loves them and thinks every new patient should have one!",
    name: "Dr. David Sarver",
    title: "Sarver Orthodontics",
  },
];

export default function Home() {
  const [productGroups, setProductGroups] = useState<
    ProductGroupWithProducts[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [shopUrl, setShopUrl] = useState("/shop");

  useEffect(() => {
    setShopUrl(getShopUrl());
  }, []);

  // Fetch product groups (incl. their products) from the new API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groups: ProductGroupWithProducts[] = await apiCall(
          "GET",
          "/shop/product-groups",
        );
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
        {/* ─────────────────────────────────────────────────────────────
            HERO — Split Panel
            Left: headline + tagline pill + subtitle + CTAs + trust badges
            Right: product image
        ───────────────────────────────────────────────────────────── */}
        <section className="relative bg-cloud-blue overflow-hidden">
          {/* Decorative right-side wash */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-brand-blue/[0.04]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />
            <div className="absolute -top-20 right-1/4 w-64 h-64 bg-soft-plum/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-12 w-full py-16 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* ── Left: Text content ── */}
              <div className="space-y-6 order-2 lg:order-1 text-center lg:text-left">
                {/* Eyebrow */}
                {/* <div className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="h-px w-6 bg-atlantic-blue hidden lg:block" />
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-atlantic-blue">
                    Orthodontic Self-Care Solutions
                  </span>
                </div> */}

                {/* H1 — existing text kept */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-soft-dark leading-[1.1] tracking-tight">
                  Precision{" "}
                  <div className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue to-atlantic-blue">
                    Oral Health
                  </div>
                </h1>

                {/* Detect → Prevent → Heal → Monitor pill — existing content kept */}
                <div className="flex justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white rounded-full border border-brand-blue/30 text-xs font-semibold shadow-sm">
                    <span className="text-brand-blue">Detect</span>
                    <ArrowRight size={12} className="text-zinc-300" />
                    <span className="text-atlantic-blue">Prevent</span>
                    <ArrowRight size={12} className="text-zinc-300" />
                    <span className="text-bright-cyan">Heal</span>
                    <ArrowRight size={12} className="text-zinc-300" />
                    <span className="text-soft-plum">Monitor</span>
                  </span>
                </div>

                {/* Subtitle — existing text kept */}
                <p className="max-w-lg mx-auto lg:mx-0 text-sm text-soft-dark/60 font-medium leading-relaxed">
                  {/* A closed-loop clinical + commercial system that turns every
                  diagnosis into immediate patient value, standardized care, and
                  captured revenue. */}
                  OrthoNu® redefines orthodontics with innovative self-care
                  products. Created by orthodontists, our solutions focus on
                  emergency care, oral hygiene, and aesthetics. Supported by
                  industry leaders and the University of Pennsylvania, we're
                  advancing oral health science to enhance patient experience
                  and practice efficiency.
                </p>

                {/* CTAs — existing links kept */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                  <Link
                    href={shopUrl}
                    target="_blank"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full font-semibold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5"
                  >
                    Shop Solutions
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                  <a
                    href="#partner-with-us"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-warm-gray text-soft-dark border border-warm-gray rounded-full font-semibold text-sm tracking-wide transition-all hover:border-brand-blue hover:text-atlantic-blue"
                  >
                    Partner with Us
                  </a>
                </div>

                {/* Trust badges — additive content */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-2">
                  <span className="flex items-center gap-2 text-[11px] text-soft-dark/50 font-medium">
                    <GraduationCap
                      size={13}
                      className="text-atlantic-blue shrink-0"
                    />
                    UPenn School of Dental Medicine Partner
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-soft-dark/50 font-medium">
                    <Award size={13} className="text-atlantic-blue shrink-0" />
                    Patented Technology
                  </span>
                </div>
              </div>

              {/* ── Right: Product image — additive ── */}
              <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg lg:max-w-none rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-atlantic-blue/10 bg-white">
                  <Image
                    src="/oral-relief-kitz2-updated-1200x714.png"
                    alt="OrthoNu Oral Relief Kitz — Professional oral care solutions"
                    width={1200}
                    height={714}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Floating product label */}
                  {/* <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest uppercase text-atlantic-blue shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                      Oral Relief Kitz™
                    </span>
                  </div> */}
                </div>
                {/* Decorative blob behind image */}
                <div className="absolute -z-10 -bottom-8 -right-8 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            DETECT / PREVENT / HEAL / MONITOR PILLARS
            All original content preserved — cosmetic reskin only
        ───────────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
            {/* Section header */}
            <div className="text-center space-y-3 mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-soft-dark tracking-tight">
                Oral Intelligence Layer™
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-atlantic-blue" />
                <span className="text-[11px] font-bold tracking-wide text-atlantic-blue">
                  A closed-loop clinical + commercial system that turns every
                  diagnosis into immediate patient value, standardized care, and
                  captured revenue.
                </span>
                <span className="h-px w-6 bg-atlantic-blue" />
              </div>
            </div>

            {/* Desktop: horizontal cards | Tablet: 2-col | Mobile: stacked */}
            <div className="pt-8 space-y-8">
              {/* Mobile: Vertical Stack with Timeline */}
              <div className="flex flex-col md:hidden space-y-0 max-w-sm mx-auto">
                {PILLARS.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={pillar.title} className="relative">
                      {/* Timeline line extending to next pillar */}
                      {i < PILLARS.length - 1 && (
                        <div
                          className={`absolute top-10 left-5 bottom-0 w-0.5 ${pillar.bgClass}/30 -translate-x-0.5`}
                        ></div>
                      )}
                      <div className="flex items-start space-x-4 text-left">
                        <div className="shrink-0 relative">
                          <div
                            className={`w-10 h-10 rounded-full ${pillar.bgClass} flex items-center justify-center z-10 relative`}
                          >
                            <Icon size={20} className="text-white" />
                          </div>
                        </div>
                        <div
                          className={`flex-1 pt-1 ${i < PILLARS.length - 1 ? "pb-8" : ""}`}
                        >
                          <div className="mb-2">
                            <span
                              className={`text-xs font-bold tracking-widest ${pillar.textClass}`}
                            >
                              {pillar.label}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-soft-dark mb-2">
                            {pillar.title}
                          </h3>
                          <p className="text-sm text-soft-dark/70 leading-relaxed">
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop: Horizontal Layout with Arrows */}
              <div className="hidden md:flex justify-center gap-2 lg:gap-4 max-w-7xl mx-auto">
                {PILLARS.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="flex items-start flex-1 gap-2 lg:gap-4"
                    >
                      <div className="text-center space-y-4 flex-1">
                        <div className="flex justify-center">
                          <div
                            className={`w-16 h-16 rounded-full ${pillar.bgClass} flex items-center justify-center`}
                          >
                            <Icon size={28} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="mb-2">
                            <span
                              className={`text-sm font-semibold tracking-wide ${pillar.textClass}`}
                            >
                              {pillar.label}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-soft-dark mb-3">
                            {pillar.title}
                          </h3>
                          <p className="text-sm text-soft-dark/70 leading-relaxed">
                            {pillar.desc}
                          </p>
                        </div>
                      </div>

                      {/* Arrow between pillars */}
                      {i < PILLARS.length - 1 && (
                        <div className="shrink-0">
                          <ArrowRight
                            size={32}
                            className={`${pillar.textClass} mt-4`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA row — original buttons kept */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12">
              <Link
                href={shopUrl}
                target="_blank"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full font-semibold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5"
              >
                Shop Solutions
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <a
                href="#partner-with-us"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-warm-gray text-soft-dark border border-warm-gray rounded-full font-semibold text-sm tracking-wide transition-all hover:border-brand-blue hover:text-atlantic-blue"
              >
                Partner with Us
              </a>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            ABOUT ORTHONU — Additive section
            Copy sourced from orthonu.com / brand identity
        ───────────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-cloud-blue">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <div className="relative">
                <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-atlantic-blue/10">
                  <Image
                    src="/Final-Simas-Hands-Silo-Centered-1200x670.png"
                    alt="Dr. Sima Yakoby Epstein, DMD — OrthoNu Founder"
                    width={1200}
                    height={670}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Floating credential badge */}
                {/* <div className="absolute -bottom-4 right-4 md:right-6 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-zinc-100">
                  <div className="w-8 h-8 bg-atlantic-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <GraduationCap size={15} className="text-atlantic-blue" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black tracking-widest uppercase text-zinc-400 leading-none mb-0.5">
                      Advisory Partner
                    </div>
                    <div className="text-[10px] font-bold text-soft-dark leading-tight">
                      UPenn School of
                      <br />
                      Dental Medicine
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Text */}
              <div className="space-y-5 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-atlantic-blue">
                    Our Mission
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-soft-dark tracking-tight leading-tight">
                  Pioneering a New Era
                  <br className="hidden md:block" /> in Orthodontics
                </h2>

                <p className="text-sm md:text-base text-soft-dark/60 font-medium leading-relaxed">
                  At OrthoNu®, we&apos;re pioneering a new era in orthodontics,
                  created by an orthodontist for orthodontists. Our mission is
                  to eliminate the discomfort and embarrassment of wearing
                  braces or aligners by introducing professional-grade,
                  self-care products that redefine the standard of care.
                </p>

                <p className="text-sm md:text-base text-soft-dark/60 font-medium leading-relaxed">
                  As the first company focused on driving innovation in oral
                  care, we support both patient experience and practice
                  efficiencies. With the backing of an advisory board of
                  industry leaders and partnerships with the University of
                  Pennsylvania School of Dental Medicine, we are committed to
                  advancing the science of oral health.
                </p>

                <p className="text-sm font-semibold text-atlantic-blue italic font-serif pt-1">
                  &ldquo;Because at OrthoNu®, we believe mouthcare is
                  healthcare.&rdquo;
                </p>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sm font-bold text-atlantic-blue transition-all hover:gap-3"
                  >
                    Read More About OrthoNu®
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            TESTIMONIALS — Additive section
            Quotes from orthonu.com
        ───────────────────────────────────────────────────────────── */}
        {/* <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
            <div className="text-center space-y-3 mb-12 md:mb-16">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-atlantic-blue" />
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-atlantic-blue">
                  Testimonials
                </span>
                <span className="h-px w-6 bg-atlantic-blue" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-soft-dark tracking-tight">
                What Doctors Are Saying
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="relative p-6 md:p-8 rounded-2xl bg-warm-gray border border-transparent hover:border-zinc-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-4"
                >
                  <Quote size={22} className="text-brand-blue/30" />
                  <p className="text-sm text-soft-dark/70 leading-relaxed font-medium italic font-serif">
                    {t.quote}
                  </p>
                  <div className="pt-3 border-t border-zinc-200">
                    <div className="text-sm font-bold text-soft-dark">
                      {t.name}
                    </div>
                    <div className="text-xs text-soft-dark/50 font-medium mt-0.5">
                      {t.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* ─────────────────────────────────────────────────────────────
            PARTNER WITH US FORM — Original section unchanged
        ───────────────────────────────────────────────────────────── */}
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

        {/* ─────────────────────────────────────────────────────────────
            PRODUCT SECTIONS — Original section unchanged
        ───────────────────────────────────────────────────────────── */}
        {!loading && productGroups.length > 0 && (
          <Section bgColor="bg-warm-gray/30">
            <div className="space-y-32">
              {productGroups
                .filter((group) => group.products.length > 0)
                .map((group) => {
                  const accentColor = group.color || "#3B82F6";
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
                          <h2 className="text-3xl font-bold text-soft-dark tracking-tight">
                            {group.name}
                          </h2>
                        </div>
                        <div className="flex-1 h-px bg-zinc-200" />
                        <Link
                          href={shopUrl}
                          target="_blank"
                          className="text-[10px] font-bold tracking-[0.3em] transition-colors flex items-center gap-2"
                          style={{ color: accentColor }}
                        >
                          View All <ChevronRight size={12} />
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {group.products.slice(0, 4).map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            hrefPrefix={shopUrl}
                            linkTarget="_blank"
                          />
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
