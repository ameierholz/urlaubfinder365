export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import BuchungsTicket, { type TicketDaten } from "@/components/buchung/BuchungsTicket";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  params: Promise<{ nummer: string }>;
  searchParams: Promise<{ print?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nummer } = await params;
  return {
    title: `Buchung ${nummer} | Urlaubfinder365`,
    robots: { index: false, follow: false },
  };
}

export default async function TicketPage({ params, searchParams }: Props) {
  const { nummer } = await params;
  const { print } = await searchParams;

  const { data } = await supabaseAdmin
    .from("buchungen")
    .select(`
      buchungs_nummer, qr_token, kunden_name,
      datum, personen, gesamtpreis, status, created_at,
      angebote:angebot_id (titel, ziel, dauer, foto_url, treffpunkt, treffpunkt_hinweis),
      anbieter_profile:anbieter_id (name, telefon, avatar_url, verifiziert)
    `)
    .eq("buchungs_nummer", nummer)
    .eq("status", "bestaetigt")
    .single();

  if (!data) notFound();

  const ticket = data as unknown as TicketDaten;

  const shouldPrint = print === "1";

  return (
    <>
      {shouldPrint && (
        // eslint-disable-next-line react/no-danger
        <script dangerouslySetInnerHTML={{ __html: "window.addEventListener('load',function(){setTimeout(function(){window.print()},600)});" }} />
      )}
      <BuchungsTicket d={ticket} autoPrint={shouldPrint} />
    </>
  );
}
