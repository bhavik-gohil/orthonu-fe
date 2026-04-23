"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import ProductForm, {
  Category,
  ProductItem,
} from "@/components/admin/ProductForm";
import Snackbar from "@/components/Snackbar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [snack, setSnack] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, prodData] = await Promise.all([
          apiCall("GET", "/product-categories"),
          apiCall("GET", "/shop/products"),
        ]);
        setCategories(catData);
        setProducts(prodData);
        
        // Show warning if no categories exist
        if (!catData || catData.length === 0) {
          console.warn('No product categories found. Please create categories first.');
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        showSnack("error", "Failed to load categories and products. Please try again.");
      }
    };
    fetchData();
  }, []);

  const showSnack = (type: "success" | "error", text: string) =>
    setSnack({ type, text });

  return (
    <div className="flex flex-col flex-1 items-center justify-start font-sans p-8 gap-8 min-h-screen">
      {snack && (
        <Snackbar
          message={snack.text}
          type={snack.type}
          onDismiss={() => setSnack(null)}
        />
      )}

      <header className="flex w-full max-w-5xl items-center justify-between">
        <Link
          href="/admin/product"
          className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Back to Products
          </span>
        </Link>
        <h1 className="text-sm font-bold text-soft-dark uppercase tracking-[0.2em]">
          Create Product
        </h1>
        <div className="w-24" /> {/* Spacer */}
      </header>

      <main className="w-full max-w-5xl bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden">
        <ProductForm
          categories={categories}
          products={products}
          onSuccess={(msg) => {
            showSnack("success", msg);
            setTimeout(() => router.push("/admin/product"), 1500);
          }}
          onError={(msg) => showSnack("error", msg)}
          onCancel={() => router.push("/admin/product")}
          submitLabel="Create Product"
        />
      </main>
    </div>
  );
}
