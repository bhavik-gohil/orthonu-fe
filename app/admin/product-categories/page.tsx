"use client";

import { useEffect, useState } from "react";
import { apiCall, apiUpload } from "@/lib/api-client";
import { mediaUrl } from "@/lib/types";
import { Trash2, Plus, Loader2, ChevronLeft, Edit2, X, Save, FolderTree } from "lucide-react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

interface Category {
    id: number;
    productCategory: string;
    header: string;
    text: string;
    image: string;
}

export default function ProductCategoriesAdmin() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        productCategory: "",
        header: "",
        text: "",
        image: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await apiCall("GET", "/product-categories"); // public read
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setError("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            productCategory: "",
            header: "",
            text: "",
            image: ""
        });
        setImageFile(null);
        setImagePreview("");
        setEditingId(null);
        setError("");
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            productCategory: category.productCategory,
            header: category.header,
            text: category.text,
            image: category.image
        });
        setImagePreview(category.image);
        setError("");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please select an image file");
                return;
            }
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError("Image size must be less than 10MB");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.productCategory.trim()) {
            setError("Category name is required");
            return;
        }
        if (!formData.header.trim()) {
            setError("Header is required");
            return;
        }
        if (!formData.text.trim()) {
            setError("Description text is required");
            return;
        }
        if (!editingId && !imageFile) {
            setError("Image is required");
            return;
        }

        try {
            setSubmitting(true);

            let imagePath = formData.image;

            // Upload image if new file selected
            if (imageFile) {
                const formDataUpload = new FormData();
                formDataUpload.append("image", imageFile);
                
                const uploadResponse = await apiUpload("/admin/upload/category-image", formDataUpload, "POST");
                imagePath = uploadResponse.path;
            }

            const payload = {
                productCategory: formData.productCategory.trim(),
                header: formData.header.trim(),
                text: formData.text.trim(),
                image: imagePath
            };

            if (editingId) {
                await apiCall("PATCH", `/admin/product-categories/${editingId}`, payload);
            } else {
                await apiCall("POST", "/admin/product-categories", payload);
            }

            resetForm();
            fetchCategories();
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.response?.data?.error || "Failed to save category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this category? This cannot be undone.")) return;
        
        try {
            await apiCall("DELETE", `/admin/product-categories/${id}`);
            fetchCategories();
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.response?.data?.error || "Failed to delete category");
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <div className="space-y-4">
                <button 
                    onClick={() => window.history.back()} 
                    className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue mb-2 transition-colors group text-xs font-bold uppercase tracking-widest"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    Dashboard
                </button>
                <PageHeader
                    title="Product Categories"
                    eyebrow="Taxonomy"
                    subtitle="Organize your shop collection with headers, descriptions, and banner images."
                />
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Create/Edit Form */}
                <Card className="lg:col-span-1" padding="medium">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-soft-dark mb-1">
                                    {editingId ? "Edit Category" : "New Category"}
                                </h3>
                                <p className="text-xs text-soft-dark/40 font-medium">
                                    {editingId ? "Update category details" : "Add a new product grouping"}
                                </p>
                            </div>
                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="text-xs text-zinc-400 hover:text-soft-dark flex items-center gap-1 font-bold uppercase tracking-widest"
                                >
                                    <X size={14} /> Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500">Category Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Detect"
                                    value={formData.productCategory}
                                    onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                                    className="w-full px-4 py-3 border border-zinc-100 rounded-xl bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500">Header Text *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Early Detection Solutions"
                                    value={formData.header}
                                    onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                                    className="w-full px-4 py-3 border border-zinc-100 rounded-xl bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500">Description *</label>
                                <textarea
                                    placeholder="Describe this category..."
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-zinc-100 rounded-xl bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500">
                                    Banner Image * {editingId && "(Leave empty to keep current)"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-blue file:text-white hover:file:bg-atlantic-blue file:cursor-pointer cursor-pointer file:uppercase file:tracking-widest"
                                />
                                {imagePreview && (
                                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-zinc-200 mt-3">
                                        <img
                                            src={imagePreview.startsWith('blob:') ? imagePreview : mediaUrl(imagePreview)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                    <p className="text-xs text-rose-600 font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : editingId ? (
                                    <><Save size={16} strokeWidth={3} /> Update Category</>
                                ) : (
                                    <><Plus size={16} strokeWidth={3} /> Create Category</>
                                )}
                            </button>
                        </form>
                    </div>
                </Card>

                {/* Categories List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-soft-dark">
                            All Categories ({categories.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-brand-blue" size={32} />
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {categories.map((category) => (
                                <Card 
                                    key={category.id} 
                                    className="group hover:border-brand-blue/30 transition-all" 
                                    padding="small"
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            {category.image && (
                                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 shrink-0">
                                                    <img
                                                        src={mediaUrl(category.image)}
                                                        alt={category.productCategory}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                                                        <FolderTree size={14} />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-soft-dark uppercase tracking-tight">
                                                        {category.productCategory}
                                                    </h4>
                                                </div>
                                                <p className="text-xs font-semibold text-brand-blue">
                                                    {category.header}
                                                </p>
                                                <p className="text-xs text-zinc-600 line-clamp-2">
                                                    {category.text}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-brand-blue bg-white border border-brand-blue/20 rounded-lg hover:bg-brand-blue/5 transition-all"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="px-3 py-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-sm text-soft-dark/40 font-medium">
                                No categories found. Start by creating one.
                            </p>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
