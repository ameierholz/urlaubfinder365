"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  articleId: string;
  currentStatus: string;
}

export default function ArtikelStatusButton({ articleId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sb = createSupabaseBrowser();

  const toggle = async () => {
    setLoading(true);
    const isPublished = currentStatus === "veroeffentlicht";
    const newStatus = isPublished ? "entwurf" : "veroeffentlicht";
    const extra = isPublished ? {} : { published_at: new Date().toISOString() };

    await sb
      .from("magazin_articles" as never)
      .update({ status: newStatus, ...extra } as never)
      .eq("id", articleId);

    setLoading(false);
    router.refresh();
  };

  const isPublished = currentStatus === "veroeffentlicht";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 ${
        isPublished
          ? "bg-emerald-900/40 hover:bg-emerald-800 text-emerald-400"
          : "bg-gray-800 hover:bg-gray-700 text-gray-400"
      }`}
    >
      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
      {isPublished ? "✓ Veröffentlicht" : "Entwurf"}
    </button>
  );
}
