import type { Metadata } from "next";

// UGC-Seiten: noindex um Crawl-Budget zu schonen und Duplicate-Content zu vermeiden
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function UrlaubsberichtDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
