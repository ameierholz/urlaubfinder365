import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "🔑 Anmelden – Urlaubfinder365",
  description: "Jetzt bei Urlaubfinder365 anmelden und alle Community-Features nutzen ✓ Reiseberichte ✓ Gruppen ✓ Preisalarme.",
  alternates: { canonical: "https://www.urlaubfinder365.de/login/" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
