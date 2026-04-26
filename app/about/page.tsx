"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiCall, API_BASE_URL } from "@/lib/api-client";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import {
  Quote,
  User,
  Handshake,
  ExternalLink,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { getShopUrl } from "@/lib/subdomains";
import HeroSection from "@/components/ui/HeroSection";

interface Testimonial {
  id: number;
  text: string;
  by: string;
  from?: string;
}
interface BoardMember {
  id: number;
  name: string;
  position: string;
  image: string | null;
}
interface Partner {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  learnMoreUrl: string | null;
}

function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [shopUrl, setShopUrl] = useState("/shop");
  const router = useRouter();

  const handlePartnerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/#partner-with-us");
  };

  useEffect(() => {
    setShopUrl(getShopUrl());
  }, []);

  useEffect(() => {
    Promise.all([
      apiCall("GET", "/testimonials"),
      apiCall("GET", "/board-members"),
      apiCall("GET", "/partners"),
    ])
      .then(([t, b, p]) => {
        setTestimonials(t);
        setBoardMembers(b);
        setPartners(p);
      })
      .catch(console.error)
      .finally(() => setLoadingContent(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <HeroSection
          title="About OrthoNu"
          subtitle="Created by an orthodontist for orthodontists — the first company focused on driving innovation in oral care to support both patient experience and practice efficiencies."
        />

        {/* ── About Text ───────────────────────────────────────────── */}
        <section className="py-20 px-6">
          <div className="mx-auto space-y-8">
            <div className="flex w-full justify-center gap-12 items-center">
              <div className="max-w-3xl space-y-6 text-soft-dark/70 leading-relaxed">
                <p>
                  OrthoNu is creating a new category of professional-grade,
                  self-care products for orthodontists to provide to their
                  patients, redefining the orthodontic standard of care as the
                  industry undergoes a seismic shift due to the massive growth
                  in patients of all ages seeking orthodontic treatment.
                </p>
                <p>
                  With an advisory board of industry leaders and partnerships
                  with the University of Pennsylvania School of Dental Medicine,
                  OrthoNu is committed to advancing the science of oral health,
                  which has a significant role in improving overall health.
                  Patients in orthodontic treatment are in a constant
                  inflammatory state with an ever-changing microbiome, making it
                  critical to maintain comfort and oral hygiene.
                </p>
                <p>
                  The OrthoNu line of self-care orthodontic products focus on
                  emergency care, oral hygiene, oral aesthetics, and oral
                  health, reducing the massive impact of emergency visits and
                  elevating the patient experience.
                </p>
                <p className="font-medium text-soft-dark">
                  The fact is, nearly nine in ten patients experience urgent
                  issues during the course of their treatment. Being able to
                  support patients before these events occur will change patient
                  expectations, comfort, and confidence. Our mission is to
                  ensure every orthodontist has access to tools that will enable
                  them to meet the growing needs of patients. You got this!
                </p>
              </div>
            </div>

            {/* ── Mission & Vision ─────────────────────────────────────── */}
            <section className="py-16 px-6 bg-zinc-50">
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="bg-brand-blue text-white rounded-3xl p-10 space-y-4">
                  <p className="text-base font-black tracking-wide text-white/70">
                    Mission
                  </p>
                  <p className="text-2xl font-black leading-snug">
                    Eliminate the discomfort and embarrassment of wearing braces
                    or aligners
                  </p>
                </div>
                <div className="bg-atlantic-blue text-white rounded-3xl p-10 space-y-4">
                  <p className="text-base font-black tracking-wide text-white/70">
                    Vision
                  </p>
                  <p className="text-2xl font-black leading-snug">
                    Transform society's understanding that mouthcare =
                    healthcare
                  </p>
                </div>
              </div>
            </section>

            {/* ── Founder ──────────────────────────────────────────────── */}
            <section className="md:py-6 md:px-6">
              <div className="md:max-w-4xl md:mx-auto">
                <p className="text-sm font-extrabold tracking-wide text-brand-blue mb-8 flex justify-center">
                  Meet Our Founder
                </p>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Photo */}
                  <div className="shrink-0 mx-auto md:mx-0 text-center">
                    <div className="w-72 rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
                      <img
                        src="/Dr.-Sima-Yakoby-Epstein-DMD.jpg"
                        alt="Dr. Sima Yakoby Epstein, DMD"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {/* <p className="text-xs font-bold text-soft-dark mt-2">
                        Dr. Sima Yakoby Epstein
                      </p>
                      <p className="text-[10px] text-brand-blue font-medium">
                        DMD · Founder & CEO
                      </p> */}
                  </div>

                  {/* Text + Quote */}
                  <div className="space-y-5">
                    <div className="space-y-4 text-soft-dark/70 leading-relaxed">
                      <p>
                        {/* <strong className="text-soft-dark"> */}
                        Dr. Sima Yakoby Epstein
                        {/* </strong>{" "} */}
                        holds a Doctorate of Medicine in Dentistry and Clinical
                        Orthodontics from the University of Pennsylvania School
                        of Dental Medicine. She completed her residency at New
                        York Presbyterian and taught Advanced Aesthetic
                        Dentistry at New York University. She has more than 10
                        years of professional orthodontic experience, including
                        working as a cosmetic dentist in New York City, and a
                        lifetime of patient experience.
                      </p>
                      <p>
                        Dr. Yakoby Epstein created OrthoNu® with a goal to
                        support the emerging needs of orthodontists and their
                        patients in a rapidly evolving landscape. Her interest
                        in orthodontics and passion for patient well-being was
                        born at an early age. As a young girl, Dr. Yakoby
                        Epstein's face, teeth, and jaw were broken in a car
                        accident. She went through years of treatment and uses
                        her experience to better inform modern orthodontic care.
                      </p>
                      <p>
                        Today, Dr. Yakoby Epstein is committed to engaging top
                        orthodontic innovators and scientific developers as she
                        transforms the orthodontic industry.
                      </p>
                    </div>
                  </div>
                </div>
                <blockquote className="border-l-4 border-brand-blue pl-6 space-y-2 mt-6">
                  <p className="text-base font-serif italic text-soft-dark">
                    "Orthodontic treatment is a partnership in every sense of
                    the word. I developed OrthoNu to support orthodontists and
                    empower patients to take care of their oral health, for a
                    beautiful, healthy mouth throughout treatment and for their
                    future."
                  </p>
                  <footer className="text-sm font-bold text-brand-blue">
                    — Sima Yakoby Epstein, DMD, OrthoNu Founder & CEO
                  </footer>
                </blockquote>
              </div>
            </section>

            <div className="py-16 bg-warm-gray/20 space-y-8">
              <div className="space-y-4 flex w-full flex-row justify-center ">
                <div className="justify-center font-bold text-2xl text-atlantic-blue">
                  The time is now to prepare your practice for patient needs.
                </div>
              </div>

              <div className="space-y-4 flex w-full flex-row justify-center ">
                <div className="flex flex-col sm:flex-row max-w-3xl gap-4 ">
                  <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-5 text-center space-y-2">
                    <p className="text-3xl font-black text-brand-blue">300%</p>
                    <p className="text-xs text-soft-dark/60 leading-relaxed">
                      Projected growth of the orthodontic market by 2027
                    </p>
                  </div>
                  <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-5 text-center space-y-2">
                    <p className="text-3xl font-black text-brand-blue">85%</p>
                    <p className="text-xs text-soft-dark/60 leading-relaxed">
                      Patients experience an urgent issue during the course of
                      care
                    </p>
                  </div>
                  <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-5 text-center space-y-2">
                    <p className="text-3xl font-black text-brand-blue">100%</p>
                    <p className="text-xs text-soft-dark/60 leading-relaxed">
                      The average practice experiences 8-10 costly emergency
                      visits every day, with each visit costing the office $100
                      on average.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials (dynamic) ────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <p className="text-sm font-extrabold tracking-wide text-brand-blue mb-8">
                Social Proof
              </p>
              <h2 className="text-4xl font-black text-soft-dark">
                What Professionals Say
              </h2>
              <p className="text-soft-dark/50 max-w-xl mx-auto">
                Don't take it from us. Here's what leading orthodontic
                professionals have to say.
              </p>
            </div>
            {loadingContent ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
              </div>
            ) : testimonials.length === 0 ? (
              <p className="text-center text-zinc-400 italic py-8">
                Testimonials coming soon.
              </p>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="break-inside-avoid bg-zinc-50 border border-zinc-100 rounded-3xl p-6 space-y-4 hover:border-brand-blue/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Quote size={20} className="text-brand-blue/30" />
                    <div className="space-y-4">
                      <p className="text-sm text-soft-dark/80 leading-relaxed italic">
                        {t.text}
                      </p>
                      <div>
                        {t.by && (
                          <p className="text-xs font-bold text-brand-blue">
                            — {t.by}
                          </p>
                        )}
                        {t.from && (
                          <p
                            className={`text-[10px] font-medium text-soft-dark/50 mt-1 ${t.by ? "ml-4" : ""}`}
                          >
                            {t.from}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Board Members (dynamic) ───────────────────────────────── */}
        <section className="py-16 px-6 bg-zinc-50">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <p className="text-sm font-extrabold tracking-wide text-brand-blue mb-8">
                Leadership
              </p>
              <h2 className="text-4xl font-black text-soft-dark">
                Board Members
              </h2>
            </div>
            {loadingContent ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
              </div>
            ) : boardMembers.length === 0 ? (
              <p className="text-center text-zinc-400 italic py-8">
                Board member information coming soon.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {boardMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-200 border border-zinc-100">
                      {m.image ? (
                        <img
                          src={mediaUrl(m.image)}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <User size={36} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-soft-dark">
                        {m.name}
                      </p>
                      <p className="text-xs text-brand-blue font-medium mt-0.5">
                        {m.position}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Partners (dynamic) ───────────────────────────────────── */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <p className="text-sm font-extrabold tracking-wide text-brand-blue mb-8">
                Ecosystem
              </p>
              <h2 className="text-4xl font-black text-soft-dark">
                Our Partners
              </h2>
            </div>
            {loadingContent ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
              </div>
            ) : partners.length === 0 ? (
              <p className="text-center text-zinc-400 italic py-8">
                Partner information coming soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-brand-blue/0 rounded-3xl p-6 flex flex-col gap-6 hover:border-brand-blue/20 hover:shadow-xl transition-all"
                  >
                    <div className="w-full h-32 rounded-xl bg-white flex items-center justify-center p-6 shrink-0">
                      {p.logo ? (
                        <img
                          src={mediaUrl(p.logo)}
                          alt={p.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <Handshake size={48} className="text-zinc-300" />
                      )}
                    </div>
                    <div className="space-y-3 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-soft-dark text-center sm:text-left">
                        {p.name}
                      </h3>
                      <p className="text-sm text-soft-dark/70 leading-relaxed flex-1 text-center sm:text-left">
                        {p.description}
                      </p>
                      {p.learnMoreUrl && (
                        <div className="pt-2 flex justify-center sm:justify-start">
                          <a
                            href={p.learnMoreUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-atlantic-blue transition-colors"
                          >
                            Learn More <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-brand-blue/10 text-brand-blue text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-black">
              The time is now to prepare your practice for patient needs.
            </h2>
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
                onClick={handlePartnerClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-warm-gray text-soft-dark border border-warm-gray rounded-full font-semibold text-sm tracking-wide transition-all hover:border-brand-blue hover:text-atlantic-blue"
              >
                Partner with Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
