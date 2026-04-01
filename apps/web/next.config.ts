import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  transpilePackages: ["@urlaubfinder/shared"],


  allowedDevOrigins: ["127.0.0.1", "localhost"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.specials.de" },
      { protocol: "https", hostname: "media.traffics-switch.de" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://d.adup-tech.com https://s.adup-tech.com https://vercel.live https://*.vercel.app https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com",
              "font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com https://assets.specials.de data:",
              "img-src 'self' data: blob: https://images.unsplash.com https://*.specials.de https://media.traffics-switch.de https://flagcdn.com https://*.tiqets.com https://aws-tiqets-cdn.imgix.net https://*.supabase.co https://*.googleusercontent.com https://*.googleapis.com https://i.pravatar.cc",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.firebaseio.com https://*.googleapis.com https://api.specials.de https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://d.adup-tech.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://accounts.google.com",
              "frame-src 'self' https://*.specials.de https://d.adup-tech.com https://s.adup-tech.com https://www.openstreetmap.org https://openstreetmap.org https://accounts.google.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      {
        // Next.js JS/CSS chunks – content-hashed, safe to cache forever
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // IBE engine + CSS served from /public/scripts/ and /public/styles/
        source: "/(scripts|styles)/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  // ─── 301-Redirects: alte WordPress-URLs → neue Next.js-Struktur ───
  async redirects() {
    return [
      // Sitemap & Feeds
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/feed/rss", destination: "/", permanent: true },
      { source: "/feed/atom", destination: "/", permanent: true },
      { source: "/comments/feed/", destination: "/", permanent: true },

      // WordPress-System-URLs blockieren
      { source: "/wp-login.php", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-includes/:path*", destination: "/", permanent: true },
      { source: "/xmlrpc.php", destination: "/", permanent: true },

      // WordPress-Kategorien → Urlaubsziele
      { source: "/category/mallorca/:path*", destination: "/urlaubsziele/mallorca/", permanent: true },
      { source: "/category/antalya/:path*", destination: "/urlaubsziele/antalya/", permanent: true },
      { source: "/category/kreta/:path*", destination: "/urlaubsziele/kreta/", permanent: true },
      { source: "/category/barcelona/:path*", destination: "/urlaubsziele/barcelona/", permanent: true },
      { source: "/category/last-minute/:path*", destination: "/last-minute/", permanent: true },
      { source: "/category/:slug/", destination: "/urlaubsziele/", permanent: true },
      { source: "/category/:slug", destination: "/urlaubsziele/", permanent: true },

      // WordPress-Tags → Urlaubsziele
      { source: "/tag/:slug/", destination: "/urlaubsziele/", permanent: true },
      { source: "/tag/:slug", destination: "/urlaubsziele/", permanent: true },

      // WordPress-Paginierung → Startseite
      { source: "/page/:num/", destination: "/", permanent: true },
      { source: "/page/:num", destination: "/", permanent: true },

      // Alte Datumspfade
      { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/", destination: "/urlaubsguides/", permanent: true },
      { source: "/:year(\\d{4})/:month(\\d{2})/:slug/", destination: "/urlaubsguides/", permanent: true },
      { source: "/:year(\\d{4})/:month(\\d{2})/", destination: "/", permanent: true },
      { source: "/:year(\\d{4})/:month(\\d{2})", destination: "/", permanent: true },

      // Author-Seiten
      { source: "/author/:slug/", destination: "/", permanent: true },
      { source: "/author/:slug", destination: "/", permanent: true },

      // Hotel-IBE-Pfade
      { source: "/hotel/hotelsuche/", destination: "/hotelsuche/", permanent: true },
      { source: "/hotel/hotelsuche", destination: "/hotelsuche/", permanent: true },
      { source: "/hotel/:path*/", destination: "/hotelsuche/", permanent: true },
      { source: "/hotel/:path*", destination: "/hotelsuche/", permanent: true },

      // Flug-IBE-Pfade
      { source: "/flug/flugsuche/", destination: "/flugsuche/", permanent: true },
      { source: "/flug/flugsuche", destination: "/flugsuche/", permanent: true },
      { source: "/flug/:path*/", destination: "/flugsuche/", permanent: true },
      { source: "/flug/:path*", destination: "/flugsuche/", permanent: true },

      // Themen-URLs
      { source: "/thema/all-inclusive/", destination: "/urlaubsthemen/all-inclusive-urlaub/", permanent: true },
      { source: "/thema/all-inclusive", destination: "/urlaubsthemen/all-inclusive-urlaub/", permanent: true },
      { source: "/thema/:slug/", destination: "/urlaubsthemen/", permanent: true },
      { source: "/thema/:slug", destination: "/urlaubsthemen/", permanent: true },

      // Last-Minute-Suche
      { source: "/last-minute-suche/", destination: "/last-minute/", permanent: true },
      { source: "/last-minute-suche", destination: "/last-minute/", permanent: true },
      { source: "/urlaubsarten/last-minute-suche/", destination: "/last-minute/", permanent: true },
      { source: "/urlaubsarten/last-minute-suche", destination: "/last-minute/", permanent: true },

      // Guide-URLs
      { source: "/guide/:slug/", destination: "/urlaubsguides/", permanent: true },
      { source: "/guide/:slug", destination: "/urlaubsguides/", permanent: true },

      // Rechtspfade
      { source: "/allgemeine-geschaeftsbedingungen-agb/", destination: "/agb/", permanent: true },
      { source: "/allgemeine-geschaeftsbedingungen-agb", destination: "/agb/", permanent: true },
      { source: "/datenschutzerklaerung/", destination: "/datenschutz/", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz/", permanent: true },

      // Länder/Region/Ort-Pfade
      { source: "/land/spanien/", destination: "/urlaubsziele/spanien/", permanent: true },
      { source: "/land/spanien", destination: "/urlaubsziele/spanien/", permanent: true },
      { source: "/land/:slug/", destination: "/urlaubsziele/", permanent: true },
      { source: "/land/:slug", destination: "/urlaubsziele/", permanent: true },
      { source: "/region/:slug/", destination: "/urlaubsziele/", permanent: true },
      { source: "/region/:slug", destination: "/urlaubsziele/", permanent: true },
      { source: "/ort/:slug/", destination: "/urlaubsziele/", permanent: true },
      { source: "/ort/:slug", destination: "/urlaubsziele/", permanent: true },

      // Singular → Plural
      { source: "/urlaubsziel/:slug/", destination: "/urlaubsziele/", permanent: true },
      { source: "/urlaubsziel/:slug", destination: "/urlaubsziele/", permanent: true },

      // Verschachtelte Urlaubsziele
      { source: "/urlaubsziele/tuerkei/antalya/", destination: "/urlaubsziele/antalya/", permanent: true },
      { source: "/urlaubsziele/tuerkei/:slug/", destination: "/urlaubsziele/:slug/", permanent: true },
      { source: "/urlaubsziele/urlaubssuche/", destination: "/urlaubsziele/", permanent: true },
      { source: "/urlaubsziele/urlaubssuche", destination: "/urlaubsziele/", permanent: true },

      // Stadtspezifische Pauschalreisen
      { source: "/urlaubsarten/pauschalreisen-antalya/", destination: "/urlaubsziele/antalya/", permanent: true },
      { source: "/urlaubsarten/pauschalreisen-mallorca/", destination: "/urlaubsziele/mallorca/", permanent: true },
      { source: "/urlaubsarten/pauschalreisen-barcelona/", destination: "/urlaubsziele/barcelona/", permanent: true },
      { source: "/urlaubsarten/pauschalreisen-hurghada/", destination: "/urlaubsziele/hurghada/", permanent: true },
      { source: "/urlaubsarten/pauschalreisen-:slug/", destination: "/urlaubsarten/pauschalreisen/", permanent: true },
      { source: "/urlaubsarten/pauschalreisen-:slug", destination: "/urlaubsarten/pauschalreisen/", permanent: true },

      // Last-Minute stadtspezifisch
      { source: "/urlaubsarten/last-minute-antalya/", destination: "/last-minute/", permanent: true },
      { source: "/urlaubsarten/last-minute-:slug/", destination: "/last-minute/", permanent: true },
      { source: "/urlaubsarten/last-minute-:slug", destination: "/last-minute/", permanent: true },
      { source: "/urlaubsarten/super-last-minute-antalya/", destination: "/last-minute/", permanent: true },
      { source: "/urlaubsarten/super-last-minute-:slug/", destination: "/last-minute/", permanent: true },
      { source: "/urlaubsarten/super-last-minute-:slug", destination: "/last-minute/", permanent: true },

      // Kreuzfahrten
      { source: "/urlaubsarten/kreuzfahrten/", destination: "/kreuzfahrten/", permanent: true },
      { source: "/urlaubsarten/kreuzfahrten", destination: "/kreuzfahrten/", permanent: true },

      // Mietwagen
      { source: "/mietwagen/:path*/", destination: "/mietwagen-reservieren/", permanent: true },
      { source: "/mietwagen/:path*", destination: "/mietwagen-reservieren/", permanent: true },

      // Pauschalreisen Top-Level
      { source: "/pauschalreisen/:slug/", destination: "/urlaubsarten/pauschalreisen/", permanent: true },
      { source: "/pauschalreisen/:slug", destination: "/urlaubsarten/pauschalreisen/", permanent: true },

      // Reisenden-Karte
      { source: "/reisenden-karte/", destination: "/extras/reisenden-karte/", permanent: true },
      { source: "/reisenden-karte", destination: "/extras/reisenden-karte/", permanent: true },
    ];
  },
};

export default nextConfig;
