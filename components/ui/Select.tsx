"use client";

import React from "react";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string;
    onChange?: (value: string) => void;
    options: SelectOption[];
    icon?: React.ReactNode;
    placeholder?: string;
    required?: boolean;
    name?: string;
    disabled?: boolean;
    className?: string;
}

export default function Select({
    label,
    value,
    onChange,
    options,
    icon,
    placeholder,
    required = false,
    name,
    disabled = false,
    className = "",
}: SelectProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest text-soft-dark/50 px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-blue transition-colors">
                        {icon}
                    </span>
                )}
                <select
                    name={name}
                    value={value}
                    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                    disabled={disabled}
                    required={required}
                    className={`w-full ${icon ? "pl-12" : "pl-4"} pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all font-medium text-soft-dark appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
