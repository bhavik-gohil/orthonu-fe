"use client";

import ShopNavbar from "@/components/ShopNavbar";
import Footer from "@/components/Footer";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <ShopNavbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
