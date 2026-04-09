"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Plus, TrendingUp, MousePointerClick, Eye, BarChart2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface SponsoredDeal {
  id: string;
  hotel_name: string;
  destination_name: string;
  price_per_person: number;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  status: string;
  sponsor_name: string | null;
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d));
}

export default function SponsoredDealsPage() {
  const [deals, setDeals] = useState<SponsoredDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const supabase = createSupabaseBrowser();

  async function load() {
    const { data } = await supabase
      .from("sponsored_deals" as never)
      .select("id, hotel_name, destination_name, price_per_person, start_date, end_date, impressions, clicks, status, sponsor_name")
      .order("created_at", { ascending: false });
    setDeals((data ?? []) as SponsoredDeal[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleStatus(deal: SponsoredDeal) {
    setToggling(deal.id);
    const next = deal.status === "aktiv" ? "pausiert" : "aktiv";
    await (supabase.from("sponsored_deals" as never).update({ status: next } as never) as unknown as { eq: (col: string, val: string) => Promise<unknown> }).eq("id", deal.id);
    await load();
    setToggling(null);
  }

  const activeDeals = deals.filter((d) => d.status === "aktiv");
  const totalImpressions = deals.reduce((s, d) => s + (d.impressions ?? 0), 0);
  const totalClicks = deals.reduce((s, d) => s + (d.clicks ?? 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500/15 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Sponsored Deals</h1>
            <p className="text-xs text-gray-500">Bezahlte Deal-Platzierungen auf der Startseite</p>
          </div>
        </div>
        <Link
          href="/admin/sponsored-deals/neu"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuen Deal anlegen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Aktive Deals", value: activeDeals.length, icon: Flame, color: "text-orange-400" },
          { label: "Gesamt-Impressionen", value: totalImpressions.toLocaleString("de-DE"), icon: Eye, color: "text-blue-400" },
          { label: "Gesamt-Klicks", value: totalClicks.toLocaleString("de-DE"), icon: MousePointerClick, color: "text-emerald-400" },
          { label: "Ø CTR", value: `${avgCtr} %`, icon: BarChart2, color: "text-violet-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabelle */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-white">Alle Deals</h2>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500 text-sm">Lädt…</div>
        ) : deals.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 text-sm">Noch keine Sponsored Deals angelegt.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Hotel", "Destination", "Preis/P.", "Zeitraum", "Impressionen", "Klicks", "CTR", "Status", "Aktion"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {deals.map((deal) => {
                  const ctr = deal.impressions > 0
                    ? ((deal.clicks / deal.impressions) * 100).toFixed(2)
                    : "0.00";
                  return (
                    <tr key={deal.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap max-w-[180px] truncate">
                        {deal.hotel_name}
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{deal.destination_name}</td>
                      <td className="px-4 py-3 text-orange-400 font-bold whitespace-nowrap">
                        {deal.price_per_person.toLocaleString("de-DE")} €
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                        {formatDate(deal.start_date)} – {formatDate(deal.end_date)}
                      </td>
                      <td className="px-4 py-3 text-blue-400 font-semibold tabular-nums">
                        {(deal.impressions ?? 0).toLocaleString("de-DE")}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold tabular-nums">
                        {(deal.clicks ?? 0).toLocaleString("de-DE")}
                      </td>
                      <td className="px-4 py-3 text-violet-400 font-semibold tabular-nums">
                        {ctr} %
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          deal.status === "aktiv"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-gray-700 text-gray-400"
                        }`}>
                          {deal.status === "aktiv" ? "Aktiv" : "Pausiert"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStatus(deal)}
                          disabled={toggling === deal.id}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            deal.status === "aktiv"
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400"
                          } disabled:opacity-40`}
                        >
                          {toggling === deal.id ? "…" : deal.status === "aktiv" ? "Pausieren" : "Aktivieren"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
