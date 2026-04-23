"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface SnackbarProps {
    message: string;
    type: "success" | "error";
    onDismiss: () => void;
    duration?: number;
}

export default function Snackbar({ message, type, onDismiss, duration = 3000 }: SnackbarProps) {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure we're client-side before portaling
    useEffect(() => { setMounted(true); }, []);

    // Slide in on mount
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    // Auto-dismiss
    useEffect(() => {
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
    }, [duration]);

    function handleDismiss() {
        setVisible(false);
        // Wait for exit animation before unmounting
        setTimeout(onDismiss, 300);
    }

    if (!mounted) return null;

    const isSuccess = type === "success";

    const content = (
        <div
            role="status"
            aria-live="polite"
            className={[
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
                "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-sm",
                "transition-all duration-300",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                isSuccess
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border-rose-200 text-rose-700",
            ].join(" ")}
        >
            {isSuccess
                ? <CheckCircle2 size={18} className="shrink-0" />
                : <AlertCircle size={18} className="shrink-0" />
            }
            <span className="text-sm font-medium flex-1">{message}</span>
            <button
                type="button"
                aria-label="Dismiss notification"
                onClick={handleDismiss}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
                <X size={15} />
            </button>
        </div>
    );

    return createPortal(content, document.body);
}
