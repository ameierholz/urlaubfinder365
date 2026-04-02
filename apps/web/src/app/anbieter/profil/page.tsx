import { createSupabaseServer } from "@/lib/supabase-server";
import ProfilEinrichtenForm from "@/components/anbieter/ProfilEinrichtenForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mein Profil | Anbieter-Portal" };

export default async function AnbieterProfilPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profil = profilRaw as Record<string, any> | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Mein Profil</h1>
        <p className="text-gray-500 text-sm mt-1">
          Halte dein Profil aktuell — vollständige Profile werden bevorzugt angezeigt.
        </p>
      </div>

      {/* Status-Badge */}
      {profil && (
        <div className={`rounded-2xl px-5 py-3 text-sm font-medium flex items-center gap-2 ${
          profil.verifiziert
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : profil.status === "ausstehend"
            ? "bg-amber-50 border border-amber-200 text-amber-700"
            : profil.status === "gesperrt"
            ? "bg-red-50 border border-red-200 text-red-700"
            : "bg-gray-50 border border-gray-200 text-gray-600"
        }`}>
          {profil.verifiziert
            ? "✅ Dein Profil ist verifiziert und aktiv."
            : profil.status === "ausstehend"
            ? "⏳ Dein Profil wird gerade geprüft. Wir melden uns innerhalb von 48 Stunden."
            : profil.status === "gesperrt"
            ? "🚫 Dein Profil wurde gesperrt. Kontaktiere uns: info@urlaubfinder365.de"
            : "📝 Bitte vervollständige dein Profil damit wir es freischalten können."}
        </div>
      )}

      <ProfilEinrichtenForm
        profilId={profil?.id}
        initial={profil ?? undefined}
      />
    </div>
  );
}
