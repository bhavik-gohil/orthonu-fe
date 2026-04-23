"use client";

import React from "react";

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export default function Toggle({ label, checked, onChange, className = "" }: ToggleProps) {
    return (
        <div className={`flex items-center justify-between px-1 py-2 ${className}`}>
            <span className="text-sm font-bold text-soft-dark tracking-tight">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${checked ? "bg-brand-blue" : "bg-zinc-200"
                    }`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-7" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}
