export interface ProductMedia {
    id: number;
    media: string;
    type: "image" | "video" | "pdf";
    isExtra: boolean;
    displayOrder: number;
}

export interface ProductPrice {
    id: number;
    price: number;
    userType: "regular" | "professional";
}

export interface ProductBundle {
    id: number;
    productRefId: number;
}

export interface Product {
    id: number;
    uid: string;
    name: string;
    intro: string;
    tag: string;
    productCategory: string;
    description: string;
    additionalInfo: Record<string, string> | null;
    isBundle: boolean;
    isVariant: boolean;
    variantName: string | null;
    variantId: number | null;
    isDefaultVariant: boolean;
    variantCount?: number; // Added for variant indicator
    prices: ProductPrice[];
    media: ProductMedia[];
    bundleItems?: ProductBundle[];
    variants?: Product[];
    color?: string;
}

export interface Category {
    id: number;
    productCategory: string;
    header: string;
    text: string;
    image: string;
}

export interface CartItem {
    id: number;
    cartId?: number;
    productId: number;
    productName: string;
    productSlug: string;
    productImage: string | null;
    regularPrice: number;
    professionalPrice: number | null;
    variantName: string | null;
    color: string | null;
    quantity: number;
    productCategory: string | null;
    isBundle: boolean;
}

export interface Cart {
    id: number;
    userId: number;
    status: string;
    items: CartItem[];
}

// Slug helper
export function makeSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Media URL helper
export const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

export function mediaUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${MEDIA_BASE_URL}${path}`;
}

// Product Grouping
export interface ProductGroup {
    id: number;
    uid: string;
    name: string;
    color: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductGroupWithProducts extends ProductGroup {
    products: Product[];
}
