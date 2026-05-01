"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import { Product, mediaUrl } from "@/lib/types";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import ShopNavbar from "@/components/ShopNavbar";
import Link from "next/link";
import {
  Loader2,
  ShoppingBag,
  ChevronLeft,
  PlayCircle,
  FileText,
  Info,
  Tag,
  Package,
  ChevronRight,
  Minus,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";

// Helper function to convert YouTube URLs to embed format
function toVideoEmbed(url: string): string {
  if (!url) return url;

  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo.com/video/"))
    return url;

  // YouTube
  let videoId = null;
  const ytShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (ytShortMatch) videoId = ytShortMatch[1];
  const ytWatchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch) videoId = ytWatchMatch[1];

  if (videoId) return `https://www.youtube.com/embed/${videoId}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-200/60 rounded-lg ${className}`} />
);

const ProductSkeleton = () => (
  <div className="flex flex-col min-h-screen font-sans bg-warm-gray">
    <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pt-4 pb-2 space-y-3 md:py-6 md:space-y-6">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="md:flex gap-4 lg:gap-24 items-start">
        {/* Media Gallery Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-56 w-full md:h-96 md:w-96 rounded-3xl" />
          <div className="flex gap-3">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <Skeleton className="h-16 w-16 rounded-xl" />
            <Skeleton className="h-16 w-16 rounded-xl" />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex-1 space-y-6 mt-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4 md:w-1/2" />
            <Skeleton className="h-10 w-1/2 md:w-1/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-8 w-24 mt-4" />

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>

          <div className="space-y-4 pt-8">
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default function ProductDetailPage() {
  const params = useParams();
  const pathname = usePathname();

  // Fallback to extract uid from pathname if useParams fails due to proxy rewrite
  let uid = params?.uid as string;
  if (!uid && pathname) {
    const parts = pathname.split("/").filter(Boolean);
    uid = parts[parts.length - 1] as string;
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    loading: cartLoading,
  } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data: Product[] = await apiCall(
          "GET",
          `/shop/products?uid=${uid}`,
        );
        const found = Array.isArray(data)
          ? data.find((p) => p.uid === uid)
          : data;

        if (found) {
          setProduct(found);
          setSelectedVariant(found); // Initially select the current product

          // Use the variants already included in the response, or fallback to the product itself
          const allVariants =
            found.variants && found.variants.length > 0
              ? found.variants.sort((a: Product, b: Product) => {
                  if (a.isDefaultVariant) return -1;
                  if (b.isDefaultVariant) return 1;
                  return 0;
                })
              : [found];
          setVariants(allVariants);

          // Use bundled products already included in the response
          if (found.isBundle && found.bundleItems) {
            const bundled = found.bundleItems
              .map((item: any) => item.product)
              .filter(Boolean) as Product[];
            setBundleProducts(bundled);
          }
        } else {
          setProduct(null);
          setVariants([]);
          setSelectedVariant(null);
          setBundleProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [uid]);

  // Find if product is in cart (use selectedVariant for cart operations)
  const cartItem = selectedVariant
    ? items.find((item) => item.productId === selectedVariant.id)
    : null;
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if (selectedVariant) {
      console.log("Adding to cart:", selectedVariant.id, selectedVariant.name);
      try {
        await addItem(selectedVariant.id, 1);
        console.log("Successfully added to cart");
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    }
  };

  const handleIncrement = async () => {
    if (cartItem && selectedVariant) {
      await updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = async () => {
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      // Remove item from cart when quantity would go to 0
      await removeItem(cartItem.id);
    } else {
      await updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  const handleVariantSwitch = (variant: Product) => {
    setSelectedVariant(variant);
    setActiveImage(0); // Reset to first image when switching variants
    // Update URL to reflect selected variant
    window.history.replaceState(
      null,
      "",
      `/shop/product/${variant.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${variant.uid}`,
    );
  };

  const standardMedia = (selectedVariant?.media || [])
    .filter((m) => !m.isExtra)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const extraMedia = (selectedVariant?.media || [])
    .filter((m) => m.isExtra)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const allMedia = standardMedia;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    setZoom(1);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % allMedia.length);
    setZoom(1);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    setZoom(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, allMedia.length]);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen font-sans bg-warm-gray">
        <ShopNavbar />
        <div className="flex flex-col items-center justify-center flex-1 gap-6">
          <h1 className="text-4xl font-black text-soft-dark">
            Product Not Found
          </h1>
          <Link
            href="/shop"
            className="text-brand-blue font-bold flex items-center gap-2 hover:underline"
          >
            <ChevronLeft size={16} /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const regularPrice = selectedVariant?.prices.find(
    (p) => p.userType === "regular",
  )?.price;
  const professionalPrice = selectedVariant?.prices.find(
    (p) => p.userType === "professional",
  )?.price;

  const isProfessional = user?.userType === "professional";
  const showProfessionalPricing = isProfessional && professionalPrice != null;
  const isGuest = !authLoading && !user;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-soft-dark">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pt-4 pb-2 space-y-3 md:py-6 md:space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-soft-dark/40">
          <Link
            href="/shop"
            className="hover:text-brand-blue transition-colors"
          >
            Shop
          </Link>
          <ChevronRight size={10} />
          {/* Category Breadcrumb */}
          {selectedVariant?.categories?.[0]?.productCategory && (
            <>
              <Link
                href={`/shop?category=${encodeURIComponent(selectedVariant.categories[0].productCategory)}`}
                className="hover:text-brand-blue transition-colors"
              >
                {selectedVariant.categories[0].productCategory}
              </Link>
              <ChevronRight size={10} />
            </>
          )}
          <span className="text-soft-dark/70">{selectedVariant?.name}</span>
        </nav>

        {/* Main Product View */}
        <div className="md:flex lg:flex-cols-2 gap-4 lg:gap-24 items-start">
          {/* Media Gallery */}
          <div className="space-y-6 sticky">
            {/* Main Media View */}
            <div
              className="relative h-64 w-full md:h-[450px] md:w-[450px] bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-200/50 cursor-zoom-in group"
              onClick={() => openLightbox(activeImage)}
            >
              {allMedia.length === 0 ? (
                <div className="flex items-center justify-center text-zinc-200 w-full h-full">
                  <ShoppingBag size={100} strokeWidth={0.5} />
                </div>
              ) : allMedia[activeImage]?.type === "video" ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={toVideoEmbed(allMedia[activeImage].media)}
                    className="w-full h-full pointer-events-none"
                    title={selectedVariant?.name}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                    <PlayCircle
                      size={48}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                    />
                  </div>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(allMedia[activeImage]?.media)}
                  alt={selectedVariant?.name}
                  className="w-full h-full object-contain p-4 md:group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>

            {/* Thumbnail Row - Simplified for mobile */}
            {allMedia.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full md:max-w-[450px]">
                {allMedia.map((m, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(i);
                    }}
                    className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? "border-brand-blue shadow-sm" : "border-zinc-100 md:hover:border-zinc-300"}`}
                  >
                    {m.type === "video" ? (
                      <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <PlayCircle size={16} />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaUrl(m.media)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                    {activeImage === i && (
                      <div className="absolute inset-0 bg-brand-blue/5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3 mt-3">
            {/* Categories & Tag */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Show all categories if available, otherwise fallback to the string field */}
              {selectedVariant?.categories &&
              selectedVariant.categories.length > 0
                ? selectedVariant.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-md text-soft-dark w-fit  border border-brand-blue/0"
                      style={{
                        backgroundColor: selectedVariant.color?.startsWith("#")
                          ? `${selectedVariant.color}4D`
                          : selectedVariant.color,
                      }}
                    >
                      {cat.productCategory}
                    </span>
                  ))
                : null}

              {selectedVariant?.isBundle && (
                <span
                  className="flex text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md text-soft-dark w-fit  border border-brand-blue/0"
                  style={{
                    backgroundColor: selectedVariant.color?.startsWith("#")
                      ? `${selectedVariant.color}4D`
                      : selectedVariant.color,
                  }}
                >
                  Bundle
                </span>
              )}
              {selectedVariant?.tag && (
                <div
                  className="text-[10px] font-bold tracking-[0.15em] px-2 py-1 rounded-full bg-brand-blue/30 text-soft-dark w-fit border border-brand-blue/50"
                  style={{
                    backgroundColor: selectedVariant.color?.startsWith("#")
                      ? `${selectedVariant.color}4D`
                      : selectedVariant.color,
                    borderColor: selectedVariant.color?.startsWith("#")
                      ? `${selectedVariant.color}80`
                      : selectedVariant.color,
                  }}
                >
                  {selectedVariant.tag}
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-xl md:text-3xl text-atlantic-blue font-bold ">
              {selectedVariant?.name}
            </h1>

            {/* Intro */}
            {selectedVariant?.intro && (
              <p className="text-sm md:text-sm text-soft-dark/70 font-medium leading-relaxed">
                {selectedVariant.intro}
              </p>
            )}

            {/* Pricing - Display based on user type */}
            {regularPrice != null && (
              <div className="flex items-baseline gap-3 text-soft-dark">
                {showProfessionalPricing ? (
                  <>
                    <span className="text-base font-medium text-zinc-400 line-through">
                      ${regularPrice.toFixed(2)}
                    </span>
                    <span className="text-xl md:text-2xl font-bold">
                      ${professionalPrice!.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl md:text-2xl font-bold">
                    ${regularPrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}

            {/* Variant Switching Pills - Moved below price */}
            {variants.length > 1 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-[10px] font-extrabold text-soft-dark/60 uppercase tracking-[0.1em]">
                  Available Options
                  {/* ({variants.length}) */}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSwitch(variant)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedVariant?.id === variant.id
                          ? "bg-atlantic-blue text-white shadow-lg shadow-atlantic-blue/20"
                          : "bg-white text-soft-dark border border-zinc-200 hover:border-atlantic-blue hover:text-atlantic-blue hover:cursor-pointer"
                      }`}
                    >
                      {variant.variantName || "Original"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart with Quantity Controls */}
            <div className="flex flex-col gap-3 pt-4">
              {quantityInCart === 0 ? (
                <div
                  className={`grid grid-cols-1 ${isGuest ? "sm:grid-cols-2" : ""} gap-3`}
                >
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-xs tracking-[0.05em] bg-brand-blue text-white hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 shadow-lg shadow-brand-blue/20 cursor-pointer"
                  >
                    {cartLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag size={18} strokeWidth={2.5} /> Add to Cart
                      </>
                    )}
                  </button>
                  {isGuest && (
                    <Link
                      href="/shop/register?professional=yes"
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-xs tracking-[0.05em] bg-warm-gray text-atlantic-blue border border-warm-gray hover:border-brand-blue transition-all text-center"
                    >
                      Buy Now - Professional
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 py-3 px-6 rounded-3xl bg-white border-2 border-brand-blue">
                    <button
                      onClick={handleDecrement}
                      disabled={cartLoading}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus
                        size={18}
                        strokeWidth={2.5}
                        className="text-brand-blue"
                      />
                    </button>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className="text-2xl font-black text-atlantic-blue">
                        {quantityInCart}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-soft-dark/40">
                        In Cart
                      </span>
                    </div>
                    <button
                      onClick={handleIncrement}
                      disabled={cartLoading}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus
                        size={18}
                        strokeWidth={2.5}
                        className="text-brand-blue"
                      />
                    </button>
                  </div>

                  <div
                    className={`grid grid-cols-1 ${isGuest ? "sm:grid-cols-2" : ""} gap-3`}
                  >
                    <Link
                      href="/shop/cart"
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-xs tracking-[0.05em] bg-brand-blue text-white hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 shadow-lg shadow-brand-blue/20 cursor-pointer"
                    >
                      <ShoppingBag size={16} strokeWidth={2.5} />
                      Checkout
                      <ArrowRight size={14} strokeWidth={3} />
                    </Link>
                    {isGuest && (
                      <Link
                        href="/shop/register?professional=yes"
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-xs tracking-[0.05em] bg-warm-gray text-atlantic-blue border border-warm-gray hover:border-brand-blue transition-all text-center"
                      >
                        Buy Now - Professional
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            {selectedVariant?.description && (
              <div className="space-y-3 py-2">
                <div className="h-px w-full bg-zinc-100" />
                <p className="text-soft-dark/70 text-xs md:text-sm font-medium font-sans whitespace-pre-wrap">
                  {selectedVariant.description}
                </p>
              </div>
            )}

            {/* Bundle Items */}
            {selectedVariant?.isBundle && bundleProducts.length > 0 && (
              <div className="border border-zinc-100 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 bg-zinc-50 border-b border-zinc-100">
                  <Package size={14} className="text-fresh-mint" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-soft-dark">
                    Bundle Includes
                  </h3>
                </div>
                <div className="divide-y divide-zinc-100">
                  {bundleProducts.map((bundledProduct) => (
                    <Link
                      key={bundledProduct.id}
                      href={`/shop/product/${bundledProduct.name.toLowerCase().replace(/\s+/g, "-")}/${bundledProduct.uid}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                        {bundledProduct.media.find(
                          (m) => !m.isExtra && m.type === "image",
                        ) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mediaUrl(
                              bundledProduct.media.find(
                                (m) => !m.isExtra && m.type === "image",
                              )!.media,
                            )}
                            alt={bundledProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag
                              size={24}
                              strokeWidth={1}
                              className="text-zinc-300"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-soft-dark group-hover:text-brand-blue transition-colors">
                          {bundledProduct.name}
                        </h4>
                        {bundledProduct.tag && (
                          <p className="text-[9px] font-bold uppercase tracking-widest text-soft-dark/40 mt-1">
                            {bundledProduct.tag}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-zinc-300 group-hover:text-brand-blue transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {selectedVariant?.additionalInfo &&
              Object.keys(selectedVariant.additionalInfo).length > 0 && (
                <div className="border border-zinc-100 rounded-2xl overflow-hidden bg-zinc-50">
                  <div className="flex items-center gap-2 px-5 pt-4 border-b border-zinc-100">
                    <Info size={14} className="text-brand-blue" />
                    <h3 className="text-[10px] font-bold tracking-[0.05em] text-soft-dark">
                      Additional Info
                    </h3>
                  </div>
                  <div className="divide-y divide-zinc-100 px-3 py-3">
                    {Object.entries(selectedVariant.additionalInfo).map(
                      ([key, val]) => (
                        <div
                          key={key}
                          className="flex items-start gap-2 px-2 py-1"
                        >
                          <span className="text-xs font-semibold text-soft-dark/50 w-fit">
                            {key}
                          </span>
                          <span className="text-xs text-soft-dark/80 font-medium flex-1">
                            : {String(val)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Extra Media Section */}
        {extraMedia.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-[10px] font-bold tracking-[0.1em] text-atlantic-blue bg-brand-blue/10 px-4 py-1.5 rounded-full">
                Instructional Media
              </h2>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {extraMedia.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden bg-white border border-zinc-100 shadow-md ${
                    m.type === "image" ? "flex" : "aspect-video"
                  }`}
                >
                  {m.type === "video" ? (
                    <iframe
                      src={toVideoEmbed(m.media)}
                      className="w-full h-full"
                      title={`Media ${i + 1}`}
                      allowFullScreen
                    />
                  ) : m.type === "pdf" ? (
                    <a
                      href={mediaUrl(m.media)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-full flex items-center justify-center text-brand-blue gap-2 hover:bg-brand-blue/5 transition-colors"
                    >
                      <FileText size={32} strokeWidth={1.5} />
                      <span className="font-bold text-sm">View PDF</span>
                    </a>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(m.media)}
                      alt=""
                      className="w-full h-auto object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Full Screen Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-soft-dark backdrop-blur-xl animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg">
                {selectedVariant?.name}
              </h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                {lightboxIndex + 1} / {allMedia.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                title="Toggle Zoom"
              >
                {zoom === 1 ? <Plus size={20} /> : <Minus size={20} />}
              </button>
              <button
                onClick={closeLightbox}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
            {/* Nav Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightbox();
              }}
              className="absolute left-6 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-all backdrop-blur-md border border-white/10"
            >
              <ChevronLeft size={32} />
            </button>

            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out cursor-zoom-in"
              style={{ transform: `scale(${zoom})` }}
              onClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
            >
              {allMedia[lightboxIndex]?.type === "video" ? (
                <div className="w-full h-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={toVideoEmbed(allMedia[lightboxIndex].media)}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(allMedia[lightboxIndex]?.media)}
                  alt=""
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightbox();
              }}
              className="absolute right-6 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-all backdrop-blur-md border border-white/10"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="p-6 flex justify-center gap-3 overflow-x-auto">
            {allMedia.map((m, i) => (
              <button
                key={i}
                onClick={() => {
                  setLightboxIndex(i);
                  setZoom(1);
                }}
                className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${lightboxIndex === i ? "border-brand-blue" : "border-transparent opacity-100"}`}
              >
                {m.type === "video" ? (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-white">
                    <PlayCircle size={20} />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(m.media)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
