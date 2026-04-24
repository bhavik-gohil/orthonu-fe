"use client";

import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Product, makeSlug, mediaUrl } from "@/lib/types";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

interface Props {
  product: Product;
  className?: string;
  hrefPrefix?: string;
  linkTarget?: string;
}

export default function ProductCard({
  product,
  className = "",
  hrefPrefix = "/shop",
  linkTarget,
}: Props) {
  const { addItem, loading } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const mainImage = product.media.find(
    (m) => !m.isExtra && m.type === "image",
  )?.media;
  const regularPrice = product.prices.find(
    (p) => p.userType === "regular",
  )?.price;
  const professionalPrice = product.prices.find(
    (p) => p.userType === "professional",
  )?.price;

  const isProfessional = user?.userType === "professional";
  const showProfessionalPricing = isProfessional && professionalPrice != null;

  const slug = makeSlug(product.name);
  const href = `${hrefPrefix}/product/${slug}/${product.uid}`;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addItem(product.id);
    setAdding(false);
  };

  return (
    <a
      href={href}
      target={linkTarget}
      className={`group block cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden bg-white border border-zinc-100 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(mainImage)}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-zinc-300" />
          </div>
        )}

        {/* Category Badge */}
        {product.productCategory && (
          <div className="absolute top-4 left-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-white bg-brand-blue px-3 py-1.5 rounded-full shadow-sm">
              {product.productCategory}
            </span>
          </div>
        )}

        {/* Variant Indicator */}
        {(product?.variantCount || 0) > 1 && (
          <div className="absolute top-4 right-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue bg-white px-2 py-1 rounded-full shadow-sm border border-brand-blue/20">
              {product.variantCount} Options
            </span>
          </div>
        )}
      </div>

      {/* Color Divider */}
      <div
        className="h-[4px] w-full"
        style={{ backgroundColor: product.color || "#7BD2F6" }}
      />

      {/* Info Container */}
      <div className="p-3 space-y-3">
        <div className="space-y-1">
          {product.tag && (
            <p className="text-[10px] font-bold text-white bg-brand-blue px-1 py-0.5 rounded-sm tracking-normal w-fit">
              {product.tag}
            </p>
          )}
          <h3 className="text-lg font-bold text-soft-dark leading-tight tracking-tight line-clamp-2">
            {product.name}
          </h3>
          {product.intro && (
            <p className="text-xs text-soft-dark/60 leading-snug line-clamp-2">
              {product.intro}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-50 pt-2">
          {showProfessionalPricing ? (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-400 line-through">
                ${regularPrice?.toFixed(2)}
              </span>
              <span className="text-xl font-black text-soft-dark">
                ${professionalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            regularPrice != null && (
              <span className="text-xl font-black text-soft-dark">
                ${regularPrice.toFixed(2)}
              </span>
            )
          )}
        </div>
      </div>
    </a>
  );
}
