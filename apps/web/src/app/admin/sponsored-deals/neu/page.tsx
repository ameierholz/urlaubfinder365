"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

const BOARDS = ["All Inclusive", "Vollpension", "Halbpension", "Frühstück", "Nur Übernachtung"];

export default function SponsoredDealNeuPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    hotel_name: "",
    destination_name: "",
    destination_slug: "",
    image_url: "",
    booking_url: "",
    price_per_person: "",
    original_price: "",
    stars: "4",
    board: "All Inclusive",
    nights: "7",
    departure_date: "",
    sponsor_name: "",
    sponsor_email: "",
    daily_budget: "",
    start_date: "",
    end_date: "",
  });

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { error: err } = await supabase.from("sponsored_deals" as never).insert({
      hotel_name:       form.hotel_name,
      destination_name: form.destination_name,
      destination_slug: form.destination_slug || form.destination_name.toLowerCase().replace(/\s+/g, "-"),
      image_url:        form.image_url,
      booking_url:      form.booking_url,
      price_per_person: Number(form.price_per_person),
      original_price:   form.original_price ? Number(form.original_price) : null,
      stars:            Number(form.stars),
      board:            form.board,
      nights:           Number(form.nights),
      departure_date:   form.departure_date || null,
      sponsor_name:     form.sponsor_name || null,
      sponsor_email:    form.sponsor_email || null,
      daily_budget:     form.daily_budget ? Number(form.daily_budget) : null,
      start_date:       form.start_date,
      end_date:         form.end_date,
      status:           "pausiert",
      impressions:      0,
      clicks:           0,
    } as never);

    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }

    router.push("/admin/sponsored-deals/");
  }

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors";
  const labelCls = "block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider";

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/sponsored-deals/"
          className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500/15 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Neuen Sponsored Deal anlegen</h1>
            <p className="text-xs text-gray-500">Deal wird zunächst als "Pausiert" gespeichert</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hotel & Destination */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-300">Hotel & Destination</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Hotelname *</label>
              <input required className={inputCls} placeholder="z. B. Rixos Premium Belek" value={form.hotel_name} onChange={set("hotel_name")} />
            </div>
            <div>
              <label className={labelCls}>Destination *</label>
              <input required className={inputCls} placeholder="z. B. Türkei" value={form.destination_name} onChange={set("destination_name")} />
            </div>
            <div>
              <label className={labelCls}>Destination Slug</label>
              <input className={inputCls} placeholder="z. B. tuerkei (auto-generiert)" value={form.destination_slug} onChange={set("destination_slug")} />
            </div>
            <div>
              <label className={labelCls}>Sterne</label>
              <select className={inputCls} value={form.stars} onChange={set("stars")}>
                {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} Sterne</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Bild-URL *</label>
            <input required type="url" className={inputCls} placeholder="https://..." value={form.image_url} onChange={set("image_url")} />
          </div>
          <div>
            <label className={labelCls}>Buchungs-URL *</label>
            <input required type="url" className={inputCls} placeholder="https://..." value={form.booking_url} onChange={set("booking_url")} />
          </div>
        </div>

        {/* Preis & Konditionen */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-300">Preis & Konditionen</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Aktionspreis/Person (€) *</label>
              <input required type="number" min="1" className={inputCls} placeholder="499" value={form.price_per_person} onChange={set("price_per_person")} />
            </div>
            <div>
              <label className={labelCls}>Originalpreis/Person (€)</label>
              <input type="number" min="1" className={inputCls} placeholder="799" value={form.original_price} onChange={set("original_price")} />
            </div>
            <div>
              <label className={labelCls}>Nächte</label>
              <input type="number" min="1" className={inputCls} placeholder="7" value={form.nights} onChange={set("nights")} />
            </div>
            <div>
              <label className={labelCls}>Verpflegung</label>
              <select className={inputCls} value={form.board} onChange={set("board")}>
                {BOARDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Abreisedatum</label>
              <input type="date" className={inputCls} value={form.departure_date} onChange={set("departure_date")} />
            </div>
          </div>
        </div>

        {/* Sponsor */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-300">Sponsor</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Sponsor-Name</label>
              <input className={inputCls} placeholder="z. B. TUI GmbH" value={form.sponsor_name} onChange={set("sponsor_name")} />
            </div>
            <div>
              <label className={labelCls}>Sponsor-E-Mail</label>
              <input type="email" className={inputCls} placeholder="partner@tui.com" value={form.sponsor_email} onChange={set("sponsor_email")} />
            </div>
            <div>
              <label className={labelCls}>Tagesbudget (€)</label>
              <input type="number" min="1" className={inputCls} placeholder="50" value={form.daily_budget} onChange={set("daily_budget")} />
            </div>
          </div>
        </div>

        {/* Laufzeit */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-300">Laufzeit</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Startdatum *</label>
              <input required type="date" className={inputCls} value={form.start_date} onChange={set("start_date")} />
            </div>
            <div>
              <label className={labelCls}>Enddatum *</label>
              <input required type="date" className={inputCls} value={form.end_date} onChange={set("end_date")} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-xl px-4 py-3">
            Fehler: {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Wird gespeichert…" : "Deal speichern"}
          </button>
          <Link href="/admin/sponsored-deals/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
