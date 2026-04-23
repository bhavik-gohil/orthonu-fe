import React from "react";
import Container from "./Container";

interface SectionProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    eyebrow?: string;
    description?: string;
    withDivider?: boolean;
    className?: string;
    id?: string;
    bgColor?: string;
}

export default function Section({
    children,
    title,
    eyebrow,
    description,
    withDivider = false,
    className = "",
    id,
    bgColor = "bg-transparent",
}: SectionProps) {
    return (
        <section id={id} className={`py-10 md:py-16 ${bgColor} ${className}`}>
            <Container className="space-y-12">
                {(title || eyebrow || description) && (
                    <div className="space-y-6">
                        {eyebrow && (
                            <span className="text-sm font-bold tracking-[0.05em] text-brand-blue">
                                {eyebrow}
                            </span>
                        )}
                        {title && (
                            <h2 className="text-4xl md:text-5xl font-black text-soft-dark tracking-tight uppercase">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-soft-dark/50 font-medium text-lg leading-relaxed font-serif italic max-w-2xl">
                                {description}
                            </p>
                        )}
                        {withDivider && <div className="w-16 h-1 bg-brand-blue/20 rounded-full" />}
                    </div>
                )}
                {children}
            </Container>
        </section>
    );
}
