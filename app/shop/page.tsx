"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { Product, Category, mediaUrl } from "@/lib/types";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import Pill from "@/components/ui/Pill";
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
    // If we are on the deployed shop subdomain, we don't need the /shop prefix for internal links
    // so the URL stays clean (newtestshop.orthonu.com/product/...)
    // Locally (localhost), we keep /shop so routing works correctly.
    const host = window.location.hostname;
    if (host === "newtestshop.orthonu.com" || host === "shop.orthonu.com") {
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
    <Container as="main" className="py-24 space-y-32">
      <PageHeader
        eyebrow="The OrthoNu Catalog"
        title={activeCategory ? activeCategory : "The Collection"}
        subtitle="Explore our range of precision oral health solutions, clinically tested and biologically optimized for modern care."
        titleSize="extra-large"
      >
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Pill as={Link} href={shopPrefix || "/"} active={!activeCategory}>
            All
          </Pill>
          {categories.map((cat) => (
            <Pill
              key={cat.id}
              as={Link}
              href={`${shopPrefix}/?category=${encodeURIComponent(cat.productCategory)}`.replace('//', '/')}
              active={activeCategory === cat.productCategory}
            >
              {cat.productCategory}
            </Pill>
          ))}
        </div>
      </PageHeader>

      {/* Category Description Banner - Now Dynamic */}
      {activeCategory && activeCategoryInfo && (
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-soft-dark tracking-tight leading-tight">
                {activeCategoryInfo.header}
              </h2>
              <p className="text-soft-dark/70 text-base leading-relaxed font-medium">
                {activeCategoryInfo.text}
              </p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-50">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${activeCategoryInfo.image}`}
                alt={activeCategoryInfo.productCategory}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      )}

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
