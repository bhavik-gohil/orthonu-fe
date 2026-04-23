"use client";

import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-brand-blue text-white hover:bg-atlantic-blue hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 shadow-lg shadow-brand-blue/20",
    secondary:
        "bg-soft-dark text-white hover:bg-zinc-800 shadow-lg",
    danger:
        "bg-red-600 text-white hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30 shadow-lg shadow-red-600/20",
    ghost:
        "bg-transparent text-soft-dark/60 hover:text-brand-blue",
};

export default function Button({
    variant = "primary",
    loading = false,
    icon,
    fullWidth = false,
    children,
    className = "",
    disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2.5
                py-3 px-8 font-bold text-sm tracking-wide
                rounded-full transition-all
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                cursor-pointer
                ${variantStyles[variant]}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
            {...rest}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <>
                    {children}
                    {icon && <span className="shrink-0">{icon}</span>}
                </>
            )}
        </button>
    );
}
