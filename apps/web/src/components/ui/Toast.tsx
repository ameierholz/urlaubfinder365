"use client";

import { useEffect } from "react";
import { CheckCircle, X, Heart } from "lucide-react";

interface Props {
  message: string;
  link?: { href: string; label: string };
  type?: "save" | "unsave";
  onDismiss: () => void;
}

export default function Toast({ message, link, type = "save", onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium max-w-sm ${
        type === "save"
          ? "bg-white border-green-100 text-gray-800"
          : "bg-white border-gray-200 text-gray-600"
      }`}>
        {type === "save" ? (
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        ) : (
          <Heart className="w-5 h-5 text-gray-400 shrink-0" />
        )}
        <span className="flex-1">
          {message}
          {link && (
            <>
              {" "}
              <a
                href={link.href}
                className="text-sand-600 underline underline-offset-2 font-semibold hover:text-sand-700"
              >
                {link.label}
              </a>
            </>
          )}
        </span>
        <button
          onClick={onDismiss}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
