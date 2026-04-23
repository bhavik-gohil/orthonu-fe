import React from "react";

interface PillProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    as?: React.ElementType;
    href?: string; // Explicitly add href for convenience when as="a"
}

export default function Pill({
    children,
    active = false,
    onClick,
    className = "",
    as: Component = "button",
    ...rest
}: PillProps) {
    const baseStyles = "text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border transition-all cursor-pointer";
    const activeStyles = "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 -translate-y-0.5";
    const inactiveStyles = "bg-white text-soft-dark/60 border-zinc-200 hover:border-brand-blue/40 hover:text-soft-dark";

    return (
        <Component
            onClick={onClick}
            className={`${baseStyles} ${active ? activeStyles : inactiveStyles} ${className}`}
            {...rest}
        >
            {children}
        </Component>
    );
}
