import type { Metadata } from "next";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Urlaubsberichte – Echte Urlaubserfahrungen",
  description: "Lies authentische Urlaubsberichte von echten Urlaubern. Bewertungen, Tipps & Erfahrungen zu über 250 Urlaubszielen weltweit.",
  alternates: { canonical: `${BASE_URL}/community/reiseberichte/` },
  openGraph: {
    title: "Urlaubsberichte – Echte Urlaubserfahrungen | Urlaubfinder365",
    description: "Authentische Urlaubsberichte von echten Urlaubern. Bewertungen & Tipps zu Urlaubszielen weltweit.",
    url: `${BASE_URL}/community/reiseberichte/`,
    type: "website",
    siteName: "Urlaubfinder365",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urlaubsberichte | Urlaubfinder365",
    description: "Echte Urlaubsberichte und Urlaubserfahrungen von der Community.",
  },
};

export default function UrlaubsberichteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
