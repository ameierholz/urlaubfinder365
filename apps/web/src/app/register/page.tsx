import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Registrieren",
  description: "Erstelle dein kostenloses Urlaubfinder365-Konto und erhalte exklusive Reiseangebote, Preisalarme und persönliche Empfehlungen.",
  alternates: { canonical: "https://www.urlaubfinder365.de/register/" },
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
