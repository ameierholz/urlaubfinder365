import type { Metadata } from "next";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Reisegruppen – Finde Gleichgesinnte für deine nächste Reise",
  description: "Tritt Reisegruppen bei oder erstelle deine eigene. Finde Mitreisende nach Ziel, Reisestil und Zeitraum in der Urlaubfinder365 Community.",
  alternates: { canonical: `${BASE_URL}/community/gruppen/` },
  openGraph: {
    title: "Reisegruppen | Urlaubfinder365",
    description: "Tritt Reisegruppen bei und finde Gleichgesinnte für deine nächste Reise.",
    url: `${BASE_URL}/community/gruppen/`,
    type: "website",
    siteName: "Urlaubfinder365",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reisegruppen | Urlaubfinder365",
    description: "Finde Mitreisende und tritt Reisegruppen bei.",
  },
};

export default function GruppenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
