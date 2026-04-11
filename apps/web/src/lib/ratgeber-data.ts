export interface RatgeberSection {
  heading: string;
  body: string;
}

export interface RatgeberArticle {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  heroImage: string;
  category: "Buchung" | "Verpflegung" | "Preise" | "Planung" | "Sicherheit";
  readingTimeMin: number;
  updatedAt: string;      // ISO-Date
  sections: RatgeberSection[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[]; // Andere Ratgeber-Slugs
}

export const RATGEBER_ARTICLES: RatgeberArticle[] = [
  {
    slug: "wann-last-minute-buchen",
    title: "Wann Last-Minute-Reisen am günstigsten buchen?",
    seoTitle: "Wann Last-Minute buchen? Die besten Zeiten für Schnäppchen",
    seoDescription: "Wann ist der beste Zeitpunkt für Last-Minute-Reisen? Erfahre, wie du bis zu 50 % sparst – mit Insider-Tipps zu Wochentagen, Zeitfenstern & Tricks.",
    lead: "Der Mythos besagt: Je später, desto günstiger. Stimmt das wirklich? Die Antwort ist nuancierter – und mit dem richtigen Timing sparst du bis zu 50 %.",
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
    category: "Buchung",
    readingTimeMin: 6,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Der optimale Buchungszeitpunkt",
        body: "Last-Minute-Reisen sind in der Regel 2 bis 4 Wochen vor Abflug am günstigsten. Die Veranstalter senken die Preise, um Restplätze zu füllen, bevor die Flugzeuge und Hotels leer bleiben. Wer flexibel ist und auch mit unpopulären Abflugzeiten (sehr früh morgens, spätabends) leben kann, bekommt die besten Deals. Statistisch gesehen sind Reisen, die 18-24 Tage vor Abflug gebucht werden, im Schnitt 35 % günstiger als Frühbucher-Tarife für dieselbe Reise.",
      },
      {
        heading: "Super-Last-Minute (0-7 Tage)",
        body: "Ganz kurzfristige Buchungen (0-7 Tage vor Abreise) sind ein Glücksspiel: Entweder findest du Schnäppchen mit 50 % Rabatt, oder die Preise sind extrem hoch, weil nur noch teure Restkategorien verfügbar sind. Die verbleibende Hotelauswahl ist eingeschränkt und beliebte Resorts meist ausgebucht. Wir empfehlen Super-Last-Minute nur, wenn du maximal flexibel bist.",
      },
      {
        heading: "Beste Wochentage zum Buchen",
        body: "Dienstag und Mittwoch sind laut verschiedenen Analysen die besten Tage, um eine Last-Minute-Reise zu buchen. Die Preise von Flügen und Pauschalreisen werden am Wochenende durch erhöhte Nachfrage oft nach oben angepasst, sinken aber Anfang der Woche wieder. Am Dienstagnachmittag veröffentlichen viele Anbieter ihre neuen Angebote.",
      },
      {
        heading: "Welche Ziele sind als Last Minute besonders günstig?",
        body: "Die Türkei, Ägypten und die Kanaren sind Last-Minute-Hochburgen. Besonders in der Nebensaison (Mai, September, Oktober) findest du dort All-Inclusive-Deals unter 400 € pro Person. Griechenland und Mallorca sind ebenfalls beliebte Last-Minute-Ziele, aber etwas teurer.",
      },
      {
        heading: "Vorsicht bei Fake-Angeboten",
        body: "Nicht jedes 'Last Minute' ist wirklich eines. Manche Anbieter werben mit Last-Minute-Rabatten, obwohl der Preis vorher künstlich erhöht wurde. Vergleiche immer mit mindestens zwei Plattformen und schau auf die historischen Preisverläufe, um echte Schnäppchen von Marketing-Tricks zu unterscheiden.",
      },
    ],
    faqs: [
      { question: "Wie viel Prozent sparst du mit Last-Minute?", answer: "Im Durchschnitt 20-50 % gegenüber dem regulären Katalog-Preis. In Randzeiten (Schulferien) sind die Rabatte meist geringer (10-20 %), in der Nebensaison größer (30-50 %)." },
      { question: "Ist Last-Minute mit Kindern empfehlenswert?", answer: "Mit Babys und Kleinkindern ja, mit schulpflichtigen Kindern eingeschränkt. Während der Schulferien sind Last-Minute-Angebote rar, da die Nachfrage hoch bleibt. Außerhalb der Ferien sind Familien-Deals sehr attraktiv." },
      { question: "Muss ich einen Veranstalter oder eine Plattform nutzen?", answer: "Beide haben Vor- und Nachteile. Plattformen wie Urlaubfinder365 aggregieren mehrere Veranstalter und zeigen dir die tagesaktuell günstigsten Angebote. Ein einzelner Veranstalter hat zwar tiefere Rabatte, aber weniger Auswahl." },
    ],
    relatedSlugs: ["all-inclusive-oder-nicht", "pauschalreise-vs-einzelbuchung", "wie-frueh-urlaub-buchen"],
  },
  {
    slug: "all-inclusive-oder-nicht",
    title: "All Inclusive oder nicht? Die ehrliche Kalkulation",
    seoTitle: "All Inclusive oder Halbpension? Vorteile & Nachteile im Vergleich",
    seoDescription: "Lohnt sich All Inclusive wirklich? Ehrliche Analyse: Wann sich das Verpflegungskonzept rechnet und wann Halbpension oder Selbstverpflegung sinnvoller sind.",
    lead: "All-Inclusive klingt verlockend – aber rechnet es sich wirklich? Und welche Urlauber profitieren davon am meisten? Unsere ehrliche Analyse.",
    heroImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
    category: "Verpflegung",
    readingTimeMin: 7,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Was bedeutet All Inclusive wirklich?",
        body: "All Inclusive umfasst in der Regel Frühstück, Mittagessen, Abendessen, Snacks zwischendurch sowie alle alkoholischen und alkoholfreien Getränke aus dem hauseigenen Sortiment. Je nach Hotel gibt es Einschränkungen: Manche Resorts bieten nur lokale Getränke, andere auch internationale Marken. 'Ultra All-Inclusive' geht noch weiter und umfasst Premium-Alkoholika, à-la-carte-Restaurants und teilweise Minibar-Auffüllung.",
      },
      {
        heading: "Wann sich All Inclusive rechnet",
        body: "All Inclusive lohnt sich besonders in diesen Situationen: (1) Du willst die Urlaubskosten vorher komplett kalkulieren. (2) Du reist mit Kindern, die oft essen und trinken. (3) Du bleibst überwiegend im Resort und nutzt Pool und Strand. (4) Du bist an einem Ort, wo externe Restaurants teuer sind (z. B. Karibik, Malediven). (5) Dein Partner trinkt gerne das ein oder andere Glas Wein zum Abendessen.",
      },
      {
        heading: "Wann sich All Inclusive NICHT rechnet",
        body: "Gegen All Inclusive sprechen diese Situationen: (1) Du willst viel erkunden und lokale Restaurants testen. (2) Du trinkst keinen Alkohol und isst moderat. (3) Du bist in einem Land mit günstigem Essen vor Ort (Türkei, Ägypten, Thailand). (4) Du willst echte lokale Kultur erleben, nicht nur das Resort. In diesen Fällen bist du mit Halbpension oder Frühstück flexibler und oft günstiger dran.",
      },
      {
        heading: "Die ehrliche Preiskalkulation",
        body: "Beispiel Türkei: Halbpension (HP) kostet ca. 30-50 € weniger pro Person/Woche als All Inclusive (AI). Bei einer Familie mit 2 Erwachsenen und 2 Kindern summiert sich das auf 120-200 € Ersparnis. Demgegenüber stehen täglich ~2 Snacks, Mittagessen, Getränke am Pool – in einem türkischen Resort realistisch 15-25 € pro Person/Tag. AI rechnet sich hier fast immer. In Griechenland oder Spanien ist der Preisunterschied oft größer und lokale Tavernen sind Teil des Urlaubserlebnisses.",
      },
      {
        heading: "Qualitäts-Tipp",
        body: "Nicht jedes All Inclusive ist gleich. Achte auf: Hotelbewertungen speziell zum Essen, Anzahl der Restaurants (Buffet vs. à la carte), Inklusiv-Getränke-Liste (nur Hausmarken oder internationale Marken?), Öffnungszeiten (durchgehend vs. feste Zeiten). Ein schlechtes All Inclusive kann den Urlaub verderben – ein gutes ist ein echter Mehrwert.",
      },
    ],
    faqs: [
      { question: "Ist All Inclusive für Familien sinnvoll?", answer: "Ja, fast immer. Kinder essen oft unvorhersehbar, trinken viel (Limo, Säfte) und brauchen zwischendurch Snacks. Das summiert sich schnell. Zudem entfallen lästige Restaurant-Suchen mit müden Kindern. Familien-Hotels mit gutem AI bieten meist auch Kinder-Buffets mit altersgerechten Gerichten." },
      { question: "Wie erkenne ich ein gutes All-Inclusive-Hotel?", answer: "Schau auf aktuelle Bewertungen (nicht älter als 6 Monate) bei Holidaycheck, TUI oder Check24. Besonders auf Kommentare zum Essen, zur Getränke-Qualität und zur Öffnungszeit der Pool-Bar achten. Ein Hotel mit 'Ultra All Inclusive' oder einer Empfehlungsrate über 85 % ist meist eine sichere Wahl." },
      { question: "Gibt es Alternativen zu All Inclusive?", answer: "Ja: Halbpension (HP = Frühstück + Abendessen), Vollpension (VP = HP + Mittagessen), Frühstück und Übernachtung + Frühstück (ÜF) oder 'nur Übernachtung' (OV). Für flexible Urlauber, die abends gerne lokal essen, ist HP oft die beste Option." },
    ],
    relatedSlugs: ["pauschalreise-vs-einzelbuchung", "wann-last-minute-buchen", "versteckte-reisekosten"],
  },
  {
    slug: "pauschalreise-vs-einzelbuchung",
    title: "Pauschalreise vs. Einzelbuchung – was ist besser?",
    seoTitle: "Pauschalreise oder Einzelbuchung? Vergleich, Vorteile & Spartipps",
    seoDescription: "Pauschalreise oder Flug und Hotel getrennt buchen? Was ist günstiger, sicherer und flexibler? Unser ehrlicher Vergleich aller Vor- und Nachteile.",
    lead: "Die klassische Frage: Alles aus einer Hand oder flexibel zusammenstellen? Die Antwort hängt von mehr Faktoren ab, als viele denken.",
    heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
    category: "Buchung",
    readingTimeMin: 8,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Der rechtliche Unterschied",
        body: "Der wichtigste Unterschied zwischen Pauschalreise und Einzelbuchung ist der rechtliche Rahmen. Pauschalreisen fallen unter die EU-Pauschalreiserichtlinie, die Urlaubern umfassenden Schutz gibt: Bei Insolvenz des Veranstalters erhältst du dein Geld zurück (Sicherungsschein Pflicht), bei erheblichen Mängeln bestehen Minderungsansprüche und bei unzumutbaren Änderungen besteht ein Rücktrittsrecht. Bei Einzelbuchung trägst du die Risiken selbst.",
      },
      {
        heading: "Der Preisvergleich",
        body: "Pauschalreisen sind oft günstiger als Einzelbuchungen – besonders bei Fernreisen und in der Hauptsaison. Der Grund: Veranstalter kaufen große Kontingente an Flügen und Hotelzimmern zu Großkundenpreisen ein und geben die Rabatte teilweise weiter. Einzelbuchungen lohnen sich dagegen, wenn du flexibel bist, außerhalb der Hauptsaison reist oder ein spezielles Hotel buchen willst, das nicht im Pauschal-Angebot ist.",
      },
      {
        heading: "Flexibilität vs. Planungssicherheit",
        body: "Einzelbuchungen sind flexibler: Du wählst Flug, Hotel, Transfer und Aktivitäten unabhängig. Das ist ideal für Roadtrips, Rundreisen oder individuelle Urlaubsplanung. Pauschalreisen sind planungssicherer: alles ist abgestimmt, der Transfer vom Flughafen klappt, und bei Flugverspätungen kümmert sich der Veranstalter um die Konsequenzen.",
      },
      {
        heading: "Wann welche Form sinnvoll ist",
        body: "Pauschalreise empfehlenswert bei: Badeurlaub in klassischen Zielen (Türkei, Mallorca, Kanaren, Ägypten, Griechenland), Familienreisen mit Kindern, erstem Urlaub in einem Land, All-Inclusive-Wünschen, begrenztem Budget. Einzelbuchung empfehlenswert bei: Städtereisen (Flug + Airbnb ist oft günstiger), Rundreisen und Roadtrips, Luxusreisen mit speziellen Hotels, Reisen in wenig touristische Gebiete, sehr spontanen Trips.",
      },
      {
        heading: "Die Kombi-Strategie",
        body: "Erfahrene Reisende kombinieren oft beide Ansätze: Sie buchen die Hin- und Rückreise als Einzelflug (oft günstiger bei Low-Cost-Airlines), nehmen dann ein Hotel separat und organisieren Transfers und Aktivitäten selbst. Für den Bade- und Entspannungsurlaub greifen sie dagegen zur Pauschalreise. Das beste aus beiden Welten.",
      },
    ],
    faqs: [
      { question: "Ist eine Pauschalreise wirklich teurer als Einzelbuchung?", answer: "Nein, oft ist das Gegenteil der Fall. Bei Pauschalreisen in klassische Badeziele sparst du teilweise 20-30 % gegenüber Einzelbuchung. Bei Städtereisen, Rundreisen und Fernreisen mit individuellem Programm ist Einzelbuchung meist günstiger." },
      { question: "Was passiert bei Insolvenz des Anbieters?", answer: "Bei Pauschalreisen bist du durch die EU-Richtlinie geschützt: Du bekommst dein Geld vom Sicherungsschein-Aussteller zurück und wirst bei Bedarf zurückgeflogen. Bei Einzelbuchung: Flug verfällt meist, Hotel nicht erstattet. Kreditkarten-Zahlung kann helfen (Chargeback)." },
      { question: "Wie finde ich günstige Pauschalreisen?", answer: "Nutze Plattformen wie Urlaubfinder365, die mehrere Veranstalter aggregieren. Achte auf Bewertungen, Sicherungsschein und flexible Umbuchungsoptionen. Vermeide unseriöse Anbieter, die bei Problemen nicht erreichbar sind." },
    ],
    relatedSlugs: ["all-inclusive-oder-nicht", "wie-frueh-urlaub-buchen", "reiseversicherung-sinnvoll"],
  },
  {
    slug: "wie-frueh-urlaub-buchen",
    title: "Wie früh sollte man Urlaub buchen?",
    seoTitle: "Wie früh Urlaub buchen? Optimaler Zeitpunkt je nach Reiseart",
    seoDescription: "Frühbucher, Normalbuchung oder Last Minute? Wann ist der beste Zeitpunkt zum Buchen? Tipps für Mittelmeer, Fernreisen und Städtetrips.",
    lead: "Frühbucher sparen, heißt es. Aber manchmal bekommt man kurz vor knapp die besten Deals. Wann ist der optimale Buchungszeitpunkt wirklich?",
    heroImage: "https://images.unsplash.com/photo-1499591934245-40b55745b905?w=1920&q=80",
    category: "Planung",
    readingTimeMin: 6,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Frühbucher-Rabatte: Wann sie sich lohnen",
        body: "Frühbucher-Rabatte werden meist 6-12 Monate vor dem Reisetermin angeboten und sind oft 10-30 % günstiger als die regulären Preise. Sie lohnen sich besonders in der Hauptsaison (Sommerferien, Ostern, Weihnachten), bei Familienreisen (wo bestimmte Zimmergrößen schnell ausgebucht sind) und bei beliebten Destinationen mit begrenzten Kapazitäten. Tipp: Buche Frühbucher mit flexibler Stornierung, falls sich etwas ändert.",
      },
      {
        heading: "Der optimale Zeitpunkt nach Reisetyp",
        body: "Hochsaison (Juli/August) & Weihnachten/Silvester: 8-12 Monate vorher buchen. Pfingsten & Herbstferien: 4-6 Monate vorher. Nebensaison (Mai, September, Oktober): 2-4 Monate vorher. Städtereisen: 6-8 Wochen vorher. Last-Minute in die Sonne: 2-4 Wochen vorher. Fernreisen & Kreuzfahrten: 9-12 Monate vorher.",
      },
      {
        heading: "Wann Last Minute günstiger ist",
        body: "Last-Minute ist günstiger als Frühbucher bei: Flexiblen Urlaubern ohne Familienverpflichtungen, ab 2-4 Wochen vor Abreise, in der Nebensaison und außerhalb von Schulferien. Der Grund: Veranstalter reduzieren Restplätze, um leere Flüge und Hotels zu vermeiden. Die besten Deals gibt es dienstag- und mittwochmorgens.",
      },
      {
        heading: "Die Wahrheit über Buchungs-Algorithmen",
        body: "Viele denken, die Preise seien willkürlich – sie folgen aber Algorithmen. Fluggesellschaften erhöhen die Preise kurzfristig, wenn die Nachfrage steigt (z. B. durch viele Suchanfragen für denselben Flug). Cookies werden oft gelöscht, um 'Cold Searches' zu machen. Ob das wirklich hilft, ist umstritten – eine Studie von 2024 zeigt: Meist bleibt der Effekt unter 5 %.",
      },
    ],
    faqs: [
      { question: "Sind Frühbucher-Rabatte immer die beste Wahl?", answer: "Nein, sie sind besonders in der Hauptsaison und für Familienreisen ideal, in der Nebensaison oft aber schlechter als Last-Minute-Preise. Es kommt auf deine Flexibilität und die Destination an." },
      { question: "Wie spare ich am meisten bei der Urlaubsbuchung?", answer: "Die drei wichtigsten Hebel: (1) Außerhalb der Schulferien reisen, (2) flexibel bei Abflughafen und -zeit bleiben, (3) mehrere Plattformen vergleichen. Im Schnitt sparst du so 30-50 % gegenüber einer Standard-Ferienbuchung." },
      { question: "Sollte ich einzelne Bausteine kombinieren?", answer: "Ja, besonders bei Städtereisen: Billigflug + Airbnb + Eigenregie ist oft 30-40 % günstiger als eine Pauschalreise-Variante. Bei Badeurlaub sind Pauschalreisen meist günstiger." },
    ],
    relatedSlugs: ["wann-last-minute-buchen", "pauschalreise-vs-einzelbuchung", "urlaub-unter-500-euro"],
  },
  {
    slug: "urlaub-unter-500-euro",
    title: "Urlaub unter 500 € – geht das wirklich?",
    seoTitle: "Urlaub unter 500€ buchen – Tipps, Tricks & beste Destinationen",
    seoDescription: "Pauschalurlaub unter 500 € pro Person – wo gibt es die besten Deals? Destinationen, Buchungszeitpunkte und Spartipps für günstige Reisen.",
    lead: "Eine Woche Sonne, Strand und All-Inclusive für unter 500 € – geht das? Ja, und zwar leichter, als viele denken. Unsere konkreten Tipps.",
    heroImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
    category: "Preise",
    readingTimeMin: 5,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Ja, es geht – aber nicht überall",
        body: "Unter 500 € pro Person (inkl. Flug, Hotel, Transfer) bekommst du regelmäßig Pauschalreisen in die Türkei, nach Ägypten, Tunesien, Marokko und Bulgarien. Auch auf Mallorca und den Kanaren sind solche Preise in der Nebensaison möglich. Wichtig: Flexibilität bei Abflughafen, Reisezeit und Hotel-Kategorie (meist 3-4 Sterne).",
      },
      {
        heading: "Die besten Länder für Sparurlaub",
        body: "Türkei: ab 300-400 € für All-Inclusive in 4-Sterne-Resorts. Ägypten: ab 350-450 €, auch 4-5 Sterne möglich. Bulgarien: ab 300 € für Halbpension am Schwarzen Meer. Tunesien: ab 300 € für All-Inclusive. Mallorca (Nebensaison): ab 400 €. Kanaren (November-Februar): ab 450 €.",
      },
      {
        heading: "So findest du Schnäppchen",
        body: "(1) Flexibel bleiben: Abflughafen, Reisezeit und Hotelwahl offen halten. (2) Nebensaison nutzen: Mai, September, Oktober für Mittelmeer; November-Februar für Fernziele. (3) Last-Minute nutzen: 2-4 Wochen vor Abreise. (4) Mehrere Plattformen vergleichen. (5) Alerts setzen: Viele Portale benachrichtigen dich bei Preissenkungen.",
      },
      {
        heading: "Versteckte Kosten im Blick behalten",
        body: "Auch ein 500 €-Urlaub kann teurer werden: Kofferzuschlag (30-80 €), Transferkosten am Urlaubsort, Reiseversicherung (20-50 €), Trinkgelder, Ausflüge, Extras im Hotel. Kalkuliere mindestens 150-250 € Puffer ein. Bei All-Inclusive entfallen viele dieser Kosten, bei Halbpension nicht.",
      },
    ],
    faqs: [
      { question: "Wo urlaube ich am günstigsten?", answer: "Die Türkei ist seit Jahren das günstigste Pauschalreise-Ziel mit 4-Sterne-Standard. Ägypten und Bulgarien sind ebenfalls sehr preiswert. Wer es lokaler mag: Tunesien und Marokko." },
      { question: "Ist ein günstiger Urlaub auch ein guter Urlaub?", answer: "Ja, absolut. In der Türkei z. B. sind 4-Sterne-Hotels oft besser als vergleichbare Hotels in Spanien oder Italien. Wichtig ist, auf aktuelle Bewertungen zu achten und nicht das billigste Hotel, sondern das beste Preis-Leistungs-Verhältnis zu wählen." },
      { question: "Wie lange im Voraus sollte ich einen günstigen Urlaub buchen?", answer: "Für Schnäppchen: entweder 8-12 Monate vorher (Frühbucher) oder 2-4 Wochen vorher (Last-Minute). Mitte bleibt oft teurer." },
    ],
    relatedSlugs: ["wie-frueh-urlaub-buchen", "wann-last-minute-buchen", "versteckte-reisekosten"],
  },
  {
    slug: "versteckte-reisekosten",
    title: "Versteckte Reisekosten – die 10 häufigsten Fallen",
    seoTitle: "Versteckte Reisekosten vermeiden – Checkliste für den Urlaub",
    seoDescription: "Von Kofferzuschlag bis Transferkosten: Diese versteckten Reisekosten solltest du vor der Buchung kennen. Unsere Checkliste spart dir hunderte Euro.",
    lead: "Der Reisepreis im Katalog ist selten der Endpreis. Diese 10 versteckten Kosten solltest du kennen, um dich nicht von deinem Budget überrascht zu sehen.",
    heroImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920&q=80",
    category: "Preise",
    readingTimeMin: 7,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "1. Kofferzuschlag",
        body: "Bei Pauschalreisen sind 15-20 kg Gepäck meist enthalten, bei Billigfliegern oft NICHT. Extra-Koffer kosten 30-80 € pro Strecke, bei kurzfristiger Buchung am Flughafen sogar 80-120 €. Prüfe vor Buchung die Gepäckbestimmungen und bucke Koffer, wenn nötig, gleich mit.",
      },
      {
        heading: "2. Sitzplatzreservierung",
        body: "Viele Airlines verlangen Gebühren für die Sitzplatzauswahl: 5-25 € pro Person und Strecke. Bei Familien summiert sich das schnell auf 100+ €. Alternative: Bei Online-Check-in 24h vorher zufällige Plätze akzeptieren – meist sitzt die Familie dann zusammen.",
      },
      {
        heading: "3. Transferkosten am Urlaubsort",
        body: "Bei Pauschalreisen ist der Transfer meist inklusive. Bei Einzelbuchung musst du ihn separat zahlen: Taxi (20-80 € je nach Ziel), Shuttle (10-30 €), Mietwagen (30-60 € pro Tag). Kalkuliere vor der Buchung, wie du vom Flughafen zum Hotel kommst.",
      },
      {
        heading: "4. Reiseversicherung",
        body: "Eine Reiserücktrittsversicherung kostet 20-80 € pro Person und sollte bei teureren Reisen (ab 500 €) immer abgeschlossen werden. Eine Auslandskrankenversicherung ist sogar Pflicht – die gesetzliche Krankenkasse zahlt im Ausland oft nicht oder nur teilweise. Kosten: 10-25 € pro Person.",
      },
      {
        heading: "5. Trinkgelder",
        body: "In vielen Urlaubsländern erwartet, in manchen Pflicht. In der Türkei und Ägypten sind 1-2 € pro Service-Mitarbeiter üblich – bei einer Woche All-Inclusive summiert sich das auf 20-40 € pro Person. In den USA sind 15-20 % Trinkgeld Standard und nicht optional.",
      },
      {
        heading: "6. Ausflüge und Aktivitäten",
        body: "Der günstige Hotelpreis macht nicht den Urlaub alleine. Ausflüge, Bootstouren, Stadtbesichtigungen kosten extra: 30-100 € pro Person pro Ausflug. Plane bei einer Woche Urlaub mindestens 100-200 € pro Person für Aktivitäten ein. Tipp: Vorher online buchen spart 10-20 %.",
      },
      {
        heading: "7. Minibar und Hotelextras",
        body: "Die Minibar ist eine der teuersten Kostenfallen: 5-10 € pro Softdrink, 10-15 € pro Bier. Auch Wäsche-Service, Wellness-Zuschläge und Pool-Handtücher sind oft nicht inklusive. Lies vor Buchung genau, was im Preis enthalten ist.",
      },
      {
        heading: "8. Fremdwährungs- und Kreditkartengebühren",
        body: "Bei Zahlungen im Ausland berechnen viele Banken 1,5-3 % Gebühr. Geld abheben am Automat kostet oft 3-8 € pro Vorgang. Besser: Eine kostenfreie Kreditkarte (z. B. DKB, N26) oder Bargeld vorab tauschen.",
      },
      {
        heading: "9. Flughafen-Services",
        body: "Parken am Flughafen: 30-80 € pro Woche. Schnell-Einchecken: 10-30 €. Lounge-Zugang: 30-50 €. Bei Auslandsreisen zählt jede Kleinigkeit.",
      },
      {
        heading: "10. Kautionen und Touristensteuern",
        body: "Viele Länder erheben eine Kurtaxe oder Touristensteuer (Mallorca 1-4 €/Nacht, Dubai ~5 €/Nacht, Barcelona 2,25 €/Nacht). Manche Hotels fordern eine Kaution per Kreditkarte als Sicherheit, die oft erst nach Tagen zurückgebucht wird.",
      },
    ],
    faqs: [
      { question: "Wie viel Puffer sollte ich zum Reisepreis kalkulieren?", answer: "Als Faustregel: 20-30 % des Reisepreises als Puffer. Bei einem 800 €-Urlaub sind das 150-250 € zusätzlich für Trinkgelder, Ausflüge, Extras und unerwartete Ausgaben." },
      { question: "Welche Kosten sind beim Pauschalurlaub inklusive?", answer: "Meist Flug, Hotel, Transfer und Standardverpflegung. NICHT inklusive: Kofferzuschläge (bei Billigfliegern), Sitzplatzreservierung, Trinkgelder, Ausflüge, Minibar, Versicherungen, Kurtaxe." },
    ],
    relatedSlugs: ["urlaub-unter-500-euro", "reiseversicherung-sinnvoll", "all-inclusive-oder-nicht"],
  },
  {
    slug: "reiseversicherung-sinnvoll",
    title: "Reiseversicherung – wann wirklich nötig?",
    seoTitle: "Reiseversicherung sinnvoll? Welche brauchst du wirklich?",
    seoDescription: "Auslandskrankenversicherung, Reiserücktritt, Gepäckversicherung – welche Policen brauchst du wirklich? Ehrlicher Ratgeber mit Empfehlungen.",
    lead: "Reiseversicherungen sind ein Milliardenmarkt – aber welche brauchst du wirklich? Wir trennen das Nötige vom Verkaufsargument.",
    heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80",
    category: "Sicherheit",
    readingTimeMin: 6,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Die wichtigste Versicherung: Auslandskrankenversicherung",
        body: "Eine Auslandskrankenversicherung ist im Ausland unverzichtbar. Die gesetzliche Krankenversicherung zahlt im EU-Ausland nur das, was auch vor Ort Kassenleistung wäre – oft viel weniger als die tatsächlichen Kosten. Außerhalb der EU gibt es meist keinen Schutz. Ein Krankenhausaufenthalt in den USA kann 50.000 € kosten, ein Rücktransport per Ambulanzflugzeug 20.000-100.000 €. Eine Auslandskrankenversicherung kostet 10-25 €/Jahr und ist Pflicht.",
      },
      {
        heading: "Reiserücktrittsversicherung – ab wann sinnvoll?",
        body: "Bei Reisen ab etwa 500 € pro Person solltest du eine Reiserücktrittsversicherung in Betracht ziehen. Sie übernimmt die Stornokosten, wenn du die Reise aus versicherten Gründen (Krankheit, Unfall, Todesfall in der Familie) nicht antreten kannst. Kosten: 3-7 % des Reisepreises. Besonders wichtig bei teuren Pauschalreisen, Kreuzfahrten und Fernreisen.",
      },
      {
        heading: "Reiseabbruchversicherung",
        body: "Die Reiseabbruchversicherung greift, wenn du während des Urlaubs abreisen musst – z. B. weil ein Familienmitglied zuhause schwer erkrankt. Sie erstattet den nicht genutzten Teil des Reisepreises. Oft Teil einer kombinierten Police mit Reiserücktritt.",
      },
      {
        heading: "Gepäckversicherung – meist überflüssig",
        body: "Gepäckversicherungen sind meist überteuert: Sie kosten 15-30 € und haben oft hohe Selbstbeteiligungen und Ausschlüsse. Deine Hausratversicherung deckt viele Schäden (Diebstahl, Beschädigung) bereits ab. Bei Flugzeugverlust ist die Airline gesetzlich für bis zu ~1.300 € haftbar. Unser Rat: Meist verzichtbar.",
      },
      {
        heading: "Versicherungspakete – sinnvoll oder Gebührenfalle?",
        body: "Komplettpakete 'Reiseschutz' bündeln mehrere Versicherungen (Rücktritt, Abbruch, Kranken, Gepäck, Haftpflicht). Sie kosten oft 50-150 € und können einiges kosten, wenn du sie einzeln abschließen würdest. Aber: Oft enthalten sie überflüssige Bausteine. Vergleiche genau – oft ist eine Kombination aus Jahres-Auslandskranken + Einzel-Rücktritt günstiger.",
      },
    ],
    faqs: [
      { question: "Brauche ich innerhalb der EU eine Auslandskrankenversicherung?", answer: "Ja. Die EU-Krankenversicherungskarte (EHIC) deckt nur die Grundversorgung, oft nicht den Rücktransport oder private Krankenhäuser. Eine Auslandskrankenversicherung ist auch in Europa dringend empfohlen." },
      { question: "Wann lohnt sich eine Jahresversicherung?", answer: "Wenn du mindestens 2-3 Reisen pro Jahr machst, ist eine Jahresversicherung oft günstiger als Einzelversicherungen. Besonders bei Auslandskrankenversicherungen rechnet sich das schnell (20-40 €/Jahr für die ganze Familie)." },
      { question: "Gilt meine Reiseversicherung auch bei Corona/Pandemie?", answer: "Unterschiedlich! Viele Policen schließen 'Pandemien' aus. Seit 2020 gibt es allerdings neue Tarife, die Corona-Erkrankungen einschließen. Prüfe das Kleingedruckte vor Abschluss." },
    ],
    relatedSlugs: ["versteckte-reisekosten", "pauschalreise-vs-einzelbuchung", "reiseapotheke-checkliste"],
  },
  {
    slug: "reiseapotheke-checkliste",
    title: "Reiseapotheke – was gehört wirklich rein?",
    seoTitle: "Reiseapotheke Checkliste – Was für den Urlaub mitnehmen?",
    seoDescription: "Die perfekte Reiseapotheke: Was brauchst du wirklich? Unsere Checkliste für Familien, Fernreisen und Standard-Urlaub mit praktischen Tipps.",
    lead: "Eine gut bestückte Reiseapotheke spart dir im Urlaub viel Ärger – und teure Apotheken-Besuche. Unsere Checkliste für jeden Urlaubstyp.",
    heroImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1920&q=80",
    category: "Sicherheit",
    readingTimeMin: 5,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Die Basis für jeden Urlaub",
        body: "Schmerzmittel (Ibuprofen, Paracetamol), Wund-Desinfektionsmittel, Pflaster verschiedener Größen, Mull-Verband, Pinzette, medizinische Schere. Dazu Mittel gegen Durchfall (z. B. Loperamid), Elektrolyt-Pulver bei starkem Flüssigkeitsverlust und ein Fieberthermometer. Packe alles in einen wasserdichten Beutel und trage ihn im Handgepäck.",
      },
      {
        heading: "Für Sommer und Strand",
        body: "Sonnenschutz (LSF 30+ für Erwachsene, LSF 50+ für Kinder), After-Sun-Lotion, Insektenschutz (DEET oder Icaridin), Mittel gegen Mückenstiche (Fenistil), Kühlpads für Sonnenbrand und Insektenstiche. In tropischen Gebieten zusätzlich Malaria-Prophylaxe (nach ärztlicher Beratung).",
      },
      {
        heading: "Für Fernreisen",
        body: "Zusätzlich zur Basis: Antibiotika als Reserve (nach Absprache mit Hausarzt), Reisetabletten gegen Übelkeit, Augentropfen (Klima-Anlage austrocknend), Dermatop-Salbe gegen Hautreizungen, Sodbrennen-Tabletten, Stuhlnormalisierer für empfindliche Mägen.",
      },
      {
        heading: "Für Familien mit Kindern",
        body: "Kinder-Fiebermittel (Ibuprofen-Saft oder Zäpfchen), Durchfallmittel für Kinder (Oralpädon), Kinderpflaster mit Motiven, Ohrentropfen (bei Druckschmerzen), Zeckenzange, Malaria-Prophylaxe nach ärztlicher Beratung. Impfpass und Notfallnummern sichtbar im Handgepäck.",
      },
      {
        heading: "Wichtig: Vor der Reise",
        body: "Prüfe Impfstatus (Hepatitis A, Tetanus, bei Fernreisen ggf. Gelbfieber oder Typhus). Lass dich bei Fernreisen 6-8 Wochen vorher impfberaten. Nimm Rezepte und Beipackzettel verschriebener Medikamente im Original mit – besonders bei Betäubungsmitteln oder psychotropen Substanzen wichtig. Für die EU gibt es kein Problem, in anderen Ländern kann es schwierig werden.",
      },
    ],
    faqs: [
      { question: "Wie viele Medikamente darf ich ins Handgepäck?", answer: "Für persönliche Medikamente gibt es keine Mengenbeschränkung, wenn du einen Beleg vom Arzt mitführst (bei rezeptpflichtigen Medikamenten). Flüssige Medikamente über 100ml müssen vor der Kontrolle gemeldet werden." },
      { question: "Braucht man spezielle Reiseapotheken?", answer: "Nein, die meisten gängigen Medikamente aus der Apotheke tun es auch. Komplette 'Reiseapotheken' im Fachhandel sind meist teurer und enthalten oft Dinge, die du nicht brauchst. Lieber individuell zusammenstellen." },
      { question: "Was tun, wenn ich im Ausland krank werde?", answer: "(1) Ruf deine Auslandskrankenversicherung an – viele haben einen 24/7-Notruf. (2) Lass dich an einen vertrauenswürdigen Arzt verweisen. (3) Sammle ALLE Belege (Arztrechnung, Medikamentenquittungen) – diese brauchst du für die Erstattung." },
    ],
    relatedSlugs: ["reiseversicherung-sinnvoll", "reise-packliste", "was-bei-krankheit-im-urlaub"],
  },
  {
    slug: "fernreise-tipps",
    title: "Fernreise planen – die wichtigsten Tipps",
    seoTitle: "Fernreise planen – Checkliste, Impfungen, Packen & Spartipps",
    seoDescription: "Eine Fernreise will gut geplant sein: Impfungen, Jetlag, Visa, Budget und Packliste. Unsere komplette Checkliste für deine Traumreise.",
    lead: "Eine Fernreise ist aufregend – aber auch aufwändig zu planen. Was musst du 3 Monate, 1 Monat und 1 Tag vor Abflug erledigen? Unser Leitfaden.",
    heroImage: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80",
    category: "Planung",
    readingTimeMin: 8,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "3 Monate vor Abflug",
        body: "Reisepass prüfen: Muss noch 6 Monate nach Rückkehr gültig sein! Visum beantragen (USA ESTA, Indien E-Visa, Vietnam etc.). Impfungen checken – Tropenimpfungen (Hepatitis A, Typhus, Gelbfieber) brauchen Vorlauf. Malaria-Prophylaxe bei Ärztin/Arzt besprechen. Flug buchen (Fernreisen 3-6 Monate vorher meist am günstigsten). Urlaub einreichen und absegnen lassen.",
      },
      {
        heading: "1 Monat vor Abflug",
        body: "Hotels und Transfers buchen. Auslandskranken- und Reiserücktrittsversicherung abschließen. Kreditkarte für den Auslandseinsatz freischalten (viele Banken haben Länder-Sperre für Fernziele). Smartphone: Internationale Tarife oder lokale SIM-Optionen recherchieren. Reiseapotheke zusammenstellen. Packliste erstellen.",
      },
      {
        heading: "1 Woche vor Abflug",
        body: "Check-in online erledigen. Reisedokumente digital speichern (Cloud, E-Mail an dich selbst). Bargeld in Landeswährung tauschen (etwa 100-200 €). Reise-Adapter für Steckdosen besorgen (Weltadapter oder länderspezifisch). Koffer auf Gewichts-Limit prüfen. Notfallnummern (Botschaft, Versicherung) notieren.",
      },
      {
        heading: "Jetlag minimieren",
        body: "Jetlag ist der größte Feind bei Fernreisen. Tipps: (1) Im Flugzeug viel Wasser, wenig Alkohol und Koffein. (2) Sofort die Uhr auf Zielzeit stellen. (3) Am Zielort bis zur abendlichen Schlafenszeit wach bleiben – auch wenn du todmüde bist. (4) Am ersten Tag viel Tageslicht tanken. (5) Bei Rückreise von Ost nach West ist der Jetlag schwächer.",
      },
      {
        heading: "Budget-Planung für Fernreisen",
        body: "Kalkuliere realistisch: Flug (500-1.500 €), Hotels (30-200 €/Nacht je nach Standard), Essen (15-50 €/Tag), Transport vor Ort (Taxi, Bus, Inlandsflüge), Aktivitäten und Eintritte, Trinkgelder, Versicherungen, Visa-Gebühren. Faustregel: Für 14 Tage Thailand/Vietnam 1.800-3.000 € pro Person, für 14 Tage USA/Kanada 3.500-6.000 € pro Person.",
      },
    ],
    faqs: [
      { question: "Welche Fernreise ist für Einsteiger geeignet?", answer: "Thailand und Bali sind klassische Einsteiger-Ziele: touristisch gut erschlossen, sichere Infrastruktur, günstige Preise, wenig Sprachbarriere. Dubai ist ebenfalls sehr einsteigerfreundlich – moderner Standard, kein Jetlag, direkte Flüge." },
      { question: "Wie lange dauert eine Fernreise idealerweise?", answer: "Mindestens 10-14 Tage. Bei kürzeren Reisen 'verlierst' du durch Jetlag und Anreise viel Zeit. Ideal sind 2-3 Wochen, um Land und Leute wirklich kennen zu lernen und sich zu erholen." },
      { question: "Was tun bei Flugausfall auf Fernreise?", answer: "Bei EU-Flügen greift die EU-Fluggastrechte-Verordnung (bis zu 600 € Entschädigung). Bei Fernflügen mit nicht-EU-Airline: Sofort beim Counter oder per Anruf Alternativen erfragen. Mit Reiserücktrittsversicherung bekommst du oft Hotel und Verpflegung erstattet." },
    ],
    relatedSlugs: ["reiseversicherung-sinnvoll", "reiseapotheke-checkliste", "pauschalreise-vs-einzelbuchung"],
  },
  {
    slug: "was-bei-krankheit-im-urlaub",
    title: "Krank im Urlaub – was tun?",
    seoTitle: "Krank im Urlaub – Was tun? Notfall-Leitfaden & Versicherung",
    seoDescription: "Was tun, wenn du im Urlaub krank wirst? Unser Notfall-Leitfaden mit Tipps zu Versicherung, Ärzten, Kosten und Rückreise im Krankheitsfall.",
    lead: "Keiner wird gerne krank im Urlaub. Wenn es doch passiert, ist schnelles Handeln wichtig. Unser Leitfaden zeigt, was du Schritt für Schritt tun solltest.",
    heroImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80",
    category: "Sicherheit",
    readingTimeMin: 5,
    updatedAt: "2026-04-01",
    sections: [
      {
        heading: "Erste Schritte bei leichter Erkrankung",
        body: "Bei leichten Beschwerden (Erkältung, Durchfall, Kopfschmerzen) reicht meist die Reiseapotheke. Viel trinken (abgekochtes Wasser oder aus verschlossenen Flaschen), ruhen, bei Durchfall auf fettes/scharfes Essen verzichten. Wenn Symptome länger als 2-3 Tage anhalten oder sich verschlechtern, einen Arzt aufsuchen.",
      },
      {
        heading: "Arzt finden im Ausland",
        body: "Erste Anlaufstelle: Rezeption des Hotels – sie haben meist Kontakte zu vertrauenswürdigen Ärzten. Alternativ: Deutsche Botschaft/Konsulat (haben Listen von deutschsprachigen Ärzten). Für Notfälle: Örtliche Notrufnummer (EU-weit 112, USA 911, Türkei 112, Thailand 191). Deine Auslandskrankenversicherung hat meist einen 24/7-Notruf, der dich zu geprüften Ärzten weiterleitet.",
      },
      {
        heading: "Was musst du mitnehmen zum Arzt?",
        body: "Reisepass oder Ausweis, Europäische Krankenversicherungskarte (EHIC) – in EU-Ländern, Versicherungsschein der Auslandskrankenversicherung, Notizbuch zum Mitschreiben. Gib niemals das Original an den Arzt – nur Kopien. Alle Rechnungen, Quittungen und ärztliche Unterlagen sorgsam aufbewahren (für Erstattung).",
      },
      {
        heading: "Kostenerstattung nach der Reise",
        body: "Reiche bei der Auslandskrankenversicherung alle Belege ein – meist per E-Mail oder Online-Portal. Die Bearbeitung dauert 2-6 Wochen. Wichtig: Originale behalten, Kopien einreichen. Bei Streitfällen: Die Verbraucherzentrale hilft oft kostenlos weiter.",
      },
      {
        heading: "Rückreise im Krankheitsfall",
        body: "Bei schweren Erkrankungen: Nicht eigenmächtig fliegen – erst Arzt fragen, ob Flugtauglichkeit gegeben ist. Die Auslandskrankenversicherung organisiert ggf. einen medizinisch begleiteten Rücktransport. Bei Reiseabbruch (z. B. Familiennotfall zuhause) greift die Reiseabbruchversicherung – sie erstattet den nicht genutzten Teil des Urlaubs.",
      },
    ],
    faqs: [
      { question: "Was zahlt die gesetzliche Krankenkasse im Ausland?", answer: "Innerhalb der EU mit EHIC: Die Grundversorgung wie in Deutschland. Außerhalb der EU: Meist gar nichts. Deswegen ist eine Auslandskrankenversicherung unverzichtbar – sie kostet nur 10-25 €/Jahr." },
      { question: "Kann ich im Ausland meinen Hausarzt anrufen?", answer: "Ja, viele Hausärzte bieten Telefonkonsultationen an. Alternativ: Online-Arztpraxen (TeleClinic, Kry etc.) bieten 24/7-Beratung auf Deutsch. Das ersetzt keinen Notfall-Arztbesuch, aber für Einschätzungen hilfreich." },
      { question: "Bekomme ich bei Krankheit das Hotel erstattet?", answer: "Nur mit Reiseabbruchversicherung. Die normale Reiserücktrittsversicherung greift nur VOR Reiseantritt, nicht während des Urlaubs. Der Reiseabbruchversicherung erstattet den anteiligen Hotelpreis für die nicht genutzten Tage." },
    ],
    relatedSlugs: ["reiseversicherung-sinnvoll", "reiseapotheke-checkliste", "fernreise-tipps"],
  },
];

export function getRatgeberArticle(slug: string): RatgeberArticle | undefined {
  return RATGEBER_ARTICLES.find((a) => a.slug === slug);
}
