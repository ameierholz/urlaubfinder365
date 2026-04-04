"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { AppUser } from "@/context/AuthContext";
import {
  User as UserIcon, Mail, Lock, CheckCircle, AlertCircle, Globe, MapPin,
  ExternalLink, Camera, Loader2, Instagram, Link2, Eye, EyeOff,
  Plane, Palmtree, Mountain, Compass, Landmark, Sparkles, Ship, Backpack,
  Users, Heart, ChevronRight, Settings, Shield,
} from "lucide-react";
import type { TravelFrequency, TravelerType } from "@/types";

interface Props { user: AppUser }

// ─── Konstanten ──────────────────────────────────────────────────────────────

const TRAVEL_INTERESTS = [
  { id: "strand",      label: "Strand & Meer",          icon: Palmtree },
  { id: "stadt",       label: "Städtetrips",             icon: Landmark },
  { id: "natur",       label: "Natur & Wandern",         icon: Mountain },
  { id: "abenteuer",   label: "Abenteuer & Outdoor",     icon: Compass },
  { id: "kultur",      label: "Kultur & Geschichte",     icon: Sparkles },
  { id: "wellness",    label: "Wellness & Erholung",     icon: Heart },
  { id: "luxus",       label: "Luxusreisen",             icon: Sparkles },
  { id: "backpacking", label: "Backpacking",             icon: Backpack },
  { id: "familie",     label: "Familienurlaub",          icon: Users },
  { id: "kreuzfahrt",  label: "Kreuzfahrten",            icon: Ship },
] as const;

const TRAVELER_TYPES: { id: TravelerType; label: string; emoji: string; desc: string }[] = [
  { id: "entdecker",        label: "Entdecker",         emoji: "🔭", desc: "Immer auf der Suche nach Neuem" },
  { id: "strandliebhaber",  label: "Strandliebhaber",   emoji: "🏖️", desc: "Am glücklichsten mit Sand & Sonne" },
  { id: "staedtereisender", label: "Städtereisender",   emoji: "🏙️", desc: "Metropolen & Kultur begeistern mich" },
  { id: "abenteurer",       label: "Abenteurer",        emoji: "🧗", desc: "Klettern, Tauchen, Extremsport" },
  { id: "kulturfan",        label: "Kulturfan",         emoji: "🎭", desc: "Geschichte, Kunst & lokales Leben" },
  { id: "weltenbummler",    label: "Weltenbummler",     emoji: "🌍", desc: "Immer unterwegs, überall zu Hause" },
  { id: "familienreisender",label: "Familienreisender", emoji: "👨‍👩‍👧", desc: "Urlaub mit der ganzen Familie" },
];

const FREQUENCIES: { id: TravelFrequency; label: string }[] = [
  { id: "selten",   label: "Selten (1× alle 2+ Jahre)" },
  { id: "1-2x",     label: "1–2× im Jahr" },
  { id: "3-5x",     label: "3–5× im Jahr" },
  { id: "mehrmals", label: "Mehrmals im Monat" },
];

const LANGUAGES_OPTIONS = [
  "Deutsch", "Englisch", "Spanisch", "Französisch", "Italienisch",
  "Türkisch", "Arabisch", "Portugiesisch", "Niederländisch", "Polnisch",
  "Russisch", "Chinesisch", "Japanisch", "Griechisch", "Schwedisch",
];

// ─── Hilfskomponenten ─────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#00838F]" />
      </div>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Toast({ msg }: { msg: { type: "success" | "error"; text: string } }) {
  return (
    <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 ${
      msg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
    }`}>
      {msg.type === "success"
        ? <CheckCircle className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />}
      {msg.text}
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export default function ProfileTab({ user }: Props) {
  const [activeTab, setActiveTab] = useState<"profil" | "konto">("profil");

  // ── Konto-Daten ──
  const [displayName, setDisplayName]   = useState(user.displayName ?? "");
  const [nameSaving, setNameSaving]     = useState(false);
  const [nameMsg, setNameMsg]           = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [pwCurrent, setPwCurrent]       = useState("");
  const [pwNew, setPwNew]               = useState("");
  const [pwConfirm, setPwConfirm]       = useState("");
  const [pwMsg, setPwMsg]               = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwSaving, setPwSaving]         = useState(false);
  const [showPw, setShowPw]             = useState(false);

  // ── Community-Profil ──
  const [photoURL, setPhotoURL]         = useState<string | null>(user.photoURL ?? null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading]       = useState(false);

  const [bannerURL, setBannerURL]           = useState<string | null>(null);
  const [bannerPreview, setBannerPreview]   = useState<string | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [bio, setBio]                   = useState("");
  const [location, setLocation]         = useState("");
  const [nationality, setNationality]   = useState("");
  const [travelInterests, setTravelInterests] = useState<string[]>([]);
  const [travelerType, setTravelerType] = useState<TravelerType | "">("");
  const [travelFrequency, setTravelFrequency] = useState<TravelFrequency | "">("");
  const [languages, setLanguages]       = useState<string[]>([]);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl]     = useState("");
  const [isPublic, setIsPublic]         = useState(true);

  const [commSaving, setCommSaving]     = useState(false);
  const [commMsg, setCommMsg]           = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = (user.displayName || user.email || "U")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  // Profil beim Laden holen
  useEffect(() => {
    import("@/lib/supabase-db").then(({ getCommunityProfile }) => {
      getCommunityProfile(user.uid).then((p) => {
        if (p) {
          setBio(p.bio ?? "");
          setLocation(p.location ?? "");
          setNationality(p.nationality ?? "");
          setPhotoURL(p.photoURL || user.photoURL || null);
          setBannerURL(p.bannerURL ?? null);
          setTravelInterests(p.travelInterests ?? []);
          setTravelerType(p.travelerType ?? "");
          setTravelFrequency(p.travelFrequency ?? "");
          setLanguages(p.languages ?? []);
          setInstagramUrl(p.instagramUrl ?? "");
          setWebsiteUrl(p.websiteUrl ?? "");
          setIsPublic(p.isPublic !== false); // default true
        }
        setProfileLoaded(true);
      });
    });
  }, [user.uid]);

  // ── Foto-Upload ──
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setCommMsg({ type: "error", text: "Bild zu groß – max. 3 MB erlaubt." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setUploading(true);
    setCommMsg(null);
    try {
      const [{ ref, uploadBytes, getDownloadURL }, { storage }, { updateCommunityProfile }] = await Promise.all([
        import("firebase/storage"),
        import("@/lib/firebase"),
        import("@/lib/supabase-db"),
      ]);
      const storageRef = ref(storage(), `avatars/${user.uid}`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      setPhotoPreview(null);
      await updateCommunityProfile(user.uid, { photoURL: url });
      setCommMsg({ type: "success", text: "Profilbild gespeichert!" });
    } catch {
      setCommMsg({ type: "error", text: "Upload fehlgeschlagen. Bitte erneut versuchen." });
      setPhotoPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Banner-Upload ──
  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setCommMsg({ type: "error", text: "Banner zu groß – max. 5 MB erlaubt." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setBannerUploading(true);
    setCommMsg(null);
    try {
      const [{ ref, uploadBytes, getDownloadURL }, { storage }, { updateCommunityProfile }] = await Promise.all([
        import("firebase/storage"),
        import("@/lib/firebase"),
        import("@/lib/supabase-db"),
      ]);
      const storageRef = ref(storage(), `banners/${user.uid}`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      setBannerURL(url);
      setBannerPreview(null);
      await updateCommunityProfile(user.uid, { bannerURL: url });
      setCommMsg({ type: "success", text: "Profilbanner gespeichert!" });
    } catch {
      setCommMsg({ type: "error", text: "Banner-Upload fehlgeschlagen." });
      setBannerPreview(null);
    } finally {
      setBannerUploading(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  // ── Community-Profil speichern ──
  const saveCommunityProfile = async () => {
    setCommSaving(true);
    setCommMsg(null);
    try {
      const { updateCommunityProfile } = await import("@/lib/supabase-db");
      await updateCommunityProfile(user.uid, {
        bio: bio.trim(),
        location: location.trim(),
        nationality: nationality.trim(),
        travelInterests,
        travelerType: travelerType || undefined,
        travelFrequency: travelFrequency || undefined,
        languages,
        instagramUrl: instagramUrl.trim(),
        websiteUrl: websiteUrl.trim(),
        isPublic,
      });
      setCommMsg({ type: "success", text: "Öffentliches Profil gespeichert!" });
      setTimeout(() => setCommMsg(null), 4000);
    } catch {
      setCommMsg({ type: "error", text: "Fehler beim Speichern." });
    } finally {
      setCommSaving(false);
    }
  };

  // ── Name speichern ──
  const saveName = async () => {
    if (!displayName.trim()) return;
    setNameSaving(true);
    setNameMsg(null);
    try {
      const [{ createBrowserClient }, { updateUserProfile }] = await Promise.all([
        import("@supabase/ssr"),
        import("@/lib/supabase-db"),
      ]);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.updateUser({ data: { full_name: displayName.trim() } });
      await updateUserProfile(user.uid, { displayName: displayName.trim() });
      setNameMsg({ type: "success", text: "Name gespeichert!" });
      setTimeout(() => setNameMsg(null), 3000);
    } catch {
      setNameMsg({ type: "error", text: "Fehler beim Speichern." });
    } finally {
      setNameSaving(false);
    }
  };

  // ── Passwort ändern ──
  const changePassword = async () => {
    if (pwNew !== pwConfirm) {
      setPwMsg({ type: "error", text: "Passwörter stimmen nicht überein." });
      return;
    }
    if (pwNew.length < 6) {
      setPwMsg({ type: "error", text: "Passwort muss mindestens 6 Zeichen haben." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Verify current password by re-signing in
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email!, password: pwCurrent });
      if (signInErr) throw signInErr;
      const { error: updateErr } = await supabase.auth.updateUser({ password: pwNew });
      if (updateErr) throw updateErr;
      setPwMsg({ type: "success", text: "Passwort erfolgreich geändert!" });
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch {
      setPwMsg({ type: "error", text: "Aktuelles Passwort ist falsch." });
    } finally {
      setPwSaving(false);
    }
  };

  const toggleInterest = (id: string) => {
    setTravelInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((x) => x !== lang) : [...prev, lang]
    );
  };

  // ── Render ──
  return (
    <div className="max-w-2xl space-y-1">
      {/* ── Profil-Header-Card ── */}
      <div className="rounded-2xl text-white mb-6 relative overflow-hidden"
        style={{
          background: (bannerPreview ?? bannerURL)
            ? undefined
            : "linear-gradient(135deg, #00838F 0%, #005F6A 100%)",
        }}
      >
        {/* Banner-Bild */}
        {(bannerPreview ?? bannerURL) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bannerPreview ?? bannerURL!}
            alt="Profilbanner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Dunkles Overlay damit Text lesbar bleibt */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Banner-Upload-Button (oben rechts) */}
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          <button
            onClick={() => bannerInputRef.current?.click()}
            disabled={bannerUploading}
            title="Banner ändern"
            className="bg-black/30 hover:bg-black/50 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 backdrop-blur-sm transition-colors disabled:opacity-50"
          >
            {bannerUploading
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <Camera className="w-3 h-3" />}
            Banner
          </button>
          {bannerURL && !bannerPreview && !bannerUploading && (
            <button
              onClick={async () => {
                const { updateCommunityProfile } = await import("@/lib/supabase-db");
                await updateCommunityProfile(user.uid, { bannerURL: "" });
                setBannerURL(null);
              }}
              className="bg-black/30 hover:bg-red-600/70 text-white/60 hover:text-white text-xs px-2 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
              title="Banner entfernen"
            >✕</button>
          )}
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleBannerSelect}
        />
        <div className="relative p-6">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => fileInputRef.current?.click()}
            title="Profilbild ändern"
          >
            {(photoPreview ?? photoURL) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview ?? photoURL!}
                alt="Profilbild"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center text-white font-bold text-2xl">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading
                ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                : <Camera className="w-5 h-5 text-white" />}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoSelect}
          />
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-xl truncate">{user.displayName || "Reisender"}</h2>
              {travelerType && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {TRAVELER_TYPES.find((t) => t.id === travelerType)?.emoji}{" "}
                  {TRAVELER_TYPES.find((t) => t.id === travelerType)?.label}
                </span>
              )}
            </div>
            <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
            {location && (
              <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {location}
              </p>
            )}
          </div>
          <Link
            href={`/community/profil/${user.uid}/`}
            className="shrink-0 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Profil ansehen
          </Link>
        </div>
        {/* ── Foto-Aktionsleiste ── */}
        <div className="relative mt-4 flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {uploading
              ? <><Loader2 className="w-3 h-3 animate-spin" /> Wird hochgeladen…</>
              : <><Camera className="w-3 h-3" /> Bild ändern</>}
          </button>
          {photoURL && !photoPreview && !uploading && (
            <button
              onClick={async () => {
                const { updateCommunityProfile } = await import("@/lib/supabase-db");
                await updateCommunityProfile(user.uid, { photoURL: "" });
                setPhotoURL(user.photoURL ?? null);
                setCommMsg({ type: "success", text: "Profilbild entfernt." });
              }}
              className="text-white/50 hover:text-red-300 text-xs font-medium transition-colors"
            >
              Bild entfernen
            </button>
          )}
          <span className="text-white/30 text-xs ml-auto">JPG · PNG · WEBP · max. 3 MB</span>
        </div>
        {commMsg && commMsg.type === "success" && (
          <div className="relative mt-3 bg-white/20 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5" /> {commMsg.text}
          </div>
        )}
        </div>{/* end p-6 inner */}
      </div>

      {/* ── Tab-Navigation ── */}
      <div className="flex gap-2 mb-4 bg-gray-100 rounded-xl p-1">
        {([
          { id: "profil", label: "Öffentliches Profil", icon: Globe },
          { id: "konto",  label: "Konto & Sicherheit",  icon: Shield },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === id
                ? "bg-white text-[#00838F] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: ÖFFENTLICHES PROFIL                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "profil" && (
        <div className="space-y-4">
          {!profileLoaded && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Profil wird geladen…</span>
            </div>
          )}

          {profileLoaded && <>
            {/* ── Sichtbarkeit ── */}
            <SectionCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isPublic ? "bg-emerald-50" : "bg-gray-100"}`}>
                    {isPublic ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {isPublic ? "Profil ist öffentlich sichtbar" : "Profil ist privat"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isPublic
                        ? "Alle Community-Mitglieder können dein Profil sehen"
                        : "Nur du selbst kannst dein Profil sehen"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${isPublic ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPublic ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </SectionCard>

            {/* ── Grunddaten ── */}
            <SectionCard>
              <SectionTitle icon={UserIcon} title="Grunddaten" subtitle="Wie stellst du dich der Community vor?" />
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    Anzeigename <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      maxLength={50}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00838F]"
                      placeholder="Dein Name in der Community"
                    />
                    <button
                      onClick={saveName}
                      disabled={nameSaving || !displayName.trim()}
                      className="bg-[#00838F] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#006E7A] transition-colors disabled:opacity-40 whitespace-nowrap"
                    >
                      {nameSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Speichern"}
                    </button>
                  </div>
                  {nameMsg && <div className="mt-2"><Toast msg={nameMsg} /></div>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                      <MapPin className="w-3 h-3 inline mr-1" />Wohnort
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      maxLength={60}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00838F]"
                      placeholder="z.B. München, Deutschland"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                      <Globe className="w-3 h-3 inline mr-1" />Herkunftsland
                    </label>
                    <input
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      maxLength={40}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00838F]"
                      placeholder="z.B. Deutschland"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ── Bio ── */}
            <SectionCard>
              <SectionTitle icon={Plane} title="Über mich" subtitle="Erzähl der Community deinen Urlaubgeschichte" />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={400}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00838F] resize-none"
                placeholder="Erzähl uns von deiner Leidenschaft fürs Reisen, deinen schönsten Erlebnissen oder Urlaubszielen, die du noch entdecken möchtest…"
              />
              <p className="text-xs text-gray-400 text-right mt-1">{bio.length}/400</p>
            </SectionCard>

            {/* ── Reisetyp ── */}
            <SectionCard>
              <SectionTitle icon={Compass} title="Mein Reisetyp" subtitle="Wähle den Badge, der am besten zu dir passt" />
              <div className="grid grid-cols-1 gap-2">
                {TRAVELER_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTravelerType(travelerType === t.id ? "" : t.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      travelerType === t.id
                        ? "border-[#00838F] bg-teal-50"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <span className="text-xl">{t.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${travelerType === t.id ? "text-[#00838F]" : "text-gray-800"}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-gray-400">{t.desc}</p>
                    </div>
                    {travelerType === t.id && (
                      <CheckCircle className="w-5 h-5 text-[#00838F] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* ── Urlaubs-Interessen ── */}
            <SectionCard>
              <SectionTitle icon={Heart} title="Urlaubs-Interessen" subtitle="Was begeistert dich beim Reisen? (Mehrfachauswahl)" />
              <div className="grid grid-cols-2 gap-2">
                {TRAVEL_INTERESTS.map(({ id, label, icon: Icon }) => {
                  const active = travelInterests.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleInterest(id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                        active
                          ? "border-[#00838F] bg-teal-50 text-[#00838F]"
                          : "border-gray-100 hover:border-gray-200 text-gray-600"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#00838F]" : "text-gray-400"}`} />
                      <span className={`text-xs font-semibold ${active ? "text-[#00838F]" : "text-gray-600"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* ── Reisehäufigkeit ── */}
            <SectionCard>
              <SectionTitle icon={Plane} title="Wie oft reist du?" subtitle="Deine Reisehäufigkeit pro Jahr" />
              <div className="space-y-2">
                {FREQUENCIES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTravelFrequency(travelFrequency === id ? "" : id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      travelFrequency === id
                        ? "border-[#00838F] bg-teal-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${travelFrequency === id ? "text-[#00838F]" : "text-gray-700"}`}>
                      {label}
                    </span>
                    {travelFrequency === id && <CheckCircle className="w-4 h-4 text-[#00838F]" />}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* ── Sprachen ── */}
            <SectionCard>
              <SectionTitle icon={Globe} title="Gesprochene Sprachen" subtitle="Welche Sprachen sprichst du? (Mehrfachauswahl)" />
              <div className="flex flex-wrap gap-2">
                {LANGUAGES_OPTIONS.map((lang) => {
                  const active = languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                        active
                          ? "border-[#00838F] bg-teal-50 text-[#00838F]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {active && "✓ "}{lang}
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* ── Social Links ── */}
            <SectionCard>
              <SectionTitle icon={Link2} title="Social Media & Website" subtitle="Optional: Verlinke deinen Urlaub-Accounts" />
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                    <Instagram className="w-3 h-3" /> Instagram
                  </label>
                  <div className="flex">
                    <span className="border border-r-0 border-gray-200 rounded-l-xl px-3 flex items-center text-gray-400 text-sm bg-gray-50">
                      instagram.com/
                    </span>
                    <input
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      maxLength={50}
                      className="flex-1 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00838F]"
                      placeholder="dein_username"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> Website / Blog
                  </label>
                  <input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    maxLength={100}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00838F]"
                    placeholder="https://mein-reiseblog.de"
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── Speichern-Button ── */}
            {commMsg && commMsg.type === "error" && (
              <Toast msg={commMsg} />
            )}
            <div className="flex items-center justify-between gap-4 py-2">
              <Link
                href={`/community/profil/${user.uid}/`}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                Öffentliches Profil ansehen <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={saveCommunityProfile}
                disabled={commSaving}
                className="bg-[#00838F] text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-[#006E7A] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {commSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Speichert…</> : "Profil speichern"}
              </button>
            </div>
          </>}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: KONTO & SICHERHEIT                                            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "konto" && (
        <div className="space-y-4">
          {/* E-Mail */}
          <SectionCard>
            <SectionTitle icon={Mail} title="E-Mail-Adresse" />
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{user.email}</span>
              <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                Verifiziert
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              E-Mail-Änderungen sind aus Sicherheitsgründen nicht im Profil möglich.
              Bitte wende dich an unseren Support.
            </p>
          </SectionCard>

          {/* Passwort */}
          <SectionCard>
            <SectionTitle icon={Lock} title="Passwort ändern" subtitle="Mindestens 6 Zeichen" />
            <div className="space-y-3">
              {[
                { label: "Aktuelles Passwort",        value: pwCurrent, set: setPwCurrent },
                { label: "Neues Passwort",             value: pwNew,     set: setPwNew },
                { label: "Neues Passwort wiederholen", value: pwConfirm, set: setPwConfirm },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00838F] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pwMsg && <div className="mt-3"><Toast msg={pwMsg} /></div>}
            <button
              onClick={changePassword}
              disabled={pwSaving || !pwCurrent || !pwNew || !pwConfirm}
              className="mt-4 bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {pwSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Ändert…</> : <><Lock className="w-4 h-4" /> Passwort ändern</>}
            </button>
          </SectionCard>

          {/* Account-Info */}
          <SectionCard className="bg-gray-50 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">Konto-ID</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{user.uid}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Mitglied seit {new Date(user.metadata.creationTime ?? "").toLocaleDateString("de-DE", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
