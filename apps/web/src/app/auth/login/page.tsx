import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Anmelden – Urlaubfinder365",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function AuthLoginPage({ searchParams }: Props) {
  const { redirect } = await searchParams;

  // Nur relative Pfade erlauben (kein Open Redirect)
  const redirectTo =
    redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  return <AuthForm mode="login" redirectTo={redirectTo} />;
}
