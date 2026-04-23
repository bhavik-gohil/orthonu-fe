"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface CartSummaryProps {
    subtotal: number;
    itemCount: number;
}

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
    const total = subtotal; // Will add tax later
    const { user } = useAuth();
    const router = useRouter();

    const handleCheckout = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            router.push("/shop/login?redirect=/shop/cart");
        } else {
            router.push("/shop/cart/checkout");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-lg p-8 space-y-6 sticky top-24">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-soft-dark text-opacity-60">
                Order Summary
            </h2>

            <div className="space-y-4 py-4 border-y border-zinc-100">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-soft-dark/60">
                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </span>
                    <span className="text-lg font-bold text-soft-dark">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-soft-dark/40">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                </div>
            </div>

            <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-soft-dark text-opacity-60">
                    Total
                </span>
                <span className="text-3xl font-black text-brand-blue">
                    ${total.toFixed(2)}
                </span>
            </div>

            <div className="space-y-3 pt-4">
                <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-brand-blue text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-blue/20"
                >
                    <ShoppingBag size={18} strokeWidth={2.5} />
                    Proceed to Checkout
                    <ArrowRight size={14} strokeWidth={3} />
                </button>

                <Link
                    href="/shop"
                    className="w-full flex items-center justify-center py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-soft-dark/60 hover:text-brand-blue transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>

            <div className="pt-4 border-t border-zinc-100">
                <p className="text-[10px] text-soft-dark/40 leading-relaxed">
                    Free shipping on orders over $50. Secure checkout with SSL encryption.
                </p>
            </div>
        </div>
    );
}
