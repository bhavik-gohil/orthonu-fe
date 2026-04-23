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
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">June 1, 2023</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              OrthoNu Founder and CEO Dr. Sima Yakoby Epstein Named TITAN Women In Business Female Entrepreneur of the Year
            </h1>
            <p className="text-white/70 text-base font-medium">Dr. Yakoby Epstein Awarded Highest Honor in Innovator of the Year (New Start Up) Category</p>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 space-y-6 text-soft-dark/80 leading-relaxed text-sm">

              <p><strong>RUMSON, NJ, June 1, 2023</strong> – OrthoNu Founder and CEO, Dr. Sima Yakoby Epstein, has won the highest honor in the Innovator of the Year (New Start Up) category and named Female Entrepreneur of the Year by the TITAN Women In Business Awards that honors exceptional females who have made remarkable strides in the ever-evolving business landscape, making a substantial impact.</p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="italic text-soft-dark">"To be recognized as a patient turned Orthodontist innovating for the industry is truly an honor. Part of my inspiration for founding OrthoNu and developing our flagship product, Tweakz, was to improve the patient experience at home. Oral self-care is something I am deeply passionate about and it's important to educate patients about prioritizing self-care practices, which can improve overall health outcomes. I've always been driven to do something impactful, and I will continue in my quest to keep contributing in a meaningful way."</p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein</footer>
              </blockquote>

              <p>Tweakz for Braces® and Tweakz for Aligners® are professional grade tools designed to handle the most common orthodontic emergencies at home – such as broken brackets, poky wires as well as remove and replace rubber bands.</p>

              <blockquote className="border-l-4 border-zinc-200 pl-6 space-y-1">
                <p className="italic text-soft-dark/70">"Aside from professional evaluations, the winners of TITAN today have shown that their success stories are a testament to the power of perseverance and the drive to achieve excellence. Their contributions have been invaluable in propelling their respective organizations forward and serving as a driving force in their industries, inspiring others to follow in their footsteps."</p>
                <footer className="text-xs font-bold text-zinc-500">— Thomas Brandt, Spokesperson of the International Awards Association (IAA)</footer>
              </blockquote>

              <p>Recently, Dr. Yakoby Epstein also captured the Gold Stevie for Best Entrepreneur in the Consumer Products, Non-Durables category for Tweakz, in the 21st Annual American Business Awards®, the premier accolades for excellence in U.S. business, honoring organizations of all sizes and industries.</p>

              <div className="border-t border-zinc-100 pt-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About OrthoNu®</h3>
                  <p className="text-xs text-soft-dark/70">OrthoNu is focused on driving innovation in oral care to support both patient experience and practice efficiencies. OrthoNu is creating a new category of professional-grade, self-care products, including its hero product Tweakz® for Braces and Aligners, for orthodontists to provide to their patients, redefining the orthodontic standard of care. With an advisory board of industry leaders and developing partnerships with the University of Pennsylvania's School of Dental Medicine and the Center for Innovation & Precision Dentistry (CiPD), OrthoNu is committed to advancing the science of oral health, which has a significant role in improving overall health.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About the TITAN Women In Business Awards</h3>
                  <p className="text-xs text-soft-dark/70">The TITAN Women in Business Awards program honors exceptional females who have made remarkable strides in the ever-evolving business landscape, making a substantial impact with their unwavering commitment and exceptional contributions. Visit the official website: <a href="https://thewomenbusinessawards.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">thewomenbusinessawards.com</a></p>
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
