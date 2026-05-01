"use client";

import { useState } from "react";
import Link from "next/link";
import { apiCall, API_BASE_URL } from "@/lib/api-client";
import {
    Tag,
    Star,
    Loader2,
    Plus,
    FileText,
    X,
    ExternalLink,
} from "lucide-react";
import { ProductItem, Category } from "./ProductForm";

function fullUrl(path: string | undefined): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
}

const sectionCls = "flex flex-col gap-4 pt-6 border-zinc-100 first:pt-0 font-sans";
const sectionHeading = "text-sm font-bold text-soft-dark uppercase tracking-wider";

interface ProductDetailViewProps {
    product: ProductItem;
    allProducts: ProductItem[];
    categories: Category[];
    onVariantAdded: () => void;
    onEdit: (product: ProductItem) => void;
    showSnack: (type: "success" | "error", text: string) => void;
}

export default function ProductDetailView({
    product,
    allProducts,
    categories,
    onVariantAdded,
    onEdit,
    showSnack,
}: ProductDetailViewProps) {
    const [settingDefault, setSettingDefault] = useState<number | null>(null);

    const standardMedia = product.media?.filter((m) => !m.isExtra) || [];
    const extraMedia = product.media?.filter((m) => m.isExtra) || [];
    const additionalInfoEntries = product.additionalInfo
        ? Object.entries(product.additionalInfo)
        : [];

    const handleSetDefault = async (variantId: number) => {
        setSettingDefault(variantId);
        try {
            await apiCall("PATCH", `/admin/products/${variantId}/default-variant`);
            showSnack("success", "Default variant updated.");
            onVariantAdded();
        } catch (err: any) {
            showSnack("error", err?.response?.data?.message || err?.response?.data?.error || "Failed to update default variant.");
        } finally {
            setSettingDefault(null);
        }
    };

    return (
        <div className="p-8 flex flex-col gap-0 divide-y divide-zinc-100 bg-white rounded-xl">
            {/* Header */}
            <section className={sectionCls}>
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-zinc-900">
                                {product.name}
                            </h2>
                            {product.isBundle && (
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                    Bundle
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            {product.categories?.[0]?.productCategory && (
                                <span className="text-xs text-zinc-400">
                                    {product.categories[0].productCategory}
                                </span>
                            )}
                            {product.tag && (
                                <span className="flex items-center gap-1 text-xs text-zinc-500">
                                    <Tag size={11} />
                                    {product.tag}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => onEdit(product)}
                        className="px-5 py-2 text-xs font-bold text-white bg-brand-blue rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shadow-md cursor-pointer"
                    >
                        Edit Product
                    </button>
                </div>
            </section>

            {/* Prices */}
            {product.prices && product.prices.length > 0 && (
                <section className={sectionCls}>
                    <h3 className={sectionHeading}>Pricing</h3>
                    <div className="flex gap-4">
                        {product.prices.map((p, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-0.5 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3"
                            >
                                <span className="text-xs text-zinc-400 capitalize">
                                    {p.userType}
                                </span>
                                <span className="text-base font-semibold text-zinc-900">
                                    ${p.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Description */}
            {product.description && (
                <section className={sectionCls}>
                    <h3 className={sectionHeading}>Description</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        {product.description}
                    </p>
                </section>
            )}

            {/* Additional Info */}
            {additionalInfoEntries.length > 0 && (
                <section className={sectionCls}>
                    <h3 className={sectionHeading}>Additional Info</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {additionalInfoEntries.map(([k, v], i) => (
                            <div key={i} className="flex gap-2 text-sm">
                                <span className="text-zinc-400 font-medium">{k}:</span>
                                <span className="text-zinc-700">{v}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Media */}
            {standardMedia.length > 0 && (
                <section className={sectionCls}>
                    <h3 className={sectionHeading}>Media</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {standardMedia
                            .filter((m) => m.type === "image")
                            .map((m, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl overflow-hidden aspect-square bg-zinc-100 border border-zinc-100"
                                >
                                    <img
                                        src={fullUrl(m.media)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                    </div>
                    {standardMedia
                        .filter((m) => m.type === "video")
                        .map((m, i) => (
                            <div
                                key={i}
                                className="rounded-xl overflow-hidden aspect-video w-full max-w-sm bg-zinc-100"
                            >
                                <iframe
                                    src={m.media}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title="Product video"
                                />
                            </div>
                        ))}
                </section>
            )}

            {/* Extra Media */}
            {extraMedia.length > 0 && (
                <section className={sectionCls}>
                    <h3 className={sectionHeading}>Extra Media</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {extraMedia.map((m, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                {m.type === "image" && (
                                    <div className="rounded-xl overflow-hidden aspect-square bg-zinc-100 border border-zinc-100">
                                        <img
                                            src={fullUrl(m.media)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                {m.type === "video" && (
                                    <div className="rounded-xl overflow-hidden aspect-video bg-zinc-100 border border-zinc-100">
                                        <iframe
                                            src={m.media}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title="Extra video"
                                        />
                                    </div>
                                )}
                                {m.type === "pdf" && (
                                    <a
                                        href={fullUrl(m.media)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-3 hover:bg-zinc-100 transition-colors"
                                    >
                                        <FileText size={16} className="text-zinc-400" />
                                        <span className="truncate font-medium">View PDF</span>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Bundle Items */}
            {product.isBundle &&
                product.bundleItems &&
                product.bundleItems.length > 0 && (
                    <section className={sectionCls}>
                        <h3 className={sectionHeading}>Bundle Items</h3>
                        <div className="flex flex-col gap-1">
                            {product.bundleItems.map((b, i) => {
                                const ref = allProducts.find((p) => p.id === b.productRefId);
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-zinc-700 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2"
                                    >
                                        {ref ? ref.name : `Product #${b.productRefId}`}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

            {/* Variants */}
            <section className={sectionCls}>
                <div className="flex items-center justify-between">
                    <h3 className={sectionHeading}>
                        Variants{" "}
                        {product.variants && product.variants.length > 0 && (
                            <span className="text-zinc-400 font-normal">
                                ({product.variants.length})
                            </span>
                        )}
                    </h3>
                    <div className="flex gap-2">
                        <Link
                            href={`/shop/product/${product.slug}`}
                            target="_blank"
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-brand-blue border border-brand-blue/20 rounded-xl hover:bg-brand-blue/5 transition-all flex items-center gap-2"
                        >
                            <ExternalLink size={14} /> Preview
                        </Link>
                        <Link
                            href={`/admin/product/add-variant?parentId=${product.id}`}
                            className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/5 border border-brand-blue/10 hover:bg-brand-blue hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Plus size={14} strokeWidth={3} /> Add Variant
                        </Link>
                    </div>
                </div>
                {!product.variants || product.variants.length === 0 ? (
                    <p className="text-[11px] uppercase font-bold tracking-widest text-zinc-300">
                        No variants yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {product.variants.map((v, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-zinc-800">
                                            {v.name}
                                        </span>
                                        {v.variantName && (
                                            <span className="text-xs text-zinc-500">
                                                · {v.variantName}
                                            </span>
                                        )}
                                        {v.isDefaultVariant && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                                                <Star size={9} fill="currentColor" /> Default
                                            </span>
                                        )}
                                    </div>
                                    {v.prices && v.prices.length > 0 && (
                                        <span className="text-xs text-zinc-500">
                                            ${v.prices[0].price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/product/update/${v.id}`}
                                        className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-soft-dark/60 bg-white border border-zinc-100 rounded-xl hover:border-brand-blue hover:text-brand-blue hover:bg-brand-blue/5 transition-all cursor-pointer"
                                    >
                                        Edit
                                    </Link>
                                    {!v.isDefaultVariant && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetDefault(v.id)}
                                            disabled={settingDefault === v.id}
                                            className="px-3 py-1.5 text-xs font-medium text-zinc-500 bg-white border border-zinc-200 rounded-lg hover:border-brand-blue hover:text-brand-blue transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {settingDefault === v.id ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                "Set Default"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
