import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "✨ Kostenlos registrieren – Urlaubfinder365",
  description: "Kostenlos bei Urlaubfinder365 registrieren ✓ Preisalarme ✓ Reiseberichte schreiben ✓ Community beitreten ✓ Favoriten speichern.",
  alternates: { canonical: "https://www.urlaubfinder365.de/register/" },
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
