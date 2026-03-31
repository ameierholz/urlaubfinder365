import type { Metadata } from "next";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Travel Community – Reiseberichte & Reisende treffen",
  description: "Lies echte Reiseberichte, tausche dich mit anderen Reisenden aus und entdecke Geheimtipps in der Urlaubfinder365 Community.",
  alternates: { canonical: `${BASE_URL}/community/` },
  openGraph: {
    title: "Travel Community – Reiseberichte & Erfahrungen teilen | Urlaubfinder365",
    description: "Echte Reiseberichte, Reisetipps & Community für Urlauber. Entdecke Erfahrungen von Reisenden weltweit.",
    url: `${BASE_URL}/community/`,
    type: "website",
    siteName: "Urlaubfinder365",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Community | Urlaubfinder365",
    description: "Lies echte Reiseberichte und tausche dich mit anderen Reisenden aus.",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
