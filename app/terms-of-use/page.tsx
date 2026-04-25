import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import TermsOfUseContent from "@/components/legal/TermsOfUseContent";

export const metadata = { 
  title: "Terms of Use | OrthoNu" 
};

export default function TermsOfUsePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <TermsOfUseContent />
      <Footer />
    </div>
  );
}