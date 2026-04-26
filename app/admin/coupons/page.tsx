"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api-client";
import {
  Loader2, Plus, ChevronLeft, Edit2, X, Save,
  ToggleLeft, ToggleRight, Tag,
} from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

interface Coupon {
  id: number;
  uid: string;
  discountName: string;
  discountPercentage: number;
  maxDiscountAmount: number | null;
  useCountPerUser: number;
  advertiseToUser: boolean;
  header: string;
  subHeader: string | null;
  isActive: boolean;
  createdAt: string;
}

const inputCls = "w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

const emptyForm = {
  discountName: "",
  discountPercentage: "",
  maxDiscountAmount: "",
  useCountPerUser: "1",
  advertiseToUser: true,
  header: "",
  subHeader: "",
};

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await apiCall("GET", "/admin/coupons");
      setCoupons(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (c: Coupon) => {
    setForm({
      discountName: c.discountName,
      discountPercentage: String(c.discountPercentage),
      maxDiscountAmount: c.maxDiscountAmount != null ? String(c.maxDiscountAmount) : "",
      useCountPerUser: String(c.useCountPerUser),
      advertiseToUser: c.advertiseToUser,
      header: c.header,
      subHeader: c.subHeader || "",
    });
    setEditingId(c.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.discountName.trim() || !form.discountPercentage || !form.header.trim()) {
      setError("Coupon code, discount %, and header are required");
      return;
    }
    const pct = parseFloat(form.discountPercentage);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      setError("Discount percentage must be between 0 and 100");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const payload: any = {
        discountName: form.discountName.trim().toUpperCase(),
        discountPercentage: pct,
        maxDiscountAmount: form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount) : null,
        useCountPerUser: parseInt(form.useCountPerUser) || 1,
        advertiseToUser: form.advertiseToUser,
        header: form.header.trim(),
        subHeader: form.subHeader.trim() || null,
      };
      if (editingId) {
        await apiCall("PATCH", `/admin/coupons/${editingId}`, payload);
        setSuccess("Coupon updated!");
      } else {
        await apiCall("POST", "/admin/coupons", payload);
        setSuccess("Coupon created!");
      }
      setTimeout(() => setSuccess(""), 3000);
      resetForm();
      fetchCoupons();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || "Failed to save coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (c: Coupon) => {
    try {
      await apiCall("PATCH", `/admin/coupons/${c.id}`, { isActive: !c.isActive });
      fetchCoupons();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update coupon status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors group text-xs font-bold uppercase tracking-widest">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Dashboard
        </button>
        <div className="flex items-center justify-between">
          <PageHeader title="Coupon Codes" eyebrow="Promotions"
            subtitle="Create and manage discount coupons for the checkout page." />
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-atlantic-blue transition-all">
            <Plus size={16} strokeWidth={3} /> New Coupon
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
          {success}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <Card padding="medium" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-soft-dark">
              {editingId ? "Edit Coupon" : "New Coupon"}
            </h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-rose-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coupon code */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Coupon Code * <span className="text-zinc-400">(auto-uppercased)</span></label>
                <input type="text" placeholder="e.g. WELCOME20"
                  value={form.discountName}
                  onChange={e => setForm(f => ({ ...f, discountName: e.target.value }))}
                  className={inputCls} disabled={!!editingId} required />
              </div>

              {/* Header */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Header *</label>
                <input type="text" placeholder="e.g. Welcome Discount"
                  value={form.header}
                  onChange={e => setForm(f => ({ ...f, header: e.target.value }))}
                  className={inputCls} required />
              </div>

              {/* Discount % */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Discount Percentage % *</label>
                <input type="number" min="0.01" max="100" step="0.01" placeholder="e.g. 20"
                  value={form.discountPercentage}
                  onChange={e => setForm(f => ({ ...f, discountPercentage: e.target.value }))}
                  className={inputCls} required />
              </div>

              {/* Max discount $ */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Max Discount Amount $ <span className="text-zinc-400">(optional cap)</span></label>
                <input type="number" min="0" step="0.01" placeholder="e.g. 50.00"
                  value={form.maxDiscountAmount}
                  onChange={e => setForm(f => ({ ...f, maxDiscountAmount: e.target.value }))}
                  className={inputCls} />
              </div>

              {/* Uses per user */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Uses Per User</label>
                <input type="number" min="1" step="1" placeholder="1"
                  value={form.useCountPerUser}
                  onChange={e => setForm(f => ({ ...f, useCountPerUser: e.target.value }))}
                  className={inputCls} />
              </div>

              {/* Sub header */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Sub Header <span className="text-zinc-400">(optional)</span></label>
                <input type="text" placeholder="e.g. Valid for new customers"
                  value={form.subHeader}
                  onChange={e => setForm(f => ({ ...f, subHeader: e.target.value }))}
                  className={inputCls} />
              </div>
            </div>

            {/* Advertise toggle */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm(f => ({ ...f, advertiseToUser: !f.advertiseToUser }))}
                className="flex items-center gap-2 text-sm font-medium text-soft-dark">
                {form.advertiseToUser
                  ? <ToggleRight size={28} className="text-brand-blue" />
                  : <ToggleLeft size={28} className="text-zinc-400" />}
                <span>Advertise to users on checkout page</span>
              </button>
            </div>

            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-atlantic-blue transition-all disabled:opacity-50">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> {editingId ? "Update" : "Create"}</>}
              </button>
              <button type="button" onClick={resetForm}
                className="px-6 py-3 text-xs font-bold text-zinc-500 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Coupons list */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
      ) : coupons.length === 0 ? (
        <Card padding="medium" className="text-center py-12">
          <p className="text-sm text-zinc-400 italic">No coupons yet. Create your first one.</p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                {["Code", "Header", "Discount", "Max $", "Uses/User", "Advertised", "Status", "Actions"].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-soft-dark/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {coupons.map(c => (
                <tr key={c.id} className="group hover:bg-zinc-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-brand-blue shrink-0" />
                      <span className="text-sm font-black text-soft-dark tracking-wider">{c.discountName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-soft-dark">{c.header}</p>
                    {c.subHeader && <p className="text-xs text-zinc-400">{c.subHeader}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-brand-blue">{c.discountPercentage}%</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-soft-dark/60">
                    {c.maxDiscountAmount != null ? `$${Number(c.maxDiscountAmount).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-soft-dark/60">{c.useCountPerUser}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${c.advertiseToUser ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {c.advertiseToUser ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(c)}
                      className="flex items-center gap-1.5 text-xs font-bold transition-colors">
                      {c.isActive
                        ? <><ToggleRight size={20} className="text-emerald-500" /><span className="text-emerald-600">Active</span></>
                        : <><ToggleLeft size={20} className="text-zinc-400" /><span className="text-zinc-400">Disabled</span></>}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleEdit(c)}
                      className="p-2 text-zinc-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-all">
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
