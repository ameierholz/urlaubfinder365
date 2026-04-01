"use client";

import { useEffect, useState, useCallback } from "react";
import type { AppUser } from "@/context/AuthContext";
import {
  getUserStreak, performDailyCheckin,
  getCoinHistory, type UserStreak, type CoinTransaction,
} from "@/lib/supabase-db";
import { Flame, Coins, Trophy, CalendarCheck, Zap, Gift, Clock } from "lucide-react";

interface Props { user: AppUser }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Build a 7-column grid of the last 4 weeks (28 days) */
function buildCalendar(history: string[]) {
  const set = new Set(history);
  const days: { date: string; done: boolean }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, done: set.has(iso) });
  }
  return days;
}

export default function CheckInTab({ user }: Props) {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [history, setHistory] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [toast, setToast] = useState<{ msg: string; coins: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, h] = await Promise.all([
      getUserStreak(user.uid),
      getCoinHistory(user.uid),
    ]);
    setStreak(s);
    setHistory(h);
    setLoading(false);
  }, [user.uid]);

  useEffect(() => { load(); }, [load]);

  const handleCheckin = async () => {
    setChecking(true);
    const result = await performDailyCheckin(user.uid);
    if (result.alreadyDone) {
      setToast({ msg: "Heute schon eingecheckt!", coins: 0 });
    } else {
      setStreak(result.streak);
      setToast({ msg: `+${result.coinsEarned} Travel Coins verdient!`, coins: result.coinsEarned });
      // reload history
      const h = await getCoinHistory(user.uid);
      setHistory(h);
    }
    setChecking(false);
    setTimeout(() => setToast(null), 3500);
  };

  const todayDone = streak?.lastCheckinDate === new Date().toISOString().slice(0, 10);
  const calendar = buildCalendar(streak?.checkinHistory ?? []);

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-48" />
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-semibold text-sm transition-all ${
          toast.coins > 0 ? "bg-amber-500" : "bg-gray-600"
        }`}>
          {toast.coins > 0 ? <Gift className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Daily Check-in
        </h2>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border border-orange-200">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <div className="text-3xl font-black text-orange-600">{streak?.currentStreak ?? 0}</div>
          <div className="text-xs text-orange-500 font-medium mt-0.5">Streak (Tage)</div>
        </div>
        <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl p-4 text-center border border-amber-200">
          <Coins className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <div className="text-3xl font-black text-amber-600">{streak?.totalCoins ?? 0}</div>
          <div className="text-xs text-amber-500 font-medium mt-0.5">Travel Coins</div>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
          <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <div className="text-3xl font-black text-purple-600">{streak?.longestStreak ?? 0}</div>
          <div className="text-xs text-purple-500 font-medium mt-0.5">Bester Streak</div>
        </div>
      </div>

      {/* Check-in Button */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        {todayDone ? (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="font-bold text-gray-800 text-lg">Heute bereits eingecheckt!</p>
            <p className="text-sm text-gray-500">
              Komm morgen wieder, um deinen Streak fortzuführen.
              {(streak?.currentStreak ?? 0) > 0 && (
                <> Noch <strong>{7 - ((streak?.currentStreak ?? 0) % 7)} Tage</strong> bis zum nächsten Bonus!</>
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-200">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg mb-1">Jetzt einchecken</p>
              <p className="text-sm text-gray-500">
                Verdiene <strong>10 Travel Coins</strong> für heute.
                {(streak?.currentStreak ?? 0) > 0 && (
                  <> Streak läuft seit <strong>{streak!.currentStreak} Tagen</strong>!</>
                )}
                {(streak?.currentStreak ?? 0) > 0 && (7 - ((streak?.currentStreak ?? 0) % 7)) <= 3 && (
                  <> Nur noch <strong>{7 - ((streak?.currentStreak ?? 0) % 7)} Tage</strong> bis zum 50-Coin-Bonus!</>
                )}
              </p>
            </div>
            <button
              onClick={handleCheckin}
              disabled={checking}
              className="bg-linear-to-r from-amber-400 to-orange-500 text-white font-bold px-8 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
            >
              {checking ? "Wird gespeichert…" : "✅ Einchecken & Coins kassieren"}
            </button>
          </div>
        )}
      </div>

      {/* 28-day calendar heatmap */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <CalendarCheck className="w-4 h-4 text-gray-400" />
          Letzte 28 Tage
        </h3>
        <div className="grid grid-cols-7 gap-1.5">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
            <div key={d} className="text-center text-[10px] text-gray-400 font-semibold pb-1">{d}</div>
          ))}
          {/* pad to weekday offset of first day */}
          {(() => {
            const firstDay = new Date(calendar[0].date);
            const dow = (firstDay.getDay() + 6) % 7; // Mon=0
            return Array.from({ length: dow }, (_, i) => (
              <div key={`pad-${i}`} />
            ));
          })()}
          {calendar.map(({ date, done }) => (
            <div
              key={date}
              title={formatDate(date)}
              className={`aspect-square rounded-lg transition-colors ${
                done
                  ? "bg-linear-to-br from-orange-400 to-amber-500"
                  : date === new Date().toISOString().slice(0, 10)
                  ? "bg-gray-200 border-2 border-orange-300"
                  : "bg-gray-100"
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-3 text-center">
          Orangene Tage = eingecheckt · Jede Woche ohne Lücke → +50 Bonus-Coins
        </p>
      </div>

      {/* Coin history */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Coins className="w-4 h-4 text-gray-400" />
            Coin-Verlauf
          </h3>
          <ul className="space-y-2">
            {history.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-600">C</span>
                  <span className="text-gray-700">{tx.reason}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600">+{tx.amount}</span>
                  <span className="text-[10px] text-gray-400">{formatDate(tx.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
