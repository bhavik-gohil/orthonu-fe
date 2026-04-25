"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { getBlogBySlug, getRelatedBlogs, type Blog, type BlogContentBlock } from "@/lib/blogData";
import { type Product } from "@/lib/types";
import { apiCall } from "@/lib/api-client";
import {
    Calendar,
    ArrowRight,
    ArrowLeft,
    ShoppingCart,
    Play,
    ChevronRight,
} from "lucide-react";
import { mediaUrl, makeSlug } from "@/lib/types";
import { useCart } from "@/lib/CartContext";
import { notFound } from "next/navigation";
import { getShopUrl } from "@/lib/subdomains";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function YouTubeEmbed({ videoId, caption }: { videoId: string; caption?: string }) {
    return (
        <figure className="my-8">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-xl">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?si=8aFwCR4TnoRTweIJ&rel=0`}
                    title={caption || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>
            {caption && (
                <figcaption className="mt-3 text-center text-xs text-zinc-400 italic">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

function ContentRenderer({ blocks }: { blocks: BlogContentBlock[] }) {
    return (
        <div className="prose prose-zinc max-w-none">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "heading":
                        if (block.level === 2) {
                            return (
                                <h2
                                    key={i}
                                    className="text-2xl font-black text-soft-dark mt-10 mb-4 leading-tight"
                                >
                                    {block.text}
                                </h2>
                            );
                        }
                        if (block.level === 3) {
                            return (
                                <h3
                                    key={i}
                                    className="text-xl font-bold text-soft-dark mt-8 mb-3"
                                >
                                    {block.text}
                                </h3>
                            );
                        }
                        return (
                            <h4
                                key={i}
                                className="text-lg font-bold text-soft-dark mt-6 mb-2"
                            >
                                {block.text}
                            </h4>
                        );

                    case "paragraph":
                        return (
                            <p key={i} className="text-zinc-600 leading-relaxed text-base mb-5">
                                {block.text}
                            </p>
                        );

                    case "list":
                        return (
                            <ul key={i} className="my-5 space-y-2 pl-0 list-none">
                                {block.items?.map((item, j) => (
                                    <li
                                        key={j}
                                        className="flex items-start gap-3 text-zinc-600 text-base leading-relaxed"
                                    >
                                        <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-brand-blue" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        );

                    case "image":
                        return (
                            <figure key={i} className="my-8">
                                <div className="rounded-2xl overflow-hidden border border-zinc-100">
                                    <img
                                        src={block.src}
                                        alt={block.alt || ""}
                                        className="w-full object-cover max-h-[420px]"
                                    />
                                </div>
                                {block.caption && (
                                    <figcaption className="mt-3 text-center text-xs text-zinc-400 italic">
                                        {block.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );

                    case "video":
                        return (
                            <YouTubeEmbed
                                key={i}
                                videoId={block.videoId || ""}
                                caption={block.caption}
                            />
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();
    const [adding, setAdding] = useState(false);

    const mainImage = product.media?.find((m) => m.type === "image" && !m.isExtra);
    const imgSrc = mainImage ? mediaUrl(mainImage.media) : null;
    const regularPrice = product.prices?.find((p) => p.userType === "regular")?.price;
    const slug = makeSlug(product.name);

    const handleAdd = async () => {
        setAdding(true);
        try {
            await addItem(product.id, 1);
        } catch (_) {
            // silently ignore
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="group flex flex-col bg-white rounded-2xl border border-zinc-100 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300 overflow-hidden">
            {/* Image */}
            <Link href={getShopUrl(`/product/${slug}`)}>
                <div className="relative h-48 bg-zinc-50 overflow-hidden">
                    {imgSrc ? (
                        <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-4xl">
                            📦
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <Link href={getShopUrl(`/product/${slug}`)}>
                    <h4 className="text-sm font-black text-soft-dark group-hover:text-brand-blue transition-colors leading-snug">
                        {product.name}
                    </h4>
                </Link>
                {product.intro && (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {product.intro}
                    </p>
                )}
                {product.description && (
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mt-1">
                        {product.description}
                    </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-zinc-50">
                    {regularPrice !== undefined && (
                        <span className="text-base font-black text-soft-dark">
                            ${regularPrice.toFixed(2)}
                        </span>
                    )}
                    <button
                        onClick={handleAdd}
                        disabled={adding}
                        className="flex items-center gap-1.5 bg-brand-blue text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-brand-blue/90 transition-all duration-200 disabled:opacity-60"
                    >
                        <ShoppingCart size={12} />
                        {adding ? "Adding…" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Related Blog Card
// ─────────────────────────────────────────────────────────────
function RelatedBlogCard({ blog }: { blog: Blog }) {
    return (
        <Link
            href={`/resources/blog/${blog.slug}`}
            className="group bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all duration-300 flex flex-col"
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-1.5 text-zinc-400">
                    <Calendar size={11} />
                    <span className="text-xs">{formatDate(blog.date)}</span>
                </div>
                <h3 className="text-sm font-black text-soft-dark line-clamp-2 group-hover:text-brand-blue transition-colors leading-snug">
                    {blog.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-brand-blue text-xs font-bold mt-auto group-hover:gap-2 transition-all duration-200">
                    Read More <ArrowRight size={11} />
                </span>
            </div>
        </Link>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const blog = getBlogBySlug(slug);

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        if (!blog) return;

        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const data: Product[] = await apiCall("GET", "/api/products");
                // Filter products matching the blog's product categories
                const filtered = data.filter((p) =>
                    blog.productCategories.some(
                        (cat) =>
                            p.productCategory
                                ?.toLowerCase()
                                .includes(cat.toLowerCase().replace("®", "")) ||
                            p.name.toLowerCase().includes("tweakz") &&
                            blog.productCategories.includes("Tweakz®") ||
                            (p.productCategory === "Oral Relief" &&
                                blog.productCategories.includes("Oral Relief"))
                    )
                );
                setProducts(filtered.slice(0, 4));
            } catch (_) {
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [blog?.slug]);

    if (!blog) {
        notFound();
    }

    const related = getRelatedBlogs(blog, 3);
    const showProducts =
        blog.productCategories.some((c) => c !== "General") &&
        (loadingProducts || products.length > 0);

    return (
        <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
            <HomeNavbar />

            <main className="flex-1">
                {/* ── Breadcrumb ── */}
                <div className="bg-white border-b border-zinc-100">
                    <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-zinc-400 font-medium">
                        <Link href="/resources" className="hover:text-brand-blue transition-colors">
                            Resources
                        </Link>
                        <ChevronRight size={12} />
                        <Link href="/resources/blog" className="hover:text-brand-blue transition-colors">
                            Blog
                        </Link>
                        <ChevronRight size={12} />
                        <span className="text-zinc-600 line-clamp-1">{blog.title}</span>
                    </div>
                </div>

                {/* ── Hero / Header ── */}
                <header className="bg-white border-b border-zinc-100">
                    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-5 flex-wrap">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-black uppercase tracking-widest bg-brand-blue/8 text-brand-blue px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className="ml-auto flex items-center gap-1.5 text-zinc-400 text-xs">
                                <Calendar size={12} />
                                {formatDate(blog.date)}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-black text-soft-dark leading-tight mb-6">
                            {blog.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
                            {blog.excerpt}
                        </p>
                    </div>

                    {/* Thumbnail */}
                    <div className="max-w-4xl mx-auto px-6 pb-12">
                        <div className="rounded-3xl overflow-hidden border border-zinc-100 max-h-[500px]">
                            <img
                                src={blog.thumbnail}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* ── Body ── */}
                <article className="max-w-4xl mx-auto px-6 py-12">
                    <ContentRenderer blocks={blog.content} />
                </article>

                {/* ── Products Section (dynamic) ── */}
                {showProducts && (
                    <section className="bg-white border-t border-zinc-100 py-16 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue/60 mb-1">
                                        OrthoNu Products
                                    </p>
                                    <h2 className="text-2xl font-black text-soft-dark">
                                        {blog.productCategories.includes("Tweakz®") &&
                                            blog.productCategories.includes("Oral Relief")
                                            ? "Featured Products"
                                            : blog.productCategories.includes("Tweakz®")
                                                ? "Tweakz® Collection"
                                                : "Oral Relief Collection"}
                                    </h2>
                                </div>
                                <Link
                                    href={getShopUrl()}
                                    className="text-sm font-bold text-brand-blue flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200"
                                >
                                    Shop All <ArrowRight size={14} />
                                </Link>
                            </div>

                            {loadingProducts ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="bg-zinc-100 rounded-2xl h-64 animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {products.map((p) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-zinc-400 text-sm">
                                    <p>Products coming soon.</p>
                                    <Link
                                        href={getShopUrl()}
                                        className="mt-3 inline-flex items-center gap-1.5 text-brand-blue font-bold text-sm hover:gap-2.5 transition-all duration-200"
                                    >
                                        Browse the Shop <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ── Related Posts ── */}
                {related.length > 0 && (
                    <section className="py-16 px-6">
                        <div className="max-w-4xl mx-auto">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue/60 mb-1">
                                Keep Reading
                            </p>
                            <h2 className="text-2xl font-black text-soft-dark mb-8">
                                Related Posts
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {related.map((b) => (
                                    <RelatedBlogCard key={b.slug} blog={b} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Back to Blog ── */}
                <div className="pb-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/resources/blog"
                            className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm hover:gap-3 transition-all duration-200"
                        >
                            <ArrowLeft size={14} />
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
