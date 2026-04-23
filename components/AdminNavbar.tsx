"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AdminNavbar({
  adminName,
  adminType,
  onLogout,
}: {
  adminName?: string;
  adminType?: string;
  onLogout?: () => void;
}) {
  return (
    <nav className="sticky top-0 z-50 w-ful bg-brand-blue border-b border-zinc-100 font-sans shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center group">
          <Image
            src="/logo-nu-white.png"
            alt="OrthoNu Logo"
            width={120}
            height={26}
            className="h-10 md:h-20 w-auto brightness-0 invert transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            priority
          />
          <span className="h-4 w-px bg-zinc-100 mx-4" />
          <span className="text-base font-semibold tracking-wide text-white">
            Console
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {(adminName || adminType) && (
            <div className="items-center gap-4 px-4 py-2 rounded-2xl border border-zinc-50/25 hidden md:flex">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold leading-none text-white">
                  {adminName}
                </span>
                <span className="text-[9px] text-white font-bold leading-none mt-1.5 uppercase tracking-widest">
                  {adminType?.replace("_", " ")}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex gap-2 font-bold text-[10px] uppercase tracking-widest px-4 py-2 text-zinc-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer group"
            title="Logout"
          >
            <span>Sign Out</span>
            <LogOut
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
