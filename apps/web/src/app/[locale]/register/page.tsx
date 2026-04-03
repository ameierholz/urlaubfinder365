import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "✨ Kostenlos registrieren – Urlaubfinder365",
  description: "Kostenlos bei Urlaubfinder365 registrieren ✓ Preisalarme ✓ Reiseberichte schreiben ✓ Community beitreten ✓ Favoriten speichern.",
  alternates: { canonical: "https://www.urlaubfinder365.de/register/" },
  robots: { index: false, follow: true },
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AuthForm mode="register" />;
}
