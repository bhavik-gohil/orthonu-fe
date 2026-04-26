"use client";

import Link from "next/link";
import { useState } from "react";
import HomeNavbar from "@/components/HomeNavbar";
import Footer from "@/components/Footer";
import { blogs, type BlogProductCategory } from "@/lib/blogData";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import HeroSection from "@/components/ui/HeroSection";

const CATEGORIES: { label: string; value: BlogProductCategory | "All" }[] = [
  { label: "All Posts", value: "All" },
  { label: "Oral Relief", value: "Oral Relief" },
  { label: "Tweakz®", value: "Tweakz®" },
  { label: "General", value: "General" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<
    BlogProductCategory | "All"
  >("All");

  const filtered =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) =>
          b.productCategories.includes(activeCategory as BlogProductCategory),
        );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-warm-gray text-soft-dark font-sans">
      <HomeNavbar />

      <main className="flex-1">
        {/* ── Hero ── */}
        <HeroSection
          breadcrumb={{ label: "Resources", href: "/resources" }}
          category="OrthoNu Blog"
          title="Insights & Stories"
          subtitle="Clinical insights, patient stories, and the latest from the OrthoNu team."
        />

        {/* ── Category Filter ── */}
        <section className="border-b border-zinc-200 bg-white/70 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === value
                    ? "bg-brand-blue text-white shadow-sm"
                    : "bg-warm-gray text-zinc-500 hover:bg-zinc-200 cursor-pointer"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-14">
          {filtered.length === 0 && (
            <p className="text-center text-zinc-400 py-20">
              No posts found for this category.
            </p>
          )}

          {/* ── Featured Post ── */}
          {featured && (
            <Link
              href={`/resources/blog/${featured.slug}`}
              className="group block mb-14"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-zinc-100 bg-white shadow-sm hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300">
                {/* Image */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={featured.thumbnail}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-black uppercase tracking-widest bg-white/90 text-brand-blue px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar size={13} />
                    <span className="text-xs font-medium">
                      {formatDate(featured.date)}
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest ml-2 text-brand-blue/60 bg-brand-blue/5 px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-soft-dark leading-tight group-hover:text-brand-blue transition-colors duration-200">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm mt-2 group-hover:gap-3 transition-all duration-200">
                    Read More <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* ── Blog Grid ── */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/resources/blog/${blog.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-black uppercase tracking-widest bg-white/90 text-brand-blue px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Calendar size={12} />
                      <span className="text-xs">{formatDate(blog.date)}</span>
                    </div>
                    <h3 className="text-base font-black text-soft-dark leading-snug group-hover:text-brand-blue transition-colors duration-200 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 flex-1">
                      {blog.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-brand-blue font-bold text-xs mt-auto group-hover:gap-2.5 transition-all duration-200">
                      Read More <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
