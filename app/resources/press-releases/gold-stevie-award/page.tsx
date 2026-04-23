import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";

export default function PressRelease() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-brand-blue text-white py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <Link href="/resources/press-releases"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
              <ChevronLeft size={14} /> Press Releases
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">May 5, 2023</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Dr. Sima Yakoby Epstein Recognized with Gold Stevie in The 21st Annual American Business Awards® for Best Entrepreneur – Consumer Products for Tweakz!
            </h1>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 space-y-6 text-soft-dark/80 leading-relaxed text-sm">

              <p><strong>RUMSON, NJ, May 5, 2023</strong> – OrthoNu Founder and CEO, Dr. Sima Yakoby Epstein, has captured the Gold Stevie for Best Entrepreneur in the Consumer Products, Non-Durables category for Tweakz, in the 21st Annual American Business Awards®, the premier accolades for excellence in U.S. business, honoring organizations of all sizes and industries.</p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="italic text-soft-dark">"I am so honored to receive this award. Opportunity is truly born when you identify an unmet need, and you have a passion to meet that need. I founded OrthoNu and created Tweakz because of my passion to do something impactful for patients and parents who were feeling vulnerable and stressed about inevitable and common orthodontic emergencies such as broken wires and loose brackets, and for Orthodontists as emergency visits are costly to their practice. It is very gratifying to know that we are being recognized for making a difference."</p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein</footer>
              </blockquote>

              <p>The Stevie® Awards are the world's premier business awards created in 2002 to honor and generate public recognition of the achievements and positive contributions of organizations and working professionals worldwide. The Stevie has become one of the world's most coveted prizes. More than 3,700 nominations from organizations of all sizes and in virtually every industry were submitted this year for consideration in a wide range of categories.</p>

              <blockquote className="border-l-4 border-zinc-200 pl-6 space-y-1">
                <p className="italic text-soft-dark/70">"I don't give out high scores, but I'm super impressed. To see a client identify a problem and 'go to the basement' to start to figure out a solution is the epitome of entrepreneurship. I admire you and your work."</p>
                <footer className="text-xs font-bold text-zinc-500">— ABA Judge on Dr. Sima Yakoby Epstein and Tweakz</footer>
              </blockquote>

              <p>Dr. Yakoby Epstein will be presented with her Gold Stevie Award at a special event that will be held on June 13, 2023, in New York City.</p>

              <div className="border-t border-zinc-100 pt-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About OrthoNu®</h3>
                  <p className="text-xs text-soft-dark/70">OrthoNu is focused on driving innovation in oral care to support both patient experience and practice efficiencies. OrthoNu is creating a new category of professional-grade, self-care products, including its hero product Tweakz® for Braces and Aligners, for orthodontists to provide to their patients, redefining the orthodontic standard of care. With an advisory board of industry leaders and developing partnerships with the University of Pennsylvania's School of Dental Medicine and the Center for Innovation & Precision Dentistry (CiPD), OrthoNu is committed to advancing the science of oral health, which has a significant role in improving overall health.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About the Stevie Awards</h3>
                  <p className="text-xs text-soft-dark/70">Stevie Awards are conferred in eight programs including The American Business Awards® and The International Business Awards®. Stevie Awards competitions receive more than 12,000 entries each year from organizations in more than 70 nations. Learn more at <a href="http://www.StevieAwards.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">www.StevieAwards.com</a>.</p>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 space-y-1">
                <p className="text-xs font-bold text-soft-dark uppercase tracking-wider">Media Contact</p>
                <p className="text-xs text-soft-dark/60">Dawn Maniglia · MKC Strategies · <a href="mailto:dmaniglia@mkcstrategies.com" className="text-brand-blue hover:underline">dmaniglia@mkcstrategies.com</a> · 917.862.5444</p>
                <p className="text-xs text-soft-dark/60">Tina Trenkler · OrthoNu · <a href="mailto:Tina@orthonu.com" className="text-brand-blue hover:underline">Tina@orthonu.com</a> · 718.541.5241</p>
              </div>
            </article>

            <div className="mt-8">
              <Link href="/resources/press-releases"
                className="inline-flex items-center gap-2 text-brand-blue hover:text-atlantic-blue font-bold text-sm transition-colors">
                <ChevronLeft size={16} /> Back to Press Releases
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
