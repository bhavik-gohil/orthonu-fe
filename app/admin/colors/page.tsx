"use client";

import { useState, useEffect } from "react";
import { apiCall } from "@/lib/api-client";
import { Trash2, Plus, Loader2, ChevronLeft, Hash } from "lucide-react";
import Link from "next/link";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface Color {
    id: number;
    color: string;
    colorName: string;
}

export default function ColorsPage() {
    const [colors, setColors] = useState<Color[]>([]);
    const [newColor, setNewColor] = useState("");
    const [newColorName, setNewColorName] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const fetchColors = async () => {
        try {
            setLoading(true);
            const data = await apiCall("GET", "/colors");
            setColors(data);
        } catch (err) {
            setError("Failed to fetch colors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    const handleAddColor = async (e: React.FormEvent) => {
        e.preventDefault();

        let formattedColor = newColor.trim();
        if (formattedColor && !formattedColor.startsWith("#")) {
            formattedColor = "#" + formattedColor;
        }

        if (!formattedColor || (formattedColor.length !== 4 && formattedColor.length !== 7)) {
            setError("Please enter a valid hex color (e.g. #7BD2F6)");
            return;
        }

        if (!newColorName.trim()) {
            setError("Please enter a color name");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            await apiCall("POST", "/admin/colors", {
                color: formattedColor,
                colorName: newColorName.trim()
            });
            setNewColor("");
            setNewColorName("");
            fetchColors();
        } catch (err) {
            setError("Failed to add color");
        } finally {
            setSubmitting(false);
        }
    };

    const handleColorChange = (value: string) => {
        if (value && !value.startsWith("#") && !newColor.startsWith("#")) {
            setNewColor("#" + value);
        } else {
            setNewColor(value);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this color?")) return;
        try {
            await apiCall("DELETE", `/admin/colors/${id}`);
            fetchColors();
        } catch (err) {
            setError("Failed to delete color");
        }
    };

    return (
        <Section className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin"
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-soft-dark tracking-tight">Brand Colors</h1>
                    <p className="text-sm text-soft-dark/50">Manage the product color system</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Color Form */}
                <Card className="space-y-6 self-start">
                    <h2 className="text-sm font-bold text-soft-dark uppercase tracking-wider">Add New Color</h2>
                    <form onSubmit={handleAddColor} className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500">Color Name</label>
                                <Input
                                    value={newColorName}
                                    onChange={(v) => setNewColorName(v)}
                                    placeholder="e.g. Ortho Blue"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500">Hex Value</label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            icon={<Hash size={18} />}
                                            value={newColor}
                                            onChange={handleColorChange}
                                            placeholder="#000000"
                                            required
                                        />
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-xl border border-zinc-100 shadow-sm transition-colors duration-300"
                                        style={{ backgroundColor: newColor || "#FFFFFF" }}
                                        title="Live Preview"
                                    />
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
                        <Button
                            type="submit"
                            loading={submitting}
                            fullWidth
                            variant="primary"
                            icon={<Plus size={16} />}
                        >
                            Create Color
                        </Button>
                    </form>
                </Card>

                {/* Colors List */}
                <Card className="space-y-6">
                    <h2 className="text-sm font-bold text-soft-dark uppercase tracking-wider">Existing Colors</h2>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="animate-spin text-brand-blue" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {colors.map((color) => (
                                <div
                                    key={color.id}
                                    className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:border-brand-blue/20 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-xl shadow-sm border border-white"
                                            style={{ backgroundColor: color.color }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-soft-dark uppercase tracking-tight">{color.colorName}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">{color.color}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(color.id)}
                                        className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {colors.length === 0 && !loading && (
                                <p className="text-center py-12 text-zinc-400 text-sm italic">No colors added yet.</p>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </Section>
    );
}
