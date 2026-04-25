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
} from "lucide-react";

// Helper function to convert YouTube URLs to embed format
function toYoutubeEmbed(url: string): string {
  if (!url) return url;

  // Already an embed URL
  if (url.includes("/embed/")) return url;

  // Extract video ID from various YouTube URL formats
  let videoId = null;

  // Format: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }

  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }

  // If we found a video ID, return embed URL
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Return original URL if we couldn't parse it
  return url;
}

export default function ProductDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  
  // Fallback to extract uid from pathname if useParams fails due to proxy rewrite
  let uid = params?.uid as string;
  if (!uid && pathname) {
    const parts = pathname.split('/').filter(Boolean);
    uid = parts[parts.length - 1] as string;
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { items, addItem, updateQuantity, removeItem, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();

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

          // Fetch variants and bundle items concurrently
          const variantPromise = found.variantId
            ? apiCall("GET", `/shop/variants/${found.variantId}`).catch((err) => {
                console.error("Failed to fetch variants:", err);
                return [found];
              })
            : Promise.resolve([found]);

          const bundlePromise =
            found.isBundle && found.bundleItems && found.bundleItems.length > 0
              ? Promise.all(
                  found.bundleItems.map((bi) =>
                    apiCall("GET", `/shop/products/${bi.productRefId}`).catch(() => null)
                  )
                ).then((results) => results.filter(Boolean) as Product[])
              : Promise.resolve([]);

          const [productVariants, bundled] = (await Promise.all([variantPromise, bundlePromise])) as [Product[], Product[]];

          // Sort variants with default variant first
          const allVariants = productVariants.sort((a: Product, b: Product) => {
            if (a.isDefaultVariant) return -1;
            if (b.isDefaultVariant) return 1;
            return 0;
          });
          setVariants(allVariants);
          setBundleProducts(bundled);
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
    window.history.replaceState(null, '', `/shop/product/${variant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${variant.uid}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-gray">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
      </div>
    );
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

  const standardMedia = selectedVariant?.media.filter((m) => !m.isExtra) || [];
  const extraMedia = selectedVariant?.media.filter((m) => m.isExtra) || [];
  const regularPrice = selectedVariant?.prices.find(
    (p) => p.userType === "regular",
  )?.price;
  const professionalPrice = selectedVariant?.prices.find(
    (p) => p.userType === "professional",
  )?.price;
  
  const isProfessional = user?.userType === 'professional';
  const showProfessionalPricing = isProfessional && professionalPrice != null;
  const isGuest = !authLoading && !user;
  
  const allMedia = standardMedia;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-warm-gray text-soft-dark">
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
          {selectedVariant?.productCategory && (
            <>
              <Link
                href={`/shop?category=${encodeURIComponent(selectedVariant.productCategory)}`}
                className="hover:text-brand-blue transition-colors"
              >
                {selectedVariant.productCategory}
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
            <div className="relative h-56 w-full md:h-96 md:w-96 bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-lg shadow-zinc-200/50">
              {allMedia.length === 0 ? (
                <div className="flex items-center justify-center text-zinc-200 max-h-fit w-fit">
                  <ShoppingBag size={100} strokeWidth={0.5} />
                </div>
              ) : allMedia[activeImage]?.type === "video" ? (
                <iframe
                  src={toYoutubeEmbed(allMedia[activeImage].media)}
                  className="w-full h-full"
                  title={selectedVariant?.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(allMedia[activeImage]?.media)}
                  alt={selectedVariant?.name}
                  className="w-auto h-full object-cover m-auto"
                />
              )}
            </div>

            {/* Thumbnail Strip */}
            {allMedia.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allMedia.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? "border-brand-blue shadow-md shadow-brand-blue/20" : "border-zinc-100 hover:border-zinc-300"}`}
                  >
                    {m.type === "video" ? (
                      <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
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
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3 mt-3">
            {/* Variant Switching Pills */}
            {variants.length > 1 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-soft-dark/60 uppercase tracking-wider">
                  Available Variants ({variants.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSwitch(variant)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedVariant?.id === variant.id
                          ? "bg-brand-blue text-white shadow-md"
                          : "bg-white text-soft-dark border border-zinc-200 hover:border-brand-blue hover:text-brand-blue"
                      }`}
                    >
                      {variant.variantName || "Original"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category & Tag */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedVariant?.productCategory && (
                <span className="text-[9px] font-extrabold tracking-[0.15em] text-brand-blue bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-brand-blue/20">
                  {selectedVariant.productCategory}
                </span>
              )}
              {selectedVariant?.tag && (
                <p className="text-xs font-semibold bg-brand-blue text-white w-fit px-2 py-0.5 rounded-md">
                  {selectedVariant.tag}
                </p>
              )}
              {selectedVariant?.isBundle && (
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-fresh-mint bg-fresh-mint/10 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Package size={9} />
                  Bundle
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-xl md:text-3xl text-brand-blue font-bold ">
              {selectedVariant?.name}
            </h1>

            {/* Intro */}
            {selectedVariant?.intro && (
              <p className="text-sm md:text-base text-soft-dark/80 font-medium leading-relaxed">
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

            {/* Add to Cart with Quantity Controls */}
            <div className="flex flex-col gap-3 pt-4">
              {quantityInCart === 0 ? (
                <div className={`grid grid-cols-1 ${isGuest ? 'sm:grid-cols-2' : ''} gap-3`}>
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl font-bold text-xs tracking-[0.05em] bg-brand-blue text-white hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 shadow-lg shadow-brand-blue/20 cursor-pointer"
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
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs tracking-[0.05em] bg-white text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/5 hover:shadow-md transition-all text-center"
                    >
                      Buy Now - Professional
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 py-3 px-6 rounded-2xl bg-white border-2 border-brand-blue">
                    <button
                      onClick={handleDecrement}
                      disabled={cartLoading}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} strokeWidth={2.5} className="text-brand-blue" />
                    </button>
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className="text-2xl font-black text-brand-blue">
                        {quantityInCart}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-soft-dark/40">
                        In Cart
                      </span>
                    </div>
                    <button
                      onClick={handleIncrement}
                      disabled={cartLoading}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} strokeWidth={2.5} className="text-brand-blue" />
                    </button>
                  </div>

                  <div className={`grid grid-cols-1 ${isGuest ? 'sm:grid-cols-2' : ''} gap-3`}>
                    <Link
                      href="/shop/cart"
                      className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl font-bold text-xs tracking-[0.05em] bg-brand-blue text-white hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-blue/20"
                    >
                      <ShoppingBag size={16} strokeWidth={2.5} />
                      Checkout
                      <ArrowRight size={14} strokeWidth={3} />
                    </Link>
                    {isGuest && (
                      <Link
                        href="/shop/register?professional=yes"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs tracking-[0.05em] bg-white text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/5 hover:shadow-md transition-all text-center"
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
              <h2 className="text-[10px] font-bold tracking-[0.15em] text-brand-blue bg-brand-blue/5 px-4 py-1.5 rounded-full">
                Instructional Media
              </h2>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {extraMedia.map((m, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden aspect-video bg-white border border-zinc-100 shadow-md"
                >
                  {m.type === "video" ? (
                    <iframe
                      src={toYoutubeEmbed(m.media)}
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
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
