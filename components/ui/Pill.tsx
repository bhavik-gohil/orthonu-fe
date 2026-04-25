import React from "react";

interface PillProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
    active?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    as?: any;
    href?: string;
}

export default function Pill({
    children,
    active = false,
    onClick,
    className = "",
    as: Component = "button",
    href,
    ...rest
}: PillProps) {
    const baseStyles = "text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border transition-all cursor-pointer inline-flex items-center justify-center";
    const activeStyles = "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 -translate-y-0.5";
    const inactiveStyles = "bg-white text-soft-dark/60 border-zinc-200 hover:border-brand-blue/40 hover:text-soft-dark";

    return (
        <Component
            onClick={onClick}
            href={href}
            className={`${baseStyles} ${active ? activeStyles : inactiveStyles} ${className}`}
            {...rest}
        >
            {children}
        </Component>
    );
}
