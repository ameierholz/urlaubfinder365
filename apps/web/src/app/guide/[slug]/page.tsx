import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, ArrowLeft, MapPin } from "lucide-react";
import { fetchOffers } from "@/lib/travel-api";
import { getDestinationBySlug } from "@/lib/destinations";
import OffersGrid from "@/components/offers/OffersGrid";
import type { Metadata } from "next";

// Beispiel-Content – später aus Firestore/CMS oder MDX
const guideContent: Record<string, {
  slug: string;
  destination: string;
  destinationSlug: string;
  title: string;
  readingTime: number;
  coverImage: string;
  intro: string;
  sections: { heading: string; body: string }[];
}> = {
  "reisefuehrer-antalya": {
    slug: "reisefuehrer-antalya",
    destination: "Antalya",
    destinationSlug: "antalya",
    title: "Antalya Reiseführer: Alles was du wissen musst",
    readingTime: 8,
    coverImage: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=1600&q=80",
    intro:
      "Antalya ist das Herz der türkischen Riviera – eine faszinierende Mischung aus antiker Geschichte, modernen Resorts und atemberaubender Natur. Dieser Reiseführer bereitet dich optimal auf deinen Urlaub vor.",
    sections: [
      {
        heading: "Einreise & Visum",
        body: "Deutsche Staatsbürger benötigen für die Türkei kein Visum für Aufenthalte bis zu 90 Tagen. Ein gültiger Reisepass oder Personalausweis genügt. Es empfiehlt sich, die Gültigkeit des Dokuments vor der Reise zu prüfen – mindestens 6 Monate Restgültigkeit werden empfohlen.",
      },
      {
        heading: "Beste Reisezeit",
        body: "Die beste Reisezeit für Antalya ist von April bis Oktober. Die Sommermonate Juni bis August sind am heißesten (35–40°C), ideal für Strandurlaub. Für Sightseeing empfiehlt sich der Frühling (April/Mai) oder Herbst (September/Oktober) mit angenehmen 25–30°C.",
      },
      {
        heading: "Klima & Wetter",
        body: "Antalya hat ein typisch mediterranes Klima: heiße, trockene Sommer und milde, feuchte Winter. Das Meer ist von Mai bis November angenehm warm (22–29°C). Im Juli und August kann die Hitze sehr intensiv sein – plane Aktivitäten für morgens oder abends.",
      },
      {
        heading: "Sehenswürdigkeiten",
        body: "Die Altstadt Kaleiçi mit dem römischen Hafen ist ein Muss. Besuche das Hadrianstor (2. Jhd. n. Chr.), das Antalya Museum (eines der besten archäologischen Museen der Türkei) und die Düden-Wasserfälle. Tagesausflüge nach Perge, Aspendos und Side sind sehr empfehlenswert.",
      },
      {
        heading: "Essen & Trinken",
        body: "Die türkische Küche ist vielfältig und frisch. Probiere unbedingt: Köfte (Hackfleischbällchen), frischen Fisch am Hafen, Pide (türkische Pizza), Baklava und Çay (türkischen Tee). Restaurants in der Altstadt bieten gute Qualität zu fairen Preisen. Leitungswasser ist nicht zum Trinken geeignet.",
      },
      {
        heading: "Gesundheit & Sicherheit",
        body: "Antalya ist ein sicheres Touristenziel. Dennoch: Reisekrankenversicherung nicht vergessen. Bei starker Hitze viel trinken (Mineralwasser kaufen), Sonnencreme verwenden und Mittagshitze meiden. Die Nothilfe erreicht man unter 112. Europäische Krankenversichertenkarte (EHIC) gilt in der Türkei nicht.",
      },
      {
        heading: "Währung & Bezahlen",
        body: "Landeswährung ist die Türkische Lira (TRY). An den meisten Orten werden auch Euro akzeptiert, Wechselkurs aber oft ungünstig. Geldautomaten sind überall verfügbar. Kreditkarten werden in Hotels und größeren Restaurants meist akzeptiert. Kleingeld für lokale Märkte und Kleinbetriebe mitnehmen.",
      },
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideContent[slug];
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.intro.slice(0, 160),
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = guideContent[slug];

  if (!guide) notFound();

  const dest = getDestinationBySlug(guide.destinationSlug);
  const relatedOffers = dest
    ? await fetchOffers({ regionIds: dest.regionIds, limit: 3 }).catch(() => [])
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Zurück */}
      <Link
        href="/guide"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Alle Reiseführer
      </Link>

      {/* Hero Bild */}
      <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.coverImage}
          alt={guide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-sand-400" />
          {guide.destination}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sand-400" />
          {guide.readingTime} Min. Lesezeit
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-sand-400" />
          Reiseführer
        </span>
      </div>

      {/* Titel */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{guide.title}</h1>

      {/* Intro */}
      <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-sand-400 pl-4 mb-10">
        {guide.intro}
      </p>

      {/* Inhaltsverzeichnis */}
      <div className="bg-sand-50 rounded-2xl p-5 mb-10">
        <p className="font-semibold text-gray-900 mb-3 text-sm">Inhaltsverzeichnis</p>
        <ol className="space-y-1.5">
          {guide.sections.map((s, i) => (
            <li key={i}>
              <a
                href={`#section-${i}`}
                className="text-sm text-sand-700 hover:text-sand-900 hover:underline flex gap-2"
              >
                <span className="text-sand-400 font-medium">{i + 1}.</span>
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* Abschnitte */}
      <div className="space-y-10">
        {guide.sections.map((section, i) => (
          <section key={i} id={`section-${i}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-sand-100 text-sand-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              {section.heading}
            </h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      {/* Zugehörige Angebote */}
      {relatedOffers.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Günstige Angebote für {guide.destination}
          </h2>
          <p className="text-gray-500 text-sm mb-6">Jetzt Traumurlaub buchen – täglich aktualisiert.</p>
          <OffersGrid offers={relatedOffers} />
          <div className="text-center mt-6">
            <Link
              href={`/urlaubsziele/${guide.destinationSlug}`}
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              Alle {guide.destination} Angebote →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
