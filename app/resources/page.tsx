import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { FileText, Video, BookOpen, Newspaper, Radio } from "lucide-react";

const resources = [
  {
    href: "/resources/white-paper",
    icon: <FileText size={32} />,
    label: "White Paper",
    description: "Download our clinical white paper on revolutionizing oral self-care.",
    available: true,
  },
  {
    href: "/resources/webinars",
    icon: <Video size={32} />,
    label: "Webinars",
    description: "Watch expert-led webinars on orthodontic innovation and patient care.",
    available: true,
  },
  {
    href: "/resources/blog",
    icon: <BookOpen size={32} />,
    label: "Blog",
    description: "Read the latest insights from the OrthoNu team and industry experts.",
    available: true,
  },
  {
    href: "/resources/press-releases",
    icon: <Newspaper size={32} />,
    label: "Press Releases",
    description: "Official announcements and news from OrthoNu.",
    available: true,
  },
  {
    href: "/resources/in-the-news",
    icon: <Radio size={32} />,
    label: "In The News",
    description: "See where OrthoNu has been featured in the media.",
    available: true,
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-brand-blue text-white py-20 md:py-28 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
              Knowledge Hub
            </p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              Resources
            </h1>
            <p className="text-white/70 text-lg font-medium">
              Clinical insights, research, and educational content for orthodontic professionals.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(({ href, icon, label, description, available }) => {
              const card = (
                <div
                  className={`group relative flex flex-col items-center text-center gap-5 p-8 bg-white rounded-2xl border transition-all duration-300 ${
                    available
                      ? "border-zinc-100 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 cursor-pointer"
                      : "border-zinc-100 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      available
                        ? "bg-brand-blue/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-soft-dark">{label}</h3>
                    <p className="text-xs text-soft-dark/50 leading-relaxed">{description}</p>
                  </div>
                  {!available && (
                    <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-400 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              );

              return available ? (
                <Link key={label} href={href}>
                  {card}
                </Link>
              ) : (
                <div key={label}>{card}</div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
