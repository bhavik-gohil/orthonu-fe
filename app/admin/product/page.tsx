"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiCall } from "@/lib/api-client";
import Snackbar from "@/components/Snackbar";
import {
  ChevronLeft,
  Plus,
  Loader2,
  ChevronRight,
  Package,
} from "lucide-react";
import ProductDetailView from "@/components/admin/ProductDetailView";
import { ProductItem, Category } from "@/components/admin/ProductForm";
import { useRouter } from "next/navigation";

import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { Trash2 } from "lucide-react";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductAdmin() {
  const router = useRouter();
  const [view, setView] = useState<"LIST" | "VIEW">("LIST");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategories(await apiCall("GET", "/product-categories"));
    } catch { /* silent */ }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setProducts(await apiCall("GET", "/admin/products"));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const showSnack = (type: "success" | "error", text: string) => setSnack({ type, text });

  const handleEdit = (p: ProductItem) => {
    router.push(`/admin/product/update/${p.id}`);
  };

  const handleDelete = async (p: ProductItem) => {
    if (!window.confirm(`Are you sure you want to delete "${p.name}"? This action cannot be undone.`)) return;

    try {
      await apiCall("DELETE", `/admin/products/${p.id}`);
      showSnack("success", "Product deleted successfully");
      fetchProducts();
    } catch (err: any) {
      showSnack("error", err?.response?.data?.message || err?.response?.data?.error || "Failed to delete product");
    }
  };

  const handleVariantAdded = () => {
    fetchProducts();
    if (selectedProduct) {
      apiCall("GET", `/admin/products/${selectedProduct.id}`).then(setSelectedProduct);
    }
  };

  return (
    <div className="flex flex-col flex-1 font-sans">
      {snack && (
        <Snackbar
          message={snack.text}
          type={snack.type}
          onDismiss={() => setSnack(null)}
        />
      )}

      {view === "LIST" ? (
        <div className="space-y-8">
          <PageHeader
            title="Product Management"
            eyebrow="Inventory"
          >
            <div className="pt-2">
              <Link
                href="/admin/product/create"
                className="px-6 py-3 text-xs font-bold text-white bg-brand-blue hover:bg-atlantic-blue rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2 w-fit cursor-pointer"
              >
                <Plus size={16} strokeWidth={3} /> Create Product
              </Link>
            </div>
          </PageHeader>

          <ListView
            loading={loading}
            products={products}
            onViewClick={(p) => {
              setSelectedProduct(p);
              setView("VIEW");
            }}
            onDeleteClick={handleDelete}
          />
        </div>
      ) : selectedProduct && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView("LIST")}
              className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors group text-xs font-bold uppercase tracking-widest"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to List
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(selectedProduct)}
                className="px-5 py-2.5 text-xs font-bold text-soft-dark border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Edit Details
              </button>
            </div>
          </div>

          <Card padding="none" className="overflow-hidden">
            <ProductDetailView
              product={selectedProduct}
              allProducts={products}
              categories={categories}
              onVariantAdded={handleVariantAdded}
              onEdit={handleEdit}
              showSnack={showSnack}
            />
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── ListView ─────────────────────────────────────────────────────────────────
function ListView({
  loading,
  products,
  onViewClick,
  onDeleteClick,
}: {
  loading: boolean;
  products: ProductItem[];
  onViewClick: (p: ProductItem) => void;
  onDeleteClick: (p: ProductItem) => void;
}) {
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 translate-y-24">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
        <p className="text-sm text-zinc-400 animate-pulse">Loading products…</p>
      </div>
    );

  if (products.length === 0)
    return (
      <Card className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300 mb-5">
          <Package size={32} />
        </div>
        <h3 className="text-xl font-bold text-soft-dark mb-2">No Products Yet</h3>
        <p className="text-sm text-soft-dark/40 max-w-xs mb-8 leading-relaxed">
          Your medical inventory is currently empty. Start by creating your first product path.
        </p>
        <Link
          href="/admin/product/create"
          className="px-10 py-4 bg-brand-blue text-white text-xs font-bold rounded-xl shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          Create First Product
        </Link>
      </Card>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product, i) => (
        <Card
          key={i}
          className="group hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300"
          padding="medium"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue/60">
                {product.productCategory}
              </span>
              <h3 className="text-lg font-bold text-soft-dark group-hover:text-brand-blue transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {product.isBundle && (
                  <span className="text-[9px] font-bold text-fresh-mint bg-fresh-mint/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                    Bundle
                  </span>
                )}
                {product.variants && product.variants.length > 0 && (
                  <span className="text-[9px] font-bold text-soft-plum bg-soft-plum/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                    {product.variants.length} variant{product.variants.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onDeleteClick(product)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-100 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => onViewClick(product)}
                className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-zinc-50 text-soft-dark border border-zinc-200 hover:bg-brand-blue hover:text-white hover:border-brand-blue hover:shadow-lg hover:shadow-brand-blue/20 transition-all cursor-pointer"
              >
                Manage
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
