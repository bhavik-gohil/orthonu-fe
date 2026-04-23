"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type AlertType = "error" | "success" | "info";

interface AlertProps {
    type: AlertType;
    message: string;
    className?: string;
}

const alertStyles: Record<AlertType, { bg: string; icon: React.ReactNode }> = {
    error: {
        bg: "bg-red-50 text-red-600 border-red-100",
        icon: <AlertCircle size={18} className="shrink-0" />,
    },
    success: {
        bg: "bg-green-50 text-green-600 border-green-100",
        icon: <CheckCircle2 size={18} className="shrink-0" />,
    },
    info: {
        bg: "bg-blue-50 text-blue-600 border-blue-100",
        icon: <Info size={18} className="shrink-0" />,
    },
};

export default function Alert({ type, message, className = "" }: AlertProps) {
    if (!message) return null;

    const style = alertStyles[type];
    return (
        <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium border animate-in fade-in slide-in-from-top-2 ${style.bg} ${className}`}
        >
            {style.icon}
            <p>{message}</p>
        </div>
    );
}
