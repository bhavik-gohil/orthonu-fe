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
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">September 19, 2022</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              OrthoNu® Launches as First Known Company Created to Advance the Orthodontic Industry as it Hits an Inflection Point Driving Massive Opportunity for Practices and Patients
            </h1>
          </div>
        </section>

        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 space-y-6 text-soft-dark/80 leading-relaxed">
              <p className="text-sm font-bold text-brand-blue uppercase tracking-widest">
                OrthoNu is Redefining Orthodontic Standard of Care with New Category of Self-Care Tools Supporting Orthodontists, Orthodontic care providers, and Patients
              </p>

              <ul className="space-y-2 text-sm list-disc list-inside text-soft-dark/70">
                <li>Orthodontic industry expected to triple in size by 2028 redefining practice and patient needs</li>
                <li>OrthoNu engagement with foremost experts and clinical research teams to support orthodontic and oral health practices in staying ahead of the curve</li>
              </ul>

              <p className="text-sm">
                <strong>Rumson, NJ, September 19, 2022/PR Web/</strong> – Created by an orthodontist, OrthoNu®, the first company entirely focused on developing new, dynamic science-driven discovery to support the orthodontic community and patients, is redefining the orthodontic standard of care with a new category of self-care solutions for real life. OrthoNu is delivering a full line of premium, professional-grade self-care tools, including Tweakz® for Braces and Tweakz® for Aligners, to meet the daily oral care needs of orthodontic patients and enhance practice efficiencies.
              </p>

              <p className="text-sm">
                The orthodontics market is undergoing a seismic shift due to the massive growth in patients of all ages seeking orthodontic treatments and the occurrence of new technologies. Still, nearly 9 in 10 patients experience urgent oral care issues during the course of their treatment.<sup>1</sup> OrthoNu gives patients the ability to better care for their oral health so unplanned and urgent appointments can be minimized. This provides orthodontic practices with the opportunity to create office efficiencies such as reduced use of clinical chair time and additional tools sterilizations, so care teams have more time to see scheduled patients, potentially leading to greater profitability.
              </p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="text-sm italic text-soft-dark">
                  "As orthodontists, we recognize that our industry is rapidly evolving. We need to look beyond the status quo to improve the patient experience in our offices and at home, and that is why I founded OrthoNu. By embracing and staying ahead of this shift, we'll create efficiencies that will enable our practices to do more for more patients and ultimately have an even greater impact on each patient's overall health."
                </p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein, DMD, OrthoNu Founder and CEO</footer>
              </blockquote>

              <p className="text-sm">
                Patients in orthodontic treatment are in a constant inflammatory state with an ever-changing microbiome, making it critical to maintain comfort and oral hygiene. OrthoNu is working with renowned researchers, medical centers, and developers of orthodontic concepts and solutions, to ensure the OrthoNu products are scientifically driven and of the highest quality.
              </p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="text-sm italic text-soft-dark">
                  "We are pleased to collaborate with OrthoNu to test and validate the science that could enable better sensors, so that it can be applied to their unique line of orthodontic care products to establish oral health and potential preventive medicine biomarkers for disease states found in the mouth. This research will help us identify and discover new ways that the orthodontic experience can be optimized to improve patient experience, outcomes, and overall health."
                </p>
                <footer className="text-xs font-bold text-brand-blue">— Shu Yang PhD, Joseph Bordogna Professor and Chair, Department of Materials Science and Engineering, University of Pennsylvania</footer>
              </blockquote>

              <p className="text-sm">
                OrthoNu's line of products focus on emergency care, oral hygiene, oral aesthetics, and oral health, reducing the massive impact of emergency visits and elevating the patient experience throughout treatment.
              </p>

              <p className="text-sm">
                For more information about OrthoNu including to see What's #NU4U, please visit{" "}
                <a href="https://www.orthonu.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-medium">www.OrthoNu.com</a>.
              </p>

              <div className="border-t border-zinc-100 pt-6 space-y-3">
                <h3 className="text-sm font-black text-soft-dark uppercase tracking-wider">About OrthoNu®</h3>
                <p className="text-sm text-soft-dark/70">
                  OrthoNu is the first company to focus on driving innovation in oral care to support both patient experience and practice efficiencies. OrthoNu is creating a new category of professional-grade, self-care products, including its hero product Tweakz® for Braces and Aligners, for orthodontists to provide to their patients, redefining the orthodontic standard of care. With an advisory board of industry leaders and developing partnerships with the University of Pennsylvania's School of Dental Medicine and the Center for Innovation & Precision Dentistry (CiPD), OrthoNu is committed to advancing the science of oral health, which has a significant role in improving overall health.
                </p>
              </div>

              <p className="text-xs text-zinc-400 border-t border-zinc-100 pt-4">
                <sup>1</sup> Bilder L., Hazan-Molina H., Aizenbud D. Medical emergencies in a dental office: inhalation and ingestion of orthodontic objects. <em>J Am Dent Assoc.</em> 2011;142:45–52. <br />
                Editor's Note: Updated October 5, 2022
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
