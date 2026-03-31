"use client";

import { useState } from "react";

export interface FAQItem {
  q: string;
  a: string;
}

interface Props {
  items: FAQItem[];
  accentColor?: string;
}

export default function ThemeFAQAccordion({
  items,
  accentColor = "#00838F",
}: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map(({ q, a }, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-transparent shadow-md"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
            style={isOpen ? { borderLeft: `3px solid ${accentColor}`, background: "white" } : {}}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              {/* Nummer */}
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors duration-200"
                style={
                  isOpen
                    ? { background: accentColor, color: "white" }
                    : { background: "#f3f4f6", color: "#9ca3af" }
                }
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Frage */}
              <span
                className={`flex-1 font-bold text-sm leading-snug transition-colors duration-200 ${
                  isOpen ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {q}
              </span>

              {/* Chevron */}
              <svg
                className="flex-shrink-0 w-4 h-4 text-gray-400 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Antwort */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? "600px" : "0px" }}
            >
              <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed pl-[4.25rem]">
                {a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
