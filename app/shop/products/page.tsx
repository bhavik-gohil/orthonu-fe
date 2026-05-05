"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { Product, Category } from "@/lib/types";
import { isSubdomainEnvironment } from "@/lib/subdomains";
import Container from "@/components/ui/Container";
import Link from "next/link";

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const isBundle = searchParams.get("isBundle") === "true";

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
        console.error("Failed to fetch products data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isAll = activeCategory?.toLowerCase() === "all";

  const filtered = (activeCategory && !isAll)
    ? products.filter((p) =>
        p.categories?.some((c) => c.productCategory === activeCategory),
      )
    : isBundle
    ? products.filter((p) => p.isBundle)
    : products;

  const grouped = (activeCategory && !isAll)
    ? [{ name: activeCategory, items: filtered }].filter(
        (g) => g.items.length > 0,
      )
    : isBundle
    ? [{ name: "OrthoNu Kits", items: filtered }].filter(
        (g) => g.items.length > 0,
      )
    : categories
        .map((cat) => ({
          name: cat.productCategory,
          items: products.filter((p) =>
            p.categories?.some(
              (c) => c.productCategory === cat.productCategory,
            ),
          ),
        }))
        .filter((g) => g.items.length > 0);

  // Get active category info for header
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
    <Container as="main" className="py-12 space-y-12">
      {/* ── Minimal Dynamic Category Header ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto md:px-8">
        <h1 className="text-3xl md:text-3xl font-black text-soft-dark tracking-tight leading-tight">
          {isAll ? "All Products" : isBundle ? "OrthoNu Kits" : activeCategoryInfo?.name || activeCategory || "Products"}
        </h1>
      </div>
      
      {grouped.length === 0 ? (
        <div className="text-center py-32 text-soft-dark/40 font-medium text-xl">
          No products found.
        </div>
      ) : (
        <div className="space-y-40 max-w-5xl mx-auto md:px-8">
          {grouped.map((group, idx) => (
            <div key={idx} className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    hrefPrefix={shopPrefix}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-cloud-blue text-soft-dark">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin text-brand-blue" size={32} />
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </div>
  );
}
