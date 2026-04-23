"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api-client";
import { Loader2, Plus, Trash2, ChevronLeft, Quote } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

interface Testimonial {
    id: number;
    text: string;
    by: string;
    createdAt: string;
}

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({ text: "", by: "" });

    const inputCls = "w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const data = await apiCall("GET", "/testimonials");
            setTestimonials(data);
        } catch {
            setError("Failed to load testimonials");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.text.trim() || !form.by.trim()) {
            setError("Both fields are required");
            return;
        }
        try {
            setSubmitting(true);
            setError("");
            await apiCall("POST", "/admin/testimonials", form);
            setForm({ text: "", by: "" });
            setSuccess("Testimonial added!");
            setTimeout(() => setSuccess(""), 3000);
            fetchTestimonials();
        } catch (err: any) {
            setError(err?.response?.data?.error || "Failed to create testimonial");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this testimonial?")) return;
        try {
            await apiCall("DELETE", `/admin/testimonials/${id}`);
            fetchTestimonials();
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
                <PageHeader title="Testimonials" eyebrow="About Page" subtitle="Manage customer and professional testimonials shown on the About page." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Create Form */}
                <Card padding="medium" className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-soft-dark">Add Testimonial</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Quote *</label>
                            <textarea
                                rows={5}
                                placeholder="What they said..."
                                value={form.text}
                                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                                className={`${inputCls} resize-none`}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500">Attribution *</label>
                            <input
                                type="text"
                                placeholder="e.g. Dr. Jane Smith, ABC Orthodontics"
                                value={form.by}
                                onChange={e => setForm(f => ({ ...f, by: e.target.value }))}
                                className={inputCls}
                                required
                            />
                        </div>
                        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
                        {success && <p className="text-xs text-emerald-600 font-medium">{success}</p>}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} strokeWidth={3} /> Add Testimonial</>}
                        </button>
                    </form>
                </Card>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-soft-dark">
                        All Testimonials ({testimonials.length})
                    </h3>
                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
                    ) : testimonials.length === 0 ? (
                        <Card padding="medium" className="text-center py-12">
                            <p className="text-sm text-zinc-400 italic">No testimonials yet.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                            {testimonials.map(t => (
                                <Card key={t.id} padding="medium" className="group hover:border-brand-blue/20 transition-all">
                                    <div className="flex items-start gap-3">
                                        <Quote size={18} className="text-brand-blue/30 shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-2">
                                            <p className="text-sm text-soft-dark/80 leading-relaxed italic">{t.text}</p>
                                            <p className="text-xs font-bold text-brand-blue">— {t.by}</p>
                                            <p className="text-[10px] text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
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
