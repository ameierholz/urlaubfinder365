import { MetadataRoute } from "next";
import { destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";
import { locales, SITE_URL } from "@/i18n/routing";
import { SEASON_GUIDES } from "@/lib/season-guide-data";
import { PAUSCHAL_KOMBIS } from "@/lib/pauschalreisen-kombi-data";
import { RATGEBER_ARTICLES } from "@/lib/ratgeber-data";

// Nicht-DE Locales für Alternate-URLs
const NON_DEFAULT_LOCALES = locales.filter((l) => l !== "de");

/** Erstellt alle Locale-Varianten einer URL als alternates-Objekt (für hreflang) */
function withAlternates(path: string) {
  const alternates: Record<string, string> = { de: `${SITE_URL}${path}` };
  NON_DEFAULT_LOCALES.forEach((l) => {
    alternates[l] = `${SITE_URL}/${l}${path}`;
  });
  return alternates;
}

/** Gibt DE + alle Sprachvarianten einer Seite zurück */
function localizedEntries(
  path: string,
  opts: Pick<MetadataRoute.Sitemap[number], "lastModified" | "changeFrequency" | "priority">
): MetadataRoute.Sitemap {
  return [
    // DE (kein Präfix – bestehende URL)
    { url: `${SITE_URL}${path}`, ...opts, alternates: { languages: withAlternates(path) } },
    // Alle anderen Sprachen
    ...NON_DEFAULT_LOCALES.map((l) => ({
      url: `${SITE_URL}/${l}${path}`,
      ...opts,
      alternates: { languages: withAlternates(path) },
    })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const today   = new Date();
  const content = new Date("2026-03-18");
  const legal   = new Date("2025-01-01");

  // ── Statische Kernseiten ────────────────────────────────────────────────────
  const staticPages = [
    ...localizedEntries("/",                                   { lastModified: today,   changeFrequency: "daily",   priority: 1.0 }),
    ...localizedEntries("/last-minute/",                       { lastModified: today,   changeFrequency: "daily",   priority: 0.95 }),
    ...localizedEntries("/guenstig-urlaub-buchen/",            { lastModified: today,   changeFrequency: "daily",   priority: 0.95 }),
    ...localizedEntries("/urlaubsziele/",                      { lastModified: content, changeFrequency: "weekly",  priority: 0.92 }),
    ...localizedEntries("/urlaubsarten/pauschalreisen/",       { lastModified: content, changeFrequency: "weekly",  priority: 0.9 }),
    ...localizedEntries("/urlaubsarten/all-inclusive-urlaub/", { lastModified: content, changeFrequency: "weekly",  priority: 0.88 }),
    ...localizedEntries("/urlaubsarten/last-minute-urlaub/",   { lastModified: today,   changeFrequency: "daily",   priority: 0.85 }),
    ...localizedEntries("/kreuzfahrten/",                      { lastModified: content, changeFrequency: "weekly",  priority: 0.82 }),
    ...localizedEntries("/flugsuche/",                         { lastModified: content, changeFrequency: "weekly",  priority: 0.8 }),
    ...localizedEntries("/hotelsuche/",                        { lastModified: content, changeFrequency: "weekly",  priority: 0.8 }),
    ...localizedEntries("/urlaubsguides/",                     { lastModified: content, changeFrequency: "weekly",  priority: 0.8 }),
    ...localizedEntries("/aktivitaeten/",                      { lastModified: today,   changeFrequency: "daily",   priority: 0.8 }),
    ...localizedEntries("/marktplatz/",                        { lastModified: today,   changeFrequency: "daily",   priority: 0.82 }),
    ...localizedEntries("/urlaubsarten/fruhbucher-urlaub/",    { lastModified: content, changeFrequency: "weekly",  priority: 0.78 }),
    ...localizedEntries("/urlaubsarten/super-last-minute-urlaub/", { lastModified: today, changeFrequency: "daily", priority: 0.75 }),
    ...localizedEntries("/urlaubsarten/",                      { lastModified: content, changeFrequency: "weekly",  priority: 0.78 }),
    // ── Urlaubsthemen ──────────────────────────────────────────────────────────
    ...localizedEntries("/urlaubsthemen/",                 { lastModified: content, changeFrequency: "weekly",  priority: 0.82 }),
    ...localizedEntries("/urlaubsthemen/strandurlaub/",    { lastModified: today,   changeFrequency: "daily",   priority: 0.85 }),
    ...localizedEntries("/urlaubsthemen/familienurlaub/",  { lastModified: today,   changeFrequency: "daily",   priority: 0.85 }),
    ...localizedEntries("/urlaubsthemen/wellnessurlaub/",  { lastModified: content, changeFrequency: "weekly",  priority: 0.82 }),
    ...localizedEntries("/urlaubsthemen/staedtereisen/",   { lastModified: content, changeFrequency: "weekly",  priority: 0.82 }),
    ...localizedEntries("/urlaubsthemen/abenteuerurlaub/", { lastModified: content, changeFrequency: "weekly",  priority: 0.80 }),
    ...localizedEntries("/urlaubsthemen/aktivurlaub/",     { lastModified: content, changeFrequency: "weekly",  priority: 0.78 }),
    ...localizedEntries("/urlaubsthemen/adults-only/",     { lastModified: content, changeFrequency: "weekly",  priority: 0.80 }),
    ...localizedEntries("/urlaubsthemen/singlereisen/",    { lastModified: content, changeFrequency: "weekly",  priority: 0.78 }),
    ...localizedEntries("/urlaubsthemen/luxusurlaub/",     { lastModified: content, changeFrequency: "weekly",  priority: 0.80 }),
    ...localizedEntries("/urlaubsthemen/hochzeitsreise/",  { lastModified: content, changeFrequency: "weekly",  priority: 0.75 }),
    ...localizedEntries("/urlaubsthemen/seniorenreisen/",  { lastModified: content, changeFrequency: "weekly",  priority: 0.75 }),
    ...localizedEntries("/urlaubsthemen/kurreisen/",       { lastModified: content, changeFrequency: "weekly",  priority: 0.72 }),
    ...localizedEntries("/urlaubsthemen/budget-bis-500/",  { lastModified: today,   changeFrequency: "daily",   priority: 0.78 }),
    ...localizedEntries("/urlaubsthemen/budget-bis-1000/", { lastModified: today,   changeFrequency: "daily",   priority: 0.80 }),
    ...localizedEntries("/urlaubsthemen/budget-bis-1500/", { lastModified: today,   changeFrequency: "daily",   priority: 0.78 }),
    ...localizedEntries("/urlaubsthemen/budget-bis-2000/", { lastModified: today,   changeFrequency: "daily",   priority: 0.75 }),
    // ── Neue SEO-Hubs (Saisonal, Pauschal-Kombis, Ratgeber) ───────────────────
    ...localizedEntries("/reiseziele/",     { lastModified: content, changeFrequency: "monthly", priority: 0.85 }),
    ...localizedEntries("/pauschalreisen/", { lastModified: today,   changeFrequency: "daily",   priority: 0.88 }),
    ...localizedEntries("/ratgeber/",       { lastModified: content, changeFrequency: "weekly",  priority: 0.82 }),
    ...localizedEntries("/mietwagen-reservieren/",             { lastModified: content, changeFrequency: "weekly",  priority: 0.72 }),
    ...localizedEntries("/community/",                         { lastModified: today,   changeFrequency: "daily",   priority: 0.82 }),
    ...localizedEntries("/community/reiseberichte/",           { lastModified: today,   changeFrequency: "daily",   priority: 0.8 }),
    ...localizedEntries("/community/gruppen/",                 { lastModified: today,   changeFrequency: "daily",   priority: 0.78 }),
    ...localizedEntries("/presse/",                            { lastModified: content, changeFrequency: "monthly", priority: 0.55 }),
    ...localizedEntries("/impressum/",                         { lastModified: legal,   changeFrequency: "yearly",  priority: 0.3 }),
    ...localizedEntries("/datenschutz/",                       { lastModified: legal,   changeFrequency: "yearly",  priority: 0.3 }),
    ...localizedEntries("/agb/",                               { lastModified: legal,   changeFrequency: "yearly",  priority: 0.3 }),
  ];

  // ── Destination-Seiten mit allen Sprachvarianten ────────────────────────────
  const richDestinationPages = destinations.flatMap((d) =>
    localizedEntries(`/urlaubsziele/${d.slug}/`, { lastModified: today, changeFrequency: "daily", priority: 0.95 })
  );

  const richSlugs = new Set(destinations.map((d) => d.slug));
  const catalogPages = CATALOG.filter(
    (e) => !richSlugs.has(e.slug) && e.type === "super"
  ).flatMap((e) =>
    localizedEntries(`/urlaubsziele/${e.slug}/`, { lastModified: content, changeFrequency: "weekly", priority: 0.8 })
  );

  const guidePages = destinations
    .filter((d) => d.guideSlug)
    .flatMap((d) =>
      localizedEntries(`/urlaubsguides/${d.guideSlug}/`, { lastModified: content, changeFrequency: "monthly", priority: 0.7 })
    );

  const aktivitaetenPages = destinations
    .filter((d) => d.tiqetsCityId)
    .flatMap((d) => [
      ...localizedEntries(`/aktivitaeten/${d.slug}/`, { lastModified: content, changeFrequency: "weekly", priority: 0.78 }),
      ...(d.tiqetsNiches ?? []).flatMap((n) =>
        localizedEntries(`/aktivitaeten/${d.slug}/${n.slug}/`, { lastModified: content, changeFrequency: "weekly", priority: 0.72 })
      ),
    ]);

  // ── Saisonal-Guides (Reiseziele nach Monat) ──────────────────────────────────
  const seasonPages = SEASON_GUIDES.flatMap((g) =>
    localizedEntries(`/reiseziele/${g.slug}/`, { lastModified: content, changeFrequency: "monthly", priority: 0.78 })
  );

  // ── Pauschalreisen-Kombi-Seiten ──────────────────────────────────────────────
  const pauschalKombiPages = PAUSCHAL_KOMBIS.flatMap((k) =>
    localizedEntries(`/pauschalreisen/${k.slug}/`, { lastModified: today, changeFrequency: "daily", priority: 0.82 })
  );

  // ── Ratgeber-Artikel ─────────────────────────────────────────────────────────
  const ratgeberPages = RATGEBER_ARTICLES.flatMap((a) =>
    localizedEntries(`/ratgeber/${a.slug}/`, { lastModified: new Date(a.updatedAt), changeFrequency: "monthly", priority: 0.75 })
  );

  // ── Top-20-Attraktionen pro Tiqets-Stadt ─────────────────────────────────────
  const tiqetsSlugs = new Set<string>();
  destinations.filter((d) => d.tiqetsCityId).forEach((d) => tiqetsSlugs.add(d.slug));
  CATALOG.filter((e) => e.tiqetsCityId).forEach((e) => tiqetsSlugs.add(e.slug));
  const topAttractionPages = Array.from(tiqetsSlugs).flatMap((slug) =>
    localizedEntries(`/aktivitaeten/${slug}/top-attraktionen/`, { lastModified: content, changeFrequency: "weekly", priority: 0.76 })
  );

  return [
    ...staticPages,
    ...richDestinationPages,
    ...catalogPages,
    ...guidePages,
    ...aktivitaetenPages,
    ...seasonPages,
    ...pauschalKombiPages,
    ...ratgeberPages,
    ...topAttractionPages,
  ];
}
