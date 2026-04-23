"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import ProductForm, {
  Category,
  ProductItem,
} from "@/components/admin/ProductForm";
import Snackbar from "@/components/Snackbar";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UpdateProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData, allProdsData] = await Promise.all([
          apiCall("GET", `/admin/products/${id}`),
          apiCall("GET", "/product-categories"),
          apiCall("GET", "/admin/products"),
        ]);
        setProduct(prodData);
        setCategories(catData);
        setProducts(allProdsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
        showSnack("error", "Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const showSnack = (type: "success" | "error", text: string) =>
    setSnack({ type, text });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-brand-blue" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-zinc-500">Product not found.</p>
        <Link href="/admin/product" className="text-brand-blue hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

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
          Edit Product: {product.name}
        </h1>
        <div className="w-24" /> {/* Spacer */}
      </header>

      <main className="w-full max-w-5xl bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden">
        <ProductForm
          initialData={product}
          categories={categories}
          products={products}
          onSuccess={(msg) => {
            showSnack("success", msg);
            router.push("/admin/product");
          }}
          onError={(msg) => showSnack("error", msg)}
          onCancel={() => router.push("/admin/product")}
          submitLabel="Update Product"
          // Don't pass isVariant for updates - this is always an update operation
        />
      </main>
    </div>
  );
}
