"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { apiCall } from "@/lib/api-client";
import { mediaUrl } from "@/lib/types";
import {
  ShoppingBag,
  ChevronLeft,
  Tag,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
  Ticket,
  MapPin,
  Pencil,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidatedCoupon {
  id: number;
  discountName: string;
  discountPercentage: number;
  maxDiscountAmount: number | null;
  header: string;
  subHeader: string | null;
}

interface AdvertisedCoupon {
  id: number;
  discountName: string;
  discountPercentage: number;
  maxDiscountAmount: number | null;
  header: string;
  subHeader: string | null;
}

interface AddressForm {
  fullName: string;
  phone: string;
  streetAddress1: string;
  streetAddress2: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
}

interface BillingForm {
  billingNameOnCard: string;
  billingStreetAddress1: string;
  billingStreetAddress2: string;
  billingZipcode: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcDiscount(subtotal: number, coupon: ValidatedCoupon): number {
  const raw = (subtotal * coupon.discountPercentage) / 100;
  if (coupon.maxDiscountAmount != null) {
    return Math.min(raw, coupon.maxDiscountAmount);
  }
  return raw;
}

const inputCls =
  "w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm text-soft-dark placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

const emptyAddress: AddressForm = {
  fullName: "",
  phone: "",
  streetAddress1: "",
  streetAddress2: "",
  zipcode: "",
  city: "",
  state: "",
  country: "",
};

const emptyBilling: BillingForm = {
  billingNameOnCard: "",
  billingStreetAddress1: "",
  billingStreetAddress2: "",
  billingZipcode: "",
  billingCity: "",
  billingState: "",
  billingCountry: "",
};

function hasAddress(u: any): boolean {
  return !!(u?.streetAddress1 && u?.city && u?.zipcode);
}

// ─── ZipInput component ───────────────────────────────────────────────────────

function ZipInput({
  value,
  onChange,
  onResolved,
}: {
  value: string;
  onChange: (v: string) => void;
  onResolved: (city: string, state: string, country: string) => void;
}) {
  const [zipError, setZipError] = useState("");
  const [zipLoading, setZipLoading] = useState(false);

  const handleBlur = async () => {
    const zip = value.trim();
    if (!zip || zip.length < 5) return;
    setZipLoading(true);
    setZipError("");
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) {
        setZipError("Invalid ZIP code. Please check and try again.");
        return;
      }
      const data = await res.json();
      const place = data.places?.[0];
      if (place) {
        onResolved(place["place name"], place["state"], data.country);
      }
    } catch {
      setZipError("Could not validate ZIP code.");
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          placeholder="ZIP Code"
          value={value}
          maxLength={10}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          className={inputCls}
        />
        {zipLoading && (
          <Loader2
            size={14}
            className="animate-spin text-brand-blue absolute right-3 top-1/2 -translate-y-1/2"
          />
        )}
      </div>
      {zipError && (
        <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {zipError}
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, totalItems, loading: cartLoading } = useCart();
  const { user, refreshUser } = useAuth();

  // ── Address state ──────────────────────────────────────────────────────────
  const [editingShipping, setEditingShipping] = useState(false);
  const [shippingForm, setShippingForm] = useState<AddressForm>(emptyAddress);
  const [shippingSaving, setShippingSaving] = useState(false);
  const [shippingError, setShippingError] = useState("");

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingForm, setBillingForm] = useState<BillingForm>(emptyBilling);
  const [billingSaving, setBillingSaving] = useState(false);
  const [billingError, setBillingError] = useState("");

  // ── Coupon state ───────────────────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);
  const [advertisedCoupons, setAdvertisedCoupons] = useState<AdvertisedCoupon[]>([]);

  const userType = user?.userType || "regular";

  // Redirect to cart if empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.replace("/shop/cart");
    }
  }, [cartLoading, items.length, router]);

  // Pre-fill address form from saved user profile
  useEffect(() => {
    if (user) {
      if (hasAddress(user)) {
        setEditingShipping(false);
      } else {
        setEditingShipping(true);
      }
      setShippingForm({
        fullName: user.fullName || user.name || "",
        phone: user.phone || "",
        streetAddress1: user.streetAddress1 || "",
        streetAddress2: user.streetAddress2 || "",
        zipcode: user.zipcode || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "United States",
      });
      setBillingForm({
        billingNameOnCard: user.billingNameOnCard || "",
        billingStreetAddress1: user.billingStreetAddress1 || "",
        billingStreetAddress2: user.billingStreetAddress2 || "",
        billingZipcode: user.billingZipcode || "",
        billingCity: user.billingCity || "",
        billingState: user.billingState || "",
        billingCountry: user.billingCountry || "United States",
      });
      setBillingSameAsShipping(user.isBillingSameAsShipping !== false);
    }
  }, [user]);

  // Fetch advertised coupons
  useEffect(() => {
    apiCall("GET", "/coupons/advertised")
      .then(setAdvertisedCoupons)
      .catch(() => { });
  }, []);

  // Pricing
  const discount = appliedCoupon ? calcDiscount(cartTotal, appliedCoupon) : 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  // ── Address save ───────────────────────────────────────────────────────────
  const saveShipping = async () => {
    if (!shippingForm.streetAddress1 || !shippingForm.zipcode || !shippingForm.city) {
      setShippingError("Street address, ZIP code, and city are required.");
      return;
    }
    setShippingSaving(true);
    setShippingError("");
    try {
      await apiCall("PATCH", "/auth/update-profile", shippingForm);
      await refreshUser();
      setEditingShipping(false);
    } catch {
      setShippingError("Failed to save address. Please try again.");
    } finally {
      setShippingSaving(false);
    }
  };

  const saveBilling = async () => {
    setBillingSaving(true);
    setBillingError("");
    try {
      await apiCall("PATCH", "/auth/update-profile", {
        ...billingForm,
        isBillingSameAsShipping: billingSameAsShipping,
      });
      await refreshUser();
    } catch {
      setBillingError("Failed to save billing address.");
    } finally {
      setBillingSaving(false);
    }
  };

  // ── Coupon ─────────────────────────────────────────────────────────────────
  const handleApplyCoupon = useCallback(async (code?: string) => {
    const codeToApply = (code ?? couponInput).trim().toUpperCase();
    if (!codeToApply) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await apiCall("POST", "/coupons/validate", {
        discountName: codeToApply,
        userId: user?.id ?? null,
      });
      setAppliedCoupon(res.coupon);
      setCouponInput("");
    } catch (err: any) {
      setCouponError(err?.response?.data?.error || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, user]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponInput("");
  };

  if (cartLoading || items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-gray">
        <Loader2 className="animate-spin text-brand-blue" size={36} />
      </div>
    );
  }

  const savedShippingComplete = hasAddress(user) && !editingShipping;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-warm-gray text-soft-dark">

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <Link href="/shop/cart"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-blue text-xs font-bold uppercase tracking-widest transition-colors group">
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-soft-dark tracking-tight uppercase">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Left column ──────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* ── Shipping Address ────────────────────────────── */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-blue" />
                  <p className="text-xs font-black uppercase tracking-widest text-soft-dark">
                    Shipping Address
                  </p>
                </div>
                {hasAddress(user) && !editingShipping && (
                  <button
                    onClick={() => setEditingShipping(true)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-atlantic-blue transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                )}
              </div>

              {/* Saved address display */}
              {savedShippingComplete ? (
                <div className="bg-zinc-50 rounded-xl p-4 space-y-1">
                  <p className="text-sm font-bold text-soft-dark">
                    {user?.fullName || user?.name}
                  </p>
                  {user?.phone && (
                    <p className="text-xs text-zinc-500">{user.phone}</p>
                  )}
                  <p className="text-xs text-zinc-500">{user?.streetAddress1}</p>
                  {user?.streetAddress2 && (
                    <p className="text-xs text-zinc-500">{user.streetAddress2}</p>
                  )}
                  <p className="text-xs text-zinc-500">
                    {user?.city}, {user?.state} {user?.zipcode}
                  </p>
                  <p className="text-xs text-zinc-500">{user?.country}</p>
                </div>
              ) : (
                /* Address form */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm((f) => ({ ...f, fullName: e.target.value }))}
                      className={inputCls}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm((f) => ({ ...f, phone: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingForm.streetAddress1}
                    onChange={(e) => setShippingForm((f) => ({ ...f, streetAddress1: e.target.value }))}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="Apt, Suite, Unit (optional)"
                    value={shippingForm.streetAddress2}
                    onChange={(e) => setShippingForm((f) => ({ ...f, streetAddress2: e.target.value }))}
                    className={inputCls}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <ZipInput
                      value={shippingForm.zipcode}
                      onChange={(v) => setShippingForm((f) => ({ ...f, zipcode: v }))}
                      onResolved={(city, state, country) =>
                        setShippingForm((f) => ({ ...f, city, state, country }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm((f) => ({ ...f, city: e.target.value }))}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm((f) => ({ ...f, state: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingForm.country}
                    onChange={(e) => setShippingForm((f) => ({ ...f, country: e.target.value }))}
                    className={inputCls}
                  />

                  {shippingError && (
                    <p className="text-xs text-rose-500 flex items-center gap-1.5">
                      <AlertCircle size={13} /> {shippingError}
                    </p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={saveShipping}
                      disabled={shippingSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all disabled:opacity-50"
                    >
                      {shippingSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      Save Address
                    </button>
                    {hasAddress(user) && (
                      <button
                        onClick={() => setEditingShipping(false)}
                        className="px-5 py-2.5 border border-zinc-200 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-50 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Billing Address ─────────────────────────────── */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-soft-dark">
                  Billing Address
                </p>
                {/* Toggle */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Same as shipping</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={billingSameAsShipping}
                      onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors ${billingSameAsShipping ? "bg-brand-blue" : "bg-zinc-200 shadow-inner"}`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${billingSameAsShipping ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>
                </label>
              </div>

              {billingSameAsShipping ? (
                <p className="text-xs text-zinc-400 italic">
                  Using shipping address as billing address.
                </p>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={billingForm.billingNameOnCard}
                    onChange={(e) => setBillingForm((f) => ({ ...f, billingNameOnCard: e.target.value }))}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={billingForm.billingStreetAddress1}
                    onChange={(e) => setBillingForm((f) => ({ ...f, billingStreetAddress1: e.target.value }))}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="Apt, Suite, Unit (optional)"
                    value={billingForm.billingStreetAddress2}
                    onChange={(e) => setBillingForm((f) => ({ ...f, billingStreetAddress2: e.target.value }))}
                    className={inputCls}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <ZipInput
                      value={billingForm.billingZipcode}
                      onChange={(v) => setBillingForm((f) => ({ ...f, billingZipcode: v }))}
                      onResolved={(city, state, country) =>
                        setBillingForm((f) => ({
                          ...f,
                          billingCity: city,
                          billingState: state,
                          billingCountry: country,
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={billingForm.billingCity}
                      onChange={(e) => setBillingForm((f) => ({ ...f, billingCity: e.target.value }))}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={billingForm.billingState}
                      onChange={(e) => setBillingForm((f) => ({ ...f, billingState: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Country"
                    value={billingForm.billingCountry}
                    onChange={(e) => setBillingForm((f) => ({ ...f, billingCountry: e.target.value }))}
                    className={inputCls}
                  />

                  {billingError && (
                    <p className="text-xs text-rose-500 flex items-center gap-1.5">
                      <AlertCircle size={13} /> {billingError}
                    </p>
                  )}

                  <button
                    onClick={saveBilling}
                    disabled={billingSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all disabled:opacity-50"
                  >
                    {billingSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    Save Billing Address
                  </button>
                </div>
              )}
            </div>

            {/* ── Order Summary ────────────────────────────────── */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-soft-dark/50">
                Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
              </h2>

              {items.map((item) => {
                const price =
                  userType === "professional" && item.professionalPrice != null
                    ? Number(item.professionalPrice)
                    : Number(item.regularPrice);
                return (
                  <div key={item.id}
                    className="flex items-center gap-4 bg-white border border-zinc-100 rounded-2xl p-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                      {item.productImage ? (
                        <img src={mediaUrl(item.productImage)} alt={item.productName}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={24} strokeWidth={1} className="text-zinc-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-soft-dark truncate">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-brand-blue font-medium">{item.variantName}</p>
                      )}
                      <p className="text-xs text-zinc-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-soft-dark shrink-0">
                      ${(price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right column: coupon + totals ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Advertised coupons */}
            {advertisedCoupons.length > 0 && !appliedCoupon && (
              <div className="bg-white border border-zinc-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-brand-blue" />
                  <p className="text-xs font-black uppercase tracking-widest text-soft-dark">
                    Available Offers
                  </p>
                </div>
                <div className="space-y-2">
                  {advertisedCoupons.map((c) => (
                    <button key={c.id}
                      onClick={() => handleApplyCoupon(c.discountName)}
                      className="w-full text-left flex items-start gap-3 p-3 rounded-xl border border-dashed border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/10 hover:border-brand-blue/50 transition-all group">
                      <Tag size={14} className="text-brand-blue mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-brand-blue tracking-wider">
                            {c.discountName}
                          </span>
                          <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">
                            {c.discountPercentage}% OFF
                            {c.maxDiscountAmount != null && ` (up to $${Number(c.maxDiscountAmount).toFixed(0)})`}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-soft-dark mt-0.5">{c.header}</p>
                        {c.subHeader && <p className="text-[10px] text-zinc-400">{c.subHeader}</p>}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                        Apply
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon input */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-brand-blue" />
                <p className="text-xs font-black uppercase tracking-widest text-soft-dark">
                  Coupon Code
                </p>
              </div>

              {appliedCoupon ? (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-emerald-700 tracking-wider">
                        {appliedCoupon.discountName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {appliedCoupon.discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-xs font-bold text-soft-dark mt-0.5">{appliedCoupon.header}</p>
                    {appliedCoupon.subHeader && (
                      <p className="text-[10px] text-zinc-400">{appliedCoupon.subHeader}</p>
                    )}
                    <p className="text-xs font-bold text-emerald-600 mt-1">
                      You save ${discount.toFixed(2)}
                    </p>
                  </div>
                  <button onClick={removeCoupon}
                    className="text-zinc-400 hover:text-rose-500 transition-colors shrink-0">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-3 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all disabled:opacity-40 shrink-0 flex items-center gap-2"
                    >
                      {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <div className="flex items-center gap-2 text-xs text-rose-500 font-medium">
                      <AlertCircle size={13} />
                      {couponError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order total */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-soft-dark/50">
                Price Details
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-soft-dark/60">Subtotal</span>
                  <span className="font-bold text-soft-dark">${cartTotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-medium flex items-center gap-1.5">
                      <Tag size={12} /> {appliedCoupon.discountName}
                    </span>
                    <span className="font-bold">−${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>Tax</span>
                  <span>Calculated at next step</span>
                </div>

                <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-soft-dark/60">Total</span>
                  <span className="text-2xl font-black text-brand-blue">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={!savedShippingComplete}
                className="w-full flex items-center justify-center gap-3 py-4 bg-brand-blue text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ShoppingBag size={16} strokeWidth={2.5} />
                Place Order
              </button>

              {!savedShippingComplete && (
                <p className="text-center text-[10px] text-zinc-400">
                  Please add a shipping address to continue.
                </p>
              )}

              <Link href="/shop/cart"
                className="w-full flex items-center justify-center py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-soft-dark/50 hover:text-brand-blue transition-colors">
                ← Back to Cart
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
