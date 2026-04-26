import Link from "next/link";
import Image from "next/image";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import HeroSection from "@/components/ui/HeroSection";

// ─── Webinar data ─────────────────────────────────────────────────────────────
// Update youtubeId per webinar when real recordings are available.

const DEFAULT_VIDEO_ID = "vyISuWUWcFs";

export const WEBINARS = {
  "prevention-comfort": {
    slug: "prevention-comfort",
    title:
      "Emergency-Proof Your Practice: Proactive Tools for Orthodontic Success",
    description:
      "This product training session will take a deep dive into the Oral Relief Collection, as a proactive tool designed to minimize common orthodontic issues before they escalate.",
    thumbnail: "/sima-yakoby-epstein-on-demand-ce-400x267.webp",
    youtubeId: DEFAULT_VIDEO_ID, // TODO: replace with actual recording ID
  },
  "changing-the-game": {
    slug: "changing-the-game",
    title:
      "The Ortho Homecare Debate: Insights from the Front Lines of Patient Care",
    description:
      "In this dynamic 60-minute panel, join the CEO of the Oral Relief Collection for an in-depth conversation on how innovation is transforming the way practices manage unscheduled patient emergencies.",
    thumbnail: "/sima-yakoby-epstein-on-demand-ce-400x267.webp",
    youtubeId: DEFAULT_VIDEO_ID, // TODO: replace with actual recording ID
  },
} as const;

export default function WebinarsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />

      <main className="flex-1">
        {/* Hero */}
        <HeroSection
          breadcrumb={{ label: "Resources", href: "/resources" }}
          category="Education"
          title="Webinars"
          subtitle="Expert-led sessions on orthodontic innovation, patient care, and the future of oral self-care."
        />

        {/* Webinar cards */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            {Object.entries(WEBINARS).map(([slug, w]) => (
              <Link
                key={slug}
                href={`/resources/webinars/${slug}`}
                className="group bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={w.thumbnail}
                    alt={w.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-brand-blue/40 flex items-center justify-center transition-all duration-300">
                    <PlayCircle
                      size={48}
                      className="text-white drop-shadow-lg"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <h2 className="text-base font-bold text-soft-dark group-hover:text-brand-blue transition-colors leading-snug">
                    {w.title}
                  </h2>
                  <p className="text-sm text-soft-dark/60 leading-relaxed line-clamp-2">
                    {w.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-blue uppercase tracking-widest pt-1">
                    Watch Webinar <ChevronRight size={14} />
                  </div>
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
