import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { ChevronLeft, ExternalLink, FileText, Mic } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const articles = [
  {
    year: 2025,
    items: [
      {
        date: "September 17, 2025",
        publication: "Orthodontic Products",
        title: "Young Specialties to Distribute OrthoNu's Orthodontic Self-Care Product Line",
        url: "https://orthodonticproductsonline.com/practice-products/patient-products/treatment-adherence/young-specialties-to-distribute-orthonus-orthodontic-self-care-product-line/",
      },
      {
        date: "August 7, 2025",
        publication: "The LEAD Magazine",
        title: "Read The Summer 2025 Issue",
        url: "https://theleadmagazine.com/issue/summer-2025/",
      },
    ],
  },
];

const podcasts = [
  {
    date: "May 13, 2024",
    title: "How OrthoNu Is Creating A New Standard Of Patient Care",
    url: "https://traktiontalks.buzzsprout.com/1220831/15061587-innovation-in-orthodontics-how-orthonu-is-creating-a-new-standard-of-patient-care",
    embedType: "buzzsprout",
    embedId: "1220831/15061587",
  },
  {
    date: "February 27, 2023",
    title: "The Stress Free Dentist with Dr. Eric Block",
    url: "https://www.thestressfreedentist.com/podcast/wired-and-inspired/",
    embedType: null,
  },
  {
    date: "February 15, 2024",
    title: "Innovating Orthodontic Efficiency w/ Blair Feldman [2023]",
    url: "https://podcasts.apple.com/us/podcast/dr-sima-yakoby-epstein-innovating-orthodontic-efficiency/id1497625167?i=1000645453647",
    embedType: null,
  },
  {
    date: "December 11, 2023",
    title: "Dental Products Report: GNYDM 2023",
    url: "https://www.dentalproductsreport.com/view/greater-new-york-dental-meeting-2023-interview-with-sima-yakoby-epstein-dmd",
    embedType: null,
  },
  {
    date: "September 13, 2023",
    title: "DPR: Retaining Dental Staff [2023]",
    url: "https://www.dentalproductsreport.com/view/mastermind---episode-31---retaining-dental-staff",
    embedType: null,
  },
  {
    date: "June 17, 2023",
    title: "The Get It Straight Podcast: Innovators Unleashed w/ Dr. Sima Yakoby Epstein and Tina Trankler",
    url: "https://podcasts.apple.com/us/podcast/the-get-it-straight-podcast-innovators-unleashed-w-dr/id1529804721?i=1000617377122",
    embedType: null,
  },
  {
    date: "March 28, 2023",
    title: "The Resource Minute w/ Chris Bentson [2023]",
    url: "https://www.youtube.com/watch?v=7f-XYnHjBZc",
    embedType: "youtube",
    embedId: "7f-XYnHjBZc",
  },
  {
    date: "August 30, 2022",
    title: "Orthoprenuers | The Future of Orthodontics w/ Dr. Sima Yakoby Epstein Founder and CEO of OrthoNu",
    url: "https://www.youtube.com/watch?v=pd9xRkX4tYw",
    embedType: "youtube",
    embedId: "pd9xRkX4tYw",
  },
];

const pdfs = [
  {
    label: "OrthoNu 5Ws",
    file: "/OrthoNu-5ws.pdf",
  },
  {
    label: "OrthoNu Buyer's Guide",
    file: "/OrthoNu-Buyers-Guide.pdf",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

function YearBadge({ year }: { year: number }) {
  return (
    <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-brand-blue text-white px-3 py-1 rounded-full mb-4">
      {year}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InTheNewsPage() {
  // Group podcasts by year
  const podcastsByYear: Record<number, typeof podcasts> = {};
  for (const p of podcasts) {
    const year = parseInt(p.date.split(", ").pop()!);
    if (!podcastsByYear[year]) podcastsByYear[year] = [];
    podcastsByYear[year].push(p);
  }
  const podcastYears = Object.keys(podcastsByYear)
    .map(Number)
    .sort((a, b) => b - a);

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
                "radial-gradient(circle at 70% 50%, white 0%, transparent 55%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto space-y-4">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <ChevronLeft size={14} /> Resources
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
              Media Coverage
            </p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              In The News
            </h1>
            <p className="text-white/70 text-lg font-medium max-w-xl">
              Articles, podcasts, and media features covering OrthoNu® and the
              future of orthodontic self-care.
            </p>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto space-y-16">

            {/* ── Articles ─────────────────────────────────────────────── */}
            <div>
              <SectionHeading>Articles</SectionHeading>
              <div className="space-y-8">
                {articles.map(({ year, items }) => (
                  <div key={year}>
                    <YearBadge year={year} />
                    <div className="space-y-3">
                      {items.map((item) => (
                        <a
                          key={item.url}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-start gap-4 bg-white border border-zinc-100 rounded-2xl p-5 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all">
                            <ExternalLink size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                              {item.date} · {item.publication}
                            </p>
                            <p className="text-sm font-bold text-soft-dark group-hover:text-brand-blue transition-colors leading-snug">
                              {item.title}
                            </p>
                          </div>
                          <ExternalLink
                            size={14}
                            className="text-zinc-300 group-hover:text-brand-blue transition-colors shrink-0 mt-1"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Podcasts ─────────────────────────────────────────────── */}
            <div>
              <SectionHeading>Podcasts</SectionHeading>
              <div className="space-y-10">
                {podcastYears.map((year) => (
                  <div key={year}>
                    <YearBadge year={year} />
                    <div className="space-y-6">
                      {podcastsByYear[year].map((pod) => (
                        <div
                          key={pod.url}
                          className="bg-white border border-zinc-100 rounded-2xl overflow-hidden"
                        >
                          {/* Header row */}
                          <div className="flex items-start gap-4 p-5">
                            <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center shrink-0">
                              <Mic size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                                {pod.date}
                              </p>
                              <a
                                href={pod.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-bold text-soft-dark hover:text-brand-blue transition-colors leading-snug inline-flex items-center gap-1.5"
                              >
                                {pod.title}
                                <ExternalLink size={12} className="text-zinc-400 shrink-0" />
                              </a>
                            </div>
                          </div>

                          {/* Embed */}
                          {pod.embedType === "youtube" && (
                            <div className="aspect-video w-full border-t border-zinc-100">
                              <iframe
                                src={`https://www.youtube.com/embed/${pod.embedId}`}
                                title={pod.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              />
                            </div>
                          )}

                          {pod.embedType === "buzzsprout" && (
                            <div className="border-t border-zinc-100 p-4">
                              <iframe
                                src={`https://www.buzzsprout.com/${pod.embedId}?client_source=small_player&iframe=true`}
                                loading="lazy"
                                width="100%"
                                height="200"
                                frameBorder="0"
                                scrolling="no"
                                title={pod.title}
                                className="rounded-xl"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PDFs ─────────────────────────────────────────────────── */}
            <div>
              <SectionHeading>Downloads</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pdfs.map((pdf) => (
                  <a
                    key={pdf.file}
                    href={pdf.file}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 bg-white border border-zinc-100 rounded-2xl p-5 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all">
                      <FileText size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-soft-dark group-hover:text-brand-blue transition-colors">
                        {pdf.label}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-0.5">
                        PDF · Click to open
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-zinc-300 group-hover:text-brand-blue transition-colors shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Press Inquiries ──────────────────────────────────────── */}
            <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-6 text-center space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-soft-dark/60">
                Press Inquiries
              </p>
              <p className="text-sm text-soft-dark/70">
                Press inquiries should be directed to{" "}
                <a
                  href="mailto:whatsnu@orthonu.com"
                  className="text-brand-blue font-bold hover:underline"
                >
                  whatsnu@orthonu.com
                </a>
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
