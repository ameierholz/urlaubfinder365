"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { AppUser } from "@/context/AuthContext";
import type { UserProfile, ChecklistItem } from "@/types";
import { updateChecklist } from "@/lib/supabase-db";
import { CheckSquare, Plus, Trash2, RotateCcw } from "lucide-react";

interface Props {
  user: AppUser;
  userProfile: UserProfile | null;
}

type Category = ChecklistItem["category"];

const CATEGORY_I18N: Record<Category, { key: string; emoji: string }> = {
  dokumente:  { key: "categories.documents",    emoji: "📄" },
  kleidung:   { key: "categories.clothing",     emoji: "👕" },
  toilette:   { key: "categories.toiletries",   emoji: "🧴" },
  elektronik: { key: "categories.electronics",  emoji: "📱" },
  gesundheit: { key: "categories.health",       emoji: "💊" },
  sonstiges:  { key: "categories.other",        emoji: "🎒" },
};

const DEFAULT_ITEMS: ChecklistItem[] = [
  // Dokumente
  { id: "pass",         label: "Reisepass / Personalausweis",   checked: false, category: "dokumente" },
  { id: "tickets",      label: "Flugtickets & Buchungsbestätigung", checked: false, category: "dokumente" },
  { id: "krankenvers",  label: "Krankenversicherungskarte",     checked: false, category: "dokumente" },
  { id: "reisevers",    label: "Reiseversicherung",             checked: false, category: "dokumente" },
  { id: "visum",        label: "Visum (falls notwendig)",       checked: false, category: "dokumente" },
  { id: "impfpass",     label: "Impfausweis",                   checked: false, category: "dokumente" },
  // Kleidung
  { id: "badezeug",     label: "Badekleidung & Handtuch",       checked: false, category: "kleidung" },
  { id: "sonnenbrillen",label: "Sonnenbrille",                  checked: false, category: "kleidung" },
  { id: "sonnenhut",    label: "Sonnenhut / Mütze",             checked: false, category: "kleidung" },
  { id: "abendkleid",   label: "Abendgarderobe",                checked: false, category: "kleidung" },
  { id: "jacke",        label: "Leichte Jacke / Regenjacke",    checked: false, category: "kleidung" },
  { id: "sandalen",     label: "Sandalen & bequeme Schuhe",     checked: false, category: "kleidung" },
  // Toilette
  { id: "sonnencreme",  label: "Sonnencreme (LSF 30+)",         checked: false, category: "toilette" },
  { id: "insektenschutz",label: "Insektenschutz",               checked: false, category: "toilette" },
  { id: "zahnbuerste",  label: "Zahnbürste & Zahnpasta",        checked: false, category: "toilette" },
  { id: "shampoo",      label: "Shampoo & Duschgel",            checked: false, category: "toilette" },
  { id: "deo",          label: "Deo & Parfum",                  checked: false, category: "toilette" },
  // Elektronik
  { id: "handy",        label: "Smartphone & Ladekabel",        checked: false, category: "elektronik" },
  { id: "adapter",      label: "Reise-Adapter / Steckdosen",    checked: false, category: "elektronik" },
  { id: "powerbank",    label: "Powerbank",                     checked: false, category: "elektronik" },
  { id: "kamera",       label: "Kamera & Speicherkarte",        checked: false, category: "elektronik" },
  { id: "kopfhoerer",   label: "Kopfhörer",                     checked: false, category: "elektronik" },
  // Gesundheit
  { id: "schmerzmittel",label: "Schmerzmittel",                 checked: false, category: "gesundheit" },
  { id: "pflaster",     label: "Pflaster & Verbandsmaterial",   checked: false, category: "gesundheit" },
  { id: "magenmittel",  label: "Magenmittel / Reisekrankheit",  checked: false, category: "gesundheit" },
  { id: "rezeptmedis",  label: "Verschreibungspflichtige Medikamente", checked: false, category: "gesundheit" },
  // Sonstiges
  { id: "bargeld",      label: "Bargeld & Kreditkarte",         checked: false, category: "sonstiges" },
  { id: "schloss",      label: "Kofferschloss",                 checked: false, category: "sonstiges" },
  { id: "buch",         label: "Buch / E-Reader",               checked: false, category: "sonstiges" },
  { id: "reisekissen",  label: "Reisekissen",                   checked: false, category: "sonstiges" },
];

export default function ChecklistTab({ user, userProfile }: Props) {
  const t = useTranslations("dashboardChecklist");

  const [items, setItems] = useState<ChecklistItem[]>(
    userProfile?.checklist?.length ? userProfile.checklist : DEFAULT_ITEMS
  );
  const [newLabel, setNewLabel] = useState("");
  const [newCat, setNewCat]     = useState<Category>("sonstiges");
  const [saving, setSaving]     = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  // Autosave mit Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      setSaving(true);
      await updateChecklist(user.uid, items).catch(() => {});
      setSaving(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [items, user.uid]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  const addItem = () => {
    if (!newLabel.trim()) return;
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      label: newLabel.trim(),
      checked: false,
      category: newCat,
      custom: true,
    };
    setItems((prev) => [...prev, newItem]);
    setNewLabel("");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetAll = () => {
    if (confirm(t("resetConfirm"))) {
      setItems((prev) => prev.map((i) => ({ ...i, checked: false })));
    }
  };

  const categories = Object.keys(CATEGORY_I18N) as Category[];
  const visibleItems = activeCategory === "all"
    ? items
    : items.filter((i) => i.category === activeCategory);

  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount   = items.length;
  const percent      = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6">

    {/* Erklärung rechts */}
    <div className="order-first lg:order-last lg:w-64 shrink-0">
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 lg:sticky lg:top-28">
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">{t("howItWorks")}</h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start gap-2"><span className="shrink-0">✅</span><span>{t("hint1")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">➕</span><span>{t("hint2")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">📂</span><span>{t("hint3")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">💾</span><span>{t("hint4")}</span></li>
          <li className="flex items-start gap-2"><span className="shrink-0">🔄</span><span>{t("hint5")}</span></li>
        </ul>
      </div>
    </div>

    <div className="flex-1 min-w-0 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            {t("title")}
          </h2>
          <div className="flex items-center gap-3">
            {saving && <span className="text-xs text-gray-400">{t("saving")}</span>}
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t("reset")}
            </button>
          </div>
        </div>
      </div>

      {/* Fortschrittsbalken */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">{t("progress")}</span>
          <span className="text-sm font-bold text-emerald-600">{t("progressCount", { checked: checkedCount, total: totalCount })}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {percent === 100 && (
          <p className="text-sm text-emerald-600 font-semibold mt-2">
            {t("allDone")}
          </p>
        )}
      </div>

      {/* Kategorie-Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeCategory === "all"
              ? "bg-[#00838F] text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-[#00838F]"
          }`}
        >
          {t("filterAll", { count: totalCount })}
        </button>
        {categories.map((cat) => {
          const count = items.filter((i) => i.category === cat).length;
          const { key, emoji } = CATEGORY_I18N[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-[#00838F] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#00838F]"
              }`}
            >
              {emoji} {t(key)} ({count})
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {visibleItems.map((item, idx) => (
          <label
            key={item.id}
            className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors group ${
              idx > 0 ? "border-t border-gray-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggle(item.id)}
              className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
            />
            <span className={`flex-1 text-sm ${item.checked ? "line-through text-gray-400" : "text-gray-700"}`}>
              {CATEGORY_I18N[item.category].emoji} {item.label}
            </span>
            {item.custom && (
              <button
                onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </label>
        ))}

        {visibleItems.length === 0 && (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            {t("noItems")}
          </div>
        )}
      </div>

      {/* Neuer Eintrag */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#00838F]" />
          {t("addCustom")}
        </h3>
        <div className="flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder={t("addPlaceholder")}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#00838F]"
          />
          <select
            value={newCat}
            onChange={(e) => setNewCat(e.target.value as Category)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#00838F] bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_I18N[cat].emoji} {t(CATEGORY_I18N[cat].key)}
              </option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="bg-[#00838F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#006E7A] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
