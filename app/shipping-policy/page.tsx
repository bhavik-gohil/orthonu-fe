import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import ShippingPolicyContent from "@/components/legal/ShippingPolicyContent";

export const metadata = { 
  title: "Shipping Policy | OrthoNu" 
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <ShippingPolicyContent />
      <Footer />
    </div>
  );
}