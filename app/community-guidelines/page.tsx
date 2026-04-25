import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import CommunityGuidelinesContent from "@/components/legal/CommunityGuidelinesContent";

export const metadata = { 
  title: "Community Guidelines | OrthoNu" 
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <CommunityGuidelinesContent />
      <Footer />
    </div>
  );
}
