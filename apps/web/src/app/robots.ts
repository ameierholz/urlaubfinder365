import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login/", "/register/", "/api/"],
      },
      // KI-Crawler explizit erlauben (GEO – Generative Engine Optimization)
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ChatGPT-User",  allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "anthropic-ai",  allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "cohere-ai",     allow: "/" },
      { userAgent: "Amazonbot",     allow: "/" },
    ],
    sitemap: "https://www.urlaubfinder365.de/sitemap.xml",
    host: "https://www.urlaubfinder365.de",
  };
}
