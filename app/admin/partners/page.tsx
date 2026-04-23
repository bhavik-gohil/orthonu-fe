"use client";

import { useEffect, useState } from "react";
import { apiCall, apiUpload, API_BASE_URL } from "@/lib/api-client";
import { Loader2, Plus, Trash2, ChevronLeft, Handshake } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

interface Partner {
    id: number;
    name: string;
    description: string;
    logo: string | null;
    learnMoreUrl: string | null;
    createdAt: string;
}

export default function PartnersAdmin() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({ name: "", description: "", learnMoreUrl: "" });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");

    const inputCls = "w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const data = await apiCall("GET", "/partners");
            setPartners(data);
        } catch {
            setError("Failed to load partners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPartners(); }, []);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
        if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB"); return; }
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.description.trim()) {
            setError("Name and description are required");
            return;
        }
        try {
            setSubmitting(true);
            setError("");
            const fd = new FormData();
            fd.append("name", form.name.trim());
            fd.append("description", form.description.trim());
            if (form.learnMoreUrl.trim()) fd.append("learnMoreUrl", form.learnMoreUrl.trim());
            if (logoFile) fd.append("logo", logoFile);
            await apiUpload("/admin/partners", fd, "POST");
            setForm({ name: "", description: "", learnMoreUrl: "" });
            setLogoFile(null);
            setLogoPreview("");
            setSuccess("Partner added!");
            setTimeout(() => setSuccess(""), 3000);
            fetchPartners();
        } catch (err: any) {
            setError(err?.response?.data?.error || "Failed to create partner");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this partner?")) return;
        try {
            await apiCall("DELETE", `/admin/partners/${id}`);
            fetchPartners();
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
                <PageHeader title="Partners" eyebrow="About Page" subtitle="Manage partner organizations shown on the About page." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Create Form */}
                <Card padding="medium" className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-soft-dark">Add Partner</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Partner Name *</label>
                            <input type="text" placeholder="e.g. Mari's List" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Description *</label>
                            <textarea rows={4} placeholder="Describe this partner organization..."
                                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                className={`${inputCls} resize-none`} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Learn More URL (optional)</label>
                            <input type="url" placeholder="https://..." value={form.learnMoreUrl}
                                onChange={e => setForm(f => ({ ...f, learnMoreUrl: e.target.value }))} className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Logo (optional)</label>
                            <input type="file" accept="image/*" onChange={handleLogoChange}
                                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-blue file:text-white hover:file:bg-atlantic-blue file:cursor-pointer file:uppercase file:tracking-widest" />
                            {logoPreview && (
                                <div className="w-32 h-16 rounded-xl overflow-hidden border border-zinc-200 mt-2 bg-zinc-50 flex items-center justify-center p-2">
                                    <img src={logoPreview} alt="preview" className="max-w-full max-h-full object-contain" />
                                </div>
                            )}
                        </div>
                        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
                        {success && <p className="text-xs text-emerald-600 font-medium">{success}</p>}
                        <button type="submit" disabled={submitting}
                            className="w-full py-3 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} strokeWidth={3} /> Add Partner</>}
                        </button>
                    </form>
                </Card>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-soft-dark">
                        All Partners ({partners.length})
                    </h3>
                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
                    ) : partners.length === 0 ? (
                        <Card padding="medium" className="text-center py-12">
                            <p className="text-sm text-zinc-400 italic">No partners yet.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {partners.map(p => (
                                <Card key={p.id} padding="medium" className="group hover:border-brand-blue/20 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0 flex items-center justify-center p-1">
                                            {p.logo ? (
                                                <img src={`${API_BASE_URL}${p.logo}`} alt={p.name} className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <Handshake size={20} className="text-zinc-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-soft-dark">{p.name}</p>
                                            <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{p.description}</p>
                                            {p.learnMoreUrl && (
                                                <a href={p.learnMoreUrl} target="_blank" rel="noreferrer"
                                                    className="text-[10px] text-brand-blue font-bold mt-1 inline-block hover:underline">
                                                    Learn More →
                                                </a>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(p.id)}
                                            className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0">
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
