"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Plus, X, Loader2, CheckCircle, Upload, ImageIcon, Star, Euro, Info } from "lucide-react";
import WerbeplatzBuchen from "@/components/anbieter/WerbeplatzBuchen";
import Image from "next/image";

const KATEGORIEN = [
  "stadtfuehrung","tagesausflug","wassersport","outdoor","kulinarik","kultur","fotoshooting","transfer",
];
const KAT_LABEL: Record<string, string> = {
  stadtfuehrung: "Stadtführung", tagesausflug: "Tagesausflug", wassersport: "Wassersport",
  outdoor: "Outdoor & Wandern", kulinarik: "Kulinarik", kultur: "Kultur & Kunst",
  fotoshooting: "Fotoshooting", transfer: "Transfer",
};

const SPRACHEN_OPTIONEN = [
  "Deutsch","Englisch","Türkisch","Spanisch","Französisch","Italienisch",
  "Russisch","Arabisch","Griechisch","Polnisch","Niederländisch","Japanisch","Chinesisch",
];

const PREISTYPEN = [
  { value: "pro_person",  label: "pro Person",  hint: "Preis wird mit Teilnehmerzahl multipliziert" },
  { value: "pro_gruppe",  label: "pro Gruppe",  hint: "Fester Preis unabhängig von der Gruppengröße" },
  { value: "festpreis",   label: "Festpreis",   hint: "Einmaliger Gesamtpreis (z. B. privater Transfer)" },
  { value: "auf_anfrage", label: "Auf Anfrage", hint: "Preis wird individuell vereinbart" },
];

const PROVISION = 0.15;

// ── Tag-Input ─────────────────────────────────────────────────────────────────
function TagInput({ label, values, onChange, placeholder }: {
  label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setInput("");
  };
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-7">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 bg-[#00838F]/10 text-[#00838F] text-xs font-semibold px-2.5 py-1 rounded-full">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? "Eingabe + Enter"}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]"
        />
        <button type="button" onClick={add}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Sprachen-Toggle ───────────────────────────────────────────────────────────
function SprachenInput({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const toggle = (s: string) =>
    onChange(values.includes(s) ? values.filter((x) => x !== s) : [...values, s]);
  return (
    <div className="flex flex-wrap gap-2">
      {SPRACHEN_OPTIONEN.map((s) => (
        <button key={s} type="button" onClick={() => toggle(s)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            values.includes(s)
              ? "bg-[#00838F] text-white border-[#00838F]"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#00838F]"
          }`}>
          {s}
        </button>
      ))}
    </div>
  );
}

// ── Foto-Upload ───────────────────────────────────────────────────────────────
function FotoUpload({ hauptfoto, weiterefotos, onHauptfoto, onAddFoto, onRemoveFoto, uploading }: {
  hauptfoto: string; weiterefotos: string[];
  onHauptfoto: (url: string) => void; onAddFoto: (url: string) => void;
  onRemoveFoto: (url: string) => void; uploading: boolean;
}) {
  const sb      = createSupabaseBrowser();
  const refMain = useRef<HTMLInputElement>(null);
  const refMore = useRef<HTMLInputElement>(null);

  const upload = async (file: File, onDone: (url: string) => void) => {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const ext  = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("angebote-fotos").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = sb.storage.from("angebote-fotos").getPublicUrl(path);
      onDone(data.publicUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">
          Hauptfoto <span className="text-red-400">*</span>
          <span className="text-gray-400 font-normal ml-1">— Vorschaubild & Hero</span>
        </p>
        {hauptfoto ? (
          <div className="relative h-48 rounded-2xl overflow-hidden group">
            <Image src={hauptfoto} alt="Hauptfoto" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button type="button" onClick={() => refMain.current?.click()}
                className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl">Ersetzen</button>
              <button type="button" onClick={() => onHauptfoto("")}
                className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl">Entfernen</button>
            </div>
            <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-900" /> Hauptfoto
            </span>
          </div>
        ) : (
          <div onClick={() => refMain.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-[#00838F] hover:bg-[#00838F]/5 transition-all group">
            {uploading
              ? <Loader2 className="w-8 h-8 text-[#00838F] animate-spin mb-2" />
              : <>
                  <ImageIcon className="w-10 h-10 text-gray-300 group-hover:text-[#00838F] mb-3 transition-colors" />
                  <p className="text-sm font-semibold text-gray-500 group-hover:text-[#00838F] transition-colors">Hauptfoto hochladen</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · max. 10 MB · Querformat empfohlen</p>
                </>
            }
          </div>
        )}
        <input ref={refMain} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, onHauptfoto); }} />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">
          Weitere Fotos <span className="text-gray-400 font-normal">— bis zu 5</span>
        </p>
        <div className="grid grid-cols-5 gap-2">
          {weiterefotos.map((url) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
              <Image src={url} alt="Foto" fill className="object-cover" unoptimized />
              <button type="button" onClick={() => onRemoveFoto(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {weiterefotos.length < 5 && (
            <div onClick={() => refMore.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#00838F] hover:bg-[#00838F]/5 transition-all">
              {uploading
                ? <Loader2 className="w-5 h-5 text-[#00838F] animate-spin" />
                : <><Upload className="w-5 h-5 text-gray-300" /><span className="text-[10px] text-gray-400 mt-1">Foto</span></>
              }
            </div>
          )}
        </div>
        <input ref={refMore} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, onAddFoto); }} />
      </div>
    </div>
  );
}

// ── Preis-Vorschau Sidebar ────────────────────────────────────────────────────
function PreisVorschau({ preis, preistyp }: { preis: string; preistyp: string }) {
  const p        = parseFloat(preis);
  const hasPreis = !isNaN(p) && p > 0 && preistyp !== "auf_anfrage";
  const provision = hasPreis ? p * PROVISION : 0;
  const auszahlung = hasPreis ? p * (1 - PROVISION) : 0;

  const preistypInfo = PREISTYPEN.find((t) => t.value === preistyp);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#00838F]/10 flex items-center justify-center">
          <Euro className="w-4 h-4 text-[#00838F]" />
        </div>
        <p className="font-bold text-gray-900 text-sm">Preisübersicht</p>
      </div>

      {preistyp === "auf_anfrage" ? (
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-gray-600">Preis auf Anfrage</p>
          <p className="text-xs text-gray-400 mt-1">Provision wird nach Vereinbarung berechnet</p>
        </div>
      ) : hasPreis ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">Kundenpreis {preistypInfo?.label && `(${preistypInfo.label})`}</span>
            <span className="text-base font-black text-gray-900">{p.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-gray-500">Urlaubfinder365 (15%)</span>
            <span className="text-sm font-semibold text-red-500">− {provision.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center py-2 bg-emerald-50 rounded-xl px-3">
            <span className="text-xs font-bold text-emerald-700">Deine Auszahlung (85%)</span>
            <span className="text-base font-black text-emerald-700">{auszahlung.toFixed(2)} €</span>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 text-center text-xs text-gray-400">
          Preis eingeben um Kalkulation zu sehen
        </div>
      )}

      {/* Steuerhinweis */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-800 leading-relaxed">
            <p className="font-bold mb-1">Steuerlicher Hinweis</p>
            <p>Die Steuerpflicht richtet sich nach deinem Wohnsitzland. Deutsche Anbieter prüfen bitte §19 UStG (Kleinunternehmer) oder weisen ggf. 19 % USt. aus. Dieser Preis ist der Bruttopreis für den Kunden.</p>
          </div>
        </div>
      </div>

      {/* Beispielrechnung bei Buchung */}
      {hasPreis && preistyp === "pro_person" && (
        <div className="border border-gray-100 rounded-xl p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Beispiel: 4 Personen</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Gesamtumsatz</span>
            <span className="text-sm font-bold text-gray-900">{(p * 4).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">Deine Auszahlung</span>
            <span className="text-sm font-bold text-emerald-700">{(auszahlung * 4).toFixed(2)} €</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const INPUT = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F]";

// ── Types ─────────────────────────────────────────────────────────────────────
interface AngebotData {
  id?: string;
  titel?: string; slug?: string; kurzbeschreibung?: string; beschreibung?: string;
  kategorie?: string; ziel?: string; land?: string; preis?: number; preistyp?: string;
  dauer?: string; max_teilnehmer?: number; sprachen?: string[]; highlights?: string[];
  inbegriffen?: string[]; nicht_inbegriffen?: string[]; treffpunkt?: string;
  foto_url?: string; fotos?: string[]; status?: string;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AngebotForm({ anbieter_id, initial }: { anbieter_id: string; initial?: AngebotData }) {
  const router = useRouter();
  const sb     = createSupabaseBrowser();
  const isEdit = !!initial?.id;

  const [titel,            setTitel]            = useState(initial?.titel ?? "");
  const [kurzbeschreibung, setKurzbeschreibung] = useState(initial?.kurzbeschreibung ?? "");
  const [beschreibung,     setBeschreibung]     = useState(initial?.beschreibung ?? "");
  const [kategorie,        setKategorie]        = useState(initial?.kategorie ?? "");
  const [ziel,             setZiel]             = useState(initial?.ziel ?? "");
  const [land,             setLand]             = useState(initial?.land ?? "");
  const [preis,            setPreis]            = useState(initial?.preis?.toString() ?? "");
  const [preistyp,         setPreistyp]         = useState(initial?.preistyp ?? "pro_person");
  const [dauer,            setDauer]            = useState(initial?.dauer ?? "");
  const [maxTn,            setMaxTn]            = useState(initial?.max_teilnehmer?.toString() ?? "10");
  const [sprachen,         setSprachen]         = useState<string[]>(initial?.sprachen ?? []);
  const [highlights,       setHighlights]       = useState<string[]>(initial?.highlights ?? []);
  const [inbegriffen,      setInbegriffen]      = useState<string[]>(initial?.inbegriffen ?? []);
  const [nichtInbegriffen, setNichtInbegriffen] = useState<string[]>(initial?.nicht_inbegriffen ?? []);
  const [treffpunkt,       setTreffpunkt]       = useState(initial?.treffpunkt ?? "");
  const [hauptfoto,        setHauptfoto]        = useState(initial?.foto_url ?? "");
  const [weiterefotos,     setWeiterefotos]     = useState<string[]>(initial?.fotos ?? []);
  const [status,           setStatus]           = useState(initial?.status ?? "entwurf");

  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  const makeSlug = (t: string) =>
    t.toLowerCase().replace(/[äöü]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue" }[c] ?? c))
     .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titel || !kategorie || !ziel) { setError("Titel, Kategorie und Reiseziel sind Pflicht."); return; }
    if (preistyp !== "auf_anfrage" && !preis) { setError("Bitte Preis eingeben oder 'Auf Anfrage' wählen."); return; }
    if (!hauptfoto) { setError("Bitte lade mindestens ein Hauptfoto hoch."); return; }
    setError("");
    setLoading(true);

    const payload = {
      anbieter_id, titel,
      slug: isEdit ? initial!.slug : makeSlug(titel) + "-" + Date.now(),
      kurzbeschreibung, beschreibung, kategorie, ziel, land,
      preis: preis ? parseFloat(preis) : null,
      preistyp, dauer,
      max_teilnehmer: parseInt(maxTn),
      sprachen, highlights, inbegriffen,
      nicht_inbegriffen: nichtInbegriffen,
      treffpunkt, foto_url: hauptfoto, fotos: weiterefotos, status,
    };

    if (isEdit) {
      const { error: err } = await sb.from("angebote" as never).update(payload as never).eq("id", initial!.id!);
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await sb.from("angebote" as never).insert(payload as never);
      if (err) { setError(err.message); setLoading(false); return; }
    }
    setSuccess(true);
    setTimeout(() => router.push("/anbieter/angebote/"), 1500);
  };

  if (success) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
      <h2 className="font-black text-gray-900 text-xl">Angebot {isEdit ? "aktualisiert" : "gespeichert"}!</h2>
      <p className="text-gray-500 mt-2 text-sm">Du wirst weitergeleitet …</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      {/* ── Linke Spalte: Formular ─────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

        {/* Fotos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1">Fotos</h2>
          <p className="text-xs text-gray-400 mb-5">Angebote mit Fotos werden 3× häufiger gebucht</p>
          <FotoUpload
            hauptfoto={hauptfoto}
            weiterefotos={weiterefotos}
            onHauptfoto={(url) => { setHauptfoto(url); setUploadingFoto(false); }}
            onAddFoto={(url) => { setWeiterefotos((p) => [...p, url]); setUploadingFoto(false); }}
            onRemoveFoto={(url) => setWeiterefotos((p) => p.filter((x) => x !== url))}
            uploading={uploadingFoto}
          />
        </div>

        {/* Basisinformationen */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Basisinformationen</h2>
          <Field label="Titel" required>
            <input type="text" value={titel} onChange={(e) => setTitel(e.target.value)}
              placeholder="z. B. Bootsfahrt entlang der Küste Antalyas" className={INPUT} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Kategorie" required>
              <select value={kategorie} onChange={(e) => setKategorie(e.target.value)} className={INPUT + " bg-white"}>
                <option value="">Bitte wählen …</option>
                {KATEGORIEN.map((k) => <option key={k} value={k}>{KAT_LABEL[k]}</option>)}
              </select>
            </Field>
            <Field label="Reiseziel / Stadt" required hint="z. B. Antalya, Türkei">
              <input type="text" value={ziel} onChange={(e) => setZiel(e.target.value)}
                placeholder="Antalya, Türkei" className={INPUT} />
            </Field>
          </div>

          {/* Preistyp + Preis */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-600 block">Preismodell <span className="text-red-400">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PREISTYPEN.map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setPreistyp(value)}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                    preistyp === value
                      ? "border-[#00838F] bg-[#00838F]/10 text-[#00838F]"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            {preistyp !== "auf_anfrage" && (
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">€</span>
                    <input type="number" min="0" step="0.01" value={preis}
                      onChange={(e) => setPreis(e.target.value)}
                      placeholder="0.00"
                      className={INPUT + " pl-8"} />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {PREISTYPEN.find(t => t.value === preistyp)?.hint}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Dauer" hint="z. B. 3 Stunden, Ganztag">
              <input type="text" value={dauer} onChange={(e) => setDauer(e.target.value)}
                placeholder="3 Stunden" className={INPUT} />
            </Field>
            <Field label="Max. Teilnehmer">
              <input type="number" min="1" value={maxTn} onChange={(e) => setMaxTn(e.target.value)} className={INPUT} />
            </Field>
          </div>
          <Field label="Kurzbeschreibung" hint="1–2 Sätze für Suchergebnisse und Vorschaukarten">
            <textarea value={kurzbeschreibung} onChange={(e) => setKurzbeschreibung(e.target.value)}
              rows={2} className={INPUT + " resize-none"} placeholder="Was macht dieses Erlebnis besonders?" />
          </Field>
          <Field label="Ausführliche Beschreibung">
            <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)}
              rows={5} className={INPUT + " resize-none"} placeholder="Was erwartet die Teilnehmer genau? Ablauf, Highlights, besondere Erlebnisse …" />
          </Field>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Details & Ausstattung</h2>
          <TagInput label="Highlights" values={highlights} onChange={setHighlights}
            placeholder="z. B. Hadriantor · Enter" />
          <TagInput label="Im Preis inbegriffen" values={inbegriffen} onChange={setInbegriffen}
            placeholder="z. B. Guide, Mittagessen · Enter" />
          <TagInput label="Nicht inbegriffen" values={nichtInbegriffen} onChange={setNichtInbegriffen}
            placeholder="z. B. Eintrittsgelder · Enter" />
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Sprachen</label>
            <SprachenInput values={sprachen} onChange={setSprachen} />
          </div>
          <Field label="Treffpunkt" hint="Genaue Adresse oder Beschreibung des Startpunkts">
            <input type="text" value={treffpunkt} onChange={(e) => setTreffpunkt(e.target.value)}
              placeholder="z. B. Hadriantor, Kaleiçi, Antalya" className={INPUT} />
          </Field>
        </div>

        {/* Veröffentlichung */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Veröffentlichung</h2>
          <div className="flex gap-3 flex-wrap">
            {[
              { v: "entwurf",  l: "Entwurf speichern",       c: "border-gray-300 text-gray-600 bg-gray-50" },
              { v: "aktiv",    l: "✅ Sofort veröffentlichen", c: "border-emerald-400 text-emerald-700 bg-emerald-50" },
              { v: "pausiert", l: "⏸ Pausieren",              c: "border-amber-300 text-amber-700 bg-amber-50" },
            ].map(({ v, l, c }) => (
              <button key={v} type="button" onClick={() => setStatus(v)}
                className={`flex-1 py-2.5 border-2 rounded-xl text-sm font-bold transition-all ${
                  status === v ? c + " ring-2 ring-offset-1 ring-[#00838F]" : "border-gray-200 text-gray-400 hover:bg-gray-50"
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-60 text-white font-black py-4 rounded-2xl text-sm transition-colors">
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gespeichert …</>
            : isEdit ? "Änderungen speichern" : "Angebot anlegen →"
          }
        </button>
      </form>

      {/* ── Rechte Spalte: Preis-Vorschau + Werbeplatz ────────────────── */}
      <div className="sticky top-24 space-y-4">
        <PreisVorschau preis={preis} preistyp={preistyp} />
        <WerbeplatzBuchen anbieter_id={anbieter_id} />
      </div>
    </div>
  );
}
