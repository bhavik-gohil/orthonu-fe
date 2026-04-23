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
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">November 25, 2024</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              OrthoNu Launches Revolutionary Oral Relief Products to Transform Orthodontic Care
            </h1>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 space-y-6 text-soft-dark/80 leading-relaxed text-sm">

              <p><strong>NEW JERSEY, USA. 25th November, 2024</strong> – OrthoNu, a pioneer in orthodontic care innovations, is excited to announce the launch of its groundbreaking Oral Relief Kitz™ product line, designed to alleviate common discomforts experienced by orthodontic patients. The new products were unveiled during an exclusive webinar on November 1st, 2024, where industry leaders gathered to discover how these innovations are set to redefine patient care in orthodontics.</p>

              <p>The Oral Relief Kitz™ product line includes four innovative, patient-centric solutions aimed at improving the orthodontic treatment experience. These products complement OrthoNu's well-established Tweakz™ toolkit, introduced last year, which has already redefined how orthodontic emergencies can be managed.</p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="italic text-soft-dark">"The Oral Relief Kitz™ products, alongside our Tweakz™ tools, mark the creation of a completely new category in orthodontic care. Never before has the orthodontic industry focused on solutions that are exclusively designed for patients to ensure better health outcomes. These innovations are a vital part of improving the patient experience but also helping doctors optimize the efficiency of their practices by reducing unnecessary in-office emergencies."</p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein, CEO and Founder of OrthoNu</footer>
              </blockquote>

              <p>Oral Relief Kitz™ products are designed to provide immediate relief for patients experiencing pain or discomfort during treatment, keeping patients comfortable at home and reducing the need for last-minute visits.</p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="italic text-soft-dark">"We are committed to advancing the science of oral health in a way that not only benefits the patient, but also supports the orthodontist in their mission to streamline care and improve efficiency. With these new products, doctors can focus on in-office care, knowing that their patients are well cared for outside of office visits."</p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein</footer>
              </blockquote>

              <p>Looking to the future, OrthoNu is continually developing products focused on patient care that will further solidify its status as a leader in orthodontic innovations. OrthoNu is widely distributed in the US and is planning to expand distribution to the UK and EU in 2025. The Oral Relief Kitz™ products represent the next step in a long-term strategy to modernize patient management and empower doctors with the tools to elevate the standard of care across the globe.</p>

              <div className="border-t border-zinc-100 pt-6 space-y-2">
                <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About OrthoNu®</h3>
                <p className="text-xs text-soft-dark/70">OrthoNu is the first company to focus on driving innovation in orthodontic care by offering professional-grade, self-care products designed for patients undergoing treatment. Founded by Dr. Sima Yakoby Epstein, OrthoNu's mission is to transform the orthodontic experience. For more information about OrthoNu and its products, please visit <a href="https://www.orthonu.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">www.orthonu.com</a>.</p>
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
