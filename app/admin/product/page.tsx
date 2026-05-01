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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical } from "lucide-react";

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
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [snack, setSnack] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategories(await apiCall("GET", "/product-categories"));
    } catch {
      /* silent */
    }
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

  const showSnack = (type: "success" | "error", text: string) =>
    setSnack({ type, text });

  const handleEdit = (p: ProductItem) => {
    router.push(`/admin/product/update/${p.id}`);
  };

  const handleDelete = async (p: ProductItem) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${p.name}"? This action cannot be undone.`,
      )
    )
      return;

    try {
      await apiCall("DELETE", `/admin/products/${p.id}`);
      showSnack("success", "Product deleted successfully");
      fetchProducts();
    } catch (err: any) {
      showSnack(
        "error",
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to delete product",
      );
    }
  };

  const handleVariantAdded = () => {
    fetchProducts();
    if (selectedProduct) {
      apiCall("GET", `/admin/products/${selectedProduct.id}`).then(
        setSelectedProduct,
      );
    }
  };

  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      const orders = products.map((p, index) => ({
        id: p.id,
        displayOrder: index,
      }));

      await apiCall("PATCH", "/admin/products/reorder", { orders });
      showSnack("success", "Product order updated successfully");
      setReordering(false);
      fetchProducts();
    } catch (err: any) {
      showSnack("error", "Failed to save product order");
    } finally {
      setSavingOrder(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((p) => p.id === active.id);
        const newIndex = items.findIndex((p) => p.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
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
          <PageHeader title="Product Management" eyebrow="Inventory">
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/admin/product/create"
                className="px-6 py-3 text-[10px] font-black tracking-widest text-white bg-brand-blue hover:bg-atlantic-blue rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2 w-fit cursor-pointer uppercase"
              >
                <Plus size={14} strokeWidth={3} /> Create Product
              </Link>
              <button
                onClick={() => setReordering(!reordering)}
                className={`px-6 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all flex items-center gap-2 w-fit cursor-pointer uppercase border ${
                  reordering
                    ? "bg-zinc-100 text-soft-dark border-zinc-200"
                    : "bg-white text-brand-blue border-brand-blue/20 hover:bg-brand-blue/5"
                }`}
              >
                {reordering ? "Cancel Reorder" : "Reorder Products"}
              </button>
              {reordering && (
                <button
                  onClick={handleSaveOrder}
                  disabled={savingOrder}
                  className="px-6 py-3 text-[10px] font-black tracking-widest text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 w-fit cursor-pointer disabled:opacity-50 uppercase"
                >
                  {savingOrder ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    "Save Order"
                  )}
                </button>
              )}
            </div>
          </PageHeader>

          {reordering ? (
            <ReorderList
              products={products}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            />
          ) : (
            <ListView
              loading={loading}
              products={products}
              onViewClick={(p) => {
                setSelectedProduct(p);
                setView("VIEW");
              }}
              onDeleteClick={handleDelete}
            />
          )}
        </div>
      ) : (
        selectedProduct && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setView("LIST")}
                className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors group text-xs font-bold uppercase tracking-widest"
              >
                <ChevronLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
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
        )
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
        <h3 className="text-xl font-bold text-soft-dark mb-2">
          No Products Yet
        </h3>
        <p className="text-sm text-soft-dark/40 max-w-xs mb-8 leading-relaxed">
          Your medical inventory is currently empty. Start by creating your
          first product path.
        </p>
        <Link
          href="/admin/product/create"
          className="px-10 py-4 bg-brand-blue text-white text-xs font-bold rounded-xl shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          Create First Product
        </Link>
      </Card>
    );

  // Group products by category
  const groupedProducts = products.reduce(
    (acc, p) => {
      const cat =
        (p as any).categories?.[0]?.productCategory || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    },
    {} as Record<string, ProductItem[]>,
  );

  const categoryNames = Object.keys(groupedProducts).sort();

  return (
    <div className="space-y-12">
      {categoryNames.map((cat) => (
        <div key={cat} className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue whitespace-nowrap">
              {cat}
            </h2>
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {groupedProducts[cat].length} Item
              {groupedProducts[cat].length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedProducts[cat].map((product, i) => (
              <Card
                key={i}
                className="group hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300"
                padding="medium"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-soft-dark group-hover:text-brand-blue transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {(product as any).categories?.[0]?.productCategory && (
                        <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          {(product as any).categories[0].productCategory}
                        </span>
                      )}
                      {product.isBundle && (
                        <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          Bundle
                        </span>
                      )}
                      {product.isVariant && (
                        <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          Variant : {product.variantName || "Unnamed"}
                        </span>
                      )}
                      {product.isDefaultVariant && (
                        <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter w-fit">
                          Default Variant
                        </span>
                      )}
                      {product.variants && product.variants.length > 0 && (
                        <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          {product.variants.length} variant
                          {product.variants.length > 1 ? "s" : ""}
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
        </div>
      ))}
    </div>
  );
}

// ─── ReorderList ──────────────────────────────────────────────────────────────
function ReorderList({
  products,
  onDragEnd,
  sensors,
}: {
  products: ProductItem[];
  onDragEnd: (e: DragEndEvent) => void;
  sensors: any;
}) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={products.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 max-w-4xl mx-auto">
          {products.map((product) => (
            <SortableItem key={product.id} product={product} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ─── SortableItem ─────────────────────────────────────────────────────────────
function SortableItem({ product }: { product: ProductItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card
        padding="medium"
        className={`flex items-center gap-4 transition-all duration-200 ${isDragging ? "shadow-2xl ring-2 ring-brand-blue/20 bg-zinc-50 border-brand-blue/30" : "hover:border-brand-blue/20"}`}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 text-zinc-300 hover:text-brand-blue transition-colors"
        >
          <GripVertical size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-soft-dark truncate">
            {product.name}
          </h3>
          <div className="space-x-2">
            <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter w-fit">
              {(product as any).categories?.[0]?.productCategory ||
                "No Category"}
            </span>
            {product.isVariant && (
              <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter w-fit">
                Variant : {product.variantName || "variant"}
              </span>
            )}
            {product.isDefaultVariant && (
              <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter w-fit">
                Default Variant
              </span>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {product.isBundle && (
            <span className="text-[9px] font-bold text-atlantic-blue bg-brand-blue/10 px-2.5 py-1 rounded-full uppercase tracking-tighter w-fit">
              Bundle
            </span>
          )}
          <span className="text-[10px] font-black text-soft-dark/20 uppercase tracking-widest tabular-nums">
            ID: {product.id}
          </span>
        </div>
      </Card>
    </div>
  );
}
