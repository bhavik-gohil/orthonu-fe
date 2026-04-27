"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { Product, Category, mediaUrl } from "@/lib/types";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import Pill from "@/components/ui/Pill";
import { isSubdomainEnvironment } from "@/lib/subdomains";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Link from "next/link";

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          apiCall("GET", "/shop/products"),
          apiCall("GET", "/product-categories"),
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = activeCategory
    ? products.filter((p) => p.productCategory === activeCategory)
    : products;

  const grouped = activeCategory
    ? [{ name: activeCategory, items: filtered }].filter(
      (g) => g.items.length > 0,
    )
    : categories
      .map((cat) => ({
        name: cat.productCategory,
        items: products.filter(
          (p) => p.productCategory === cat.productCategory,
        ),
      }))
      .filter((g) => g.items.length > 0);

  // Get active category info
  const activeCategoryInfo = categories.find(
    (cat) => cat.productCategory === activeCategory,
  );

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
      {!activeCategory && (
        <section className="relative overflow-hidden bg-white py-16 lg:py-24 px-6 border-b border-zinc-100">
          {/* Sophisticated pastel mesh background */}
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

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Content */}
              <div className="space-y-8 order-2 lg:order-1 text-center lg:text-left">
                <div className="space-y-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-soft-dark/40 hover:text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                  >
                    <ChevronLeft size={12} /> Back to Home
                  </Link>
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-atlantic-blue">
                      OrthoNu® Catalog
                    </p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-soft-dark tracking-tight leading-tight">
                      The Collection
                    </h1>
                    <p className="max-w-xl mx-auto lg:mx-0 text-sm md:text-base text-soft-dark/50 font-medium leading-relaxed">
                      Explore our range of precision oral health solutions, clinically tested and biologically optimized for modern care.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Featured Image */}
              <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl shadow-atlantic-blue/10 bg-white aspect-[1200/714]">
                  <Image
                    src="/oral-relief-kitz2-updated-1200x714.png"
                    alt="OrthoNu Solutions"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
                <div className="absolute -z-10 -bottom-8 -right-8 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Category Showcase Section ─────────────────────────────────── */}
      {!activeCategory && categories.length > 0 && (
        <section className="py-24 px-6 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-4">
              <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-brand-blue">
                Our Categories
              </h2>
              <p className="text-3xl font-black text-soft-dark tracking-tight">
                Specialized Care for Every Need
              </p>
            </div>

            <div className="grid grid-cols-1 gap-24">
              {categories.map((cat, idx) => (
                <div 
                  key={cat.id} 
                  className={cn(
                    "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                    idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                  )}
                >
                  <div className={cn("space-y-8", idx % 2 === 1 ? "lg:order-2" : "lg:order-1")}>
                    <div className="space-y-4">
                      <h3 className="text-4xl font-black text-soft-dark tracking-tight">
                        {cat.header || cat.productCategory}
                      </h3>
                      <p className="text-lg text-soft-dark/60 font-medium leading-relaxed max-w-xl">
                        {cat.text || "Explore our specialized solutions for " + cat.productCategory}
                      </p>
                    </div>
                    <Link
                      href={`${shopPrefix}/?category=${encodeURIComponent(cat.productCategory)}`.replace("//", "/")}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full font-bold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5"
                    >
                      View {cat.productCategory} Solutions
                      <ChevronRight size={16} />
                    </Link>
                  </div>

                  <div className={cn("relative", idx % 2 === 1 ? "lg:order-1" : "lg:order-2")}>
                    <div className="relative aspect-video rounded-4xl overflow-hidden shadow-2xl bg-white">
                      <Image
                        src={cat.image ? mediaUrl(cat.image) : "/oral-relief-kitz2-updated-1200x714.png"}
                        alt={cat.productCategory}
                        fill
                        className="object-cover"
                        unoptimized
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

      {activeCategory && (
        <Container as="main" className="py-6 space-y-32">
          {grouped.length === 0 ? (
            <div className="text-center py-32 text-soft-dark/40 font-medium text-xl">
              No products found.
            </div>
          ) : (
            <div className="space-y-40">
              {grouped.map((group, idx) => (
                <div key={idx} className="space-y-12">
                  <div className="flex items-center gap-8">
                    <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-atlantic-blue bg-brand-blue/10 px-4 py-1.5 rounded-full">
                      {group.name}
                    </h2>
                    {/* <div className="flex-1 h-px bg-zinc-200" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {group.items.length} Product
                      {group.items.length !== 1 ? "s" : ""}
                    </span> */}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.items.map((product) => (
                      <ProductCard key={product.id} product={product} hrefPrefix={shopPrefix} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      )}
    </>
  );
}

export default function Shop() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-warm-gray text-soft-dark">
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
