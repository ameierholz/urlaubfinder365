import { MetadataRoute } from "next";
import { destinations } from "@/lib/destinations";
import { CATALOG } from "@/data/catalog-regions";

// Guide-Slugs mit echtem Seiteninhalt
const GUIDE_SLUGS = ["reisefuehrer-antalya"];

const BASE_URL = "https://www.urlaubfinder365.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const today      = new Date();                    // Deal-Seiten: täglich frisch
  const content    = new Date("2026-03-18");        // Content-Seiten: letztes größeres Update
  const legal      = new Date("2025-01-01");        // Rechtliche Seiten: kaum Änderungen

  // Statische Seiten – nach SEO-Wert priorisiert
  const staticPages: MetadataRoute.Sitemap = [
    // ── Kernseiten (höchste Priorität) ──────────────────────────────────────
    { url: `${BASE_URL}/`, lastModified: today, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/last-minute/`, lastModified: today, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE_URL}/guenstig-urlaub-buchen/`, lastModified: today, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE_URL}/urlaubsziele/`, lastModified: content, changeFrequency: "weekly", priority: 0.92 },
    // ── Buchungs-Einstiegsseiten ─────────────────────────────────────────────
    { url: `${BASE_URL}/urlaubsarten/pauschalreisen/`, lastModified: content, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/urlaubsarten/all-inclusive-urlaub/`, lastModified: content, changeFrequency: "weekly", priority: 0.88 },
    { url: `${BASE_URL}/urlaubsarten/last-minute-urlaub/`, lastModified: today, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE_URL}/urlaubsarten/super-last-minute-urlaub/`, lastModified: today, changeFrequency: "daily", priority: 0.82 },
    { url: `${BASE_URL}/kreuzfahrten/`, lastModified: content, changeFrequency: "weekly", priority: 0.82 },
    { url: `${BASE_URL}/flugsuche/`, lastModified: content, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/hotelsuche/`, lastModified: content, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/urlaubsarten/fruhbucher-urlaub/`, lastModified: content, changeFrequency: "weekly", priority: 0.78 },
    { url: `${BASE_URL}/urlaubsarten/`, lastModified: content, changeFrequency: "weekly", priority: 0.78 },
    { url: `${BASE_URL}/mietwagen-reservieren/`, lastModified: content, changeFrequency: "weekly", priority: 0.72 },
    // ── Content / Ratgeber ───────────────────────────────────────────────────
    { url: `${BASE_URL}/urlaubsguides/`, lastModified: content, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/guide/`, lastModified: content, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE_URL}/aktivitaeten/`, lastModified: today, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/tipps/reise-packliste/`, lastModified: content, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/extras/reisenden-karte/`, lastModified: content, changeFrequency: "weekly", priority: 0.72 },
    // ── Community ────────────────────────────────────────────────────────────
    { url: `${BASE_URL}/community/`, lastModified: today, changeFrequency: "daily", priority: 0.82 },
    { url: `${BASE_URL}/community/reiseberichte/`, lastModified: today, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/community/gruppen/`, lastModified: today, changeFrequency: "daily", priority: 0.78 },
    { url: `${BASE_URL}/community/mitglieder/`, lastModified: today, changeFrequency: "weekly", priority: 0.7 },
    // ── Linkable / PR ────────────────────────────────────────────────────────
    { url: `${BASE_URL}/presse/`, lastModified: content, changeFrequency: "monthly", priority: 0.55 },
    // ── Rechtliche Pflichtseiten ─────────────────────────────────────────────
    { url: `${BASE_URL}/impressum/`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/datenschutz/`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/agb/`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Rich destination pages (vollständige Seiten mit Inhalten) → höchste Prio
  const richDestinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${BASE_URL}/urlaubsziele/${d.slug}/`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.95,
  }));

  // Katalog: nur Super-Regionen (Länder/große Regionen wie "türkei", "spanien" etc.)
  // Sub-Regionen (202 Städte/Resorts wie "antalya-side", "mallorca-playa") werden bewusst
  // NICHT in die Sitemap aufgenommen – sie haben zu wenig Unique Content und verschwenden
  // Crawl-Budget. Google findet sie weiterhin über interne Links (z.B. von der Super-Region).
  const richSlugs = new Set(destinations.map((d) => d.slug));
  const catalogPages: MetadataRoute.Sitemap = CATALOG.filter(
    (e) => !richSlugs.has(e.slug) && e.type === "super"
  ).map((e) => ({
    url: `${BASE_URL}/urlaubsziele/${e.slug}/`,
    lastModified: content,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Guide-Seiten (urlaubsguides/ = SEO-Guides aus Firestore/CMS)
  const guidePages: MetadataRoute.Sitemap = destinations
    .filter((d) => d.guideSlug)
    .map((d) => ({
      url: `${BASE_URL}/urlaubsguides/${d.guideSlug}/`,
      lastModified: content,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // /guide/[slug]/ Seiten (statische Reiseführer)
  const staticGuidePages: MetadataRoute.Sitemap = GUIDE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/guide/${slug}/`,
    lastModified: content,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  // Aktivitäten-Stadtseiten (alle Destinations mit tiqetsCityId)
  const aktivitaetenPages: MetadataRoute.Sitemap = destinations
    .filter((d) => d.tiqetsCityId)
    .flatMap((d) => [
      {
        url: `${BASE_URL}/aktivitaeten/${d.slug}/`,
        lastModified: content,
        changeFrequency: "weekly" as const,
        priority: 0.78,
      },
      ...(d.tiqetsNiches ?? []).map((n) => ({
        url: `${BASE_URL}/aktivitaeten/${d.slug}/${n.slug}/`,
        lastModified: content,
        changeFrequency: "weekly" as const,
        priority: 0.72,
      })),
    ]);

  return [...staticPages, ...richDestinationPages, ...catalogPages, ...guidePages, ...staticGuidePages, ...aktivitaetenPages];
}
