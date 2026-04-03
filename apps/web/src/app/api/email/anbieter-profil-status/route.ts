import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";
import { sendMail, FROM_DEFAULT } from "@/lib/email";
import { EmailAnbieterProfilStatus } from "@/emails/templates/EmailAnbieterProfilStatus";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { anbieter_id, status, hinweis } = await req.json() as {
    anbieter_id: string;
    status: "approved" | "rejected";
    hinweis?: string;
  };

  const { data: anbieter } = await supabaseAdmin
    .from("anbieter_profile")
    .select("name, email, sprache")
    .eq("id", anbieter_id)
    .single();

  const ap = anbieter as unknown as { name: string; email: string; sprache?: string } | null;
  if (!ap?.email) return NextResponse.json({ error: "Anbieter nicht gefunden" }, { status: 404 });

  await sendMail({
    to: ap.email,
    from: FROM_DEFAULT,
    subject: status === "approved" ? "Dein Profil wurde freigeschaltet – Urlaubfinder365" : "Dokumente: Bitte nachreichen – Urlaubfinder365",
    react: EmailAnbieterProfilStatus({
      anbieterName: ap.name,
      sprache: ap.sprache,
      status,
      hinweis,
      dashboardUrl: "https://urlaubfinder365.de/anbieter/dashboard",
    }),
  });

  return NextResponse.json({ ok: true });
}
