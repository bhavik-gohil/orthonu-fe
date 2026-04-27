"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCog,
  Users,
  FolderTree,
  Package,
  Layers,
  Loader2,
  ShieldAlert,
  Quote,
  User,
  Handshake,
  Ticket,
} from "lucide-react";
import { apiCall } from "@/lib/api-client";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

interface DashCard {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function DashboardCard({ href, icon, title, description }: DashCard) {
  return (
    <Link href={href} className="group">
      <Card
        className="h-full flex flex-col items-center text-center hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-500"
        padding="medium"
      >
        <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-brand-blue group-hover:bg-white transition-all duration-500 mb-6">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-soft-dark mb-2">{title}</h3>
        <p className="text-xs text-soft-dark/40 leading-relaxed">{description}</p>
      </Card>
    </Link>
  );
}

export default function Admin() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiCall("GET", "admin/me");
        setAdminUser(user);
      } catch {
        /* Layout will handle redirect */
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  const isMainAdmin = adminUser?.userType === "main_admin";
  const isEditor = adminUser?.userType === "editor";
  const canManageContent = isMainAdmin || isEditor;

  return (
    <Section className="flex-1 flex flex-col items-center justify-center p-0">
      <main className="flex flex-1 w-full flex-col items-center justify-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-soft-dark">
            Dashboard
          </h1>
          <p className="text-lg text-soft-dark/50 max-w-md">
            Manage your application settings, users, and content from this central hub.
          </p>
        </div>

        {isMainAdmin || canManageContent ? (
          <div className="w-full space-y-10">
            {/* Main Admin only section */}
            {isMainAdmin && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-soft-dark/40 mb-4">
                  Administration
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  <DashboardCard href="/admin/console-users" icon={<UserCog size={32} />}
                    title="Console Users" description="Add, edit, or remove console administrators and staff." />
                  <DashboardCard href="/admin/users" icon={<Users size={32} />}
                    title="Users" description="Manage user accounts and professional user approvals." />
                  <DashboardCard href="/admin/product-categories" icon={<FolderTree size={32} />}
                    title="Categories" description="Organize your shop collection by medical category." />
                  <DashboardCard href="/admin/product" icon={<Package size={32} />}
                    title="Products" description="Create and manage your medical grade inventory." />
                  <DashboardCard href="/admin/product-groups" icon={<Layers size={32} />}
                    title="Product Collections" description="Group products into named collections for the home page." />
                  <DashboardCard href="/admin/colors"
                    icon={<div className="flex gap-1"><div className="w-4 h-4 rounded-full bg-brand-blue" /><div className="w-4 h-4 rounded-full bg-soft-plum" /><div className="w-4 h-4 rounded-full bg-fresh-mint" /></div>}
                    title="Brand Colors" description="Manage the product color palette and packaging accents." />
                  <DashboardCard href="/admin/coupons" icon={<Ticket size={32} />}
                    title="Coupon Codes" description="Create and manage discount coupons for checkout." />
                  <DashboardCard href="/admin/submissions" icon={<ShieldAlert size={32} />}
                    title="Form Submissions" description="Review inquiries from Partnership, Contact, and Download forms." />
                </div>
              </div>
            )}

            {/* Content section — main_admin + editor */}
            {canManageContent && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-soft-dark/40 mb-4">
                  About Page Content
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <DashboardCard href="/admin/testimonials" icon={<Quote size={32} />}
                    title="Testimonials" description="Manage customer and professional testimonials." />
                  <DashboardCard href="/admin/board-members" icon={<User size={32} />}
                    title="Board Members" description="Manage advisory board members shown on the About page." />
                  <DashboardCard href="/admin/partners" icon={<Handshake size={32} />}
                    title="Partners" description="Manage partner organizations shown on the About page." />
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="flex flex-col items-center gap-4 p-12 text-center max-w-lg mx-auto" padding="medium">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl mb-2">
              <ShieldAlert size={48} />
            </div>
            <h2 className="text-xl font-bold text-soft-dark">Limited Access</h2>
            <p className="text-sm text-soft-dark/50 leading-relaxed">
              Your account is assigned the{" "}
              <span className="font-bold text-brand-blue">
                {adminUser?.userType.replace("_", " ")}
              </span>{" "}
              role. Access to specific management tools is restricted.
            </p>
          </Card>
        )}
      </main>
    </Section>
  );
}
