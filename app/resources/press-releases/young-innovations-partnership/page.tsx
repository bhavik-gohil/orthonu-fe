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
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">September 22, 2025</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              OrthoNu® Expands U.S. Market Reach Through Distribution Partnership with Young Innovations
            </h1>
            <p className="text-white/70 text-lg font-medium">
              Collaboration brings professional-grade orthodontic self-care solutions to more patients and practices nationwide
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 space-y-6 text-soft-dark/80 leading-relaxed text-sm">

              <p><strong>Red Bank, NJ – September 22, 2025</strong> – OrthoNu®, the first company solely dedicated to innovating orthodontic self-care, is proud to announce a new strategic distribution partnership with Young Innovations, Inc. ("Young"), a global leader in oral healthcare manufacturing and distribution.</p>

              <p>Through this partnership, Young Specialties—the specialty division of Young—will serve as a nationwide distributor for OrthoNu's professional-grade, patient-centered product line. Designed by an orthodontist for orthodontists, OrthoNu's innovative tools empower patients to manage common treatment challenges at home while helping practices reduce costly emergency visits and boost efficiency.</p>

              <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                <p className="italic text-soft-dark">"Our mission at OrthoNu has always been to advance patient care beyond the chair. By partnering with Young, we are aligning with a trusted leader whose reach and expertise will allow us to scale our solutions nationwide. Together, we will enhance continuity of care, improve patient experience, and deliver measurable value to orthodontic practices."</p>
                <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein, Founder of OrthoNu</footer>
              </blockquote>

              <div className="space-y-3">
                <h2 className="text-base font-black text-soft-dark uppercase tracking-wider">Redefining Orthodontic Self-Care</h2>
                <p>OrthoNu's clinically validated products address the most common issues faced by 85–90% of orthodontic patients, ensuring treatment journeys are more comfortable and predictable. The product portfolio includes:</p>
                <ul className="space-y-2 list-none pl-0">
                  {[
                    ["Chillin' Strips™", "Dissolvable, universal moldable strips that replace wax with long-lasting relief for irritation caused by braces or aligners."],
                    ["OrthoChewz™", "The first-ever dissolvable chew that relieves discomfort, alleviates dry mouth, and promotes gum health."],
                    ["Comfort Tape™", "Provides instant relief for achy teeth and sore gums."],
                    ["mouth-aid™", "A breakthrough formulation that soothes mouth sores and ulcers."],
                    ["Tweakz®", "A patented multitool for safely addressing sharp wires, dislodged brackets, and rough spots on braces or aligners."],
                  ].map(([name, desc]) => (
                    <li key={name} className="flex gap-2">
                      <span className="font-bold text-soft-dark shrink-0">{name}</span>
                      <span className="text-soft-dark/70">– {desc}</span>
                    </li>
                  ))}
                </ul>
                <p>By equipping orthodontists with these tools, practices can reduce unplanned emergency visits, drive revenue growth, and reinforce their commitment to patient-centered care.</p>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-black text-soft-dark uppercase tracking-wider">A Shared Vision for the Future of Orthodontics</h2>
                <p>The partnership with Young Specialties expands OrthoNu's footprint across the U.S. through a familiar and trusted distribution network. Together, the two companies will deliver a broader, more accessible suite of solutions designed to meet the needs of modern orthodontics.</p>
                <blockquote className="border-l-4 border-brand-blue pl-6 space-y-1">
                  <p className="italic text-soft-dark">"OrthoNu and Young share a vision of improving oral health through innovative solutions that benefit both patients and providers. This collaboration ensures our unique products are available to practices nationwide—empowering orthodontists to practice at the top of their license and elevating patient care in a competitive landscape."</p>
                  <footer className="text-xs font-bold text-brand-blue">— Dr. Sima Yakoby Epstein</footer>
                </blockquote>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-black text-soft-dark uppercase tracking-wider">Learn More</h2>
                <p>To explore OrthoNu's product portfolio, visit <a href="https://orthonu.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-medium">orthonu.com</a>.</p>
                <p>Clinicians can access continuing education courses and resources about OrthoNu's solutions through Young Specialties at <a href="https://youngspecialties.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-medium">youngspecialties.com</a>.</p>
              </div>

              <div className="border-t border-zinc-100 pt-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About OrthoNu®</h3>
                  <p className="text-xs text-soft-dark/70">OrthoNu® is a category-defining oral wellness company founded by orthodontist-turned-entrepreneur Dr. Sima Yakoby Epstein. The company offers professional-grade, self-care products that support patient outcomes and practice efficiency. OrthoNu is committed to transforming the orthodontic experience through science-backed innovation and strategic collaboration.<br /><br />OrthoNu LLC · 125 Half Mile Road, Suite 200 · Red Bank, New Jersey 07701 · <a href="https://www.orthonu.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">www.orthonu.com</a></p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-soft-dark uppercase tracking-wider">About Young Innovations</h3>
                  <p className="text-xs text-soft-dark/70">Young Innovations is a leading manufacturer, distributor, and educator in the oral healthcare industry. Through Young Specialties, the company delivers specialty products that enable clinicians to deliver the highest standard of care while improving patient outcomes. Together, they share a mission to create A Lifetime of Oral Health™ while Transforming Dentistry, Transforming Care™.</p>
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
