import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";

export default function PressRelease() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />
      <main className="flex-1">
        <section className="bg-brand-blue text-white py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <Link href="/resources/press-releases"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
              <ChevronLeft size={14} /> Press Releases
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">January 18, 2023</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              OrthoNu® Drives Orthodontic Office Efficiencies, and Redefines Patient Oral Care with Launch of Tweakz® for Braces and Aligners
            </h1>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 space-y-6 text-soft-dark/80 leading-relaxed">
              <p className="text-sm">
                <strong>Rumson, NJ, January 18, 2023</strong> – OrthoNu® today announced the launch of Tweakz® for Braces and Tweakz® for Aligners, ushering in an entirely new category of products specifically designed to meet the needs of orthodontic patients. The Tweakz tools are designed as an oral self-care solution to address the most common orthodontic emergencies in between visits. By addressing manageable discomforts at home until the next scheduled appointment, Tweakz keeps disruptions to a minimum for the practice and patients, which creates office efficiencies and growth opportunities.
              </p>

              <p className="text-sm">
                An average practice experiences 8-10 emergency visits every day, with each visit costing an office $100 on average. Broken brackets and cutting distal ends account for 99% of braces emergencies. Rough edges and removal of overly retentive trays account for 92% of aligner emergencies. In total, these breakthrough visits can cost an office over $300,000 a year, while causing great discomfort and anxiety among patients and caregivers.
              </p>

              <p className="text-sm">
                Designed by an Orthodontist, OrthoNu Tweakz 4-in-1 self-care tools are patient-friendly, professional grade, driven by science, and developed from professional tools that are trusted.
              </p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="text-sm italic text-soft-dark">
                  "The OrthoNu line of self-care orthodontic products focuses on emergency care, oral hygiene, oral aesthetics, and oral health, reducing the sizeable impact of emergency visits and elevating the patient experience. Tweakz provides orthodontists with proper tools and solutions to meet these urgent patient needs when they occur, while helping expand patient self-care capabilities, comfort, and confidence."
                </p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein, OrthoNu Founder and CEO</footer>
              </blockquote>

              <div className="space-y-4">
                <h3 className="text-sm font-black text-soft-dark uppercase tracking-wider">Tweakz for Braces features:</h3>
                <ul className="space-y-2 text-sm list-disc list-inside text-soft-dark/70">
                  <li><strong>Flush Distal End Cutter:</strong> Eliminates sharp wires by cutting and holding the cut wire piece for safety</li>
                  <li><strong>Dental Pick:</strong> Removes broken or dislodged brackets with ease (self-ligating or conventional) and food interproximally between teeth and appliances</li>
                  <li><strong>Rubber Band Applicator:</strong> Removes and replaces rubber bands with ease</li>
                  <li><strong>Diamond Dental File:</strong> Smooths out rough spots on brackets and hooks</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black text-soft-dark uppercase tracking-wider">Tweakz for Aligners features:</h3>
                <ul className="space-y-2 text-sm list-disc list-inside text-soft-dark/70">
                  <li><strong>Dental Pick:</strong> Removes food and debris interproximally</li>
                  <li><strong>Rubber Band Applicator:</strong> Removes and replaces rubber bands with ease</li>
                  <li><strong>Aligner Remover:</strong> Removes retentive aligners</li>
                  <li><strong>Diamond Dental File:</strong> Smooths out rough spots on aligners</li>
                </ul>
              </div>

              <p className="text-sm">
                Tweakz tools come in a travel case with mirror and are available now to order at{" "}
                <a href="https://www.orthonu.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-medium">www.OrthoNu.com</a>.
              </p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="text-sm italic text-soft-dark">
                  "With Tweakz tools, we can provide our patients with safe self-care solutions, at the beginning of their treatment, to address the most common orthodontic emergencies while at home or on-the-go, and in between office visits. Tweakz are truly a welcomed advancement for the industry that will save practices time and expenses resulting from emergency visits."
                </p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Jamie Reynolds, Reynolds Orthodontics</footer>
              </blockquote>

              <p className="text-sm">
                For more information about OrthoNu including to see What's #NU4U, please visit{" "}
                <a href="https://www.orthonu.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-medium">www.OrthoNu.com</a>.
              </p>

              <div className="border-t border-zinc-100 pt-6 space-y-3">
                <h3 className="text-sm font-black text-soft-dark uppercase tracking-wider">About OrthoNu®</h3>
                <p className="text-sm text-soft-dark/70">
                  OrthoNu is focused on driving innovation in oral care to support both patient experience and practice efficiencies. OrthoNu is creating a new category of professional-grade, self-care products, including its hero product Tweakz® for Braces and Aligners, for orthodontists to provide to their patients, redefining the orthodontic standard of care. With an advisory board of industry leaders and developing partnerships with the University of Pennsylvania's School of Dental Medicine and the Center for Innovation & Precision Dentistry (CiPD), OrthoNu is committed to advancing the science of oral health, which has a significant role in improving overall health.
                </p>
              </div>

              <p className="text-xs text-zinc-400 border-t border-zinc-100 pt-4">
                <sup>1</sup> Bilder L., Hazan-Molina H., Aizenbud D. Medical emergencies in a dental office: inhalation and ingestion of orthodontic objects. <em>J Am Dent Assoc.</em> 2011;142:45–52
              </p>
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
