/**
 * Vercel Cron – Sammel-Endpoint für alle täglichen Wartungs-Tasks.
 * Konsolidiert 5 ehemalige Einzel-Crons in einen Job, um das Hobby-Limit
 * von 2 Crons einzuhalten (zusammen mit /api/cron/collect-prices).
 *
 * Tägliche Tasks (parallel):
 *   - sync-travel-warnings   (Reisewarnungen Auswärtiges Amt)
 *   - buchung-erinnerung     (E-Mail 48h vor Anreise)
 *   - buchung-bewertung      (E-Mail nach Abreise)
 *   - buchung-abschliessen   (Buchungen finalisieren)
 *
 * Monats-Task (nur am 1. des Monats):
 *   - anbieter-monatsbericht (Provisionsbericht an Anbieter)
 *
 * Manueller Aufruf:
 *   GET /api/cron/daily-tasks
 *   Header: Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { GET as syncTravelWarnings } from "../sync-travel-warnings/route";
import { GET as buchungErinnerung } from "../buchung-erinnerung/route";
import { GET as buchungBewertung } from "../buchung-bewertung/route";
import { GET as buchungAbschliessen } from "../buchung-abschliessen/route";
import { GET as anbieterMonatsbericht } from "../anbieter-monatsbericht/route";

export const runtime     = "nodejs";
export const maxDuration = 300;

interface TaskResult {
  task:   string;
  ok:     boolean;
  status: number;
  body?:  unknown;
  error?: string;
}

async function runTask(
  name: string,
  handler: (req: NextRequest) => Promise<Response>,
  req: NextRequest
): Promise<TaskResult> {
  try {
    const res = await handler(req);
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    return { task: name, ok: res.ok, status: res.status, body };
  } catch (err) {
    return {
      task:   name,
      ok:     false,
      status: 500,
      error:  err instanceof Error ? err.message : String(err),
    };
  }
}

export async function GET(req: NextRequest) {
  // 1. Auth (jede Sub-Task prüft selbst nochmal, daher hier nur Frühausstieg)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const today      = new Date();
  const isFirstDay = today.getUTCDate() === 1;

  // 2. Tägliche Tasks vorbereiten
  const dailyTasks: Array<[string, (r: NextRequest) => Promise<Response>]> = [
    ["sync-travel-warnings", syncTravelWarnings],
    ["buchung-erinnerung",   buchungErinnerung],
    ["buchung-bewertung",    buchungBewertung],
    ["buchung-abschliessen", buchungAbschliessen],
  ];

  // 3. Monats-Task nur am 1. des Monats
  if (isFirstDay) {
    dailyTasks.push(["anbieter-monatsbericht", anbieterMonatsbericht]);
  }

  // 4. Parallel ausführen (Promise.allSettled → ein Fehler stoppt nichts)
  const results = await Promise.all(
    dailyTasks.map(([name, handler]) => runTask(name, handler, req))
  );

  const successCount = results.filter((r) => r.ok).length;
  const failureCount = results.length - successCount;

  return NextResponse.json({
    ok:        failureCount === 0,
    date:      today.toISOString().split("T")[0],
    isFirstDay,
    summary:   { total: results.length, success: successCount, failed: failureCount },
    results,
  });
}
