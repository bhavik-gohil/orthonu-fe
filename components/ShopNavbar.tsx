"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LogIn,
  UserCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { Category } from "@/lib/types";
import { isSubdomainEnvironment } from "@/lib/subdomains";

export default function ShopNavbar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopPrefix, setShopPrefix] = useState("/shop");

  useEffect(() => {
    if (isSubdomainEnvironment()) {
      setShopPrefix("");
    }
  }, []);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  // Hide "For Professional" link when user is logged in
  const shouldShowProfessionalLink = !user;

  useEffect(() => {
    apiCall("GET", "/product-categories")
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-blue font-sans shadow-xl shadow-brand-blue/10 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex items-center justify-between h-20 md:h-28">
        {/* Logo Area */}
        <Link
          href={shopPrefix || "/"}
          className="hover:opacity-90 transition-all duration-500 shrink-0 group"
        >
          <div className="relative">
            <Image
              src="/logo-nu-white.png"
              alt="OrthoNu"
              width={160}
              height={32}
              className="h-10 md:h-20 w-auto brightness-0 invert transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
          {categories.map((cat, i) => {
            const isOpen = openMenu === cat.productCategory;
            return (
              <div
                key={`cat-${i}`}
                className="relative group/nav"
                onMouseEnter={() => setOpenMenu(cat.productCategory)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  className="flex items-center gap-2 relative group hover:bg-zinc-50/10 px-3 py-1 rounded-3xl transition-all duration-300"
                  href={`${shopPrefix}/?category=${encodeURIComponent(cat.productCategory)}`.replace(
                    "//",
                    "/",
                  )}
                >
                  <span className="relative z-10 ">{cat.productCategory}</span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-500 ${isOpen ? "rotate-180 text-white" : "text-white/70"}`}
                  />
                  {/* <div
                    className={`absolute bottom-6 left-0 h-0.5 bg-white transition-all duration-500 rounded-full w-0 group-hover:w-full`}
                  /> */}
                </Link>

                {isOpen && (
                  <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-2 w-[420px] bg-white rounded-4xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-zinc-100 p-10 text-left z-50 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black tracking-[0.3em] text-brand-blue uppercase bg-brand-blue/5 px-3 py-1.5 rounded-full border border-brand-blue/10">
                          Shop {cat.productCategory}
                        </span>
                        <h3 className="text-xl font-black text-soft-dark leading-tight tracking-tight pt-2">
                          {cat.header}
                        </h3>
                        <p className="text-[12px] leading-relaxed text-soft-dark/50 font-medium font-serif italic">
                          {cat.text}
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link
                          href={`${shopPrefix}/?category=${encodeURIComponent(cat.productCategory)}`.replace(
                            "//",
                            "/",
                          )}
                          className="inline-flex items-center gap-3 px-6 py-3 bg-brand-blue text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-brand-blue/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all"
                        >
                          Explore Collection
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {shouldShowProfessionalLink && (
            <Link
              href={`${shopPrefix}/register?professional=yes`}
              className="flex items-center gap-2 relative group hover:bg-zinc-50/10 px-3 py-1 rounded-3xl transition-all duration-300"
            >
              For Professional
              {/* <div
                className={`absolute bottom-6 left-0 h-0.5 bg-white transition-all duration-500 rounded-full w-0 group-hover:w-full`}
              /> */}
            </Link>
          )}
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* For Professional Button */}

          {/* Shopping Bag */}
          <Link
            href={`${shopPrefix}/cart`}
            className="relative p-3.5 text-white hover:bg-white/10 border border-white/5 rounded-full transition-all duration-500 group shadow-lg shadow-black/5"
          >
            <ShoppingBag
              size={22}
              strokeWidth={2.5}
              className="group-hover:scale-110 transition-transform"
            />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-white text-brand-blue text-[10px] font-black rounded-full flex items-center justify-center shadow-xl border-2 border-brand-blue animate-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account Icon Dropdown */}
          <div className="relative group">
            <button className="p-3.5 text-white hover:bg-white/10 border border-white/5 rounded-full transition-all duration-500 group shadow-lg shadow-black/5 flex items-center gap-2">
              <User size={22} strokeWidth={2.5} />
            </button>

            <div className="absolute top-[85%] right-0 pt-4 w-72 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <div className="bg-white rounded-4xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-zinc-100 p-3 overflow-hidden transform origin-top-right transition-all duration-500">
                {user ? (
                  <>
                    <div className="px-6 py-6 border-b border-zinc-50 bg-zinc-50/50 rounded-t-3xl mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Logged in As
                      </p>
                      <p className="text-sm font-black text-soft-dark truncate mt-1 tracking-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] font-medium text-zinc-400 truncate tracking-wide">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href={`${shopPrefix}/account`}
                      className="flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-soft-dark hover:bg-zinc-50 rounded-xl transition-all group"
                    >
                      <UserCircle
                        size={18}
                        className="text-brand-blue group-hover:scale-110 transition-transform"
                      />
                      Account Hub
                    </Link>
                    <div className="border-t border-zinc-100 mt-2 pt-2">
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
                      >
                        <LogOut
                          size={18}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-6 py-3 border-b border-zinc-50 bg-zinc-50/50 rounded-t-3xl mb-2 text-center">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
                        <User size={24} />
                      </div>
                      <p className="text-xs font-bold text-soft-dark/60 mt-1">
                        Please Login to continue
                      </p>
                    </div>
                    <Link
                      href={`${shopPrefix}/login`}
                      className="flex items-center justify-center gap-3 mx-2 my-2 py-3 bg-brand-blue text-white rounded-full text-sm font-bold tracking-wide shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <LogIn size={16} /> Login
                    </Link>
                    <div className="text-center py-2 text-sm font-bold text-zinc-400">
                      <Link
                        href={`${shopPrefix}/register`}
                        className="text-brand-blue underline decoration-brand-blue/20 hover:decoration-brand-blue transition-all"
                      >
                        Create Account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-3.5 text-white hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={2.5} />
            ) : (
              <Menu size={22} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overhaul */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-blue px-6 py-10 space-y-6 animate-in slide-in-from-top-10 duration-500 border-t border-white/5">
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-4">
              Categories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${shopPrefix}/?category=${encodeURIComponent(cat.productCategory)}`.replace(
                  "//",
                  "/",
                )}
                onClick={() => setMobileOpen(false)}
                className="flex text-lg font-black text-white py-4 border-b border-white/5 active:scale-95 transition-all items-center justify-between"
              >
                {cat.productCategory}
                <ChevronDown size={16} className="-rotate-90 text-white/40" />
              </Link>
            ))}
          </div>

          {shouldShowProfessionalLink && (
            <div className="pt-6 border-t border-white/5">
              <Link
                href={`${shopPrefix}/register?professional=yes`}
                onClick={() => setMobileOpen(false)}
                className="flex text-lg font-black text-white py-4 border-b border-white/5 active:scale-95 transition-all items-center justify-between"
              >
                For Professional
                <ChevronDown size={16} className="-rotate-90 text-white/40" />
              </Link>
            </div>
          )}

          <div className="pt-6 space-y-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-4">
              Account
            </p>
            {user ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`${shopPrefix}/account`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white"
                >
                  Hub
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center justify-center gap-2 py-4 bg-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href={`${shopPrefix}/login`}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-5 bg-white text-brand-blue rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
