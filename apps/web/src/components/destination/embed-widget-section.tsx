"use client";

import { useState } from "react";
import { Code2, ChevronDown, ChevronUp } from "lucide-react";
import { EmbedCode } from "@/components/ui/embed-code";

interface Props {
  destinationSlug: string;
  destinationName: string;
}

export default function EmbedWidgetSection({ destinationSlug, destinationName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors group"
        aria-expanded={open}
      >
        <Code2 className="w-3.5 h-3.5 group-hover:text-[#1db682] transition-colors" />
        Preisverlauf-Widget einbetten
        {open ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {open && (
        <div className="mt-3">
          <EmbedCode
            destinationSlug={destinationSlug}
            destinationName={destinationName}
            days={30}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}
