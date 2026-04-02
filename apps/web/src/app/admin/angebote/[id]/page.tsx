import { createSupabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import AngebotEditForm from "@/components/admin/AngebotEditForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Angebot bearbeiten | Admin" };

interface Props { params: Promise<{ id: string }> }

export default async function AngebotDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const [{ data: angebot }, { data: buchungen }] = await Promise.all([
    supabase.from("angebote").select("*").eq("id", id).single(),
    supabase.from("buchungen")
      .select("id, buchungs_nummer, kunden_name, datum, personen, gesamtpreis, status, created_at")
      .eq("angebot_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!angebot) notFound();

  const { data: anbieter } = await supabase
    .from("anbieter_profile")
    .select("id, name")
    .eq("id", angebot.anbieter_id)
    .single();

  const STATUS_CLS: Record<string, string> = {
    ausstehend:    "bg-amber-900/40 text-amber-400",
    bestaetigt:    "bg-blue-900/40 text-blue-400",
    abgeschlossen: "bg-emerald-900/40 text-emerald-400",
    storniert:     "bg-red-900/40 text-red-400",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/angebote/" className="text-gray-500 hover:text-white transition-colors mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-white truncate">{angebot.titel}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap text-sm text-gray-500">
            {anbieter && (
              <Link href={`/admin/anbieter/${anbieter.id}/`} className="hover:text-[#00838F] transition-colors">
                {anbieter.name}
              </Link>
            )}
            <span>·</span>
            <span>{angebot.ziel}</span>
            <span>·</span>
            <span>{Number(angebot.preis).toFixed(2)} €</span>
            {angebot.slug && (
              <>
                <span>·</span>
                <a href={`/marktplatz/${angebot.slug}/`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#00838F] transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Vorschau
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Edit-Formular */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Angebot bearbeiten</h2>
          <AngebotEditForm angebot={{
            id: angebot.id,
            titel: angebot.titel ?? "",
            kurzbeschreibung: angebot.kurzbeschreibung,
            beschreibung: angebot.beschreibung,
            kategorie: angebot.kategorie,
            ziel: angebot.ziel,
            land: angebot.land,
            preis: Number(angebot.preis),
            preistyp: angebot.preistyp ?? "pro_person",
            dauer: angebot.dauer,
            max_teilnehmer: angebot.max_teilnehmer ?? 10,
            treffpunkt: angebot.treffpunkt,
            treffpunkt_hinweis: angebot.treffpunkt_hinweis,
            status: angebot.status ?? "entwurf",
            highlights: angebot.highlights ?? [],
            inbegriffen: angebot.inbegriffen ?? [],
            nicht_inbegriffen: angebot.nicht_inbegriffen ?? [],
          }} />
        </div>

        {/* Buchungen zu diesem Angebot */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="font-bold text-white text-sm">Buchungen ({(buchungen ?? []).length})</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {(buchungen ?? []).length === 0 && (
                <p className="px-5 py-6 text-center text-gray-500 text-sm">Noch keine Buchungen.</p>
              )}
              {(buchungen ?? []).map((b: {
                id: string; buchungs_nummer: string; kunden_name: string;
                datum: string; personen: number; gesamtpreis: number; status: string;
              }) => (
                <div key={b.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">{b.kunden_name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_CLS[b.status] ?? "bg-gray-800 text-gray-400"}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {b.buchungs_nummer} · {new Date(b.datum).toLocaleDateString("de-DE")} · {b.personen} Pers. · {Number(b.gesamtpreis).toFixed(0)} €
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fotos */}
          {(angebot.fotos ?? []).length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h2 className="font-bold text-white text-sm mb-3">Fotos ({angebot.fotos.length})</h2>
              <div className="grid grid-cols-2 gap-2">
                {angebot.fotos.slice(0, 4).map((url: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`Foto ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-xl" />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
