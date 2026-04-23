"use client";

import React from "react";

interface InputProps {
    label?: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
    note?: string;
    className?: string;
}

export default function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    name,
    icon,
    disabled = false,
    required = false,
    note,
    className = "",
}: InputProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-xs font-bold tracking-wide text-soft-dark/50 px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-blue transition-colors">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                    disabled={disabled}
                    required={required}
                    className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all font-medium text-soft-dark disabled:opacity-50 disabled:cursor-not-allowed`}
                />
            </div>
            {note && (
                <p className="text-[11px] text-zinc-400 font-medium px-1 italic">{note}</p>
            )}
        </div>
    );
}
