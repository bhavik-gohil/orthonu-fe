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
import { usePathname, useSearchParams } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { Category } from "@/lib/types";
import { isSubdomainEnvironment } from "@/lib/subdomains";
import { cn } from "@/lib/utils";

export default function ShopNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
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
    <nav className="sticky top-0 z-50 w-full bg-brand-blue/95 backdrop-blur-md border-b border-white/10 font-sans shadow-lg shadow-brand-blue/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo Area */}
        <Link
          href={shopPrefix || "/"}
          className="hover:opacity-90 transition-all duration-500 shrink-0 group"
        >
          <div className="relative">
            <Image
              src="/logo-nu-white.png"
              alt="OrthoNu"
              width={120}
              height={26}
              className="h-10 md:h-14 w-auto brightness-0 invert transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-wide text-white">
          {categories.map((cat, i) => {
            return (
              <div
                key={`cat-${i}`}
                className="relative group/nav"
                onMouseEnter={() => setOpenMenu(cat.productCategory)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  className={cn(
                    "flex items-center gap-2 text-white relative group py-1.5 md:px-3 rounded-3xl transition-all duration-300",
                    activeCategory === cat.productCategory
                      ? "bg-atlantic-blue/20  shadow-sm"
                      : "hover:bg-atlantic-blue/10",
                  )}
                  href={`${shopPrefix}/?category=${encodeURIComponent(cat.productCategory)}`.replace(
                    "//",
                    "/",
                  )}
                >
                  <span className="relative z-10 ">{cat.productCategory}</span>
                </Link>
              </div>
            );
          })}

          {shouldShowProfessionalLink && (
            <Link
              href={`${shopPrefix}/register?professional=yes`}
              className={cn(
                "flex items-center gap-2 relative text-white group py-1.5 md:px-3 rounded-3xl transition-all duration-300",
                searchParams.get("professional") === "yes" ||
                  pathname.includes("register")
                  ? "bg-atlantic-blue/20 shadow-sm"
                  : "hover:bg-atlantic-blue/10",
              )}
            >
              For Professional
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
        <div className="md:hidden bg-brand-blue px-6 py-6 animate-in slide-in-from-top-10 duration-500 border-t border-white/5">
          <div className="">
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
                className={cn(
                  "flex items-center font-semibold py-3.5 px-3 border-b-2 border-white/0 transition-colors text-white text-xs",
                  activeCategory === cat.productCategory &&
                    "bg-warm-gray/15 rounded-xl",
                )}
              >
                {cat.productCategory}
                {/* <ChevronDown
                  size={16}
                  className={cn(
                    "-rotate-90",
                    activeCategory === cat.productCategory
                      ? "text-white"
                      : "text-white/20",
                  )}
                /> */}
              </Link>
            ))}
          </div>

          {shouldShowProfessionalLink && (
            <div className="border-t border-white/5">
              <Link
                href={`${shopPrefix}/register?professional=yes`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center font-semibold py-3.5 px-3 border-b-2 border-white/0 transition-colors text-white text-xs"
              >
                For Professional
                {/* <ChevronDown size={16} className="-rotate-90 text-white/40" /> */}
              </Link>
            </div>
          )}

          <div className="space-y-4 mt-4">
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
             <div className="space-y-3">
               <Link
                href={`${shopPrefix}/login`}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3.5 bg-warm-gray text-soft-dark rounded-full text-sm font-black tracking-widest"
              >
                Login
              </Link>
               <Link
                href={`${shopPrefix}/register`}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3.5 border border-warm-gray text-white rounded-full text-sm font-extrabold tracking-widest"
              >
                Register
              </Link>
             </div>
              
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
