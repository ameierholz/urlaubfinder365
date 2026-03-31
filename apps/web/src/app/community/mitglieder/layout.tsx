import type { Metadata } from "next";

const BASE_URL = "https://www.urlaubfinder365.de";

export const metadata: Metadata = {
  title: "Community-Mitglieder – Reisende aus aller Welt",
  description: "Entdecke aktive Reisende in der Urlaubfinder365 Community. Vernetze dich, folge Reisenden und entdecke ihre Erfahrungen.",
  alternates: { canonical: `${BASE_URL}/community/mitglieder/` },
  openGraph: {
    title: "Community-Mitglieder | Urlaubfinder365",
    description: "Entdecke aktive Reisende und vernetze dich mit der Community.",
    url: `${BASE_URL}/community/mitglieder/`,
    type: "website",
    siteName: "Urlaubfinder365",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community-Mitglieder | Urlaubfinder365",
    description: "Entdecke aktive Reisende in der Urlaubfinder365 Community.",
  },
};

export default function MitgliederLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
