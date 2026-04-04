import type { Metadata } from "next";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Urlaubsgruppen – Finde Gleichgesinnte für deinen nächsten Urlaub",
  description: "Tritt Urlaubsgruppen bei oder erstelle deine eigene. Finde Mitreisende nach Ziel, Reisestil und Zeitraum in der Urlaubfinder365 Community.",
  alternates: { canonical: `${BASE_URL}/community/gruppen/` },
  openGraph: {
    title: "Urlaubsgruppen | Urlaubfinder365",
    description: "Tritt Urlaubsgruppen bei und finde Gleichgesinnte für deinen nächsten Urlaub.",
    url: `${BASE_URL}/community/gruppen/`,
    type: "website",
    siteName: "Urlaubfinder365",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urlaubsgruppen | Urlaubfinder365",
    description: "Finde Mitreisende und tritt Urlaubsgruppen bei.",
  },
};

export default function GruppenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
