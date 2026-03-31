import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://urlaubfinder365.de";

// Statisch bis Supabase angebunden ist
const DESTINATION_SLUGS = [
  "mallorca", "antalya", "kreta", "hurghada", "barcelona",
  "fuerteventura", "gran-canaria", "teneriffa", "rhodos", "rom",
  "side", "bodrum", "malediven", "dubai", "phuket",
  "bali", "kapstadt", "new-york", "cancun", "sansibar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/urlaubsziele/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/last-minute/`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/hotelsuche/`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/flugsuche/`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/urlaubsguides/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/impressum/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/datenschutz/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/agb/`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const destinationPages: MetadataRoute.Sitemap = DESTINATION_SLUGS.map(
    (slug) => ({
      url: `${BASE_URL}/urlaubsziele/${slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...destinationPages];
}
