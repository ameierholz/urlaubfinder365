const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "short",
});

const relativeFormatter = new Intl.RelativeTimeFormat("de-DE", {
  numeric: "auto",
});

/** "25.03.2026" */
export function formatDate(date: string | Date): string {
  return dateFormatter.format(new Date(date));
}

/** "25. Mär." */
export function formatDateShort(date: string | Date): string {
  return shortDateFormatter.format(new Date(date));
}

/** "25.03. – 01.04.2026" */
export function formatDateRange(from: string | Date, to: string | Date): string {
  const f = new Date(from);
  const t = new Date(to);
  const fromStr = `${String(f.getDate()).padStart(2, "0")}.${String(f.getMonth() + 1).padStart(2, "0")}.`;
  const toStr = dateFormatter.format(t);
  return `${fromStr} – ${toStr}`;
}

/** "vor 3 Tagen", "gestern" */
export function formatRelativeDate(date: string | Date): string {
  const diff = new Date(date).getTime() - Date.now();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (Math.abs(days) < 1) return "heute";
  return relativeFormatter.format(days, "day");
}
