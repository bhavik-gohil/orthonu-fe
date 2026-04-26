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
                    {activeCategory && activeCategoryInfo ? activeCategoryInfo.header : "The Collection"}
                  </h1>
                  <p className="max-w-xl mx-auto lg:mx-0 text-sm md:text-base text-soft-dark/50 font-medium leading-relaxed">
                    {activeCategory && activeCategoryInfo
                      ? activeCategoryInfo.text
                      : "Explore our range of precision oral health solutions, clinically tested and biologically optimized for modern care."}
                  </p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                <Pill
                  as={Link}
                  href={shopPrefix || "/"}
                  active={!activeCategory}
                  className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest"
                >
                  All
                </Pill>
                {categories.map((cat) => (
                  <Pill
                    key={cat.id}
                    as={Link}
                    href={`${shopPrefix}/?category=${encodeURIComponent(cat.productCategory)}`.replace(
                      "//",
                      "/",
                    )}
                    active={activeCategory === cat.productCategory}
                    className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest"
                  >
                    {cat.productCategory}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Right: Featured Image */}
            <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl shadow-atlantic-blue/10 bg-white">
                <Image
                  src={activeCategory && activeCategoryInfo?.image ? mediaUrl(activeCategoryInfo.image) : "/oral-relief-kitz2-updated-1200x714.png"}
                  alt={activeCategory && activeCategoryInfo ? activeCategoryInfo.productCategory : "OrthoNu Solutions"}
                  width={1200}
                  height={714}
                  className="w-full h-auto object-cover aspect-video"
                  priority
                />
              </div>
              <div className="absolute -z-10 -bottom-8 -right-8 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <Container as="main" className="py-24 space-y-32">

        {grouped.length === 0 ? (
          <div className="text-center py-32 text-soft-dark/40 font-medium text-xl">
            No products found.
          </div>
        ) : (
          <div className="space-y-40">
            {grouped.map((group, idx) => (
              <div key={idx} className="space-y-12">
                <div className="flex items-center gap-8">
                  <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-brand-blue bg-brand-blue/10 px-4 py-1.5 rounded-full">
                    {group.name}
                  </h2>
                  <div className="flex-1 h-px bg-zinc-200" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {group.items.length} Product
                    {group.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {group.items.map((product) => (
                    <ProductCard key={product.id} product={product} hrefPrefix={shopPrefix} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
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
