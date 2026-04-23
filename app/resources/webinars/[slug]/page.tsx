"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import ContactUsForm from "@/components/forms/ContactUsForm";
import { WEBINARS } from "../page";
import { ChevronLeft } from "lucide-react";

export default function WebinarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const webinar = WEBINARS[slug as keyof typeof WEBINARS];

  if (!webinar) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />

      <main className="flex-1">
        {/* Hero / breadcrumb */}
        <section className="bg-brand-blue text-white py-14 px-6">
          <div className="max-w-5xl mx-auto space-y-3">
            <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest flex-wrap">
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
              <span>/</span>
              <Link href="/resources/webinars" className="hover:text-white transition-colors">
                Webinars
              </Link>
              <span>/</span>
              <span className="text-white/80 truncate max-w-[200px]">{webinar.title}</span>
            </div>
            {/* <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {webinar.title}
            </h1> */}
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto space-y-12">

            {/* Split: text left, video right */}
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Left: title + description */}
              <div className="flex-1 space-y-4">
                <h2 className="text-xl font-black text-soft-dark">{webinar.title}</h2>
                <p className="text-soft-dark/70 leading-relaxed text-sm">{webinar.description}</p>
              </div>

              {/* Right: YouTube embed */}
              <div className="w-full md:w-[55%] shrink-0">
                <div className="rounded-2xl overflow-hidden aspect-video bg-zinc-900 shadow-xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${webinar.youtubeId}?rel=0&modestbranding=1`}
                    title={webinar.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Back */}
            <Link
              href="/resources/webinars"
              className="inline-flex items-center gap-2 text-brand-blue hover:text-atlantic-blue font-bold text-sm transition-colors"
            >
              <ChevronLeft size={16} /> Back to Webinars
            </Link>

            {/* Contact form */}
            <div className="pt-4 w-full flex justify-center border-t border-zinc-200">
              <ContactUsForm submitButtonText="Submit" />
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
