"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getShopUrl } from "@/lib/subdomains";

export default function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [shopUrl, setShopUrl] = useState("/shop");

  useEffect(() => {
    setShopUrl(getShopUrl());
  }, []);

  // On home page: scroll to section if hash present on load
  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash;
    if (hash === "#partner-with-us") {
      scrollToPartner();
    }
  }, [isHome]);

  function scrollToPartner() {
    const element = document.getElementById("partner-with-us");
    if (!element) return;
    const navbar = document.querySelector("nav");
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const top =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      navbarHeight -
      20;
    window.scrollTo({ top, behavior: "smooth" });
  }

  const handlePartnerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHome) {
      // Already on home — just scroll
      window.history.pushState(null, "", "/#partner-with-us");
      scrollToPartner();
    } else {
      // Navigate to home with hash; the useEffect above will scroll after load
      router.push("/#partner-with-us");
    }
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-blue border-b border-white/10 font-sans shadow-lg shadow-brand-blue/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
          <Image
            src="/logo-nu-white.png"
            alt="OrthoNu"
            width={120}
            height={26}
            className="h-15 md:h-20 w-auto brightness-0 invert transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            priority
          />
        </Link>

        {/* Desktop centre links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 font-semibold text-sm tracking-[0.05em] text-white">
          <Link
            href="/about"
            className="hover:bg-zinc-50/10 px-3 py-1 rounded-3xl transition-all duration-300"
          >
            About
          </Link>
          <Link
            href="/resources"
            className="hover:bg-zinc-50/10 px-3 py-1 rounded-3xl transition-all duration-300"
          >
            Resources
          </Link>
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm tracking-[0.05em] text-white">
          <a
            href="/#partner-with-us"
            onClick={handlePartnerClick}
            className="hover:text-white/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-brand-blue rounded-full px-2 py-1"
            aria-label="Scroll to Partner with Us form"
          >
            Partner with Us
          </a>
          <Link
            href={shopUrl}
            target="_blank"
            className="px-6 py-2.5 bg-white text-brand-blue rounded-full hover:bg-zinc-100 transition-all font-semibold"
          >
            Shop Solutions
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-6 py-6 space-y-4 text-sm">
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block font-semibold text-white/80 py-2"
          >
            About
          </Link>
          <Link
            href="/resources"
            onClick={() => setMobileOpen(false)}
            className="block font-semibold text-white/80 py-2"
          >
            Resources
          </Link>
          <a
            href="/#partner-with-us"
            onClick={handlePartnerClick}
            className="block font-semibold text-white/80 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            aria-label="Scroll to Partner with Us form"
          >
            Partner with Us
          </a>
          <Link
            href={shopUrl}
            target="_blank"
            onClick={() => setMobileOpen(false)}
            className="block font-semibold text-brand-blue bg-white w-fit px-4 py-1.5 rounded-lg"
          >
            Shop Now
          </Link>
        </div>
      )}
    </nav>
  );
}
