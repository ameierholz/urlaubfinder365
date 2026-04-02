import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import ProfilEinrichtenForm from "@/components/anbieter/ProfilEinrichtenForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profil einrichten | Anbieter-Portal" };

export default async function ProfilEinrichtenPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/anbieter/profil-einrichten/");

  const { data: profilRaw } = await supabase
    .from("anbieter_profile")
    .select("id, name, status")
    .eq("user_id", user.id)
    .maybeSingle();
  const profil = profilRaw as { id: string; name: string; status: string } | null;

  // Bereits vollständig → Dashboard
  if (profil && profil.status !== "unvollstaendig") {
    redirect("/anbieter/dashboard/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00838F]/10 mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Willkommen{profil ? `, ${profil.name.split(" ")[0]}` : ""}!</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Schritt 2 von 2 — Ergänze dein Profil damit wir dich freischalten können.
          </p>
          {/* Fortschrittsbalken */}
          <div className="flex gap-2 mt-4 justify-center">
            <div className="h-1.5 w-16 rounded-full bg-[#00838F]" />
            <div className="h-1.5 w-16 rounded-full bg-[#00838F]" />
          </div>
        </div>

        <ProfilEinrichtenForm profilId={profil?.id} />
      </div>
    </div>
  );
}
