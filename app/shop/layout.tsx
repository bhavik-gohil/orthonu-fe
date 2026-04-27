"use client";

import { Suspense } from "react";
import ShopNavbar from "@/components/ShopNavbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/CartContext";
import Snackbar from "@/components/Snackbar";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { error, clearError } = useCart();

    return (
        <div className="flex flex-col min-h-screen">
            {error && (
                <Snackbar
                    message={error}
                    type="error"
                    onDismiss={clearError}
                />
            )}
            <Suspense fallback={<div className="h-28 bg-brand-blue" />}>
                <ShopNavbar />
            </Suspense>
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
