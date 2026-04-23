import React from "react";

interface PageHeaderProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    titleSize?: "large" | "extra-large";
    className?: string;
}

export default function PageHeader({
    eyebrow,
    title,
    subtitle,
    children,
    titleSize = "large",
    className = ""
}: PageHeaderProps) {
    const titleStyles = {
        large: "text-6xl md:text-7xl",
        "extra-large": "text-6xl md:text-8xl",
    };

    return (
        <header className={`space-y-6 ${className}`}>
            <div className="space-y-4">
                {eyebrow && (
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-blue">
                        {eyebrow}
                    </span>
                )}
                <h1 className={`${titleStyles[titleSize]} font-black text-soft-dark tracking-tight uppercase leading-none`}>
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-soft-dark/50 font-medium text-lg md:text-xl font-serif italic max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </header>
    );
}
