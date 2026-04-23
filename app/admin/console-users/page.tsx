"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api-client";
import { Loader2, UserPlus, Shield, Trash2, X, ChevronLeft, Key } from "lucide-react";
import Link from "next/link";

interface AdminUser {
    id: number;
    uid: string;
    name: string;
    email: string;
    userType: string;
    status: string;
    createdAt: string;
}

import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export default function ManageUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserType, setNewUserType] = useState<"editor" | "order_manager">("editor");
    const [creating, setCreating] = useState(false);
    const [snack, setSnack] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await apiCall("GET", "/admin/users");
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreating(true);
            await apiCall("POST", "/admin/user/create", {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                userType: newUserType
            });
            setSnack({ type: "success", text: "User created successfully!" });
            setShowCreate(false);
            setNewUserName("");
            setNewUserEmail("");
            setNewUserPassword("");
            fetchUsers();
        } catch (err: any) {
            setSnack({ type: "error", text: err?.response?.data?.message || "Failed to create user." });
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
                <p className="text-sm text-zinc-400 animate-pulse">Loading console staff…</p>
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
                        title="Console Staff"
                        eyebrow="Users"
                        subtitle="Manage system administrators and their operational permissions."
                    />
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-atlantic-blue transition-all"
                >
                    <UserPlus size={18} />
                    <span>New Administrator</span>
                </button>
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
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Administrator</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Role</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Joined</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-soft-dark/40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {users.map((user) => (
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
                                        <Shield size={12} />
                                        {user.userType.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                                        <span className="text-xs font-bold text-soft-dark/60 capitalize">{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-xs text-soft-dark/40 font-bold">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 text-zinc-300 hover:text-rose-500 transition-colors cursor-pointer">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Create User Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-soft-dark/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300" padding="none">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
                            <h2 className="text-sm font-black uppercase tracking-widest text-soft-dark">Add New Staff</h2>
                            <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer">
                                <X size={20} className="text-zinc-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUserName}
                                        onChange={e => setNewUserName(e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUserEmail}
                                        onChange={e => setNewUserEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                        placeholder="admin@orthonu.com"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Credentials</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                                        <input
                                            type="password"
                                            required
                                            value={newUserPassword}
                                            onChange={e => setNewUserPassword(e.target.value)}
                                            className="w-full pl-12 pr-6 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                            placeholder="Initial password"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assigned Role</label>
                                    <select
                                        value={newUserType}
                                        onChange={(e) => setNewUserType(e.target.value as any)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 cursor-pointer"
                                    >
                                        <option value="editor">Editor</option>
                                        <option value="order_manager">Order Manager</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full py-4 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? <Loader2 className="animate-spin" size={16} /> : "Create Staff Member"}
                            </button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
