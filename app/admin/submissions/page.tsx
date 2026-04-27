"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiCall } from "@/lib/api-client";
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Building2, 
  MapPin, 
  Phone, 
  Calendar,
  ClipboardList
} from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

interface FormSubmission {
  id: number;
  name: string; // The form type name
  data: any;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const currentPage = parseInt(searchParams.get("page") || "1");

  const fetchSubmissions = async (page: number) => {
    try {
      setLoading(true);
      setError("");
      const response = await apiCall("GET", `/admin/submissions?page=${page}&limit=20`);
      setSubmissions(response.forms);
      setPagination(response.pagination);
    } catch (err) {
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    router.push(`/admin/submissions?page=${newPage}`);
  };

  // Grouping logic
  const grouped = submissions.reduce((acc: Record<string, FormSubmission[]>, sub) => {
    const type = sub.name;
    if (!acc[type]) acc[type] = [];
    acc[type].push(sub);
    return acc;
  }, {});

  const formatFormName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="animate-spin text-brand-blue" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-4">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors group text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Dashboard
        </button>
        <PageHeader
          title="Submissions"
          eyebrow="Forms"
          subtitle="View and manage all inquiries received through your website forms."
        />
      </div>

      {error && (
        <Card className="bg-rose-50 border-rose-100 text-rose-600 p-4 text-sm font-medium">
          {error}
        </Card>
      )}

      {submissions.length === 0 && !loading ? (
        <Card padding="large" className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300">
            <ClipboardList size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-soft-dark">No submissions found</h3>
            <p className="text-sm text-zinc-400">When users fill out forms on your site, they will appear here.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([formType, subs]) => (
            <div key={formType} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue bg-brand-blue/10 px-4 py-1.5 rounded-full">
                  {formatFormName(formType)}
                </h2>
                <div className="flex-1 h-px bg-zinc-100" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {subs.length} Entries in this page
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {subs.map((sub) => (
                  <Card
                    key={sub.id}
                    padding="none"
                    className={cn(
                      "overflow-hidden transition-all duration-300 border-zinc-100",
                      expandedId === sub.id ? "ring-2 ring-brand-blue/10 border-brand-blue/20 shadow-lg" : "hover:border-brand-blue/20"
                    )}
                  >
                    {/* Header/Summary */}
                    <div 
                      className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-brand-blue shrink-0">
                          {sub.name === "partnership_form" ? <Building2 size={18} /> : <Mail size={18} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-soft-dark truncate">
                            {sub.data.name || sub.data.firstName + " " + sub.data.lastName || "Anonymous"}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-medium">
                            {sub.data.organization || sub.data.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 text-zinc-400">
                          <Calendar size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 transition-colors group-hover:text-brand-blue">
                          {expandedId === sub.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === sub.id && (
                      <div className="px-5 pb-6 pt-2 border-t border-zinc-50 bg-zinc-50/30 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(sub.data).map(([key, value]) => {
                             if (key === "type") return null;
                             return (
                               <div key={key} className="space-y-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                   {key.replace(/([A-Z])/g, ' $1').trim()}
                                 </p>
                                 <p className="text-sm text-soft-dark font-medium break-words">
                                   {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                                 </p>
                               </div>
                             );
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-12">
          <button
            disabled={pagination.page <= 1 || loading}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="p-2 rounded-xl border border-zinc-200 text-zinc-400 hover:text-brand-blue hover:border-brand-blue/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(pagination.pages)].map((_, i) => {
              const p = i + 1;
              const isCurrent = p === pagination.page;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-xs font-bold transition-all",
                    isCurrent 
                      ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" 
                      : "text-zinc-400 hover:bg-zinc-50"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            disabled={pagination.page >= pagination.pages || loading}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="p-2 rounded-xl border border-zinc-200 text-zinc-400 hover:text-brand-blue hover:border-brand-blue/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="animate-spin text-brand-blue" size={48} /></div>}>
      <SubmissionsContent />
    </Suspense>
  );
}
