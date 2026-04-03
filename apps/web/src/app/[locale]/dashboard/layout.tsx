import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard – Urlaubfinder365",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
