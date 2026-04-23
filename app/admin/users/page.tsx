"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api-client";
import { Loader2, ChevronLeft, Shield, CheckCircle, XCircle, Clock, User, Eye, X, MapPin, Mail, Phone, CreditCard } from "lucide-react";
import Link from "next/link";

interface RegularUser {
    id: number;
    uid: string;
    name: string;
    email: string;
    userType: string;
    status: string;
    isProfessionalUser: boolean;
    profession?: string;
    npiNumber?: string;
    emailProfessional?: string;
    createdAt: string;
    
    // Shipping address fields
    fullName?: string;
    phone?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    
    // Billing address fields
    isBillingSameAsShipping?: boolean;
    billingNameOnCard?: string;
    billingStreetAddress1?: string;
    billingStreetAddress2?: string;
    billingCity?: string;
    billingState?: string;
    billingCountry?: string;
    billingZipcode?: string;
}

import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export default function ManageUsers() {
    const [users, setUsers] = useState<RegularUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "regular" | "professional" | "pending">("all");
    const [snack, setSnack] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [selectedUser, setSelectedUser] = useState<RegularUser | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await apiCall("GET", "/admin/all-users");
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId: number, status: string) => {
        try {
            await apiCall("PATCH", `/admin/users/${userId}/status`, { status });
            setSnack({ type: "success", text: `User status updated to ${status}` });
            fetchUsers();
            // Update the selected user if modal is open
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({ ...selectedUser, status });
            }
        } catch (err: any) {
            setSnack({ type: "error", text: err?.response?.data?.message || "Failed to update user status." });
        }
    };

    const openUserModal = (user: RegularUser) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setShowUserModal(false);
    };

    const filteredUsers = users.filter(user => {
        if (filter === "all") return true;
        if (filter === "regular") return user.userType === "regular";
        if (filter === "professional") return user.userType === "professional";
        if (filter === "pending") return user.status === "pending";
        return true;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle size={12} />
                    Active
                </span>;
            case "pending":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={12} />
                    Pending
                </span>;
            case "inactive":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                    <XCircle size={12} />
                    Inactive
                </span>;
            case "not-approved":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest">
                    <XCircle size={12} />
                    Not Approved
                </span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                    {status}
                </span>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
                <p className="text-sm text-zinc-400 animate-pulse">Loading users…</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue mb-2 transition-colors group text-xs font-bold uppercase tracking-widest">
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        Dashboard
                    </button>
                    <PageHeader
                        title="User Management"
                        eyebrow="Users"
                        subtitle="Manage customer accounts and professional user approvals."
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 cursor-pointer"
                    >
                        <option value="all">All Users ({users.length})</option>
                        <option value="regular">Regular ({users.filter(u => u.userType === "regular").length})</option>
                        <option value="professional">Professional ({users.filter(u => u.userType === "professional").length})</option>
                        <option value="pending">Pending Approval ({users.filter(u => u.status === "pending").length})</option>
                    </select>
                </div>
            </div>

            {snack && (
                <div className={`p-4 rounded-2xl text-xs font-bold animate-in slide-in-from-top-2 duration-300 ${snack.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                    {snack.text}
                </div>
            )}

            <Card padding="none" className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 border-b border-zinc-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">User</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Type</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Joined</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-soft-dark/40">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="group hover:bg-zinc-50/30 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-blue to-bright-cyan flex items-center justify-center text-white text-xs font-black shadow-inner shadow-black/10">
                                            {user.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-soft-dark">{user.name}</p>
                                            <p className="text-xs text-soft-dark/40">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-soft-dark/60">
                                        <User size={12} />
                                        {user.userType}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="px-8 py-5 text-xs text-soft-dark/40 font-bold">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button
                                        onClick={() => openUserModal(user)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-[10px] font-bold rounded-lg hover:bg-atlantic-blue transition-colors"
                                    >
                                        <Eye size={12} />
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-12 text-center text-zinc-400 text-sm">
                                    No users found for the selected filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-soft-dark/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300" padding="none">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 bg-zinc-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-blue to-bright-cyan flex items-center justify-center text-white text-lg font-black shadow-inner shadow-black/10">
                                    {selectedUser.name.substring(0, 1).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-soft-dark">{selectedUser.name}</h2>
                                    <p className="text-sm text-soft-dark/60">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={closeUserModal} 
                                className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <X size={20} className="text-zinc-400" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-soft-dark/60 mb-4">Basic Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <User size={16} className="text-zinc-400" />
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">User Type</p>
                                                    <p className="text-sm font-bold text-soft-dark capitalize">{selectedUser.userType}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    {getStatusBadge(selectedUser.status)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={16} className="text-zinc-400" />
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Member Since</p>
                                                    <p className="text-sm font-bold text-soft-dark">{new Date(selectedUser.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Information */}
                                    {selectedUser.userType === "professional" && (
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-soft-dark/60 mb-4">Professional Information</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Shield size={16} className="text-zinc-400" />
                                                    <div>
                                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Profession</p>
                                                        <p className="text-sm font-bold text-soft-dark">{selectedUser.profession || "Not specified"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded bg-zinc-200 flex items-center justify-center text-[8px] font-black text-zinc-500">ID</div>
                                                    <div>
                                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">NPI Number</p>
                                                        <p className="text-sm font-bold text-soft-dark">{selectedUser.npiNumber || "Not provided"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Mail size={16} className="text-zinc-400" />
                                                    <div>
                                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Professional Email</p>
                                                        <p className="text-sm font-bold text-soft-dark">{selectedUser.emailProfessional || "Not provided"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Management */}
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-soft-dark/60 mb-4">Account Management</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updateUserStatus(selectedUser.id, "active")}
                                                        className="px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors"
                                                    >
                                                        Approve Account
                                                    </button>
                                                    <button
                                                        onClick={() => updateUserStatus(selectedUser.id, "not-approved")}
                                                        className="px-4 py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg hover:bg-rose-200 transition-colors"
                                                    >
                                                        Reject Account
                                                    </button>
                                                </>
                                            )}
                                            {selectedUser.status === "active" && (
                                                <button
                                                    onClick={() => updateUserStatus(selectedUser.id, "inactive")}
                                                    className="px-4 py-2 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                                                >
                                                    Deactivate Account
                                                </button>
                                            )}
                                            {selectedUser.status === "inactive" && (
                                                <button
                                                    onClick={() => updateUserStatus(selectedUser.id, "active")}
                                                    className="px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors"
                                                >
                                                    Activate Account
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="space-y-6">
                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-soft-dark/60 mb-4">Shipping Address</h3>
                                        {selectedUser.fullName || selectedUser.streetAddress1 ? (
                                            <div className="space-y-3 p-4 bg-zinc-50 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <MapPin size={16} className="text-zinc-400 mt-0.5" />
                                                    <div className="space-y-1">
                                                        {selectedUser.fullName && (
                                                            <p className="text-sm font-bold text-soft-dark">{selectedUser.fullName}</p>
                                                        )}
                                                        {selectedUser.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone size={12} className="text-zinc-400" />
                                                                <p className="text-xs text-soft-dark/60">{selectedUser.phone}</p>
                                                            </div>
                                                        )}
                                                        {selectedUser.streetAddress1 && (
                                                            <p className="text-xs text-soft-dark/60">{selectedUser.streetAddress1}</p>
                                                        )}
                                                        {selectedUser.streetAddress2 && (
                                                            <p className="text-xs text-soft-dark/60">{selectedUser.streetAddress2}</p>
                                                        )}
                                                        {(selectedUser.city || selectedUser.state || selectedUser.zipcode) && (
                                                            <p className="text-xs text-soft-dark/60">
                                                                {[selectedUser.city, selectedUser.state, selectedUser.zipcode].filter(Boolean).join(", ")}
                                                            </p>
                                                        )}
                                                        {selectedUser.country && (
                                                            <p className="text-xs text-soft-dark/60">{selectedUser.country}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-zinc-400 italic">No shipping address provided</p>
                                        )}
                                    </div>

                                    {/* Billing Address */}
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-soft-dark/60 mb-4">Billing Address</h3>
                                        {selectedUser.isBillingSameAsShipping ? (
                                            <p className="text-sm text-zinc-500 italic">Same as shipping address</p>
                                        ) : selectedUser.billingNameOnCard || selectedUser.billingStreetAddress1 ? (
                                            <div className="space-y-3 p-4 bg-zinc-50 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <CreditCard size={16} className="text-zinc-400 mt-0.5" />
                                                    <div className="space-y-1">
                                                        {selectedUser.billingNameOnCard && (
                                                            <p className="text-sm font-bold text-soft-dark">{selectedUser.billingNameOnCard}</p>
                                                        )}
                                                        {selectedUser.billingStreetAddress1 && (
                                                            <p className="text-xs text-soft-dark/60">{selectedUser.billingStreetAddress1}</p>
                                                        )}
                                                        {selectedUser.billingStreetAddress2 && (
                                                            <p className="text-xs text-soft-dark/60">{selectedUser.billingStreetAddress2}</p>
                                                        )}
                                                        {(selectedUser.billingCity || selectedUser.billingState || selectedUser.billingZipcode) && (
                                                            <p className="text-xs text-soft-dark/60">
                                                                {[selectedUser.billingCity, selectedUser.billingState, selectedUser.billingZipcode].filter(Boolean).join(", ")}
                                                            </p>
                                                        )}
                                                        {selectedUser.billingCountry && (
                                                            <p className="text-xs text-soft-dark/60">{selectedUser.billingCountry}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-zinc-400 italic">No billing address provided</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}