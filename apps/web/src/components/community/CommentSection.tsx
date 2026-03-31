"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getComments, addComment } from "@/lib/firestore";
import { TravelReportComment } from "@/types";
import { MessageCircle, Send, Loader2, User } from "lucide-react";
import Link from "next/link";

function timeAgo(ts: unknown): string {
  if (!ts) return "";
  const date = ts && typeof ts === "object" && "toDate" in ts
    ? (ts as { toDate: () => Date }).toDate()
    : new Date(ts as string);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "gerade eben";
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;
  return `vor ${Math.floor(diff / 86400)} Tagen`;
}

export default function CommentSection({ reportId }: { reportId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<TravelReportComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getComments(reportId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [reportId]);

  async function handleSend() {
    if (!user || !text.trim()) return;
    setSending(true);
    const displayName = user.displayName ?? user.email?.split("@")[0] ?? "Anonym";
    try {
      const id = await addComment(reportId, user.uid, displayName, text.trim());
      setComments((prev) => [...prev, {
        id, reportId, userId: user.uid, displayName, text: text.trim(), createdAt: new Date().toISOString(),
      }]);
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
        <MessageCircle className="w-5 h-5 text-teal-600" />
        Kommentare ({comments.length})
      </h2>

      {/* Eingabe */}
      {user ? (
        <div className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {(user.displayName ?? "?").split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1 flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Dein Kommentar…"
              rows={2}
              maxLength={500}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={sending || !text.trim()}
              className="self-end px-3 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 mb-6 flex items-center gap-2">
          <User className="w-4 h-4" />
          <Link href="/login/" className="text-teal-600 font-semibold hover:underline">Anmelden</Link>
          &nbsp;um zu kommentieren
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">Noch keine Kommentare – sei der Erste!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const ini = c.displayName.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={c.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center shrink-0">
                  {ini}
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-700">{c.displayName}</span>
                    <span className="text-[10px] text-gray-400">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
