import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "small" | "medium" | "large";
    hover?: boolean;
}

export default function Card({
    children,
    className = "",
    padding = "medium",
    hover = false,
}: CardProps) {
    const paddingStyles = {
        none: "",
        small: "p-4",
        medium: "p-8 md:p-12",
        large: "p-12 md:p-20",
    };

    return (
        <div
            className={`
                bg-white rounded-3xl border border-zinc-100 
                ${hover ? "hover:shadow-xl hover:shadow-zinc-200 transition-all duration-300" : ""}
                ${paddingStyles[padding]}
                ${className}
            `}
        >
            {children}
        </div>
    );
}
