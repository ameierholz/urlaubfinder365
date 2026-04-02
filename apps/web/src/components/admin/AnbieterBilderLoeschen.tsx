"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface Props {
  anbieterId: string;
  avatarUrl: string | null;
  titelbildUrl: string | null;
}

export default function AnbieterBilderLoeschen({ anbieterId, avatarUrl, titelbildUrl }: Props) {
  const [loading, setLoading] = useState<"avatar" | "titelbild" | null>(null);
  const sb = createSupabaseBrowser();
  const router = useRouter();

  if (!avatarUrl && !titelbildUrl) return null;

  const loeschen = async (feld: "avatar_url" | "titelbild_url", typ: "avatar" | "titelbild") => {
    setLoading(typ);
    await sb.from("anbieter_profile" as never)
      .update({ [feld]: null } as never)
      .eq("id", anbieterId);
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
      <h2 className="font-bold text-white text-sm">Bilder</h2>

      {avatarUrl && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
            <Image src={avatarUrl} alt="Avatar" width={48} height={48} className="object-cover w-full h-full" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">Profilbild</p>
          </div>
          <button
            onClick={() => loeschen("avatar_url", "avatar")}
            disabled={!!loading}
            className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          >
            {loading === "avatar" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Löschen
          </button>
        </div>
      )}

      {titelbildUrl && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-800 shrink-0 relative">
            <Image src={titelbildUrl} alt="Titelbild" fill className="object-cover" unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">Titelbild</p>
          </div>
          <button
            onClick={() => loeschen("titelbild_url", "titelbild")}
            disabled={!!loading}
            className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          >
            {loading === "titelbild" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Löschen
          </button>
        </div>
      )}
    </div>
  );
}
