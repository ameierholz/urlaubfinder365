"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  id: string;
  label: string;
  emoji: string;
}

interface Props {
  items: NavItem[];
}

export default function PageNavBar({ items }: Props) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY + 175;
      let current = "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActive(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 155;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2.5">
          <span className="shrink-0 text-xs font-bold text-gray-400 uppercase tracking-wider pr-1 border-r border-gray-200">
            Schnellnavigation
          </span>
          <div className="flex gap-1.5">
            {items.map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                  active === id
                    ? "bg-[#00838F] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-[#00838F]/10 hover:text-[#00838F]"
                }`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
