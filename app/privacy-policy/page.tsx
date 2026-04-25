import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import PrivacyPolicyContent from "@/components/legal/PrivacyPolicyContent";

export const metadata = { 
  title: "Privacy Policy | OrthoNu" 
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <PrivacyPolicyContent />
      <Footer />
    </div>
  );
}