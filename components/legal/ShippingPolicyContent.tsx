import React from "react";

export default function ShippingPolicyContent() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 w-full">
      <h1 className="text-3xl font-black text-soft-dark mb-8">Shipping Policy</h1>
      <div className="prose prose-zinc max-w-none space-y-6 text-sm leading-relaxed text-soft-dark/80">
        
        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">Shipping Coverage</h2>
          <p>Currently, we ship within the United States only. Contact us at sales@orthonu.com for a quote for any other country.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-soft-dark mb-4">Processing Times</h2>
          <p>We endeavor to ship orders within 48 hours of receipt, except for orders received on Friday or Saturday. Orders shipped using priority service levels will be shipped within 24 hours of receipt, except for orders received on Saturday or Sunday.</p>
        </section>

      </div>
    </main>
  );
}
