import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import "../styles/common.css";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrthoNu - Precision Oral Health",
  description: "Innovation, Professionalism, and Care.",
  icons: {
    icon: "/logo-nu-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm-gray text-soft-dark font-sans">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
