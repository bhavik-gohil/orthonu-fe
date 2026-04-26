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
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const USER_TYPES = {
  REGULAR: "regular",
  PROFESSIONAL: "professional",
} as const;
type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

const MAX_STANDARD_IMAGES = 10;
const MAX_EXTRA_MEDIA = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_SIZE = 20 * 1024 * 1024;
const YOUTUBE_EMBED_PATTERN = /^https:\/\/(www\.)?youtube\.com\/embed\//;

function toYoutubeEmbed(url: string): string {
  if (!url) return url;
  if (YOUTUBE_EMBED_PATTERN.test(url)) return url;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
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
  productCategory: string;
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
}

export interface ColorItem {
  id: number;
  color: string;
  colorName: string;
}

export interface ExtraMediaEntry {
  id?: number;
  type: "image" | "video" | "pdf";
  file?: File;
  youtubeUrl?: string;
  previewUrl?: string;
}

export interface FormState {
  name: string;
  intro: string;
  variantName: string;
  baseVariantName?: string;
  productCategory: string;
  regularPrice: string;
  professionalPrice: string;
  standardImages: { file: File; previewUrl: string }[];
  currentImages?: { id: number; media: string }[];
  standardYoutubeUrls: { id?: number; url: string }[];
  extraMedia: ExtraMediaEntry[];
  tag: string;
  description: string;
  kvPairs: { key: string; value: string }[];
  isBundle: boolean;
  bundleItems: number[];
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
  standardImages: [],
  standardYoutubeUrls: [{ url: "" }],
  extraMedia: [],
  tag: "",
  description: "",
  kvPairs: [{ key: "", value: "" }],
  isBundle: false,
  bundleItems: [],
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
      return {
        name: initialData.name,
        intro: initialData.intro || "",
        variantName: initialData.variantName || "",
        productCategory: initialData.productCategory,
        regularPrice: String(regularPrice),
        professionalPrice: String(professionalPrice),
        standardImages: [],
        currentImages:
          initialData.media
            ?.filter((m) => !m.isExtra && m.type === "image")
            .map((m) => ({ id: m.id, media: m.media })) || [],
        standardYoutubeUrls: initialData.media
          ?.filter((m) => m.type === "video" && !m.isExtra)
          .map((m) => ({ id: m.id, url: m.media })) || [{ url: "" }],
        extraMedia:
          initialData.media
            ?.filter((m) => m.isExtra)
            .map((m) => ({
              id: m.id,
              type: m.type as any,
              youtubeUrl: m.type === "video" ? m.media : undefined,
              previewUrl: m.type !== "video" ? fullUrl(m.media) : undefined,
            })) || [],
        tag: initialData.tag || "",
        description: initialData.description || "",
        kvPairs: initialData.additionalInfo
          ? Object.entries(initialData.additionalInfo).map(([k, v]) => ({
              key: k,
              value: v,
            }))
          : [{ key: "", value: "" }],
        isBundle: initialData.isBundle,
        bundleItems: initialData.bundleItems?.map((b) => b.productRefId) || [],
        color: initialData.color || "",
      };
    }
    return defaultForm();
  });
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const standardImageRef = useRef<HTMLInputElement>(null);

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
    if (!isEdit && !f.name.trim()) return "Product name is required.";
    if (!isEdit && !f.productCategory) return "Category is required.";

    if (!isEdit || f.regularPrice) {
      if (
        !f.regularPrice ||
        isNaN(Number(f.regularPrice)) ||
        Number(f.regularPrice) <= 0
      )
        return "A valid regular price is required.";
    }

    const totalImages =
      f.standardImages.length + (f.currentImages?.length || 0);
    if (!isEdit && totalImages === 0)
      return "At least one product image is required.";

    for (const img of f.standardImages)
      if (img.file.size > MAX_IMAGE_SIZE)
        return `Image "${img.file.name}" exceeds the 10 MB limit.`;

    const filledYtUrls = f.standardYoutubeUrls.filter((u) => u.url.trim());
    for (const item of filledYtUrls)
      if (!YOUTUBE_EMBED_PATTERN.test(toYoutubeEmbed(item.url)))
        return `"${item.url}" is not a valid YouTube URL.`;

    for (const em of f.extraMedia) {
      if (
        em.type === "video" &&
        (!em.youtubeUrl?.trim() ||
          !YOUTUBE_EMBED_PATTERN.test(toYoutubeEmbed(em.youtubeUrl)))
      )
        return "Extra video must be a valid YouTube URL.";
      if (em.type === "image" && em.file && em.file.size > MAX_IMAGE_SIZE)
        return `Extra image "${em.file.name}" exceeds 10 MB.`;
      if (em.type === "pdf" && em.file && em.file.size > MAX_PDF_SIZE)
        return `PDF "${em.file.name}" exceeds 20 MB.`;
    }

    if (!isEdit && !f.description.trim()) return "Description is required.";
    if (f.isBundle && f.bundleItems.length === 0)
      return "Select at least one product for the bundle.";
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
    f.standardImages.forEach((img) => fd.append("standardImages", img.file));
    const validYtItems = f.standardYoutubeUrls
      .map((u) => ({ ...u, url: u.url.trim() }))
      .filter((u) => u.url);
    const newYtUrls = validYtItems
      .filter((u) => !u.id)
      .map((u) => toYoutubeEmbed(u.url));
    if (newYtUrls.length > 0)
      fd.append("standardYoutubeUrls", JSON.stringify(newYtUrls));

    const allExtra = [...f.extraMedia];
    const fileOnlyExtra = allExtra.filter((e) => e.type !== "video");
    const extraMediaMeta = allExtra.map((item) =>
      item.type === "video"
        ? { type: "video", youtubeUrl: item.youtubeUrl }
        : { type: item.type, fileIndex: fileOnlyExtra.indexOf(item) },
    );
    if (extraMediaMeta.length)
      fd.append("extraMediaMeta", JSON.stringify(extraMediaMeta));
    fileOnlyExtra.forEach((e) => e.file && fd.append("extraFiles", e.file));

    // Build keepMediaIds array for existing media (only for updates, not for variant creation)
    if (!isVariantCreation) {
      const keepMediaIds: number[] = [];

      // Keep existing standard images
      if (f.currentImages) {
        f.currentImages.forEach((img) => keepMediaIds.push(img.id));
      }

      // Keep existing YouTube videos
      validYtItems
        .filter((u) => u.id)
        .forEach((item) => {
          if (item.id) keepMediaIds.push(item.id);
        });

      // Keep existing extra media
      f.extraMedia.forEach((em) => {
        if (em.id) keepMediaIds.push(em.id);
      });

      if (keepMediaIds.length > 0)
        fd.append("keepMediaIds", JSON.stringify(keepMediaIds));
    }
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
    if (f.isBundle)
      fd.append(
        "bundleItems",
        JSON.stringify(f.bundleItems.map((id) => ({ productRefId: id }))),
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
      form.standardImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));

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
              className={`${inputCls} min-h-[120px] resize-none`}
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
        <div>
          <h2 className={sectionHeading}>Product Media {!isVariant && "*"}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Images (JPEG, PNG, WebP · max 10 MB each)
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-200 rounded-xl p-10 cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-all group">
            <div className="p-4 bg-brand-blue/10 rounded-xl text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
              <ImageIcon size={32} />
            </div>
            <div className="text-center space-y-1">
              <span className="block text-sm font-bold text-soft-dark">
                Click to select images
              </span>
              <span className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Up to {MAX_STANDARD_IMAGES} images · JPEG, PNG, WebP
              </span>
            </div>
            <input
              ref={standardImageRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || []);
                if (newFiles.length === 0) return;
                const combined = [
                  ...form.standardImages,
                  ...newFiles.map((f) => ({
                    file: f,
                    previewUrl: URL.createObjectURL(f),
                  })),
                ];
                setField(
                  "standardImages",
                  combined.slice(
                    0,
                    MAX_STANDARD_IMAGES - (form.currentImages?.length || 0),
                  ),
                );
                if (standardImageRef.current)
                  standardImageRef.current.value = "";
              }}
            />
          </label>
          {/* Image Preview Grid */}
          <div className="grid grid-cols-5 gap-2">
            {form.currentImages?.map((img, i) => (
              <div
                key={`curr-${i}`}
                className="relative group rounded-xl overflow-hidden aspect-square bg-zinc-100 border border-zinc-100"
              >
                <img
                  src={fullUrl(img.media)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setField(
                      "currentImages",
                      form.currentImages?.filter((_, j) => j !== i),
                    );
                  }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            {form.standardImages.map((img, i) => (
              <div
                key={`new-${i}`}
                className="relative group rounded-xl overflow-hidden aspect-square bg-zinc-100 border border-zinc-100"
              >
                <img
                  src={img.previewUrl}
                  alt={img.file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(img.previewUrl);
                    setField(
                      "standardImages",
                      form.standardImages.filter((_, j) => j !== i),
                    );
                  }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Video Section */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
              Video (<Link2 size={11} /> YouTube){" "}
              <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setField("standardYoutubeUrls", [
                  ...form.standardYoutubeUrls,
                  { url: "" },
                ])
              }
              className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-brand-blue hover:text-white transition-all"
            >
              <PlusCircle size={12} strokeWidth={3} /> Add Video
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.standardYoutubeUrls.map((item, i) => (
              <YoutubeUrlInput
                key={i}
                value={item.url}
                onChange={(val) => {
                  const next = [...form.standardYoutubeUrls];
                  next[i] = { ...next[i], url: val };
                  setField("standardYoutubeUrls", next);
                }}
                onRemove={
                  form.standardYoutubeUrls.length > 1
                    ? () =>
                        setField(
                          "standardYoutubeUrls",
                          form.standardYoutubeUrls.filter((_, j) => j !== i),
                        )
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className={sectionCls}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={sectionHeading}>
              Extra Media{" "}
              <span className="text-zinc-400 font-normal text-xs">
                (Optional · up to {MAX_EXTRA_MEDIA})
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Images, YouTube URLs, or PDFs
            </p>
          </div>
          <button
            type="button"
            disabled={form.extraMedia.length >= MAX_EXTRA_MEDIA}
            onClick={() =>
              setField("extraMedia", [...form.extraMedia, { type: "image" }])
            }
            className="text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-brand-blue hover:text-white transition-all"
          >
            <PlusCircle size={12} strokeWidth={3} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {form.extraMedia.map((em, i) => (
            <ExtraMediaRow
              key={i}
              entry={em}
              onChange={(patch) => {
                const updated = [...form.extraMedia];
                updated[i] = { ...updated[i], ...patch };
                setField("extraMedia", updated);
              }}
              onRemove={() =>
                setField(
                  "extraMedia",
                  form.extraMedia.filter((_, j) => j !== i),
                )
              }
            />
          ))}
        </div>
      </section>

      <section className={sectionCls}>
        <CheckboxToggle
          id="isBundle"
          label="Is Bundle?"
          checked={form.isBundle}
          onChange={(v) => setField("isBundle", v)}
        />
        {form.isBundle && (
          <BundleSelector
            products={products}
            selected={form.bundleItems}
            onChange={(ids) => setField("bundleItems", ids)}
          />
        )}
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
            className={inputCls + " col-span-7"}
          />
          <button
            type="button"
            onClick={() =>
              onChange(
                pairs.length > 1
                  ? pairs.filter((_, j) => j !== i)
                  : [{ key: "", value: "" }],
              )
            }
            className="col-span-1 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
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

function ExtraMediaRow({
  entry,
  onChange,
  onRemove,
}: {
  entry: ExtraMediaEntry;
  onChange: (patch: Partial<ExtraMediaEntry>) => void;
  onRemove: () => void;
}) {
  const embedUrl =
    entry.type === "video" && entry.youtubeUrl?.trim()
      ? toYoutubeEmbed(entry.youtubeUrl.trim())
      : "";
  const ytValid = embedUrl ? YOUTUBE_EMBED_PATTERN.test(embedUrl) : false;
  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-xl">
      <div className="flex items-start gap-2">
        <select
          value={entry.type}
          onChange={(e) =>
            onChange({
              type: e.target.value as any,
              file: undefined,
              youtubeUrl: undefined,
              previewUrl: undefined,
            })
          }
          className="px-3 py-2 border border-zinc-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 cursor-pointer shrink-0"
        >
          <option value="image">Image</option>
          <option value="video">YouTube URL</option>
          <option value="pdf">PDF</option>
        </select>
        {entry.type === "video" ? (
          <input
            type="text"
            placeholder="Paste any YouTube URL"
            value={entry.youtubeUrl || ""}
            onChange={(e) => onChange({ youtubeUrl: e.target.value })}
            className={inputCls + " flex-1"}
          />
        ) : (
          <label className="flex-1 flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-white cursor-pointer hover:border-brand-blue/40 transition-colors">
            {entry.type === "pdf" ? (
              <FileText size={13} className="text-zinc-400 shrink-0" />
            ) : (
              <ImageIcon size={13} className="text-zinc-400 shrink-0" />
            )}
            <span className="text-zinc-400 text-xs truncate">
              {entry.file
                ? entry.file.name
                : `Choose ${entry.type === "pdf" ? "PDF" : "Image"}…`}
            </span>
            <input
              type="file"
              accept={entry.type === "pdf" ? "application/pdf" : "image/*"}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                onChange({
                  file,
                  previewUrl:
                    entry.type === "image"
                      ? URL.createObjectURL(file)
                      : undefined,
                });
              }}
            />
          </label>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-400 hover:text-rose-500 transition-colors shrink-0 mt-2.5"
        >
          <X size={14} />
        </button>
      </div>
      {entry.type === "image" && entry.previewUrl && (
        <img
          src={entry.previewUrl}
          alt="preview"
          className="rounded-xl w-28 h-28 object-cover border border-zinc-100"
        />
      )}
      {entry.type === "video" && ytValid && (
        <div className="rounded-xl overflow-hidden aspect-video w-full max-w-xs bg-zinc-100">
          <iframe src={embedUrl} className="w-full h-full" allowFullScreen />
        </div>
      )}
      {entry.type === "pdf" && entry.file && (
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <FileText size={12} /> {entry.file.name}
        </div>
      )}
    </div>
  );
}

function BundleSelector({
  products,
  selected,
  onChange,
}: {
  products: ProductItem[];
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const toggle = (id: number) =>
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  const available = products.filter((p) => !selected.includes(p.id));
  const selectedProducts = products.filter((p) => selected.includes(p.id));
  return (
    <div className="flex flex-col gap-3 mt-4">
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 bg-brand-blue/10 text-brand-blue text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {p.name}
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className="hover:text-rose-500"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-zinc-500">Select products for bundle:</p>
      <div className="max-h-44 overflow-y-auto flex flex-col gap-0.5 border border-zinc-100 rounded-xl p-2 bg-white">
        {available.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-4">
            No more products
          </p>
        ) : (
          available.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-50 text-left transition-colors cursor-pointer text-sm text-zinc-700 italic font-bold"
            >
              <Plus size={12} className="text-zinc-400 italic font-bold" />{" "}
              {p.name}
            </button>
          ))
        )}
      </div>
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

function YoutubeUrlInput({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (v: string) => void;
  onRemove?: () => void;
}) {
  const embedUrl = value.trim() ? toYoutubeEmbed(value.trim()) : "";
  const isValid = embedUrl ? YOUTUBE_EMBED_PATTERN.test(embedUrl) : false;
  return (
    <div className="flex flex-col gap-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Paste any YouTube URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-zinc-400 hover:text-rose-500"
          >
            <X size={15} />
          </button>
        )}
      </div>
      {isValid && (
        <iframe
          src={embedUrl}
          className="rounded-lg aspect-video w-full"
          allowFullScreen
        />
      )}
    </div>
  );
}
