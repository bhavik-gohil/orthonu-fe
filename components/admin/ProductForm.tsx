"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { apiUpload, API_BASE_URL } from "@/lib/api-client";
import {
  PlusCircle,
  X,
  ImageIcon,
  Loader2,
  Trash2,
  Plus,
  Check,
  Link2,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  PlayCircle,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const USER_TYPES = {
  REGULAR: "regular",
  PROFESSIONAL: "professional",
} as const;
type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

const MAX_STANDARD_IMAGES = 30;
const MAX_EXTRA_MEDIA = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_SIZE = 20 * 1024 * 1024;
const VIDEO_EMBED_PATTERN =
  /^https:\/\/(www\.)?(youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/;

function toVideoEmbed(url: string): string {
  if (!url) return url;
  if (VIDEO_EMBED_PATTERN.test(url)) return url;

  // YouTube
  const ytShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (ytShortMatch) return `https://www.youtube.com/embed/${ytShortMatch[1]}`;
  const ytWatchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch) return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;

  // Vimeo
  // Match standard URLs, manage/videos URLs, and showcase URLs. Also extract privacy hash if present.
  const vimeoMatch = url.match(/vimeo\.com\/(?:.*\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (vimeoMatch) {
    let embed = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    if (vimeoMatch[2]) {
      embed += `?h=${vimeoMatch[2]}`;
    }
    return embed;
  }

  return url;
}

function moveItem<T>(
  arr: T[],
  index: number,
  direction: "up" | "down" | "left" | "right",
): T[] {
  const next = [...arr];
  const targetIndex =
    direction === "up" || direction === "left" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= arr.length) return arr;
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

function fullUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  productCategory: string;
  header: string;
  text: string;
  image: string;
}

export interface ProductPrice {
  id: number;
  price: number;
  userType: string;
}
export interface ProductMedia {
  id: number;
  media: string;
  type: string;
  isExtra: boolean;
}
export interface ProductBundle {
  id: number;
  productRefId: number;
}

export interface ProductItem {
  id: number;
  name: string;
  intro?: string;
  slug: string;
  tag?: string;
  description?: string;
  additionalInfo?: Record<string, string>;
  isBundle: boolean;
  isVariant: boolean;
  variantName?: string;
  variantId: number | null;
  isDefaultVariant: boolean;
  prices?: ProductPrice[];
  media?: ProductMedia[];
  bundleItems?: ProductBundle[];
  variants?: ProductItem[];
  color?: string;
  categories?: Category[];
}

export interface ColorItem {
  id: number;
  color: string;
  colorName: string;
}

export interface UnifiedMediaItem {
  id?: number;
  type: "image" | "video";
  url?: string; // Video URL or existing media URL
  file?: File; // New image file
  previewUrl?: string; // Local preview for new file
}

export interface FormState {
  name: string;
  intro: string;
  variantName: string;
  baseVariantName?: string;
  productCategory: string;
  regularPrice: string;
  professionalPrice: string;
  mainMedia: UnifiedMediaItem[];
  extraMedia: UnifiedMediaItem[];
  tag: string;
  description: string;
  kvPairs: { key: string; value: string }[];
  isBundle: boolean;
  color: string;
}

export const defaultForm = (): FormState => ({
  name: "",
  intro: "",
  variantName: "",
  baseVariantName: "",
  productCategory: "",
  regularPrice: "",
  professionalPrice: "",
  mainMedia: [],
  extraMedia: [],
  tag: "",
  description: "",
  kvPairs: [{ key: "", value: "" }],
  isBundle: false,
  color: "",
});

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm text-soft-dark placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors font-sans";
const sectionCls =
  "flex flex-col gap-4 pt-6 border-zinc-100 first:pt-0 font-sans border-t border-zinc-100 first:border-t-0 mt-6 first:mt-0";
const sectionHeading =
  "text-sm font-bold text-soft-dark uppercase tracking-wider mb-2";

interface ProductFormProps {
  initialData?: ProductItem;
  categories: Category[];
  products: ProductItem[];
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
  submitLabel: string;
  isVariant?: boolean;
  parentId?: string; // Add parentId for variant creation
}

export default function ProductForm({
  initialData,
  categories,
  products,
  onSuccess,
  onError,
  onCancel,
  submitLabel,
  isVariant,
  parentId,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => {
    if (initialData) {
      const regularPrice =
        initialData.prices?.find((p) => p.userType === USER_TYPES.REGULAR)
          ?.price || 0;
      const professionalPrice =
        initialData.prices?.find((p) => p.userType === USER_TYPES.PROFESSIONAL)
          ?.price || 0;
      const allMedia = (initialData.media || []).sort(
        (a: any, b: any) => a.displayOrder - b.displayOrder,
      );
      const mainMedia: UnifiedMediaItem[] = allMedia
        .filter((m: any) => !m.isExtra)
        .map((m: any) => ({
          id: m.id,
          type: m.type as "image" | "video",
          url: m.media,
        }));
      const extraMedia: UnifiedMediaItem[] = allMedia
        .filter((m: any) => m.isExtra)
        .map((m: any) => ({
          id: m.id,
          type: m.type as "image" | "video",
          url: m.media,
        }));

      return {
        name: initialData.name,
        intro: initialData.intro || "",
        variantName: initialData.variantName || "",
        productCategory: initialData.categories?.[0]?.productCategory || "",
        regularPrice: String(regularPrice),
        professionalPrice: String(professionalPrice),
        mainMedia,
        extraMedia,
        tag: initialData.tag || "",
        description: initialData.description || "",
        kvPairs: initialData.additionalInfo
          ? Object.entries(initialData.additionalInfo).map(([k, v]) => ({
              key: k,
              value: v,
            }))
          : [{ key: "", value: "" }],
        isBundle: initialData.isBundle,
        color: initialData.color || "",
      };
    }
    return defaultForm();
  });
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const standardImageRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { apiCall } = await import("@/lib/api-client");
        const data = await apiCall("GET", "/colors");
        setColors(data);
      } catch (err) {
        console.error("Failed to fetch colors", err);
      }
    };
    fetchColors();
  }, []);

  const validate = (f: FormState, isEdit: boolean): string | null => {
    if (!f.name.trim()) return "Product name is required.";
    if (!f.productCategory) return "Category is required.";

    if (!isEdit || f.regularPrice) {
      if (
        !f.regularPrice ||
        isNaN(Number(f.regularPrice)) ||
        Number(f.regularPrice) <= 0
      )
        return "A valid regular price is required.";
    }

    for (const m of [...f.mainMedia, ...f.extraMedia]) {
      if (
        m.type === "video" &&
        (!m.url?.trim() || !VIDEO_EMBED_PATTERN.test(toVideoEmbed(m.url)))
      ) {
        return "Please provide a valid YouTube or Vimeo URL.";
      }
    }

    if (
      f.mainMedia.filter((m) => m.type === "image").length === 0 &&
      !initialData
    ) {
      return "At least one image is required.";
    }

    if (!f.description.trim()) return "Description is required.";
    return null;
  };

  const buildFormData = (
    f: FormState,
    isVariantCreation: boolean = false,
  ): FormData => {
    const fd = new FormData();
    fd.append("name", f.name);
    if (f.intro) fd.append("intro", f.intro);
    if (f.variantName) fd.append("variantName", f.variantName);
    if (f.baseVariantName) fd.append("baseVariantName", f.baseVariantName);
    fd.append("productCategory", f.productCategory);
    if (f.color) fd.append("color", f.color);
    fd.append("isBundle", String(f.isBundle));
    const prices: { userType: UserType; price: number }[] = [
      { userType: USER_TYPES.REGULAR, price: Number(f.regularPrice) },
    ];
    if (f.professionalPrice)
      prices.push({
        userType: USER_TYPES.PROFESSIONAL,
        price: Number(f.professionalPrice),
      });
    fd.append("prices", JSON.stringify(prices));

    // Process Unified Media
    const mediaLayout: any[] = [];
    const standardImages: File[] = [];
    const extraFiles: File[] = [];
    const keepMediaIds: number[] = [];

    const processMedia = (items: UnifiedMediaItem[], isExtra: boolean) => {
      const targetFiles = isExtra ? extraFiles : standardImages;
      items.forEach((m) => {
        if (m.id) {
          keepMediaIds.push(m.id);
          const payload: any = { id: m.id, type: m.type, isExtra };
          if (m.type === "video" && m.url) {
            payload.url = toVideoEmbed(m.url);
          }
          mediaLayout.push(payload);
        } else if (m.type === "video" && m.url) {
          mediaLayout.push({
            type: "video",
            url: toVideoEmbed(m.url),
            isExtra,
          });
        } else if (m.type === "image" && m.file) {
          const fileIndex = targetFiles.length;
          targetFiles.push(m.file);
          mediaLayout.push({ type: "image", fileIndex, isExtra });
        }
      });
    };

    processMedia(f.mainMedia, false);
    processMedia(f.extraMedia, true);

    fd.append("mediaLayout", JSON.stringify(mediaLayout));
    fd.append("keepMediaIds", JSON.stringify(keepMediaIds));
    standardImages.forEach((file) => fd.append("standardImages", file));
    extraFiles.forEach((file) => fd.append("extraFiles", file));
    fd.append("tag", f.tag);
    fd.append("description", f.description);
    fd.append(
      "additionalInfo",
      JSON.stringify(
        f.kvPairs.reduce(
          (acc, kv) => {
            if (kv.key.trim()) acc[kv.key.trim()] = kv.value;
            return acc;
          },
          {} as Record<string, string>,
        ),
      ),
    );
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!initialData && !isVariant;
    const err = validate(form, isEdit);
    if (err) {
      onError(err);
      return;
    }
    try {
      setSubmitting(true);
      let url: string;
      let method: "POST" | "PATCH";

      if (isVariant && parentId) {
        // Adding variant to existing product
        url = `/admin/products/${parentId}/variants`;
        method = "POST";
      } else if (isEdit) {
        // Updating existing product
        url = `/admin/products/${initialData.id}`;
        method = "PATCH";
      } else {
        // Creating new product
        url = "/admin/products/create";
        method = "POST";
      }

      await apiUpload(url, buildFormData(form, isVariant), method);
      
      // Cleanup preview URLs
      [...form.mainMedia, ...form.extraMedia].forEach((m) => {
        if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
      });

      const successMessage = isVariant
        ? "Variant added successfully!"
        : isEdit
          ? "Product updated successfully!"
          : "Product created successfully!";
      onSuccess(successMessage);
    } catch (error: any) {
      onError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Failed to process request.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-0 bg-white">
      <section className={sectionCls}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeading}>Basic Information</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
          >
            <X size={14} /> Cancel
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Product Name {!isVariant && "*"}
            </label>
            <input
              type="text"
              placeholder="e.g. Aligner Seater Case"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required={!isVariant}
              disabled={isVariant}
              className={`${inputCls} ${isVariant ? "bg-zinc-50 text-zinc-400 cursor-not-allowed" : ""}`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Product Intro
            </label>
            <input
              type="text"
              placeholder="e.g. A brief introduction to the product"
              value={form.intro}
              onChange={(e) => setField("intro", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Category {!isVariant && "*"}
            </label>
            <div className="relative">
              <select
                value={form.productCategory}
                onChange={(e) => setField("productCategory", e.target.value)}
                required={!isVariant}
                disabled={isVariant}
                className={`${inputCls} ${isVariant ? "bg-zinc-50 text-zinc-400 cursor-not-allowed" : ""} appearance-none cursor-pointer pr-10`}
              >
                <option value="">
                  {categories.length === 0
                    ? "No categories available"
                    : "Select Category"}
                </option>
                {categories.map((c, i) => (
                  <option key={i} value={c.productCategory}>
                    {c.productCategory}
                  </option>
                ))}
              </select>
            </div>
            {categories.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ No categories found. Please create categories first.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Product Color
            </label>
            <div className="relative">
              <select
                value={form.color}
                onChange={(e) => setField("color", e.target.value)}
                className={`${inputCls} appearance-none cursor-pointer pr-10`}
              >
                <option value="">Select Color</option>
                {colors.map((c) => (
                  <option key={c.id} value={c.color} className="flex">
                    {c.colorName}
                  </option>
                ))}
              </select>
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-8 rounded-xl border border-zinc-200"
                style={{ backgroundColor: form.color || "transparent" }}
              />
            </div>
          </div>
          {isVariant && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-soft-dark/60 uppercase tracking-wider">
                  New Variant Name (e.g. Blue, Large) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Blue"
                  value={form.variantName}
                  onChange={(e) => setField("variantName", e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-soft-dark/60 uppercase tracking-wider">
                  Base Product Variant Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Original, Standard"
                  value={form.baseVariantName || ""}
                  onChange={(e) =>
                    setField("baseVariantName" as any, e.target.value)
                  }
                  className={inputCls}
                  required
                />
                <p className="text-xs text-zinc-500">
                  This will be the variant name for the original product
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className={sectionHeading}>Product Details</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Tag (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. New Arrival"
              value={form.tag}
              onChange={(e) => setField("tag", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Description {!isVariant && "*"}
            </label>
            <textarea
              rows={4}
              placeholder="Detailed product description…"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={`${inputCls} min-h-[120px]`}
            />
          </div>
          <KVBuilder
            label="Additional Info (Optional)"
            pairs={form.kvPairs}
            onChange={(pairs) => setField("kvPairs", pairs)}
          />
        </div>
      </section>

      <section className={sectionCls}>
        <h2 className={sectionHeading}>Pricing {!isVariant && "*"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">
              Regular Price {!isVariant && "*"}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.regularPrice}
              onChange={(e) => setField("regularPrice", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-soft-dark/60 uppercase tracking-wider">
              Professional Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.professionalPrice}
              onChange={(e) => setField("professionalPrice", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      <section className={sectionCls}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={sectionHeading}>Product Media {!isVariant && "*"}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => standardImageRef.current?.click()}
              className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-brand-blue hover:text-white transition-all"
            >
              <PlusCircle size={12} strokeWidth={3} /> Add Images
            </button>
            <button
              type="button"
              onClick={() => {
                setField("mainMedia", [
                  ...form.mainMedia,
                  { type: "video", url: "" },
                ]);
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-brand-blue hover:text-white transition-all"
            >
              <PlusCircle size={12} strokeWidth={3} /> Add Video
            </button>
          </div>
        </div>
        <input
          ref={standardImageRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const newItems: UnifiedMediaItem[] = files.map((f) => ({
              type: "image",
              file: f,
              previewUrl: URL.createObjectURL(f),
            }));
            setField("mainMedia", [...form.mainMedia, ...newItems]);
            if (standardImageRef.current) standardImageRef.current.value = "";
          }}
        />
        <MediaManager
          items={form.mainMedia}
          onChange={(items) => setField("mainMedia", items)}
        />
      </section>

      <section className={sectionCls}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <h2 className={sectionHeading}>Extra Content</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Additional images or videos shown in gallery
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => extraFileRef.current?.click()}
              className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-brand-blue hover:text-white transition-all"
            >
              <PlusCircle size={12} strokeWidth={3} /> Add Images
            </button>
            <button
              type="button"
              onClick={() => {
                setField("extraMedia", [
                  ...form.extraMedia,
                  { type: "video", url: "" },
                ]);
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-brand-blue hover:text-white transition-all"
            >
              <PlusCircle size={12} strokeWidth={3} /> Add Video
            </button>
          </div>
        </div>
        <input
          ref={extraFileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const newItems: UnifiedMediaItem[] = files.map((f) => ({
              type: "image",
              file: f,
              previewUrl: URL.createObjectURL(f),
            }));
            setField("extraMedia", [...form.extraMedia, ...newItems]);
            if (extraFileRef.current) extraFileRef.current.value = "";
          }}
        />
        <MediaManager
          items={form.extraMedia}
          onChange={(items) => setField("extraMedia", items)}
        />
      </section>

      <section className={sectionCls}>
        <CheckboxToggle
          id="isBundle"
          label="Is Bundle?"
          checked={form.isBundle}
          onChange={(v) => setField("isBundle", v)}
        />
      </section>

      <div className="pt-12 flex justify-end bg-zinc-50 -mx-8 -mb-8 p-8 border-t border-zinc-100 mt-8 rounded-b-xl">
        <button
          type="submit"
          disabled={submitting}
          className="px-12 py-4 bg-brand-blue text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Check size={16} strokeWidth={3} /> {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function KVBuilder({
  label,
  pairs,
  onChange,
}: {
  label: string;
  pairs: { key: string; value: string }[];
  onChange: (pairs: { key: string; value: string }[]) => void;
}) {
  const update = (i: number, field: "key" | "value", val: string) => {
    const next = [...pairs];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-zinc-500">{label}</label>
      {pairs.map((pair, i) => (
        <div key={i} className="grid grid-cols-12 gap-2">
          <input
            type="text"
            placeholder="Key"
            value={pair.key}
            onChange={(e) => update(i, "key", e.target.value)}
            className={inputCls + " col-span-4"}
          />
          <input
            type="text"
            placeholder="Value"
            value={pair.value}
            onChange={(e) => update(i, "value", e.target.value)}
            className={inputCls + " col-span-6"}
          />
          <div className="col-span-2 flex items-center gap-1">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => onChange(moveItem(pairs, i, "up"))}
              className="text-zinc-400 hover:text-brand-blue disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              disabled={i === pairs.length - 1}
              onClick={() => onChange(moveItem(pairs, i, "down"))}
              className="text-zinc-400 hover:text-brand-blue disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              onClick={() =>
                onChange(
                  pairs.length > 1
                    ? pairs.filter((_, j) => j !== i)
                    : [{ key: "", value: "" }],
                )
              }
              className="text-zinc-400 hover:text-rose-500 transition-colors ml-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...pairs, { key: "", value: "" }])}
        className="text-xs font-medium text-brand-blue flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity w-fit"
      >
        <PlusCircle size={12} /> Add Field
      </button>
    </div>
  );
}

function CheckboxToggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer w-5 h-5 border-2 border-zinc-300 rounded-md cursor-pointer appearance-none transition-all checked:bg-brand-blue checked:border-brand-blue"
        />
        <CheckCircle2
          className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          size={13}
        />
      </div>
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-700 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}

function MediaManager({
  items,
  onChange,
}: {
  items: UnifiedMediaItem[];
  onChange: (items: UnifiedMediaItem[]) => void;
}) {
  const move = (i: number, dir: "up" | "down") => {
    onChange(moveItem(items, i, dir));
  };
  const remove = (i: number) => {
    const next = items.filter((_, j) => j !== i);
    onChange(next);
  };
  const updateUrl = (i: number, url: string) => {
    const next = [...items];
    next[i] = { ...next[i], url };
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-zinc-100 rounded-xl">
          <p className="text-xs text-zinc-400">No media added yet.</p>
        </div>
      )}
      {items.map((m, i) => {
        const embedUrl = m.type === "video" && m.url ? toVideoEmbed(m.url) : "";
        const isVideoValid = embedUrl && VIDEO_EMBED_PATTERN.test(embedUrl);

        return (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl group transition-all hover:bg-white hover:shadow-md"
          >
            {/* Reorder Arrows */}
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, "up")}
                className="text-zinc-400 hover:text-brand-blue disabled:opacity-0 transition-opacity p-1"
              >
                <ChevronUp size={20} />
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => move(i, "down")}
                className="text-zinc-400 hover:text-brand-blue disabled:opacity-0 transition-opacity p-1"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Media Preview (Larger) */}
            {m.type === "image" ? (
              <div className="w-72 aspect-auto rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200 shadow-sm relative">
                <img
                  src={m.previewUrl || fullUrl(m.url)}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            ) : isVideoValid ? (
              <div className="w-72 aspect-video rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200 shadow-sm relative">
                <iframe
                  src={embedUrl}
                  className="w-full h-full pointer-events-none"
                  tabIndex={-1}
                />
              </div>
            ) : (
              <div className="w-72 aspect-video rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200 shadow-sm relative">
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
                  <PlayCircle size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Enter Video URL
                  </span>
                </div>
              </div>
            )}

            {/* Info / Input */}
            <div className="flex-1 min-w-0">
              {m.type === "video" ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Video Source URL
                  </label>
                  <input
                    type="text"
                    placeholder="Paste YouTube or Vimeo URL"
                    value={m.url || ""}
                    onChange={(e) => updateUrl(i, e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-soft-dark truncate">
                    {m.file ? m.file.name : "Existing Image"}
                  </p>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    Product Image
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-zinc-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
