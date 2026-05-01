"use client";

import { CartItem } from "@/lib/types";
import { mediaUrl } from "@/lib/types";
import { ShoppingBag, Loader2, Minus, Plus, X } from "lucide-react";
import Link from "next/link";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  loading: boolean;
  userType?: "regular" | "professional";
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  loading,
  userType = "regular",
}: CartItemRowProps) {
  // Build product URL — productSlug stores the uid, name is used for the slug segment
  const nameSlug = item.productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const productUrl = `/shop/product/${nameSlug}/${item.productSlug}`;
  const regularPrice = Number(item.regularPrice) ?? 0;
  const professionalPrice =
    item.professionalPrice != null ? Number(item.professionalPrice) : null;

  const isProfessional = userType === "professional";
  const price =
    isProfessional && professionalPrice != null
      ? professionalPrice
      : regularPrice;
  const showProfessionalPricing = isProfessional && professionalPrice != null;

  const lineTotal = price * item.quantity;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm">
      {/* Product Image */}
      <Link href={productUrl} className="shrink-0">
        <div className="w-full md:w-32 aspect-square bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100">
          {item.productImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(item.productImage)}
              alt={item.productName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag
                size={48}
                strokeWidth={1}
                className="text-zinc-200"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Name and Price */}
        <div className="flex-1 space-y-2">
          <Link
            href={productUrl}
            className="hover:text-brand-blue transition-colors"
          >
            <h3 className="text-lg font-black text-atlantic-blue tracking-tight leading-tight">
              {item.productName}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-2 pt-1">
            {item.productCategory && (
              <span
                className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md text-soft-dark w-fit"
                style={{
                  backgroundColor: item.color
                    ? item.color.startsWith("#")
                      ? `${item.color}33`
                      : item.color
                    : undefined,
                }}
              >
                {item.productCategory}
              </span>
            )}
            {item.isBundle && (
              <span
                className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md text-soft-dark w-fit"
                style={{
                  backgroundColor: item.color
                    ? item.color.startsWith("#")
                      ? `${item.color}33`
                      : item.color
                    : undefined,
                }}
              >
                Bundle
              </span>
            )}
            {item.variantName && (
              <span
                className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md text-soft-dark w-fit border border-atlantic-blue/40"
                style={{
                  backgroundColor: (item.color || undefined)?.startsWith("#")
                    ? `${item.color}33`
                    : item.color || undefined,
                }}
              >
                {item.variantName}
              </span>
            )}
          </div>

          <div className="pt-1">
            {showProfessionalPricing ? (
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-zinc-400 line-through">
                  ${regularPrice.toFixed(2)}
                </p>
                <p className="text-sm font-black text-atlantic-blue">
                  ${price.toFixed(2)}{" "}
                  <span className="text-[10px] font-bold text-zinc-400 opacity-60">
                    each
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm font-black">
                ${price.toFixed(2)}{" "}
                <span className="text-[10px] font-bold text-zinc-400 opacity-60">
                  each
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-50 rounded-2xl p-1 border border-zinc-200">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={loading || item.quantity <= 1}
              className="w-9 h-9 flex items-center justify-center text-soft-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={14} strokeWidth={3} />
            </button>
            <span className="w-10 text-center text-sm font-black text-atlantic-blue">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={loading}
              className="w-9 h-9 flex items-center justify-center text-soft-dark hover:bg-zinc-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Line Total + Remove */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          {/* <p className="text-xl font-black text-brand-blue">
            ${lineTotal.toFixed(2)}
          </p> */}
          <button
            onClick={() => onRemove(item.id)}
            disabled={loading}
            className="p-2.5 text-soft-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Remove item"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <X size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
