import { createSupabaseServer } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

export default async function SponsoredAnbieter() {
  const supabase = await createSupabaseServer();

  const { data: raw } = await supabase
    .from("werbeplaetze_buchungen")
    .select(`
      id,
      anbieter_profile:anbieter_id (id, name, bio, avatar_url, verifiziert)
    `)
    .eq("paket", "anbieter_spotlight")
    .eq("status", "aktiv")
    .limit(4);

  const anbieter = ((raw ?? []) as Array<{
    id: string;
    anbieter_profile: {
      id: string; name: string; bio: string | null;
      avatar_url: string | null; verifiziert: boolean;
    } | null;
  }>)
    .map((b) => b.anbieter_profile)
    .filter(Boolean) as Array<{
      id: string; name: string; bio: string | null;
      avatar_url: string | null; verifiziert: boolean;
    }>;

  if (anbieter.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Empfohlene Anbieter
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {anbieter.map((a) => (
          <Link
            key={a.id}
            href={`/marktplatz/`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            {/* Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {a.avatar_url ? (
                <Image
                  src={a.avatar_url}
                  alt={a.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                  {a.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-sm font-bold text-gray-900 group-hover:text-[#00838F] transition-colors truncate">
                  {a.name}
                </span>
                {a.verifiziert && (
                  <BadgeCheck className="w-3.5 h-3.5 text-[#00838F] shrink-0" />
                )}
              </div>
              {a.bio && (
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {a.bio}
                </p>
              )}
              <span className="text-[11px] text-[#00838F] font-semibold mt-1 inline-block group-hover:underline">
                Profil ansehen →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
