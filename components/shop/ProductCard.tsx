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
    <Link
      href={href}
      target={linkTarget}
      className={`group block cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden bg-white border border-soft-dark/10 ${className}`}
    >
      {/* Image Container */}
      <div 
        className={`relative aspect-[4/3] flex items-center justify-center overflow-hidden`} 
        style={{ 
          backgroundColor: product.color?.startsWith("#") 
            ? `${product.color}0D` 
            : product.color 
        }}
      >
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(mainImage)}
            alt={product.name}
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-zinc-300" />
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
          <h3 className="text-md font-bold text-soft-dark leading-tight tracking-tight line-clamp-2">
            {product.name}
          </h3>
          {product.intro && (
            <p className="text-xs text-soft-dark/80 leading-snug line-clamp-2">
              {product.intro}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Category Badge */}
          {product.productCategory && (
            <span
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-md text-soft-dark w-fit"
              style={{ 
                backgroundColor: product.color?.startsWith("#") 
                  ? `${product.color}4D` 
                  : product.color 
              }}
            >
              {product.productCategory}
            </span>
          )}

          {
            product.tag &&
            <div className="text-[10px] font-bold tracking-[0.15em] px-2 py-1 rounded-full bg-brand-blue/30 text-soft-dark w-fit">
              {product.tag}
            </div>
          }

          {/* Variant Indicator */}
          {(product?.variantCount || 0) > 1 && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-atlantic-blue bg-white px-2 py-1 rounded-full shadow-sm border border-atlantic-blue/20">
              {product.variantCount} Options
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-50">
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
    </Link>
  );
}
