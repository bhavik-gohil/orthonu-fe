"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getShopUrl } from "@/lib/subdomains";
import { cn } from "@/lib/utils";

export default function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [shopUrl, setShopUrl] = useState("/shop");
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    setShopUrl(getShopUrl());

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    // Set initial hash
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // On home page: scroll to section if hash present on load
  useEffect(() => {
    if (!isHome) return;
    if (activeHash === "#partner-with-us") {
      scrollToPartner();
    }
  }, [isHome, activeHash]);

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
      const currentPath = window.location.pathname;
      const targetHash = "#partner-with-us";

      if (window.location.hash !== targetHash) {
        // Use replaceState with a full path to be absolute about the URL structure
        window.history.replaceState(null, "", currentPath + targetHash);
        setActiveHash(targetHash);
      }
      scrollToPartner();
    } else {
      // Navigate to home with hash; the useEffect above will scroll after load
      router.push("/#partner-with-us");
    }
    setMobileOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
        setActiveHash("");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-blue/95 backdrop-blur-md border-b border-white/10 font-sans shadow-lg shadow-brand-blue/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="hover:opacity-80 transition-opacity shrink-0"
        >
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
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2  space-x-1 items-center font-semibold text-xs tracking-[0.08em] text-white">
          <Link
            href="/"
            onClick={handleLogoClick}
            className={cn(
              "py-1.5 md:px-3 rounded-3xl transition-all duration-300 text-white",
              (pathname === "/" || pathname === "") &&
                !activeHash &&
                "bg-atlantic-blue/10",
            )}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={cn(
              "py-1.5 md:px-3 rounded-3xl transition-all duration-300 text-white",
              pathname.startsWith("/about") && "bg-atlantic-blue/10",
            )}
          >
            About
          </Link>
          <Link
            href="/resources"
            className={cn(
              "py-1.5 md:px-3 rounded-3xl transition-all duration-300 text-white",
              pathname.startsWith("/resources") && "bg-atlantic-blue/10",
            )}
          >
            Resources
          </Link>
          <a
            href="/#partner-with-us"
            onClick={handlePartnerClick}
            className={cn(
              "py-1.5 md:px-3 rounded-3xl transition-all duration-300 text-white",
              (pathname === "/" || pathname === "") &&
                activeHash.includes("#partner-with-us") &&
                "bg-atlantic-blue/10",
            )}
          >
            Partner with Us
          </a>
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-1 text-xs md:text-xs lg:text-sm">
          <Link
            href={shopUrl}
            target="_blank"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-warm-gray text-atlantic-blue border border-warm-gray hover:border-atlantic-blue hover:text-warm-gray rounded-full font-bold tracking-wide hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all duration-300"
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
          className="md:hidden p-2.5 text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-white/10 px-6 space-y-1 text-sm bg-brand-blue">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center font-semibold py-3.5 px-3 border-b-2 border-white/0 transition-colors text-white",
              (pathname === "/" || pathname === "") &&
                !activeHash &&
                "bg-warm-gray/15 rounded-xl",
            )}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center font-semibold py-3.5 px-3 border-b-2 border-white/0 transition-colors text-white",
              pathname.startsWith("/about") && "bg-warm-gray/15 rounded-xl",
            )}
          >
            About
          </Link>
          <Link
            href="/resources"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center font-semibold py-3.5 px-3 border-b-2 border-white/0 transition-colors text-white",
              pathname.startsWith("/resources") && "bg-warm-gray/15 rounded-xl",
            )}
          >
            Resources
          </Link>
          <a
            href="/#partner-with-us"
            onClick={handlePartnerClick}
            className={cn(
              "flex items-center font-semibold py-3.5 px-3 border-b-2 border-white/0 transition-colors text-white",
              (pathname === "/" || pathname === "") &&
                activeHash.includes("#partner-with-us") &&
                "bg-warm-gray/15 rounded-xl",
            )}
            aria-label="Scroll to Partner with Us form"
          >
            Partner with Us
          </a>
          <div className="py-3.5 pb-4.5">
            <div className="block flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Link
                href={shopUrl}
                target="_blank"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-gray text-atlantic-blue border border-warm-gray hover:border-atlantic-blue hover:text-warm-gray rounded-full font-extrabold text-sm tracking-wide transition-all hover:bg-atlantic-blue hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 duration-300"
              >
                Shop Solutions
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
