import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import WerbeplatzContent from "@/components/anbieter/WerbeplatzContent";

export const metadata: Metadata = { title: "Werbeplatz buchen | Anbieter-Portal" };

export default async function AnbieterWerbeplatzPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/anbieter/werbeplatz/");

  return <WerbeplatzContent />;
}
