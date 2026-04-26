"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  category?: string;
  breadcrumb?: {
    label: string;
    href: string;
  };
  className?: string;
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  category,
  breadcrumb,
  className,
  children,
}) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-white py-14 md:py-20 px-6 text-soft-dark",
        className
      )}
    >
      {/* Sophisticated pastel mesh background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.6]"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(176,224,226,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(228,213,237,0.35) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 30%, rgba(157,213,239,0.3) 0%, transparent 40%),
            linear-gradient(135deg, #f0f8f9 0%, #FFF 40%, #f8f4fb 70%, #f0f9f5 100%)
          `,
        }}
      />
      
      {/* Subtle bottom border for definition */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-zinc-100 to-transparent" />

      <div className="relative max-w-5xl mx-auto flex flex-col text-center space-y-6">
        {breadcrumb && (
          <Link
            href={breadcrumb.href}
            className="inline-flex items-center gap-1 text-soft-dark/40 hover:text-brand-blue text-[10px] font-bold uppercase tracking-[0.2em] transition-colors mb-4"
          >
            <ChevronLeft size={12} /> {breadcrumb.label}
          </Link>
        )}

        <div className="space-y-2">
          {category && (
            <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-atlantic-blue">
              {category}
            </p>
          )}
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-soft-dark max-w-3xl mx-auto">
            {title}
            {title.includes("OrthoNu") && !title.includes("®") && (
              <span className="text-soft-dark/20 text-xl md:text-2xl align-top ml-0.5 font-normal">®</span>
            )}
          </h1>
          
          {subtitle && (
            <p className="text-sm md:text-base text-soft-dark/50 font-medium leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
};

export default HeroSection;
