"use client";

import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import { ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem, totalItems, cartTotal } =
    useCart();
  const { user } = useAuth();
  const userType = user?.userType || "regular";

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-gray">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-warm-gray text-soft-dark">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-24">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-12">
              <header className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-6xl md:text-7xl font-black text-soft-dark tracking-tight uppercase leading-none">
                    Your Cart
                  </h1>
                  <Link
                    href="/shop/cart/checkout"
                    className="hidden sm:flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-blue/20"
                  >
                    <ShoppingBag size={16} strokeWidth={2.5} />
                    Checkout
                    <ArrowRight size={14} strokeWidth={3} />
                  </Link>
                </div>
                <p className="text-soft-dark/50 font-medium text-lg">
                  Review your items and proceed to checkout
                </p>
              </header>

              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    loading={loading}
                    userType={userType}
                  />
                ))}
              </div>
            </div>

            {/* Right: Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary subtotal={cartTotal} itemCount={totalItems} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="w-24 h-24 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
        <ShoppingBag size={72} strokeWidth={1} className="text-brand-blue/40" />
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-soft-dark uppercase tracking-tight">
          Your cart is empty
        </h2>
        <p className="text-soft-dark/50 font-medium text-lg max-w-md">
          Looks like you haven't added any products yet. Start exploring our
          collection!
        </p>
      </div>

      <Link
        href="/shop"
        className="px-12 py-5 bg-brand-blue text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-xl hover:shadow-2xl hover:shadow-brand-blue/40 hover:-translate-y-1 transition-all shadow-xl shadow-brand-blue/20"
      >
        Start Shopping
      </Link>
    </div>
  );
}
