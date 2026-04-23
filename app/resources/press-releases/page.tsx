import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const pressReleases = [
  {
    slug: "young-innovations-partnership",
    date: "September 22, 2025",
    title: "OrthoNu® Expands U.S. Market Reach Through Distribution Partnership with Young Innovations",
    excerpt: "OrthoNu® has partnered with Young Innovations to expand nationwide access to its professional-grade orthodontic self-care products. This collaboration enhances patient experience, reduces emergencies, and helps practices operate more efficiently.",
  },
  {
    slug: "orthonu-nualtis-partnership",
    date: "August 7, 2025",
    title: "OrthoNu® Forms Strategic Partnership with Nualtis to Launch Innovative Oral Thin-Film Products",
    excerpt: "OrthoNu®, the first company solely focused on innovating self-care solutions for orthodontic patients, today announced a strategic partnership with Nualtis (formerly IntelGenx Corp.), a global leader in oral thin-film drug delivery technology.",
  },
  {
    slug: "oral-relief-kitz-launch",
    date: "November 25, 2024",
    title: "OrthoNu Launches Revolutionary Oral Relief Products to Transform Orthodontic Care",
    excerpt: "OrthoNu, a pioneer in orthodontic care innovations, is excited to announce the launch of its groundbreaking Oral Relief Kitz™ product line, designed to alleviate common discomforts experienced by orthodontic patients.",
  },
  {
    slug: "titan-women-in-business",
    date: "June 1, 2023",
    title: "OrthoNu Founder and CEO Dr. Sima Yakoby Epstein Named TITAN Women In Business Female Entrepreneur of the Year",
    excerpt: "Dr. Yakoby Epstein Awarded Highest Honor in Innovator of the Year (New Start Up) Category.",
  },
  {
    slug: "gold-stevie-award",
    date: "May 5, 2023",
    title: "Dr. Sima Yakoby Epstein Recognized with Gold Stevie in The 21st Annual American Business Awards® for Best Entrepreneur – Consumer Products for Tweakz!",
    excerpt: "OrthoNu Founder and CEO, Dr. Sima Yakoby Epstein, has captured the Gold Stevie for Best Entrepreneur in the Consumer Products, Non-Durables category for Tweakz.",
  },
  {
    slug: "orthonu-drives-orthodontic-office-efficiencies",
    date: "January 18, 2023",
    title: "OrthoNu® Drives Orthodontic Office Efficiencies, and Redefines Patient Oral Care with Launch of Tweakz® for Braces and Aligners",
    excerpt: "OrthoNu® today announced the launch of Tweakz® for Braces and Tweakz® for Aligners, ushering in an entirely new category of products specifically designed to meet the needs of orthodontic patients.",
  },
  {
    slug: "orthonu-launches-as-first-known-company",
    date: "September 19, 2022",
    title: "OrthoNu® Launches as First Known Company Created to Advance the Orthodontic Industry as it Hits an Inflection Point Driving Massive Opportunity for Practices and Patients",
    excerpt: "Created by an orthodontist, OrthoNu®, the first company entirely focused on developing new, dynamic science-driven discovery to support the orthodontic community and patients, is redefining the orthodontic standard of care.",
  },
];

export default function PressReleasesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-brand-blue text-white py-20 md:py-28 px-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 55%)" }}
          />
          <div className="relative max-w-4xl mx-auto space-y-4">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <ChevronLeft size={14} /> Resources
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">Media</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">Press Releases</h1>
            <p className="text-white/70 text-lg font-medium max-w-xl">
              Official announcements, milestones, and news from OrthoNu®.
            </p>
          </div>
        </section>

        {/* List */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {pressReleases.map((pr) => (
              <Link
                key={pr.slug}
                href={`/resources/press-releases/${pr.slug}`}
                className="group block bg-white border border-zinc-100 rounded-2xl p-6 md:p-8 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest shrink-0 md:w-40">
                    <Calendar size={12} />
                    {pr.date}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-base md:text-lg font-bold text-soft-dark group-hover:text-brand-blue transition-colors leading-snug">
                      {pr.title}
                    </h2>
                    <p className="text-sm text-soft-dark/60 leading-relaxed line-clamp-2">
                      {pr.excerpt}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-zinc-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all shrink-0 mt-1 hidden md:block"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
