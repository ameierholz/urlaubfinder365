"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, CheckCircle2, BookMarked, Bell, ListChecks, Map, FileText } from "lucide-react";

interface Props {
  onClose: () => void;
}

const PROFILE_FEATURES = [
  { icon: Heart,        text: "Reiseangebote & Hotels merken und später buchen" },
  { icon: BookMarked,   text: "Aktivitäten & Ausflüge in der Wunschliste sammeln" },
  { icon: Bell,         text: "Preisalarme – werde benachrichtigt wenn ein Angebot günstiger wird" },
  { icon: ListChecks,   text: "Persönliche Reise-Checkliste nie wieder vergessen" },
  { icon: Map,          text: "Reisepläne erstellen und Trips verknüpfen" },
  { icon: FileText,     text: "Reisedokumente (Pass, Versicherung) sicher hinterlegen" },
];

export default function SaveLoginModal({ onClose }: Props) {
  const router = useRouter();

  // Hintergrund-Scroll sperren
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Escape-Taste
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header Gradient */}
        <div className="bg-gradient-to-br from-[#00838F] to-[#005F6A] px-6 pt-6 pb-8 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Herz-Icon */}
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>

          <h2 id="save-modal-title" className="text-xl font-extrabold mb-1">
            Reiseangebot merken
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Speichere Angebote in deinem kostenlosen Reiseprofil und buche sie in Ruhe – jederzeit und überall.
          </p>
        </div>

        {/* Features */}
        <div className="px-6 py-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Dein Reiseprofil enthält außerdem
          </p>
          <ul className="space-y-2.5">
            {PROFILE_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-[#00838F]" />
                </div>
                <span className="text-sm text-gray-700 leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={() => router.push("/register")}
            className="w-full bg-gradient-to-r from-[#00838F] to-[#005F6A] hover:from-[#007A86] hover:to-[#005060] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Jetzt kostenlos registrieren
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm"
          >
            Bereits Mitglied? Anmelden
          </button>
        </div>

      </div>
    </div>
  );
}
