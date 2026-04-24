"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    Layers,
    Package,
    Search,
    Loader2,
    ChevronRight,
} from "lucide-react";
import { apiCall } from "@/lib/api-client";
import type { ProductGroup, Product } from "@/lib/types";
import { mediaUrl, makeSlug } from "@/lib/types";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function ColorSwatch({ color }: { color: string | null }) {
    if (!color) return <span className="text-zinc-300 text-xs italic">no color</span>;
    return (
        <span className="inline-flex items-center gap-1.5">
            <span
                className="inline-block w-4 h-4 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: color }}
            />
            <span className="text-xs text-zinc-500 font-mono">{color}</span>
        </span>
    );
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface ColorItem {
    id: number;
    color: string;
    colorName: string;
}

interface GroupItem {
    id: number;
    groupName: string;
    productId: number;
    product: Product | null;
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function ProductGroupsPage() {
    // ── State ──────────────────────────────────────────────
    const [groups, setGroups] = useState<ProductGroup[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    const [selectedGroup, setSelectedGroup] = useState<ProductGroup | null>(null);
    const [items, setItems] = useState<GroupItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productSearch, setProductSearch] = useState("");

    // Create group form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    // Edit group inline
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("");
    const [saving, setSaving] = useState(false);

    const [addingProduct, setAddingProduct] = useState(false);
    const [confirmDeleteGroupId, setConfirmDeleteGroupId] = useState<number | null>(null);
    const [confirmDeleteItemId, setConfirmDeleteItemId] = useState<number | null>(null);

    const [colors, setColors] = useState<ColorItem[]>([]);

    // ── Data Fetching ──────────────────────────────────────
    const fetchGroups = useCallback(async () => {
        setLoadingGroups(true);
        try {
            const data: ProductGroup[] = await apiCall("GET", "admin/product-groups");
            setGroups(data);
        } catch {
            setGroups([]);
        } finally {
            setLoadingGroups(false);
        }
    }, []);

    const fetchItems = useCallback(async (group: ProductGroup) => {
        setLoadingItems(true);
        try {
            const data: GroupItem[] = await apiCall(
                "GET",
                `admin/product-groups/${encodeURIComponent(group.name)}/items`
            );
            setItems(data);
        } catch {
            setItems([]);
        } finally {
            setLoadingItems(false);
        }
    }, []);

    const fetchAllProducts = useCallback(async () => {
        if (allProducts.length > 0) return;
        setLoadingProducts(true);
        try {
            const data: Product[] = await apiCall("GET", "admin/products");
            setAllProducts(data);
        } catch {
            setAllProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    }, [allProducts.length]);

    useEffect(() => {
        const init = async () => {
            fetchGroups();
            try {
                const colorsData = await apiCall("GET", "/colors");
                setColors(colorsData);
            } catch {
                /* ignore */
            }
        };
        init();
    }, [fetchGroups]);

    const selectGroup = (group: ProductGroup) => {
        setSelectedGroup(group);
        setEditingGroupId(null);
        setProductSearch("");
        fetchItems(group);
        fetchAllProducts();
    };

    // ── CRUD: Groups ───────────────────────────────────────
    const handleCreateGroup = async () => {
        if (!newName.trim()) return;
        setCreating(true);
        setCreateError("");
        try {
            const created: ProductGroup = await apiCall("POST", "admin/product-groups", {
                name: newName.trim(),
                color: newColor.trim() || null,
            });
            setGroups((prev) => [...prev, created]);
            setNewName("");
            setNewColor("");
            setShowCreateForm(false);
        } catch (err: any) {
            setCreateError(err?.message || "Failed to create group.");
        } finally {
            setCreating(false);
        }
    };

    const startEdit = (group: ProductGroup) => {
        setEditingGroupId(group.id);
        setEditName(group.name);
        setEditColor(group.color || "");
    };

    const handleSaveEdit = async (group: ProductGroup) => {
        setSaving(true);
        try {
            const updated: ProductGroup = await apiCall(
                "PUT",
                `admin/product-groups/${group.id}`,
                { name: editName.trim(), color: editColor.trim() || null }
            );
            setGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
            if (selectedGroup?.id === updated.id) setSelectedGroup(updated);
            setEditingGroupId(null);
        } catch {
            /* ignore */
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGroup = async (group: ProductGroup) => {
        try {
            await apiCall("DELETE", `admin/product-groups/${group.id}`);
            setGroups((prev) => prev.filter((g) => g.id !== group.id));
            if (selectedGroup?.id === group.id) {
                setSelectedGroup(null);
                setItems([]);
            }
        } catch {
            /* ignore */
        } finally {
            setConfirmDeleteGroupId(null);
        }
    };

    // ── CRUD: Items ────────────────────────────────────────
    const handleAddProduct = async (product: Product) => {
        if (!selectedGroup) return;
        setAddingProduct(true);
        try {
            await apiCall(
                "POST",
                `admin/product-groups/${encodeURIComponent(selectedGroup.name)}/items`,
                { productId: product.id }
            );
            await fetchItems(selectedGroup);
            setProductSearch("");
        } catch {
            /* ignore — likely duplicate */
        } finally {
            setAddingProduct(false);
        }
    };

    const handleRemoveItem = async (item: GroupItem) => {
        try {
            await apiCall("DELETE", `admin/product-groups/items/${item.id}`);
            setItems((prev) => prev.filter((i) => i.id !== item.id));
        } catch {
            /* ignore */
        } finally {
            setConfirmDeleteItemId(null);
        }
    };

    // ── Derived ────────────────────────────────────────────
    const addedProductIds = new Set(items.map((i) => i.productId));
    const filteredProducts = allProducts.filter(
        (p) =>
            !addedProductIds.has(p.id) &&
            (productSearch === "" ||
                p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.productCategory?.toLowerCase().includes(productSearch.toLowerCase()))
    );

    // ─────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────
    return (
        <Section>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <Layers size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-black text-soft-dark">Product Collections</h1>
                    <p className="text-sm text-soft-dark/40 mt-0.5">
                        Group products into named collections to display on the home page.
                    </p>
                </div>
                <Link href="/admin" className="text-sm font-bold text-brand-blue hover:underline hidden sm:block">
                    ← Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* ── Left: Group List ───────────────────── */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Create button */}
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-soft-dark/40">
                            Collections ({groups.length})
                        </p>
                        <button
                            onClick={() => {
                                setShowCreateForm(!showCreateForm);
                                setCreateError("");
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:bg-brand-blue/5 px-3 py-1.5 rounded-xl transition-all duration-200"
                        >
                            <Plus size={14} /> New Collection
                        </button>
                    </div>

                    {/* Create form */}
                    {showCreateForm && (
                        <Card className="p-4! space-y-3" padding="none">
                            <p className="text-xs font-black text-soft-dark">New Collection</p>
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Collection name…"
                                className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                            />
                            <div className="relative">
                                <select
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 cursor-pointer"
                                >
                                    <option value="">No Color (Optional)</option>
                                    {colors.map((c) => (
                                        <option key={c.id} value={c.color}>
                                            {c.colorName}
                                        </option>
                                    ))}
                                </select>
                                    <div
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-6 rounded-md border border-zinc-200"
                                        style={{ backgroundColor: newColor || "transparent" }}
                                    />
                            </div>
                            {createError && <p className="text-xs text-red-500">{createError}</p>}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={creating || !newName.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white text-xs font-bold py-2 rounded-xl hover:bg-brand-blue/90 disabled:opacity-60 transition-all"
                                >
                                    {creating ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-50 transition-all"
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        </Card>
                    )}

                    {/* Group list */}
                    {loadingGroups ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-brand-blue" size={24} />
                        </div>
                    ) : groups.length === 0 ? (
                        <p className="text-sm text-zinc-400 text-center py-10">
                            No collections yet. Create your first one ↑
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {groups.map((group) => (
                                <Card
                                    key={group.id}
                                    className={`cursor-pointer transition-all duration-200 ${selectedGroup?.id === group.id
                                        ? "border-brand-blue/40 shadow-md shadow-brand-blue/10"
                                        : "hover:border-zinc-300"
                                        }`}
                                    padding="none"
                                >
                                    {editingGroupId === group.id ? (
                                        /* Edit mode */
                                        <div className="p-3 space-y-2">
                                            <input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                                            />
                                            <div className="relative">
                                                <select
                                                    value={editColor}
                                                    onChange={(e) => setEditColor(e.target.value)}
                                                    className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-1.5 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 cursor-pointer"
                                                >
                                                    <option value="">No Color (Optional)</option>
                                                    {colors.map((c) => (
                                                        <option key={c.id} value={c.color}>
                                                            {c.colorName}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-5 rounded-md border border-zinc-200"
                                                    style={{ backgroundColor: editColor || "transparent" }}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveEdit(group)}
                                                    disabled={saving}
                                                    className="flex-1 flex items-center justify-center gap-1.5 bg-brand-blue text-white text-xs font-bold py-1.5 rounded-xl hover:bg-brand-blue/90 disabled:opacity-60 transition-all"
                                                >
                                                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingGroupId(null)}
                                                    className="px-3 text-xs text-zinc-400 hover:text-zinc-600 rounded-xl hover:bg-zinc-50 transition-all"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* View mode */
                                        <div
                                            className="p-3 flex items-center gap-2"
                                            onClick={() => selectGroup(group)}
                                        >
                                            {/* Color accent bar */}
                                            <div
                                                className="w-1 self-stretch rounded-full shrink-0"
                                                style={{ backgroundColor: group.color || "#E5E7EB" }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-soft-dark truncate">{group.name}</p>
                                                <ColorSwatch color={group.color} />
                                            </div>
                                            {selectedGroup?.id === group.id && (
                                                <ChevronRight size={14} className="text-brand-blue shrink-0" />
                                            )}
                                            {/* Actions */}
                                            <div
                                                className="flex items-center gap-1 ml-auto"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => startEdit(group)}
                                                    className="p-1.5 text-zinc-400 hover:text-brand-blue rounded-lg hover:bg-brand-blue/5 transition-all"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                {confirmDeleteGroupId === group.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleDeleteGroup(group)}
                                                            className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 transition-all"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDeleteGroupId(null)}
                                                            className="p-1 text-zinc-400 hover:text-zinc-600 transition-all"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDeleteGroupId(group.id)}
                                                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right: Group Products ──────────────── */}
                <div className="lg:col-span-3">
                    {!selectedGroup ? (
                        <Card className="flex flex-col items-center justify-center py-20 text-center" padding="medium">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 mb-4">
                                <Layers size={32} />
                            </div>
                            <p className="text-sm font-bold text-soft-dark/40">
                                Select a collection to manage its products
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {/* Section header */}
                            <div className="flex items-center gap-2 mb-1">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: selectedGroup.color || "#E5E7EB" }}
                                />
                                <p className="text-base font-black text-soft-dark">{selectedGroup.name}</p>
                                <span className="text-xs text-zinc-400">— {items.length} product{items.length !== 1 ? "s" : ""}</span>
                            </div>

                            {/* Current products */}
                            {loadingItems ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="animate-spin text-brand-blue" size={20} />
                                </div>
                            ) : items.length === 0 ? (
                                <p className="text-sm text-zinc-400 py-4">
                                    No products in this collection yet. Add some below.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {items.map((item) => {
                                        const product = item.product;
                                        const mainImg = product?.media?.find(
                                            (m) => m.type === "image" && !m.isExtra
                                        );
                                        const imgSrc = mainImg ? mediaUrl(mainImg.media) : null;
                                        return (
                                            <Card key={item.id} className="flex items-center gap-3" padding="none">
                                                <div className="p-3 flex items-center gap-3 flex-1 min-w-0">
                                                    {imgSrc ? (
                                                        <img
                                                            src={imgSrc}
                                                            alt={product?.name}
                                                            className="w-10 h-10 object-contain rounded-xl bg-zinc-50 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 text-zinc-300">
                                                            <Package size={16} />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-soft-dark truncate">
                                                            {product?.name ?? `Product #${item.productId}`}
                                                        </p>
                                                        <p className="text-xs text-zinc-400 truncate">
                                                            {product?.productCategory ?? "—"}
                                                        </p>
                                                    </div>
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        {confirmDeleteItemId === item.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleRemoveItem(item)}
                                                                    className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100"
                                                                >
                                                                    Remove
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmDeleteItemId(null)}
                                                                    className="p-1 text-zinc-400"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setConfirmDeleteItemId(item.id)}
                                                                className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Product picker */}
                            <div className="border-t border-zinc-100 pt-4 space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-soft-dark/40">
                                    Add Products
                                </p>
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        placeholder="Search by name or category…"
                                        className="w-full text-sm border border-zinc-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                                    />
                                </div>

                                {loadingProducts ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="animate-spin text-brand-blue" size={18} />
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <p className="text-xs text-zinc-400 text-center py-4">
                                        {productSearch ? "No matching products." : "All products already added."}
                                    </p>
                                ) : (
                                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                                        {filteredProducts.map((product) => {
                                            const mainImg = product?.media?.find(
                                                (m) => m.type === "image" && !m.isExtra
                                            );
                                            const imgSrc = mainImg ? mediaUrl(mainImg.media) : null;
                                            return (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer group border border-transparent hover:border-zinc-200"
                                                    onClick={() => !addingProduct && handleAddProduct(product)}
                                                >
                                                    {imgSrc ? (
                                                        <img
                                                            src={imgSrc}
                                                            alt={product.name}
                                                            className="w-8 h-8 object-contain rounded-lg bg-zinc-100 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-300 shrink-0">
                                                            <Package size={13} />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-soft-dark truncate">{product.name}</p>
                                                        <p className="text-[10px] text-zinc-400 truncate">{product.productCategory}</p>
                                                    </div>
                                                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-brand-blue bg-brand-blue/8 px-2 py-1 rounded-lg">
                                                            <Plus size={10} /> Add
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}
