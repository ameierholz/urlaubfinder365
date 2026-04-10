"use client";

/**
 * TipFormModal — extrahiert aus dem alten TravelMapClient.
 *
 * Modal zum Einreichen eines Reise-Tipps:
 *   - Ort wird auf der Karte gepickt (lat/lng kommen via Props rein)
 *   - Form: locationName, category, title, description, optionales Bild
 *   - Submit → addTravelTip + uploadTravelTipImage → "pending"
 *   - Erfolgsscreen nach Submit
 */

import { useRef, useState } from "react";
import { X, MapPin, Plus, AlertCircle, Loader2, ImagePlus, CheckCircle2 } from "lucide-react";
import { addTravelTip, uploadTravelTipImage } from "@/lib/supabase-db";
import { CATEGORY_CONFIG } from "@/lib/map/tip-categories";
import type { TravelTipCategory } from "@/types";
import type { AppUser } from "@/context/AuthContext";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "geheimtipp" as TravelTipCategory,
  locationName: "",
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface Props {
  user:        AppUser;
  pendingLat:  number;
  pendingLng:  number;
  /** Ruft auf wenn der User "Ort ändern" klickt — Parent setzt Picking-Modus */
  onRepick:    () => void;
  onClose:     () => void;
  /** Wird aufgerufen nach erfolgreichem Submit (für Refresh) */
  onSubmitted?: () => void;
}

export default function TipFormModal({
  user,
  pendingLat,
  pendingLng,
  onRepick,
  onClose,
  onSubmitted,
}: Props) {
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("Bild darf maximal 5 MB groß sein.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  }

  async function submitTip() {
    if (!form.title.trim() || !form.description.trim() || !form.locationName.trim()) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadTravelTipImage(user.uid, imageFile);
      }
      await addTravelTip(user.uid, {
        displayName: user.displayName ?? user.email?.split("@")[0] ?? "Anonym",
        ...form,
        lat: pendingLat,
        lng: pendingLng,
        imageUrl,
      });
      setSubmitted(true);
      setImageFile(null);
      setImagePreview(null);
      onSubmitted?.();
    } catch {
      setError("Fehler beim Speichern. Bitte erneut versuchen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-1000 flex items-end sm:items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full sm:max-w-md mx-auto overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#1db682] px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-bold text-base">Reise-Tipp teilen</h2>
            <p className="text-white/80 text-xs mt-0.5">
              {submitted
                ? "Tipp eingereicht"
                : `📍 ${pendingLat.toFixed(3)}°, ${pendingLng.toFixed(3)}°`}
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">Tipp eingereicht!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Dein Tipp wird vom Team geprüft und in Kürze freigeschaltet. Danke für deinen Beitrag!
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-[#1db682] hover:bg-[#17a374] text-white rounded-xl text-sm font-bold transition-colors"
            >
              Schließen
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Ort-Status */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-sm text-emerald-700 font-semibold">Ort markiert</span>
              <button onClick={onRepick} className="ml-auto text-xs text-emerald-600 hover:underline">
                Ändern
              </button>
            </div>

            {/* Orts-Bezeichnung */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Ort / Stadt *</label>
              <input
                type="text"
                placeholder="z.B. Antalya, Türkei"
                value={form.locationName}
                onChange={(e) => setForm((f) => ({ ...f, locationName: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1db682]/50"
              />
            </div>

            {/* Kategorie */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Kategorie *</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(CATEGORY_CONFIG) as [TravelTipCategory, typeof CATEGORY_CONFIG[TravelTipCategory]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: key }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                      form.category === key ? "border-current text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    style={form.category === key ? { background: cfg.color, borderColor: cfg.color } : {}}
                  >
                    <span>{cfg.emoji}</span>
                    <span>{cfg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Titel */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Titel *</label>
              <input
                type="text"
                placeholder="Kurzer, prägnanter Titel"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                maxLength={80}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1db682]/50"
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Beschreibung *</label>
              <textarea
                placeholder="Was macht diesen Ort besonders? Tipps, Hinweise, Öffnungszeiten…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                maxLength={400}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1db682]/50 resize-none"
              />
              <p className="text-right text-[10px] text-gray-400">{form.description.length}/400</p>
            </div>

            {/* Bild-Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Foto (optional, max. 5 MB)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Vorschau" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 flex flex-col items-center gap-1.5 text-gray-400 hover:border-[#1db682] hover:text-[#1db682] transition-colors"
                >
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs font-semibold">Foto hinzufügen</span>
                  <span className="text-[10px]">JPG, PNG, WebP bis 5 MB</span>
                </button>
              )}
            </div>

            {/* Fehler */}
            {error && (
              <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-semibold"
              >
                Abbrechen
              </button>
              <button
                onClick={submitTip}
                disabled={saving}
                className="flex-1 py-2.5 bg-[#1db682] hover:bg-[#17a374] disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? "Wird gespeichert…" : "Tipp einreichen"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
