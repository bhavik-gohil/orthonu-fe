"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";
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
    <nav className="sticky top-0 z-50 w-full bg-brand-blue/95 backdrop-blur-md border-b border-white/10 font-sans shadow-lg shadow-brand-blue/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
          <Image
            src="/logo-nu-white.png"
            alt="OrthoNu"
            width={120}
            height={26}
            className="h-10 md:h-14 w-auto brightness-0 invert transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            priority
          />
        </Link>

        {/* Desktop centre links */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center font-semibold text-sm tracking-[0.08em] text-white">
          <Link
            href="/about"
            className="hover:bg-atlantic-blue/10 px-4 py-2 rounded-3xl transition-all duration-300"
          >
            About
          </Link>
          <Link
            href="/resources"
            className="hover:bg-atlantic-blue/10 px-4 py-2 rounded-3xl transition-all duration-300"
          >
            Resources
          </Link>
          <a
            href="/#partner-with-us"
            onClick={handlePartnerClick}
            className="hover:bg-atlantic-blue/10 px-4 py-2 rounded-3xl transition-all duration-300"
          >
            Partner with Us
          </a>
        </div>

        {/* Desktop right actions */}
        <div className="hidden lg:flex flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
          <Link
            href={shopUrl}
            target="_blank"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-gray text-atlantic-blue border border-warm-gray hover:border-atlantic-blue hover:text-warm-gray rounded-full font-semibold text-sm tracking-wide hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Shop Solutions
            <ChevronRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2.5 text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 px-6 py-8 space-y-1 text-sm bg-brand-blue">
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between font-semibold text-white py-3.5 border-b border-white/10 hover:text-white/70 transition-colors"
          >
            About
          </Link>
          <Link
            href="/resources"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between font-semibold text-white py-3.5 border-b border-white/10 hover:text-white/70 transition-colors"
          >
            Resources
          </Link>
          <a
            href="/#partner-with-us"
            onClick={handlePartnerClick}
            className="flex items-center justify-between font-semibold text-white py-3.5 border-b border-white/10 hover:text-white/70 transition-colors focus:outline-none"
            aria-label="Scroll to Partner with Us form"
          >
            Partner with Us
          </a>
          <div className="pt-4">
            <div className="block flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href={shopUrl}
                target="_blank"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-gray text-soft-dark border border-warm-gray hover:border-atlantic-blue hover:text-warm-gray rounded-full font-semibold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 duration-30"
              >
                Shop Solutions
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            {/* <Link
              href={shopUrl}
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center font-bold text-brand-blue bg-white px-6 py-3.5 rounded-full text-sm tracking-wide hover:bg-zinc-50 transition-colors"
            >
              Shop Solutions
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
}
