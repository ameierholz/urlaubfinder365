"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import {
  CheckCircle, Loader2, Upload, X, Camera,
  MapPin, Globe, CreditCard, FileText, User,
} from "lucide-react";
import Image from "next/image";

const KATEGORIEN = [
  "Stadtführungen","Tagesausflüge","Wassersport","Kulinarik",
  "Transfer","Fotoshooting","Outdoor & Wandern","Kultur & Kunst","Sonstiges",
];
const LAENDER = [
  "Afghanistan","Ägypten","Albanien","Algerien","Angola","Argentinien","Armenien",
  "Aserbaidschan","Äthiopien","Australien","Bahrain","Bangladesch","Belgien",
  "Bolivien","Bosnien-Herzegowina","Brasilien","Bulgarien","Chile","China",
  "Costa Rica","Dänemark","Deutschland","Dominikanische Republik","Ecuador",
  "El Salvador","Estland","Finnland","Frankreich","Georgien","Ghana","Griechenland",
  "Großbritannien","Guatemala","Honduras","Indien","Indonesien","Irak","Iran",
  "Irland","Island","Israel","Italien","Japan","Jemen","Jordanien","Kambodscha",
  "Kamerun","Kanada","Kasachstan","Katar","Kenia","Kolumbien","Kosovo","Kroatien",
  "Kuba","Kuwait","Laos","Lettland","Libanon","Libyen","Litauen","Luxemburg",
  "Malaysia","Malta","Marokko","Mauritius","Mexiko","Moldau","Montenegro",
  "Mosambik","Myanmar","Namibia","Nepal","Neuseeland","Nicaragua","Niederlande",
  "Nigeria","Nordmazedonien","Norwegen","Oman","Österreich","Pakistan","Panama",
  "Paraguay","Peru","Philippinen","Polen","Portugal","Rumänien","Russland",
  "Saudi-Arabien","Schweden","Schweiz","Senegal","Serbien","Singapur","Slowakei",
  "Slowenien","Spanien","Sri Lanka","Südafrika","Südkorea","Syrien","Tansania",
  "Thailand","Tschechien","Tunesien","Türkei","Uganda","Ukraine","Ungarn",
  "Uruguay","USA","Usbekistan","Vereinigte Arabische Emirate","Vietnam","Weißrussland",
  "Zypern","Andere",
];
const SPRACHEN_OPTIONEN = [
  "Deutsch","Englisch","Türkisch","Spanisch","Französisch","Italienisch",
  "Russisch","Arabisch","Griechisch","Polnisch","Niederländisch",
];

const INPUT = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00838F] bg-white";
const LABEL = "text-xs font-semibold text-gray-600 mb-1.5 block";

// ── Tag-Input für Sprachen ──────────────────────────────────────────────────
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

// ── Datei-Upload-Feld ───────────────────────────────────────────────────────
function FileUploadField({
  label, hint, accept, preview, onUpload, uploading,
}: {
  label: string; hint: string; accept: string;
  preview?: string | null; onUpload: (f: File) => void; uploading?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#00838F] transition-colors group"
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 text-[#00838F] animate-spin mx-auto mb-2" />
        ) : preview ? (
          <div className="flex items-center justify-center gap-3">
            {preview.startsWith("http") && accept.includes("image") ? (
              <Image src={preview} alt="Vorschau" width={56} height={56} className="w-14 h-14 rounded-xl object-cover" unoptimized />
            ) : (
              <FileText className="w-8 h-8 text-emerald-500" />
            )}
            <div className="text-left">
              <p className="text-sm font-semibold text-emerald-600">✅ Datei hochgeladen</p>
              <p className="text-xs text-gray-400 mt-0.5">Klicken zum Ersetzen</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-[#00838F] transition-colors" />
            <p className="text-sm text-gray-500 group-hover:text-[#00838F] transition-colors">Datei auswählen</p>
            <p className="text-xs text-gray-400 mt-1">{hint}</p>
          </>
        )}
        <input ref={ref} type="file" accept={accept} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
      </div>
    </div>
  );
}

// ── Sektions-Header ─────────────────────────────────────────────────────────
function SektionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5">
      <div className="w-9 h-9 rounded-xl bg-[#00838F]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#00838F]" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
    </div>
  );
}

// ── Haupt-Formular ──────────────────────────────────────────────────────────
interface Props {
  profilId?: string;
  initial?: {
    telefon?: string; standort?: string; kategorie?: string; bio?: string;
    strasse?: string; plz?: string; stadt?: string; land_name?: string;
    webseite?: string; instagram?: string; erfahrung_jahre?: number;
    sprachen?: string[]; iban?: string; bic?: string; kontoinhaber?: string;
    avatar_url?: string; titelbild_url?: string; dokument_url?: string;
  };
}

export default function ProfilEinrichtenForm({ profilId, initial }: Props) {
  const router = useRouter();
  const sb     = createSupabaseBrowser();

  // Sektion 1: Kontakt
  const [telefon,   setTelefon]   = useState(initial?.telefon ?? "");
  const [standort,  setStandort]  = useState(initial?.standort ?? "");
  const [kategorie, setKategorie] = useState(initial?.kategorie ?? "");
  const [bio,       setBio]       = useState(initial?.bio ?? "");

  // Sektion 2: Adresse
  const [strasse,   setStrasse]   = useState(initial?.strasse ?? "");
  const [plz,       setPlz]       = useState(initial?.plz ?? "");
  const [stadt,     setStadt]     = useState(initial?.stadt ?? "");
  const [landName,  setLandName]  = useState(initial?.land_name ?? "Deutschland");

  // Sektion 3: Erfahrung & Online
  const [sprachen,  setSprachen]  = useState<string[]>(initial?.sprachen ?? []);
  const [jahre,     setJahre]     = useState(initial?.erfahrung_jahre?.toString() ?? "");
  const [webseite,  setWebseite]  = useState(initial?.webseite ?? "");
  const [instagram, setInstagram] = useState(initial?.instagram ?? "");

  // Sektion 4: Bank
  const [iban,          setIban]          = useState(initial?.iban ?? "");
  const [bic,           setBic]           = useState(initial?.bic ?? "");
  const [kontoinhaber,  setKontoinhaber]  = useState(initial?.kontoinhaber ?? "");

  // Sektion 5: Dateien
  const [avatarUrl,     setAvatarUrl]     = useState(initial?.avatar_url ?? "");
  const [titelbildUrl,  setTitelbildUrl]  = useState(initial?.titelbild_url ?? "");
  const [dokumentUrl,   setDokumentUrl]   = useState(initial?.dokument_url ?? "");
  const [uploadingAvatar,    setUploadingAvatar]    = useState(false);
  const [uploadingTitelbild, setUploadingTitelbild] = useState(false);
  const [uploadingDokument,  setUploadingDokument]  = useState(false);

  const [loading,  setLoading]  = useState(false);
  const [fehler,   setFehler]   = useState("");
  const [success,  setSuccess]  = useState(false);

  // ── File Upload Helpers ───────────────────────────────────────────────────
  const uploadFile = async (file: File, bucket: string, setUploading: (v: boolean) => void, setUrl: (v: string) => void) => {
    setUploading(true);
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const ext  = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from(bucket).upload(path, file, { upsert: true });
    if (!error) {
      const { data } = sb.storage.from(bucket).getPublicUrl(path);
      setUrl(data.publicUrl);
    }
    setUploading(false);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const senden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!standort || !kategorie) {
      setFehler("Standort und Kategorie sind Pflichtfelder.");
      return;
    }
    setFehler("");
    setLoading(true);

    const payload = {
      telefon: telefon || null, standort, kategorie, bio: bio || null,
      strasse: strasse || null, plz: plz || null, stadt: stadt || null, land_name: landName,
      sprachen, erfahrung_jahre: jahre ? parseInt(jahre) : null,
      webseite: webseite || null, instagram: instagram || null,
      iban: iban || null, bic: bic || null, kontoinhaber: kontoinhaber || null,
      avatar_url: avatarUrl || null, titelbild_url: titelbildUrl || null,
      dokument_url: dokumentUrl || null,
      status: "ausstehend",
    };

    if (profilId) {
      const { error } = await sb.from("anbieter_profile" as never).update(payload as never).eq("id", profilId);
      if (error) { setFehler(error.message); setLoading(false); return; }
    } else {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { setFehler("Nicht angemeldet."); setLoading(false); return; }
      const { error } = await sb.from("anbieter_profile" as never)
        .upsert({ user_id: user.id, email: user.email, ...payload } as never);
      if (error) { setFehler(error.message); setLoading(false); return; }
    }

    setSuccess(true);
    setTimeout(() => router.push("/anbieter/dashboard/"), 2000);
  };

  if (success) return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
      <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
      <h2 className="font-black text-gray-900 text-xl mb-2">Profil gespeichert!</h2>
      <p className="text-gray-500 text-sm">Wir prüfen deine Angaben und schalten dich innerhalb von 48 Stunden frei.</p>
    </div>
  );

  return (
    <form onSubmit={senden} className="space-y-6">

      {/* ── 1. Profilbild & Titelbild ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <SektionHeader icon={Camera} title="Bilder" sub="Profilbild und Titelbild für dein öffentliches Profil" />

        {/* Profilbild */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-3">Profilbild <span className="text-gray-400 font-normal">(Gesicht / Logo)</span></p>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
              {avatarUrl
                ? <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" unoptimized />
                : <User className="w-8 h-8 text-gray-300" />
              }
            </div>
            <div className="flex-1">
              <FileUploadField
                label=""
                hint="JPG, PNG oder WebP · max. 5 MB"
                accept="image/jpeg,image/png,image/webp"
                preview={avatarUrl || null}
                uploading={uploadingAvatar}
                onUpload={(f) => uploadFile(f, "anbieter-avatars", setUploadingAvatar, setAvatarUrl)}
              />
            </div>
          </div>
        </div>

        {/* Titelbild / Hero */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-1">Titelbild <span className="text-gray-400 font-normal">(Hero-Banner auf deinem Profil)</span></p>
          <p className="text-[11px] text-gray-400 mb-3">Landschaftsformat empfohlen — z. B. ein schönes Foto deines Reiseziels oder einer deiner Touren · min. 1200 × 400 px</p>
          {titelbildUrl && (
            <div className="relative h-28 rounded-2xl overflow-hidden mb-3 bg-gray-100">
              <Image src={titelbildUrl} alt="Titelbild" fill className="object-cover" unoptimized />
            </div>
          )}
          <FileUploadField
            label=""
            hint="JPG, PNG oder WebP · Querformat · max. 10 MB"
            accept="image/jpeg,image/png,image/webp"
            preview={titelbildUrl || null}
            uploading={uploadingTitelbild}
            onUpload={(f) => uploadFile(f, "anbieter-avatars", setUploadingTitelbild, setTitelbildUrl)}
          />
        </div>
      </div>

      {/* ── 2. Kontakt & Angebot ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <SektionHeader icon={User} title="Kontakt & Angebot" sub="Pflichtangaben für dein Profil" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Standort <span className="text-red-400">*</span></label>
            <input type="text" value={standort} onChange={(e) => setStandort(e.target.value)}
              placeholder="z. B. Antalya, Türkei" className={INPUT} />
            <p className="text-[11px] text-gray-400 mt-1">Stadt und Land — wird öffentlich auf deinem Profil angezeigt</p>
          </div>
          <div>
            <label className={LABEL}>Telefon (optional)</label>
            <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)}
              placeholder="+90 555 123 45 67" className={INPUT} />
            <p className="text-[11px] text-gray-400 mt-1">Mit Ländervorwahl, z. B. +90, +34, +30 …</p>
          </div>
        </div>

        <div>
          <label className={LABEL}>Kategorie deiner Angebote <span className="text-red-400">*</span></label>
          <select value={kategorie} onChange={(e) => setKategorie(e.target.value)} className={INPUT}>
            <option value="">Bitte wählen …</option>
            {KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div>
          <label className={LABEL}>Sprachen die du sprichst</label>
          <SprachenInput values={sprachen} onChange={setSprachen} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Jahre Erfahrung als Guide</label>
            <input type="number" min="0" max="50" value={jahre}
              onChange={(e) => setJahre(e.target.value)}
              placeholder="z. B. 5" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Über dich & deine Angebote</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)}
            placeholder="Was bietest du an? Was macht dich besonders? Warum sollten Reisende bei dir buchen?"
            rows={4} className={INPUT + " resize-none"} />
        </div>
      </div>

      {/* ── 3. Geschäftsadresse ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <SektionHeader icon={MapPin} title="Geschäftsadresse" sub="Wird nicht öffentlich angezeigt — nur für die Vertragsabwicklung" />

        <div>
          <label className={LABEL}>Straße & Hausnummer</label>
          <input type="text" value={strasse} onChange={(e) => setStrasse(e.target.value)}
            placeholder="Musterstraße 1" className={INPUT} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className={LABEL}>PLZ</label>
            <input type="text" value={plz} onChange={(e) => setPlz(e.target.value)}
              placeholder="12345" className={INPUT} />
          </div>
          <div className="col-span-1 sm:col-span-1">
            <label className={LABEL}>Stadt</label>
            <input type="text" value={stadt} onChange={(e) => setStadt(e.target.value)}
              placeholder="Antalya" className={INPUT} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL}>Land</label>
            <select value={landName} onChange={(e) => setLandName(e.target.value)} className={INPUT}>
              {LAENDER.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── 4. Online-Präsenz ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <SektionHeader icon={Globe} title="Online-Präsenz" sub="Optional — nur intern sichtbar, nicht öffentlich angezeigt" />
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800">
          🔒 Diese Angaben sind <strong>nur für unser Team</strong> sichtbar und helfen uns bei der Verifizierung. Auf deinem öffentlichen Profil werden sie nicht angezeigt.
        </div>

        <div>
          <label className={LABEL}>Webseite</label>
          <input type="url" value={webseite} onChange={(e) => setWebseite(e.target.value)}
            placeholder="https://deine-webseite.de" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Instagram</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
            <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
              placeholder="dein_handle" className={INPUT + " pl-8"} />
          </div>
        </div>
      </div>

      {/* ── 5. Bankverbindung ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <SektionHeader icon={CreditCard} title="Bankverbindung" sub="Für die Auszahlung deines Anteils (85%) — verschlüsselt gespeichert" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
          💡 Deine Bankdaten werden verschlüsselt gespeichert und ausschließlich für Auszahlungen verwendet.
          Sie werden niemals öffentlich angezeigt.
        </div>

        <div>
          <label className={LABEL}>Kontoinhaber</label>
          <input type="text" value={kontoinhaber} onChange={(e) => setKontoinhaber(e.target.value)}
            placeholder="Max Mustermann" className={INPUT} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>IBAN</label>
            <input type="text" value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase().replace(/\s/g, ""))}
              placeholder="DE00 0000 0000 0000 0000 00" className={INPUT + " font-mono tracking-wider"} />
          </div>
          <div>
            <label className={LABEL}>BIC / SWIFT</label>
            <input type="text" value={bic}
              onChange={(e) => setBic(e.target.value.toUpperCase())}
              placeholder="XXXXXXXX" className={INPUT + " font-mono"} />
          </div>
        </div>
      </div>

      {/* ── 6. Dokumente ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <SektionHeader icon={FileText} title="Dokumente & Lizenz" sub="Gewerbeschein, Reiseführer-Lizenz oder andere Nachweise" />

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800">
          📋 Lade deinen Gewerbeschein, deine Reiseführer-Lizenz oder einen anderen offiziellen Nachweis hoch.
          Das beschleunigt die Freischaltung erheblich.
        </div>

        <FileUploadField
          label="Lizenz / Gewerbeschein"
          hint="PDF, JPG oder PNG · max. 10 MB"
          accept="application/pdf,image/jpeg,image/png"
          preview={dokumentUrl || null}
          uploading={uploadingDokument}
          onUpload={(f) => uploadFile(f, "anbieter-dokumente", setUploadingDokument, setDokumentUrl)}
        />

        {dokumentUrl && (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
            <span className="text-xs text-gray-600 font-medium">✅ Dokument hochgeladen</span>
            <button type="button" onClick={() => setDokumentUrl("")}
              className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1">
              <X className="w-3 h-3" /> Entfernen
            </button>
          </div>
        )}
      </div>

      {fehler && <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{fehler}</p>}

      <button type="submit" disabled={loading || uploadingAvatar || uploadingDokument}
        className="w-full flex items-center justify-center gap-2 bg-[#00838F] hover:bg-[#006d78] disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-colors text-sm">
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gespeichert …</>
          : "Profil speichern & Freischaltung beantragen →"
        }
      </button>

      <p className="text-[10px] text-gray-400 text-center">
        Nach dem Absenden prüfen wir dein Profil und schalten dich innerhalb von 48 Stunden frei.
      </p>
    </form>
  );
}
