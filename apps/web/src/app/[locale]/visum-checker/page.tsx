import type { Metadata } from "next";
import RightSidebar from "@/components/layout/RightSidebar";
import { Globe, ShieldCheck, Clock, Info } from "lucide-react";
import VisumChecker from "@/components/visum/VisumChecker";
import { setRequestLocale } from "next-intl/server";
import { fetchPageSeoMeta } from "@/lib/seo-meta";

const FALLBACK_TITLE = "Visum-Checker – Einreisebestimmungen für deutsche Reisepässe";
const FALLBACK_DESC = "Kostenloser Visum-Checker: Einreisebestimmungen, Visumpflicht & Kosten für 50+ Urlaubsziele weltweit – für deutsche Staatsangehörige. Jetzt prüfen!";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchPageSeoMeta("/visum-checker");
  const title = seo?.meta_title || FALLBACK_TITLE;
  const description = seo?.meta_description || FALLBACK_DESC;
  return {
    title,
    description,
    alternates: { canonical: "https://www.urlaubfinder365.de/visum-checker/" },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || "Sofort prüfen: Brauchst du ein Visum? Kosten, Bearbeitungszeit & Links für 50+ Länder.",
      url: "https://www.urlaubfinder365.de/visum-checker/",
      type: "website",
      ...(seo?.og_image ? { images: [{ url: seo.og_image }] } : {}),
    },
  };
}

const STATS = [
  { icon: Globe,       zahl: "50+",     text: "Urlaubsziele" },
  { icon: ShieldCheck, zahl: "Gratis",  text: "Kostenlos nutzen" },
  { icon: Clock,       zahl: "Sofort",  text: "Ergebnis in Sekunden" },
  { icon: Info,        zahl: "DE Pass", text: "Für deutsche Pässe" },
];

export default async function ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = await fetchPageSeoMeta("/visum-checker");
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden text-white py-14 px-4" style={{ minHeight: "340px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80&auto=format"
          alt="Visum-Checker"
          className="absolute inset-0 w-full h-full object-cover"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#00838F]/90 via-[#006d78]/85 to-[#004d5a]/90" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            ✈️ Kostenloser Visum-Checker
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Brauche ich ein Visum?
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            Einreisebestimmungen, Visumkosten und Bearbeitungszeiten für über 50 Urlaubsziele weltweit —
            speziell für deutsche Reisepässe.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            {STATS.map(({ icon: Icon, zahl, text }) => (
              <div key={text} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Icon className="w-5 h-5 mx-auto mb-1 text-white/80" />
                <p className="text-xl font-black">{zahl}</p>
                <p className="text-xs text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Intro */}
      {seo?.seo_intro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {seo.seo_intro}
          </p>
        </div>
      )}

      {/* SEO Middle */}
      {seo?.seo_middle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
          {seo.seo_h2_middle && (
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{seo.seo_h2_middle}</h2>
          )}
          <div className="text-gray-600 text-sm leading-relaxed max-w-3xl space-y-3">
            {seo.seo_middle.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block, i) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </div>
      )}

      {/* Checker + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:flex xl:gap-8 xl:items-start">
          <div className="flex-1 min-w-0">
            <VisumChecker />

      {/* Info-Box */}
      <div className="mt-8 pb-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Häufige Fragen zum Visum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Was ist ein E-Visum?</h3>
              <p>Ein E-Visum wird vollständig online beantragt, ohne persönlichen Botschaftsbesuch. Du erhältst es per E-Mail und zeigst es bei der Einreise vor.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Was ist ein Visum on Arrival?</h3>
              <p>Das Visum wird direkt am Flughafen oder Grenzübergang ausgestellt. Du brauchst kein Visum vorab, solltest aber Bargeld und alle Unterlagen dabei haben.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Was ist ESTA (USA)?</h3>
              <p>Das ESTA ist kein Visum, aber eine elektronische Reisegenehmigung für den US-Visumbefreiungsprogramm. Muss vor Reiseantritt online beantragt werden (ca. 21 USD).</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Wie lange ist mein Pass gültig?</h3>
              <p>Die meisten Länder verlangen, dass der Reisepass noch mindestens 6 Monate nach Ausreise gültig ist. Außerdem oft 2 leere Seiten erforderlich.</p>
            </div>
          </div>
        </div>
      </div>
          </div>{/* end main */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <RightSidebar
                extrasBox={{
                  image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=400&h=200&q=70&auto=format",
                  eyebrow: "Absicherung",
                  title: "Auslandsschutz nicht vergessen",
                  description: "Krankheit im Ausland kann teuer werden. Reiseversicherung jetzt vergleichen.",
                  href: "/reiseversicherung/",
                  ctaLabel: "Jetzt absichern →",
                  accentColor: "bg-blue-700",
                }}
                seoLinksTitle="🛂 Einreise & Infos"
                seoLinks={[
                  { href: "/reisewarnungen/",   label: "Reisewarnungen" },
                  { href: "/reiseversicherung/", label: "Reiseversicherung" },
                  { href: "/urlaubsziele/",      label: "Urlaubsziele" },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>
      {/* SEO Bottom */}
      {seo?.seo_bottom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl">
            {seo.seo_h2_bottom && (
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">{seo.seo_h2_bottom}</h2>
            )}
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              {seo.seo_bottom.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
