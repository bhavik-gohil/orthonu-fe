"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiCall, apiUpload } from "@/lib/api-client";
import ProductForm, {
  Category,
  ProductItem,
} from "@/components/admin/ProductForm";
import Snackbar from "@/components/Snackbar";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function AddVariantContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId");

  const [parent, setParent] = useState<ProductItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!parentId) {
      router.push("/admin/product");
      return;
    }

    const fetchData = async () => {
      try {
        const [parentData, catData, prodData] = await Promise.all([
          apiCall("GET", `/admin/products/${parentId}`),
          apiCall("GET", "/product-categories"),
          apiCall("GET", "/admin/products"),
        ]);
        setParent(parentData);
        setCategories(catData);
        setAllProducts(prodData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentId, router]);

  const showSnack = (type: "success" | "error", text: string) =>
    setSnack({ type, text });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-vh-screen">
        <Loader2 className="animate-spin text-brand-blue" size={48} />
      </div>
    );
  }

  if (!parent) return null;

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
          href={`/admin/product`}
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
          Add Variant to: {parent.name}
        </h1>
        <div className="w-24" />
      </header>

      <main className="w-full max-w-5xl bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden">
        <ProductForm
          initialData={parent}
          categories={categories}
          products={allProducts}
          onSuccess={(msg) => {
            showSnack("success", msg);
            router.push("/admin/product");
          }}
          onError={(msg) => showSnack("error", msg)}
          onCancel={() => router.push("/admin/product")}
          submitLabel="Add Variant"
          isVariant={true}
          parentId={parentId || ""}
        />
      </main>
    </div>
  );
}

export default function AddVariantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" size={48} />
        </div>
      }
    >
      <AddVariantContent />
    </Suspense>
  );
}
