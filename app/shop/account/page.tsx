"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiCall } from "@/lib/api-client";
import {
    User,
    MapPin,
    ShoppingBag,
    CreditCard,
    Trash2,
    Loader2,
    CheckCircle2,
    Lock,
    Settings,
    ChevronRight,
    Play,
    Clock
} from "lucide-react";
import { useRouter } from "next/navigation";

type Section = "profile" | "address" | "orders" | "subscriptions" | "delete";

export default function AccountPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<Section>("profile");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: user?.name || "",
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        streetAddress1: user?.streetAddress1 || "",
        streetAddress2: user?.streetAddress2 || "",
        city: user?.city || "",
        state: user?.state || "",
        country: user?.country || "United States",
        zipcode: user?.zipcode || "",
    });

    useEffect(() => {
        if (!user) {
            router.push("/shop/login?redirect=/shop/account");
        } else {
            setFormData({
                name: user.name || "",
                fullName: user.fullName || "",
                phone: user.phone || "",
                streetAddress1: user.streetAddress1 || "",
                streetAddress2: user.streetAddress2 || "",
                city: user.city || "",
                state: user.state || "",
                country: user.country || "United States",
                zipcode: user.zipcode || "",
            });
        }
    }, [user, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await apiCall("PATCH", "/auth/update-profile", formData);
            setMessage({ type: "success", text: "Profile updated successfully" });
            // The AuthContext will pick up the cookie/session update if implemented correctly
            // or we could force a page reload or state update.
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-warm-gray min-h-screen">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-12">
                <header className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-blue">Your Sanctuary</span>
                    <h1 className="text-6xl md:text-7xl font-black text-soft-dark tracking-tight uppercase leading-none">Account</h1>
                    <p className="text-soft-dark/50 font-medium text-lg font-serif italic max-w-2xl">
                        Manage your profile, addresses, and therapeutic preferences.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        <NavButton
                            active={activeSection === "profile"}
                            onClick={() => setActiveSection("profile")}
                            icon={<User size={18} />}
                            title="Personal Info"
                        />
                        <NavButton
                            active={activeSection === "address"}
                            onClick={() => setActiveSection("address")}
                            icon={<MapPin size={18} />}
                            title="Addresses"
                        />
                        <NavButton
                            active={activeSection === "orders"}
                            onClick={() => setActiveSection("orders")}
                            icon={<ShoppingBag size={18} />}
                            title="Order History"
                        />
                        <NavButton
                            active={activeSection === "subscriptions"}
                            onClick={() => setActiveSection("subscriptions")}
                            icon={<Clock size={18} />}
                            title="Subscriptions"
                        />
                        <div className="pt-4 border-t border-zinc-200 mt-4">
                            <NavButton
                                active={activeSection === "delete"}
                                onClick={() => setActiveSection("delete")}
                                icon={<Trash2 size={18} />}
                                title="Delete Account"
                                danger
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 md:p-12 min-h-[500px]">
                            {message && (
                                <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <Settings size={18} />}
                                    {message.text}
                                </div>
                            )}

                            {activeSection === "profile" && (
                                <section className="space-y-8 animate-in fade-in duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-soft-dark">Personal Information</h2>
                                        <p className="text-sm text-zinc-400 font-medium">Update your account details and how we contact you.</p>
                                    </div>
                                    <form onSubmit={handleUpdate} className="space-y-6 max-w-xl">
                                        <div className="grid grid-cols-1 gap-6">
                                            <InputField
                                                label="Email"
                                                value={user.email}
                                                disabled
                                                note="Email cannot be changed."
                                            />
                                            <InputField
                                                label="Name"
                                                value={formData.name}
                                                onChange={(val) => setFormData({ ...formData, name: val })}
                                                placeholder="Your display name"
                                            />
                                            {user.userType === 'professional' && (
                                                <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Professional Status</p>
                                                    <p className="text-sm font-bold text-soft-dark capitalize">{user.profession} — {user.npiNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-4 bg-brand-blue text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-brand-blue/30 transition-all flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                                        </button>
                                    </form>
                                </section>
                            )}

                            {activeSection === "address" && (
                                <section className="space-y-8 animate-in fade-in duration-500">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-soft-dark">Shipping Address</h2>
                                        <p className="text-sm text-zinc-400 font-medium">Ensure your restorations and products arrive at the correct sanctuary.</p>
                                    </div>
                                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <InputField
                                                label="Full Recipient Name"
                                                value={formData.fullName}
                                                onChange={(val) => setFormData({ ...formData, fullName: val })}
                                                placeholder="Recipient's legal name"
                                            />
                                        </div>
                                        <InputField
                                            label="Phone Number"
                                            value={formData.phone}
                                            onChange={(val) => setFormData({ ...formData, phone: val })}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        <div className="md:col-span-2">
                                            <InputField
                                                label="Street Address"
                                                value={formData.streetAddress1}
                                                onChange={(val) => setFormData({ ...formData, streetAddress1: val })}
                                                placeholder="123 Dental Way"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <InputField
                                                label="Suite / Apartment (Optional)"
                                                value={formData.streetAddress2}
                                                onChange={(val) => setFormData({ ...formData, streetAddress2: val })}
                                                placeholder="Suite 400"
                                            />
                                        </div>
                                        <InputField
                                            label="City"
                                            value={formData.city}
                                            onChange={(val) => setFormData({ ...formData, city: val })}
                                        />
                                        <InputField
                                            label="State / Province"
                                            value={formData.state}
                                            onChange={(val) => setFormData({ ...formData, state: val })}
                                        />
                                        <InputField
                                            label="ZIP / Postal Code"
                                            value={formData.zipcode}
                                            onChange={(val) => setFormData({ ...formData, zipcode: val })}
                                        />
                                        <InputField
                                            label="Country"
                                            value={formData.country}
                                            disabled
                                        />

                                        <div className="md:col-span-2 pt-6">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-8 py-4 bg-brand-blue text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-brand-blue/30 transition-all flex items-center gap-3 disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : "Update Address"}
                                            </button>
                                        </div>
                                    </form>
                                </section>
                            )}

                            {activeSection === "orders" && (
                                <section className="flex flex-col items-center justify-center py-24 space-y-6 text-center animate-in fade-in duration-500">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                                        <ShoppingBag size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-soft-dark uppercase">No Orders Yet</h3>
                                        <p className="text-zinc-400 text-sm font-medium">Your therapeutic journey is just beginning.</p>
                                    </div>
                                    <button onClick={() => router.push('/shop')} className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-2 hover:gap-3 transition-all">
                                        Browse Products <ChevronRight size={14} />
                                    </button>
                                </section>
                            )}

                            {activeSection === "subscriptions" && (
                                <section className="flex flex-col items-center justify-center py-24 space-y-6 text-center animate-in fade-in duration-500">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                                        <Clock size={32} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-soft-dark uppercase">No Active Subscriptions</h3>
                                        <p className="text-zinc-400 text-sm font-medium">Coming soon: Automated care cycles for peace of mind.</p>
                                    </div>
                                </section>
                            )}

                            {activeSection === "delete" && (
                                <DeleteAccountSection loading={loading} setMessage={setMessage} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavButton({ title, icon, active, onClick, danger }: { title: string; icon: React.ReactNode; active: boolean; onClick: () => void; danger?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${active
                    ? danger ? "bg-red-50 text-red-600 shadow-sm border border-red-100" : "bg-white text-brand-blue shadow-lg shadow-brand-blue/5 border border-zinc-100"
                    : "text-soft-dark/40 hover:text-soft-dark hover:bg-zinc-100"
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={active ? "" : "opacity-40"}>{icon}</span>
                {title}
            </div>
            {active && <ChevronRight size={14} />}
        </button>
    );
}

function InputField({ label, value, onChange, placeholder, disabled, note }: { label: string; value: string; onChange?: (v: string) => void; placeholder?: string; disabled?: boolean; note?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-soft-dark/40 px-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-medium text-soft-dark ${disabled ? 'opacity-50 cursor-not-allowed bg-zinc-100/50' : 'hover:border-zinc-300'}`}
            />
            {note && <p className="text-[10px] text-zinc-400 font-medium px-1 italic">{note}</p>}
        </div>
    );
}

function DeleteAccountSection({ loading: parentLoading, setMessage }: { loading: boolean; setMessage: (m: any) => void }) {
    const [password, setPassword] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;
        setLoading(true);
        try {
            await apiCall("POST", "/auth/delete-account", { password });
            setMessage({ type: "success", text: "Account deleted. We're sorry to see you go." });
            setTimeout(() => {
                logout();
                router.push("/");
            }, 3000);
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Failed to delete account. Incorrect password?" });
        } finally {
            setLoading(false);
            setConfirming(false);
        }
    };

    return (
        <section className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-red-600">Delete Account</h2>
                <p className="text-sm text-zinc-400 font-medium">This action is permanent. All your data and preferences will be removed.</p>
            </div>

            {!confirming ? (
                <div className="bg-red-50 border border-red-100 rounded-3xl p-8 space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-red-700 font-bold">Are you absolutely sure?</h3>
                        <p className="text-sm text-red-600/70 font-medium">Think twice. You will lose your history and therapeutic configurations.</p>
                    </div>
                    <button
                        onClick={() => setConfirming(true)}
                        className="px-8 py-4 bg-red-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                    >
                        I understand, proceed
                    </button>
                </div>
            ) : (
                <form onSubmit={handleDelete} className="space-y-6 max-w-xl">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-red-600/60 px-1">Confirm Identity</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password to confirm"
                                    className="w-full pl-14 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium text-soft-dark"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-red-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all flex items-center gap-3 shadow-lg shadow-red-600/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "Delete Forever"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setConfirming(false)}
                            className="px-8 py-4 bg-zinc-100 text-soft-dark/60 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
