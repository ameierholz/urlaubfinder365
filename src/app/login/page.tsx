import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melde dich bei Urlaubfinder365 an und verwalte deine Reisefavoriten, Preisalarme und Buchungen.",
  alternates: { canonical: "https://www.urlaubfinder365.de/login/" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
