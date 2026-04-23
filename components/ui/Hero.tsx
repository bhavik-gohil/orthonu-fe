import React from "react";
import Container from "./Container";

interface HeroProps {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export default function Hero({
    eyebrow,
    title,
    subtitle,
    actions,
    className = "",
}: HeroProps) {
    return (
        <section className={`relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden ${className}`}>
            {/* Pastel Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#B0E0E2]/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-[#E4D5ED]/20 blur-[150px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-[#9DD5EF]/20 blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-warm-gray/30" />
            </div>

            <Container className="relative z-10 max-w-5xl space-y-6">
                <div className="space-y-4">
                    {eyebrow && (
                        <h2 className="text-sm font-bold tracking-[0.05em] text-brand-blue animate-in fade-in slide-in-from-bottom-2 duration-700">
                            {eyebrow}
                        </h2>
                    )}
                    <h1 className="text-5xl lg:text-6xl font-black text-soft-dark animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {title}
                    </h1>
                </div>

                {subtitle && (
                    <p className="max-w-2xl mx-auto text-md md:text-lg text-soft-dark/60 font-medium leading-relaxed font-sans">
                        {subtitle}
                    </p>
                )}

                {actions && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                        {actions}
                    </div>
                )}
            </Container>
        </section>
    );
}
