"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  /** Standardmäßig ausgeklappt (default: true) */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 text-left group mb-1"
        aria-expanded={open}
      >
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-[#00838F] transition-colors">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
        <span className="mt-1 shrink-0 text-gray-400 group-hover:text-[#00838F] transition-colors">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {/* Inhalt */}
      {open && <div className="mt-6">{children}</div>}
    </div>
  );
}
