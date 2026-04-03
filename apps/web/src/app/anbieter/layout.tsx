import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import AnbieterNav from "@/components/anbieter/AnbieterNav";
import { AnbieterI18nProvider } from "@/context/AnbieterI18nContext";

type Sprache = "de" | "en" | "tr" | "es" | "fr" | "it" | "pl" | "ru" | "ar";
const ALLOWED_SPRACHEN: Sprache[] = ["de", "en", "tr", "es", "fr", "it", "pl", "ru", "ar"];

export default async function AnbieterLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/anbieter/dashboard/");

  // Profil laden
  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("id, name, status, verifiziert, avatar_url, sprache")
    .eq("user_id", user.id)
    .maybeSingle();
  const profil = profilRaw as { id: string; name: string; status: string; verifiziert: boolean; avatar_url?: string | null; sprache?: string | null } | null;

  // Noch kein Profil → Bewerbung ausfüllen
  if (!profil) redirect("/marktplatz/anbieter-werden/");

  // Profil noch nicht vollständig ausgefüllt → Onboarding
  if (profil.status === "unvollstaendig") redirect("/anbieter/profil-einrichten/");

  const initialSprache: Sprache = ALLOWED_SPRACHEN.includes(profil.sprache as Sprache)
    ? (profil.sprache as Sprache)
    : "de";

  return (
    <AnbieterI18nProvider initialSprache={initialSprache} anbieter_id={profil.id}>
      <div className="min-h-screen bg-gray-50 flex">
        <AnbieterNav profil={profil} />
        <div className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </div>
    </AnbieterI18nProvider>
  );
}
