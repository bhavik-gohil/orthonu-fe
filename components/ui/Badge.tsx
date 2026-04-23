import React from "react";

type BadgeColor = "blue" | "mint" | "plum" | "zinc" | "white";

interface BadgeProps {
    color?: BadgeColor;
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

const colorStyles: Record<BadgeColor, string> = {
    blue: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
    mint: "text-fresh-mint bg-fresh-mint/10 border-fresh-mint/20",
    plum: "text-soft-plum bg-soft-plum/10 border-soft-plum/20",
    zinc: "text-zinc-500 bg-zinc-100 border-zinc-200",
    white: "text-brand-blue bg-white/90 border-brand-blue/20 backdrop-blur-sm",
};

export default function Badge({ color = "blue", children, icon, className = "" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${colorStyles[color]} ${className}`}
        >
            {icon}
            {children}
        </span>
    );
}
