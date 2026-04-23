"use client";

import { useEffect, useState } from "react";
import { apiCall, apiUpload, API_BASE_URL } from "@/lib/api-client";
import { Loader2, Plus, Trash2, ChevronLeft, User } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

interface BoardMember {
    id: number;
    name: string;
    position: string;
    image: string | null;
    createdAt: string;
}

export default function BoardMembersAdmin() {
    const [members, setMembers] = useState<BoardMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({ name: "", position: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const inputCls = "w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await apiCall("GET", "/board-members");
            setMembers(data);
        } catch {
            setError("Failed to load board members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
        if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB"); return; }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.position.trim()) {
            setError("Name and position are required");
            return;
        }
        try {
            setSubmitting(true);
            setError("");
            const fd = new FormData();
            fd.append("name", form.name.trim());
            fd.append("position", form.position.trim());
            if (imageFile) fd.append("image", imageFile);
            await apiUpload("/admin/board-members", fd, "POST");
            setForm({ name: "", position: "" });
            setImageFile(null);
            setImagePreview("");
            setSuccess("Board member added!");
            setTimeout(() => setSuccess(""), 3000);
            fetchMembers();
        } catch (err: any) {
            setError(err?.response?.data?.error || "Failed to create board member");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this board member?")) return;
        try {
            await apiCall("DELETE", `/admin/board-members/${id}`);
            fetchMembers();
        } catch {
            setError("Failed to delete");
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors group text-xs font-bold uppercase tracking-widest">
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    Dashboard
                </button>
                <PageHeader title="Board Members" eyebrow="About Page" subtitle="Manage advisory board members shown on the About page." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Create Form */}
                <Card padding="medium" className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-soft-dark">Add Board Member</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Full Name *</label>
                            <input type="text" placeholder="e.g. Dr. Jane Smith" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Position / Title *</label>
                            <input type="text" placeholder="e.g. Chief Orthodontic Advisor" value={form.position}
                                onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className={inputCls} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Photo (optional)</label>
                            <input type="file" accept="image/*" onChange={handleImageChange}
                                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-blue file:text-white hover:file:bg-atlantic-blue file:cursor-pointer file:uppercase file:tracking-widest" />
                            {imagePreview && (
                                <div className="w-24 h-24 rounded-xl overflow-hidden border border-zinc-200 mt-2">
                                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
                        {success && <p className="text-xs text-emerald-600 font-medium">{success}</p>}
                        <button type="submit" disabled={submitting}
                            className="w-full py-3 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} strokeWidth={3} /> Add Member</>}
                        </button>
                    </form>
                </Card>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-soft-dark">
                        All Members ({members.length})
                    </h3>
                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
                    ) : members.length === 0 ? (
                        <Card padding="medium" className="text-center py-12">
                            <p className="text-sm text-zinc-400 italic">No board members yet.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {members.map(m => (
                                <Card key={m.id} padding="medium" className="group hover:border-brand-blue/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                                            {m.image ? (
                                                <img src={`${API_BASE_URL}${m.image}`} alt={m.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                    <User size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-soft-dark">{m.name}</p>
                                            <p className="text-xs text-brand-blue font-medium">{m.position}</p>
                                        </div>
                                        <button onClick={() => handleDelete(m.id)}
                                            className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
