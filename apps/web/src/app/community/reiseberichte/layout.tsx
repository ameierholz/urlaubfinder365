import type { Metadata } from "next";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Reiseberichte – Echte Urlaubserfahrungen",
  description: "Lies authentische Reiseberichte von echten Urlaubern. Bewertungen, Tipps & Erfahrungen zu über 250 Reisezielen weltweit.",
  alternates: { canonical: `${BASE_URL}/community/reiseberichte/` },
  openGraph: {
    title: "Reiseberichte – Echte Urlaubserfahrungen | Urlaubfinder365",
    description: "Authentische Reiseberichte von echten Urlaubern. Bewertungen & Tipps zu Reisezielen weltweit.",
    url: `${BASE_URL}/community/reiseberichte/`,
    type: "website",
    siteName: "Urlaubfinder365",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reiseberichte | Urlaubfinder365",
    description: "Echte Reiseberichte und Urlaubserfahrungen von der Community.",
  },
};

export default function ReiseberichteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
