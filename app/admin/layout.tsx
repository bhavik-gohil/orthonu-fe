"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  User,
  Package,
  FolderTree,
  Users,
  Loader2,
} from "lucide-react";
import { apiCall } from "@/lib/api-client";
import AdminNavbar from "@/components/AdminNavbar";
import Container from "@/components/ui/Container";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const user = await apiCall("GET", "admin/me");
        setAdminUser(user);

        if (user.status === "password_reset_pending") {
          if (pathname !== "/admin/setup-password") {
            router.push("/admin/setup-password");
          }
        } else if (
          pathname === "/admin/login" ||
          pathname === "/admin/setup-password"
        ) {
          router.push("/admin");
        }
      } catch (err) {
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      // Ideally we have a /logout endpoint that clears the cookie
      // For now, we just redirect, but the cookie will still exist
      // unless we clear it on the server.
      // I'll add a logout route to the backend.
      await apiCall("POST", "admin/logout");
    } catch (err) {
      /* silent */
    }
    setAdminUser(null);
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  // Don't show navbar on login page or for users who must reset password
  if (
    pathname === "/admin/login" ||
    adminUser?.status === "password_reset_pending"
  ) {
    return <>{children}</>;
  }

  // Protect all other admin routes
  if (!adminUser) {
    return null; // Will redirect in useEffect
  }

  const navLinkCls = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname.startsWith(path)
      ? "bg-white/20 text-white shadow-sm"
      : "text-white/60 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-warm-gray font-sans text-black">
      <AdminNavbar adminName={adminUser?.name} adminType={adminUser?.userType} onLogout={handleLogout} />

      <Container as="main" className="flex-1 flex flex-col py-12">
        {children}
      </Container>
    </div>
  );
}
