import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";

export const metadata = { 
  title: "CCPA Opt Out | OrthoNu" 
};

export default function CCPAOptOutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-black text-soft-dark mb-8">CCPA Opt Out</h1>
        <div className="prose prose-zinc max-w-none space-y-6 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Your Rights Under the California Consumer Privacy Act</h2>
            <p>The California Consumer Privacy Act (CCPA) provides you with rights regarding how your data or personal information is treated. Under the legislation, California residents can choose to opt out of the "sale" of their personal information to third parties. Based on the CCPA definition, "sale" refers to data collection for the purpose of creating advertising and other communications.</p>
            
            <p>Learn more about CCPA and your privacy rights by visiting the official resources or reviewing our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">How to Opt Out</h2>
            <p>Select your preference in the pop-up banner at the bottom of this site or use the opt-out preference page link in the footer. This applies to both third-parties and the data we collect to help personalize your experience on our website or through other communications.</p>
            
            <p>For more information, view our <a href="/privacy-policy" className="text-brand-blue hover:underline">Privacy Policy</a>.</p>
            
            <p className="mt-4 p-4 bg-blue-50 border-l-4 border-brand-blue rounded">
              <strong>Eligibility:</strong> To be eligible to opt-out, you must be browsing from California.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
