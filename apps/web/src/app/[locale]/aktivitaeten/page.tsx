import type { Metadata } from "next";
import { Suspense } from "react";
import MarktplatzHome from "@/components/marktplatz/MarktplatzHome";
import RightSidebar from "@/components/layout/RightSidebar";
import { setRequestLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/seo/JsonLd";
export const metadata: Metadata = {
  title: "Aktivitäten, Touren & Erlebnisse buchen | Urlaubfinder365",
  description:
    "Touren, Stadtführungen, Wassersport & Erlebnisse direkt bei lokalen Anbietern buchen. Gratis stornierbar, sofortige Bestätigung, faire Preise.",
  alternates: { canonical: "https://www.urlaubfinder365.de/aktivitaeten/" },
  openGraph: {
    title: "Aktivitäten, Touren & Erlebnisse | Urlaubfinder365",
    description: "Unvergessliche Erlebnisse direkt bei lokalen Guides & Anbietern buchen.",
    url: "https://www.urlaubfinder365.de/aktivitaeten/",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.urlaubfinder365.de/" },
    { "@type": "ListItem", position: 2, name: "Aktivitäten", item: "https://www.urlaubfinder365.de/aktivitaeten/" },
  ],
};

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aktivitaetenPage");
  return (
    <>
    <JsonLd data={breadcrumbSchema} />
    <MarktplatzHome
      sidebar={
        <Suspense fallback={null}>
          <RightSidebar
            extrasBox={{
              image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
              eyebrow: t("sidebarEyebrow"),
              title: t("sidebarTitle"),
              description: t("sidebarDesc"),
              href: "/erlebnisse/",
              ctaLabel: t("sidebarCta"),
            }}
            seoLinksTitle={t("seoLinksTitle")}
            seoLinks={[
              { href: "/urlaubsziele/",                  label: t("seoLinkZiele") },
              { href: "/urlaubsthemen/",                 label: t("seoLinkThemen") },
              { href: "/urlaubsarten/pauschalreisen/",   label: t("seoLinkPauschal") },
              { href: "/reiseversicherung/",             label: t("seoLinkVersicherung") },
              { href: "/ki-reiseplaner/",                label: t("seoLinkKiPlaner") },
            ]}
          />
        </Suspense>
      }
    />
    </>
  );
}
