import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";

export const metadata = { 
  title: "Refund and Returns Policy | OrthoNu" 
};

export default function RefundAndReturnsPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-soft-dark font-sans">
      <HomeNavbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-black text-soft-dark mb-8">Refund and Returns Policy</h1>
        <div className="prose prose-zinc max-w-none space-y-6 text-sm leading-relaxed">
          
          <p>OrthoNu does not accept product returns.</p>

          <section>
            <h2 className="text-xl font-bold text-soft-dark mb-4">Damages and Order Issues</h2>
            <p>Please inspect your order upon receipt and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}