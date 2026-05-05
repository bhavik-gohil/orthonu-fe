"use client";

import { useEffect, useState, Suspense } from "react";
import { apiCall } from "@/lib/api-client";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Category, mediaUrl } from "@/lib/types";
import { isSubdomainEnvironment, getMainUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import Link from "next/link";

function ShopContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await apiCall("GET", "/product-categories");
        setCategories(catData);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [shopPrefix, setShopPrefix] = useState("/shop");

  useEffect(() => {
    if (isSubdomainEnvironment()) {
      setShopPrefix("");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <>
      {/* ── Shop Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 px-6 border-b border-zinc-100">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.6]"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(176,224,226,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(228,213,237,0.35) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 30%, rgba(157,213,239,0.3) 0%, transparent 40%),
              linear-gradient(135deg, #f0f8f9 0%, #FFF 40%, #f8f4fb 70%, #f0f9f5 100%)
            `,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
              <div className="space-y-4">
                <Link
                  href={getMainUrl("/")}
                  className="inline-flex items-center gap-1 text-soft-dark/40 hover:text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                >
                  <ChevronLeft size={12} /> Back to Home
                </Link>
                <div className="space-y-3">
                  <p className="text-[11px] font-bold tracking-[0.2em] text-atlantic-blue">
                    OrthoNu® Catalog
                  </p>
                  <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-soft-dark tracking-tight leading-tight">
                    Transforming Orthodontic Care
                  </h1>
                  <p className="max-w-xl mx-auto lg:mx-0 text-sm md:text-md text-soft-dark/50 font-medium leading-relaxed">
                    OrthoNu® redefines orthodontics with innovative self-care
                    products. Created by orthodontists, our solutions focus on
                    emergency care, oral hygiene, and aesthetics. Supported by
                    industry leaders and the University of Pennsylvania, we're
                    advancing oral health science to enhance patient experience
                    and practice efficiency.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Featured Image */}
            <div className="order-1 lg:order-2 relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl shadow-atlantic-blue/10 bg-white aspect-[1200/714]">
                <img
                  src={getMainUrl("/oral-relief-kitz2-updated-1200x714.png")}
                  alt="OrthoNu Solutions"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -z-10 -bottom-8 -right-8 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Showcase Section ─────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-24 px-6 bg-zinc-50/50">
          <div className="max-w-6xl mx-auto space-y-24">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black tracking-[0.1em] uppercase text-atlantic-blue">
                Our Categories
              </h2>
              <p className="text-xl md:text-3xl font-black text-soft-dark tracking-tight">
                Specialized Care for Every Need
              </p>
            </div>

            <div className="grid grid-cols-1 gap-24">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                    idx % 2 === 1 ? "lg:flex-row-reverse" : "",
                  )}
                >
                  <div
                    className={cn(
                      "space-y-8",
                      idx % 2 === 1 ? "lg:order-2" : "lg:order-1",
                    )}
                  >
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-4xl font-black text-soft-dark tracking-tight">
                        {cat.header || cat.productCategory}
                      </h3>
                      <p className="text-sm md:text-base text-soft-dark/60 font-medium leading-relaxed max-w-xl">
                        {cat.text ||
                          "Explore our specialized solutions for " +
                            cat.productCategory}
                      </p>
                    </div>
                    <Link
                      href={`${shopPrefix}/products?category=${encodeURIComponent(cat.productCategory)}`.replace(
                        "//",
                        "/",
                      )}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full font-bold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5"
                    >
                      Explore {cat.productCategory}
                      <ChevronRight size={16} />
                    </Link>
                  </div>

                  <div
                    className={cn(
                      "relative",
                      idx % 2 === 1 ? "lg:order-1" : "lg:order-2",
                    )}
                  >
                    <div className="relative aspect-video rounded-4xl overflow-hidden shadow-2xl bg-white">
                      <img
                        src={
                          cat.image
                            ? mediaUrl(cat.image)
                            : getMainUrl(
                                "/oral-relief-kitz2-updated-1200x714.png",
                              )
                        }
                        alt={cat.productCategory}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl" />
                    <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-atlantic-blue/5 rounded-full blur-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OrthoNu Kits Section ─────────────────────────────────── */}
      <section className="pt-6 pb-24 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 lg:order-1">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-4xl font-black text-soft-dark tracking-tight">
                  OrthoNu Kits
                </h3>
                <p className="text-sm md:text-base text-soft-dark/60 font-medium leading-relaxed max-w-xl">
                  Introducing the OrthoNu Collection: the complete orthodontic
                  comfort system. A curated suite of care essentials including
                  one Tweakz® toolkit of your choice alongside our four
                  innovative oral relief packs. Together, they cover the full
                  spectrum of orthodontic discomfort for unparalleled comfort
                  and oral health.
                </p>
              </div>
              <Link
                href={`${shopPrefix}/products?isBundle=true`.replace("//", "/")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full font-bold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5"
              >
                Explore OrthoNu Kits
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="relative lg:order-2">
              <div className="relative aspect-video rounded-4xl overflow-hidden shadow-2xl bg-white w-full flex items-center justify-center">
                <img
                  src={getMainUrl("/orthonu-collection.png")}
                  alt="OrthoNu Kits"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl" />
              <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-atlantic-blue/5 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Shop() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-cloud-blue text-soft-dark">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        }
      >
        <ShopContent />
      </Suspense>
    </div>
  );
}
