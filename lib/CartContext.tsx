"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CartItem } from "./types";
import { apiCall } from "./api-client";
import { useAuth } from "./AuthContext";

const CART_STORAGE_KEY = "orthonu_cart_items";

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    cartTotal: number;
    addItem: (productId: number, quantity?: number) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const CartContext = createContext<CartContextType>({
    items: [],
    totalItems: 0,
    cartTotal: 0,
    addItem: async () => { },
    removeItem: async () => { },
    updateQuantity: async () => { },
    loading: false,
    error: null,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Helper: Get price for user type
    const getPrice = useCallback((item: CartItem): number => {
        const userType = user?.userType || "regular";
        if (userType === "professional" && item.professionalPrice) {
            return Number(item.professionalPrice);
        }
        return Number(item.regularPrice) ?? 0;
    }, [user]);

    // Helper: Calculate line total
    const calculateLineTotal = useCallback((item: CartItem): number => {
        const price = getPrice(item);
        return price * item.quantity;
    }, [getPrice]);

    // Computed: Cart total
    const cartTotal = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + calculateLineTotal(item);
        }, 0);
    }, [items, calculateLineTotal]);

    // Persist cart to localStorage (guest only)
    const persistToLocalStorage = useCallback((newItems: CartItem[]) => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
        } catch (err) {
            console.error("Failed to save cart to localStorage:", err);
        }
    }, []);

    // Load cart
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                setLoading(true);
                try {
                    const data = await apiCall("GET", `/cart?userId=${user.id}`);
                    setItems(data.items || []);
                } catch (err) {
                    console.error("Failed to load backend cart:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                const stored = localStorage.getItem(CART_STORAGE_KEY);
                if (stored) {
                    try {
                        setItems(JSON.parse(stored));
                    } catch (e) {
                        setItems([]);
                    }
                }
            }
        };
        loadCart();
    }, [user]);

    // Sync localStorage cart to backend on login
    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                let guestItems = [];
                try {
                    guestItems = JSON.parse(stored);
                } catch (e) { }

                if (guestItems.length > 0) {
                    const sync = async () => {
                        for (const item of guestItems) {
                            try {
                                await apiCall("POST", "/cart/add", {
                                    userId: user.id,
                                    productId: item.productId,
                                    quantity: item.quantity
                                });
                            } catch (err) {
                                console.error("Failed to sync item:", item, err);
                            }
                        }
                        localStorage.removeItem(CART_STORAGE_KEY);
                        // Reload cart from backend
                        const data = await apiCall("GET", `/cart?userId=${user.id}`);
                        setItems(data.items || []);
                    };
                    sync();
                }
            }
        }
    }, [user]);

    const addItem = useCallback(async (productId: number, quantity = 1) => {
        setLoading(true);
        setError(null);
        try {
            if (user) {
                await apiCall("POST", "/cart/add", { userId: user.id, productId, quantity });
                const data = await apiCall("GET", `/cart?userId=${user.id}`);
                setItems(data.items || []);
            } else {
                // Guest: fetch product info from public shop endpoint to build cart item snapshot
                const allProducts = await apiCall("GET", "/shop/products");
                const product = allProducts.find((p: any) => p.id === productId);
                if (!product) throw new Error("Product not found");

                const regularPrice = product.prices?.find((p: any) => p.userType === "regular")?.price ?? 0;
                const professionalPrice = product.prices?.find((p: any) => p.userType === "professional")?.price ?? null;
                const mainImage = product.media?.filter((m: any) => !m.isExtra).sort((a: any, b: any) => a.displayOrder - b.displayOrder)[0]?.media ?? null;

                setItems(prev => {
                    const existing = prev.find(i => i.productId === productId);
                    let updated: CartItem[];
                    if (existing) {
                        updated = prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
                    } else {
                        updated = [...prev, {
                            id: Date.now(),
                            productId,
                            quantity,
                            productName: product.name,
                            productSlug: product.uid,  // use uid as slug reference
                            productImage: mainImage,
                            regularPrice,
                            professionalPrice,
                            variantName: product.variantName ?? null,
                            color: product.color ?? null,
                            productCategory: product.productCategory ?? null,
                            isBundle: product.isBundle ?? false,
                        } as CartItem];
                    }
                    persistToLocalStorage(updated);
                    return updated;
                });
            }
        } catch (err) {
            console.error("Add to cart failed:", err);
            setError("Failed to add item to cart.");
        } finally {
            setLoading(false);
        }
    }, [user, persistToLocalStorage]);

    const removeItem = useCallback(async (cartItemId: number) => {
        setLoading(true);
        try {
            if (user) {
                await apiCall("DELETE", `/cart/item/${cartItemId}`);
                const data = await apiCall("GET", `/cart?userId=${user.id}`);
                setItems(data.items || []);
            } else {
                setItems(prev => {
                    const updated = prev.filter(i => i.id !== cartItemId);
                    persistToLocalStorage(updated);
                    return updated;
                });
            }
        } catch (err) {
            console.error("Remove from cart failed:", err);
        } finally {
            setLoading(false);
        }
    }, [user, persistToLocalStorage]);

    const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
        if (quantity < 1) return;
        setLoading(true);
        try {
            if (user) {
                await apiCall("PATCH", `/cart/item/${cartItemId}`, { quantity });
                const data = await apiCall("GET", `/cart?userId=${user.id}`);
                setItems(data.items || []);
            } else {
                setItems(prev => {
                    const updated = prev.map(i => i.id === cartItemId ? { ...i, quantity } : i);
                    persistToLocalStorage(updated);
                    return updated;
                });
            }
        } catch (err) {
            console.error("Update quantity failed:", err);
        } finally {
            setLoading(false);
        }
    }, [user, persistToLocalStorage]);

    return (
        <CartContext.Provider value={{
            items,
            totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
            cartTotal,
            addItem,
            removeItem,
            updateQuantity,
            loading,
            error,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
