import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PillarCardProps {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  accentColor: string;
  href?: string;
  className?: string;
}

export default function PillarCard({
  title,
  eyebrow,
  description,
  icon,
  iconBgColor,
  iconColor,
  accentColor,
  href = "",
  className = "",
}: PillarCardProps) {
  return (
    <div className={`group space-y-10 p-4 ${className}`}>
      <div
        className={`w-20 h-20 rounded-3xl ${iconBgColor} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-500`}
      >
        {icon}
      </div>
      <div className="space-y-6">
        <h3 className="text-4xl font-black text-soft-dark tracking-tighter uppercase">
          {title}
        </h3>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed text-soft-dark/50 font-medium font-sans">
            {description}
          </p>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className={`inline-flex items-center gap-4 text-[10px] font-heavy uppercase tracking-[0.3em] text-soft-dark border-b-2 ${accentColor.replace("bg-", "border-").split(" ")[0]}/10 pb-2 hover:border-current transition-all group/link`}
        >
          Discovery{" "}
          <ChevronRight
            size={14}
            className="group-hover/link:translate-x-1 transition-transform"
          />
        </Link>
      )}
    </div>
  );
}
