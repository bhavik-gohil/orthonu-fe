import Link from "next/link";
import Image from "next/image";
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
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">August 7, 2025</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              OrthoNu® Forms Strategic Partnership with Nualtis to Launch Innovative Oral Thin-Film Products
            </h1>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 space-y-6 text-soft-dark/80 leading-relaxed text-sm">

              <p><strong>Red Bank, N.J. – August 7, 2025</strong> — OrthoNu®, the first company solely focused on innovating self-care solutions for orthodontic patients, today announced a strategic partnership with Nualtis (formerly IntelGenx Corp.), a global leader in oral thin-film drug delivery technology. This collaboration marks a significant step forward in the development of OrthoNu's over-the-counter (OTC) oral care product line, designed to improve patient comfort, convenience, and clinical outcomes.</p>

              <p>The partnership will integrate OrthoNu's patented technologies with Nualtis' proprietary film platform to bring to market a portfolio of dietary supplements and FDA OTC monograph-compliant products. These offerings will feature advanced timed-release profiles, delivering sustained and targeted oral health benefits to orthodontic patients.</p>

              {/* Dr. Sima quote with headshot */}
              <div className="flex items-start gap-5 bg-zinc-50 rounded-2xl p-6">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
                  <Image src="/press-sima-headshot.png" alt="Dr. Sima Yakoby Epstein" width={64} height={64} className="object-cover w-full h-full" />
                </div>
                <blockquote className="space-y-1">
                  <p className="italic text-soft-dark">"Partnering with Nualtis allows us to accelerate the delivery of our science-backed innovations. Their 15+ years of experience in thin-film development and manufacturing make them the ideal partner to help us redefine oral-systemic care for orthodontic patients."</p>
                  <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein, DMD, Founder and CEO of OrthoNu</footer>
                </blockquote>
              </div>

              {/* Dr. Raven quote with headshot */}
              <div className="flex items-start gap-5 bg-zinc-50 rounded-2xl p-6">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
                  <Image src="/press-dr-raven-headshot.png" alt="Dr. Michael Raven" width={64} height={64} className="object-cover w-full h-full" />
                </div>
                <blockquote className="space-y-1">
                  <p className="italic text-soft-dark">"We are excited to collaborate with OrthoNu on products that have the potential to transform the orthodontic care landscape. This partnership represents a unique alignment of our technology with OrthoNu's groundbreaking vision."</p>
                  <footer className="text-xs font-bold text-brand-blue">— Dr. Michael Raven, CEO of Nualtis</footer>
                </blockquote>
              </div>

              <p>Together, the companies will develop multiple product variants designed to enhance patient adherence and comfort during orthodontic treatment, while supporting providers with differentiated, innovative tools for in-office and take-home care.</p>

              <div className="border-t border-zinc-100 pt-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About OrthoNu®</h3>
                  <p className="text-xs text-soft-dark/70">OrthoNu® is a category-defining oral wellness company founded by orthodontist-turned-entrepreneur Dr. Sima Yakoby Epstein. The company offers professional-grade, self-care products that support patient outcomes and practice efficiency. OrthoNu is committed to transforming the orthodontic experience through science-backed innovation and strategic collaboration.<br /><br />OrthoNu LLC · 125 Half Mile Road, Suite 200 · Red Bank, New Jersey 07701 · <a href="https://www.orthonu.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">www.orthonu.com</a></p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About Nualtis</h3>
                  <p className="text-xs text-soft-dark/70">Nualtis is a Montreal-based specialty pharmaceutical company and a wholly owned subsidiary of atai Life Sciences. The company specializes in oral thin-film delivery technologies, offering pharmaceutical partners fully integrated services from formulation to commercial manufacturing. With a focus on patient-centered innovation and execution excellence, Nualtis provides solutions that meet real-world therapeutic needs.<br /><br /><a href="https://www.nualtis.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">www.nualtis.com</a></p>
                </div>
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
