"use client";

import { useState } from "react";
import {
  X, Shield, HeartPulse, PlaneLanding, Wallet, Wifi,
  ShieldCheck, Landmark, Utensils, Bus, CalendarDays,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HubData } from "@/lib/reise-hub-data";

const ICON_MAP: Record<string, LucideIcon> = {
  "fa-passport":           Shield,
  "fa-briefcase-medical":  HeartPulse,
  "fa-plane-arrival":      PlaneLanding,
  "fa-wallet":             Wallet,
  "fa-wifi":               Wifi,
  "fa-shield-alt":         ShieldCheck,
  "fa-landmark":           Landmark,
  "fa-utensils":           Utensils,
  "fa-bus":                Bus,
  "fa-calendar-alt":       CalendarDays,
};

interface Props {
  destination: string;
  country: string;
  data: HubData;
}

export default function ReiseHub({ destination, country, data }: Props) {
  const [openKey, setOpenKey]   = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"planning" | "insider">("planning");

  const openModal = (key: string) => {
    setOpenKey(key);
    setActiveTab("planning");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setOpenKey(null);
    document.body.style.overflow = "";
  };

  const openItem = openKey ? data[openKey] : null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1">
              Dein digitaler Reisebegleiter für{" "}
              <span className="text-sand-500">{destination}</span>
            </h2>
            <p className="text-gray-600">
              Alles Wichtige für vor, während und nach der Reise – inklusive Insider-Tipps.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 shrink-0 self-start md:self-auto">
            <span className="bg-teal-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Urlaubfinder365 Hub
            </span>
            <span className="text-teal-500 text-sm font-semibold">{country} Edition</span>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(data).map(([key, cat]) => {
            const Icon = ICON_MAP[cat.iconFa] ?? Shield;
            return (
              <button
                key={key}
                onClick={() => openModal(key)}
                className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-left relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${cat.color} shrink-0 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-tight">{cat.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">
                      Details →
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Overlay */}
      {openItem && openKey && (
        <div
          className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-0 border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-4 pr-8">
                {(() => {
                  const Icon = ICON_MAP[openItem.iconFa] ?? Shield;
                  return (
                    <div
                      className={`w-11 h-11 rounded-full ${openItem.color} shrink-0 flex items-center justify-center text-white shadow`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  );
                })()}
                <h3 className="text-2xl font-bold text-gray-900">{openItem.title}</h3>
                <button
                  onClick={closeModal}
                  aria-label="Schließen"
                  className="ml-auto text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 -mb-px">
                <button
                  onClick={() => setActiveTab("planning")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "planning"
                      ? "border-b-2 border-teal-400 text-teal-600 font-bold bg-gray-50"
                      : "text-gray-500 border-b-2 border-transparent hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  📋 Planung
                </button>
                <button
                  onClick={() => setActiveTab("insider")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === "insider"
                      ? "border-b-2 border-teal-400 text-teal-600 font-bold bg-gray-50"
                      : "text-gray-500 border-b-2 border-transparent hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  💡 Insider-Tipps
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div
              className="flex-1 overflow-y-auto p-6 md:p-8 reise-hub-content"
              dangerouslySetInnerHTML={{
                __html:
                  activeTab === "planning"
                    ? openItem.planningHtml
                    : openItem.insiderHtml,
              }}
            />

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t border-gray-100 rounded-b-2xl shrink-0">
              <span className="text-xs text-gray-400">© Urlaubfinder365 Hub</span>
              <button
                onClick={closeModal}
                className="text-sm font-semibold text-teal-500 hover:opacity-80 transition-opacity"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
