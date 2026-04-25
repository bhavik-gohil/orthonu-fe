import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import RefundAndReturnsPolicyContent from "@/components/legal/RefundAndReturnsPolicyContent";

export const metadata = { 
  title: "Refund and Returns Policy | OrthoNu" 
};

export default function RefundAndReturnsPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <RefundAndReturnsPolicyContent />
      <Footer />
    </div>
  );
}