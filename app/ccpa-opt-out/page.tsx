import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import CCPAOptOutContent from "@/components/legal/CCPAOptOutContent";

export const metadata = { 
  title: "CCPA Opt Out | OrthoNu" 
};

export default function CCPAOptOutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <CCPAOptOutContent />
      <Footer />
    </div>
  );
}
