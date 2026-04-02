import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import BuchungsTicket, { type TicketDaten } from "@/components/buchung/BuchungsTicket";

export const metadata: Metadata = {
  title: "Buchung erfolgreich | Urlaubfinder365",
  robots: { index: false, follow: false },
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props { searchParams: Promise<{ buchung?: string; session_id?: string }> }

export default async function BuchungErfolgPage({ searchParams }: Props) {
  const { buchung } = await searchParams;

  if (!buchung) redirect("/marktplatz/");

  const { data } = await supabaseAdmin
    .from("buchungen")
    .select(`
      buchungs_nummer, qr_token, kunden_name,
      datum, personen, gesamtpreis, status, created_at,
      angebote:angebot_id (titel, ziel, dauer, foto_url, treffpunkt, treffpunkt_hinweis),
      anbieter_profile:anbieter_id (name, telefon, avatar_url, verifiziert)
    `)
    .eq("buchungs_nummer", buchung)
    .single();

  if (!data) notFound();

  const ticket = data as unknown as TicketDaten;

  return <BuchungsTicket d={ticket} />;
}
