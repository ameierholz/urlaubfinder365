const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formatiert Cent-Betrag als "1.234 €" */
export function formatPrice(cents: number): string {
  return formatter.format(cents / 100);
}

/** Formatiert Cent-Betrag mit Nachkommastellen "1.234,50 €" */
export function formatPriceExact(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/** Berechnet Ersparnis in Prozent */
export function calcDiscount(
  originalCents: number,
  currentCents: number
): number {
  if (originalCents <= 0) return 0;
  return Math.round(((originalCents - currentCents) / originalCents) * 100);
}
