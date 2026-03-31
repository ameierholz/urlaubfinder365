import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login/", "/register/", "/api/"],
      },
    ],
    sitemap: "https://www.urlaubfinder365.de/sitemap.xml",
    host: "https://www.urlaubfinder365.de",
  };
}
