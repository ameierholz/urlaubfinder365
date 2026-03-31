"use client";

import { useState, useEffect } from "react";
import type { AppUser } from "@/context/AuthContext";
import {
  getTravelReportsByUser, deleteTravelReport,
  publishTravelReport, createTravelReport, updateTravelReport,
} from "@/lib/firestore";
import { TravelReport } from "@/types";
import TravelReportForm, { ReportFormData } from "@/components/community/TravelReportForm";
import { BookOpen, Plus, Eye, EyeOff, Trash2, Edit3, Star, Loader2 } from "lucide-react";
import Link from "next/link";

interface Props { user: AppUser }

export default function MeineBerichteTab({ user }: Props) {
  const [reports, setReports] = useState<TravelReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TravelReport | null>(null);

  useEffect(() => {
    getTravelReportsByUser(user.uid).then(setReports).finally(() => setLoading(false));
  }, [user.uid]);

  async function handleSave(data: ReportFormData, publish: boolean) {
    const displayName = user.displayName ?? user.email?.split("@")[0] ?? "Anonym";
    if (editing) {
      await updateTravelReport(user.uid, editing.id, { ...data, isPublished: publish });
      setReports((prev) => prev.map((r) => r.id === editing.id ? { ...r, ...data, isPublished: publish } : r));
      setEditing(null);
    } else {
      const id = await createTravelReport(user.uid, { ...data, displayName });
      if (publish) await publishTravelReport(user.uid, id);
      const newReport: TravelReport = {
        id, userId: user.uid, displayName, ...data,
        likesCount: 0, likedBy: [], commentsCount: 0, isPublished: publish, createdAt: new Date().toISOString(),
      };
      setReports((prev) => [newReport, ...prev]);
      setShowForm(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bericht wirklich löschen?")) return;
    await deleteTravelReport(user.uid, id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  }

  async function handlePublish(id: string) {
    await publishTravelReport(user.uid, id);
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, isPublished: true } : r));
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  if (showForm || editing) {
    return (
      <TravelReportForm
        initial={editing ?? undefined}
        onSave={handleSave}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-600" />
            Meine Reiseberichte
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{reports.length} Berichte · {reports.filter((r) => r.isPublished).length} veröffentlicht</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Bericht
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Noch keine Reiseberichte</p>
          <p className="text-sm mt-1">Teile deine Reiseerfahrungen mit der Community</p>
          <button onClick={() => setShowForm(true)}
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            Ersten Bericht schreiben
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start">
              {/* Cover-Mini */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shrink-0 overflow-hidden">
                {r.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.coverImageUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    r.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {r.isPublished ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                    {r.isPublished ? "Veröffentlicht" : "Entwurf"}
                  </span>
                  <span className="text-[10px] text-gray-400">{r.destination}</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-sm mt-1 leading-snug line-clamp-1">{r.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.highlights}</p>
              </div>

              {/* Aktionen */}
              <div className="flex flex-col gap-1.5 shrink-0">
                {r.isPublished && (
                  <Link href={`/community/reiseberichte/${r.id}/`}
                    className="text-xs text-teal-600 hover:underline font-semibold"
                  >
                    Anzeigen →
                  </Link>
                )}
                <button onClick={() => setEditing(r)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                  <Edit3 className="w-3.5 h-3.5" /> Bearbeiten
                </button>
                {!r.isPublished && (
                  <button onClick={() => handlePublish(r.id)} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                    <Eye className="w-3.5 h-3.5" /> Veröffentlichen
                  </button>
                )}
                <button onClick={() => handleDelete(r.id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" /> Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
