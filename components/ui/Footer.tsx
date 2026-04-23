import React from "react";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {
    variant?: "full" | "minimal";
}

export default function Footer({ variant = "minimal" }: FooterProps) {
    if (variant === "full") {
        return (
            <footer className="mt-auto py-20 px-6 bg-warm-gray border-t border-zinc-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <Image src="/logo-nu-white.png" alt="OrthoNu" width={100} height={22} className="opacity-50" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                            © {new Date().getFullYear()} OrthoNu. Precision Oral Health.
                        </p>
                    </div>
                    <div className="flex gap-12">
                        <Link href="/privacy" className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-blue transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-blue transition-colors">Terms</Link>
                        <Link href="/contact" className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-blue transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="py-12 px-6 bg-zinc-50 border-t border-zinc-100 mt-auto">
            <div className="mt-10 text-center font-medium text-xs text-zinc-400">
                &copy; {new Date().getFullYear()} OrthoNU. All rights reserved.
            </div>
        </footer>
    );
}
