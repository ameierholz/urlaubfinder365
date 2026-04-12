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
  category:
    | "Buchung"
    | "Verpflegung"
    | "Preise"
    | "Planung"
    | "Sicherheit"
    | "Familie"
    | "Trends"
    | "Reisemittel"
    | "Nachhaltigkeit";
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

  // ──────────────────────────────────────────────────────────────────────
  // 15 weitere Long-Form-Artikel (E-E-A-T, Magazin-Ausbau)
  // ──────────────────────────────────────────────────────────────────────

  {
    slug: "reisen-mit-kleinkindern",
    title: "Reisen mit Kleinkindern – Der ehrliche Survival-Guide",
    seoTitle: "Reisen mit Kleinkindern – Tipps, Hotels & Packliste",
    seoDescription: "Reisen mit Babys und Kleinkindern: Ehrliche Tipps für Flug, Hotel, Packliste und Reiseziele – von Eltern für Eltern.",
    lead: "Mit Kleinkindern reisen ist anders – aber nicht schwerer, wenn man die richtigen Tricks kennt. Unser Guide für Familien mit Kindern unter 6 Jahren.",
    heroImage: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1600&q=80&auto=format&fit=crop",
    category: "Familie",
    readingTimeMin: 9,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Die richtige Vorbereitung", body: "Reisen mit Kleinkindern beginnt 2-3 Wochen vor Abflug: Reisepass für jedes Kind beantragen (gültig für die gesamte Reisedauer), beim Kinderarzt einen kurzen Check machen und Reiseimpfungen besprechen, Reiseapotheke speziell für Kinder zusammenstellen (Fiebersaft, Wundsalbe, Pflaster mit Motiven) und genug Snacks und Lieblings-Spielzeuge im Handgepäck einplanen." },
      { heading: "Flugzeug mit Baby & Kleinkind", body: "Die ersten Flüge sind oft die stressigsten. Kindheits-Tipps: Buche Sitzplätze in der ersten Reihe (mehr Beinfreiheit, Babykorb möglich), nimm beim Start und der Landung eine Trinkflasche oder Schnuller mit (Druckausgleich), packe mindestens zwei komplette Wechseloutfits ins Handgepäck und plane viel Beschäftigung ein – Mal-Bücher, Sticker, ein neues Spielzeug für unterwegs." },
      { heading: "Familienfreundliche Hotels finden", body: "Achte bei der Buchung auf: Kinderbett kostenlos, Kinderpool/Babypool, Animation für die Altersgruppe deines Kindes (oft erst ab 4 Jahren), Babyphone-Service oder Walkie-Talkies, Mikrowelle/Wasserkocher im Zimmer für Babynahrung. Resorts wie Aldiana, Robinson Club oder TUI Magic Life sind bekannt für hervorragende Kinderbetreuung." },
      { heading: "Die besten Reiseziele für Kleinkinder", body: "Top-Ziele: Mallorca (kurzer Flug, viele Familienhotels, milde Temperaturen), Kanaren (ganzjährig warm, kurze Flugzeit, sicheres Wasser), Türkische Riviera (4-Sterne-All-Inclusive zum kleinen Preis, kinderfreundliche Kultur), Kreta (entspannte Atmosphäre, gute Infrastruktur). Vermeide Fernziele mit langen Flugzeiten und Jetlag bei Babys unter 2 Jahren." },
      { heading: "Was am Urlaubsort wirklich hilft", body: "Routine ist wichtig: Versuche, den Schlaf-Rhythmus möglichst beizubehalten. Wenn du das Hotel auswählst, achte auf einen Pool im Schatten oder mit Sonnenschutz. Pausen sind nicht optional – Kleinkinder brauchen feste Mittagsschlaf-Zeiten. Plane Ausflüge auf den Vormittag, nachmittags Hotel und Pool. Trinkwasser nur aus geschlossenen Flaschen (auch zum Zähneputzen)." },
      { heading: "Sicherheit & Notfälle", body: "Auslandskrankenversicherung mit Kinder-Tarif ist Pflicht. Nimm den deutschen Impfpass, das gelbe U-Heft und alle wichtigen Medikamente in Originalverpackung mit. Notfallnummern (deutsche Botschaft, Versicherung) auf dem Handy gespeichert. Bei Kindern unter 12 Monaten sind ärztliche Empfehlungen für Tropenziele meist negativ." },
    ],
    faqs: [
      { question: "Ab welchem Alter können Babys fliegen?", answer: "Theoretisch ab 7 Tagen, sinnvollerweise erst ab 3 Monaten. Die meisten Kinderärzte empfehlen, in den ersten 2-3 Monaten auf das Fliegen zu verzichten. Bei Frühgeborenen frage immer beim Kinderarzt nach." },
      { question: "Brauchen Babys einen eigenen Sitzplatz im Flugzeug?", answer: "Bis 2 Jahre nicht – sie fliegen kostenlos auf dem Schoß der Eltern (etwa 10% des Erwachsenenpreises plus Steuern). Ab 2 Jahren muss ein eigener Sitz gebucht werden. Empfehlung: Auch unter 2 Jahren einen eigenen Sitz buchen, wenn möglich – sicherer und komfortabler." },
      { question: "Welche Verpflegung ist mit Kleinkindern am besten?", answer: "All Inclusive ist meist ideal: keine Sprachbarrieren beim Essen, Buffet mit kindgerechtem Angebot, jederzeit Snacks verfügbar, kein Stress bei Restaurant-Wahl. Halbpension geht auch, aber dann brauchst du oft einen Plan für Mittagessen." },
      { question: "Wie lange darf man mit Babys verreisen?", answer: "Eine Woche ist meist die angenehmste Länge. Zwei Wochen funktionieren auch, brauchen aber mehr Vorbereitung. Drei Wochen oder länger sind mit Kleinkindern oft anstrengend, weil die Routine zu sehr durcheinander gerät." },
    ],
    relatedSlugs: ["all-inclusive-oder-nicht", "reiseapotheke-checkliste", "reiseversicherung-sinnvoll"],
  },

  {
    slug: "fluggastrechte-eu261",
    title: "Fluggastrechte – Was steht dir bei Verspätung & Ausfall zu?",
    seoTitle: "Fluggastrechte EU 261/2004 – Entschädigung bei Verspätung",
    seoDescription: "EU-Fluggastrechte-Verordnung: Wann bekommst du bis zu 600€ Entschädigung? Komplettleitfaden mit Mustertext, Fristen und Tipps.",
    lead: "Verspätungen und Flugausfälle sind ärgerlich – aber oft auch lukrativ. Die EU-Verordnung 261/2004 garantiert dir bis zu 600 € Entschädigung. Wir erklären, wann.",
    heroImage: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1600&q=80&auto=format&fit=crop",
    category: "Reisemittel",
    readingTimeMin: 8,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Wann gilt die EU-Fluggastrechte-Verordnung?", body: "Die EU-Verordnung 261/2004 gilt für: alle Flüge, die in der EU starten (egal welche Airline) und alle Flüge mit EU-Airlines, die in der EU landen (auch wenn der Start außerhalb der EU war). Sie schützt dich bei Verspätungen ab 3 Stunden, bei Annullierungen und bei Nichtbeförderung wegen Überbuchung." },
      { heading: "Höhe der Entschädigung", body: "Die Entschädigungshöhe richtet sich nach der Flugdistanz: Bis 1.500 km: 250 € pro Person, 1.500-3.500 km (oder innerhalb EU): 400 €, über 3.500 km (EU-extern): 600 €. Diese Beträge gelten zusätzlich zu einer Erstattung des Tickets oder Umbuchung – nicht statt." },
      { heading: "Wann gibt es KEINE Entschädigung", body: "Außergewöhnliche Umstände entlasten die Airline: Wetter (Sturm, Schnee), Vulkanausbrüche, politische Unruhen, Streiks von Drittpartys (Flughafen, Sicherheit), aber NICHT eigene Streiks der Airline-Mitarbeiter. Auch technische Probleme zählen meist NICHT als außergewöhnlich – hier muss die Airline zahlen." },
      { heading: "Was du bei Verspätung sofort tun solltest", body: "1. Lass dir die Verspätung schriftlich von der Airline bestätigen (Counter oder Boarding-Card mit Stempel). 2. Sammle alle Belege (Boarding-Pässe, Bordkarten, Quittungen für Essen/Hotel während der Wartezeit). 3. Mach Fotos vom Flughafen-Display mit deiner Flugnummer und Verspätungs-Anzeige. 4. Bleibe ruhig – dein Anspruch entsteht automatisch durch die Verspätung." },
      { heading: "Entschädigung einfordern – Schritt für Schritt", body: "Schreibe innerhalb von 6 Monaten an die Airline (Adresse auf airline.com im Impressum). Nutze einen Mustertext (Verbraucherzentrale hat kostenfreie Vorlagen). Wenn die Airline ablehnt oder nicht antwortet (4-6 Wochen): Schalte die Schlichtungsstelle SÖP (söp-online.de) ein – kostenfrei. Letzte Option: Anwalt oder einen Dienstleister wie Flightright/EUclaim (Erfolgsgebühr 25-30%)." },
      { heading: "Versorgungsleistungen während der Wartezeit", body: "Bei Verspätungen ab 2 Stunden hast du Anspruch auf: Getränke und Mahlzeiten (angemessen), 2 Telefonate oder E-Mails, bei Übernachtung: Hotel + Transfer (ohne Aufpreis). Wenn die Airline nichts anbietet, kaufe es selbst (Quittungen aufheben) und reiche es später ein." },
    ],
    faqs: [
      { question: "Wie schnell muss ich Entschädigung beantragen?", answer: "In Deutschland verjähren Ansprüche nach 3 Jahren. Praktisch solltest du innerhalb der ersten 6 Wochen aktiv werden – je länger du wartest, desto schwerer wird es, Belege zu sammeln und nachzuweisen, dass die Airline schuld ist." },
      { question: "Bekomme ich auch bei Pauschalreisen Entschädigung?", answer: "Ja, die EU-Fluggastrechte gelten auch bei Pauschalreisen. Du kannst die Entschädigung direkt bei der Airline einfordern. Zusätzlich greift bei Pauschalreisen die EU-Pauschalreiserichtlinie – bei erheblichen Mängeln kannst du den Reisepreis mindern." },
      { question: "Muss ich erst den Veranstalter oder direkt die Airline kontaktieren?", answer: "Bei Pauschalreisen: erst den Veranstalter (TUI, FTI etc.). Wenn es um Fluggastrechte geht, kannst du beides parallel tun – der Veranstalter kümmert sich oft selbst." },
      { question: "Wofür steht 'Außergewöhnliche Umstände'?", answer: "Damit ist gemeint: Naturkatastrophen, Wetter, politische Unruhen, Sicherheitsrisiken, behördliche Anweisungen. NICHT dazu zählen: technische Defekte (außer extrem selten), Personalengpässe, Streiks der eigenen Mitarbeiter." },
    ],
    relatedSlugs: ["reiseversicherung-sinnvoll", "wann-last-minute-buchen", "fernreise-tipps"],
  },

  {
    slug: "nachhaltig-reisen",
    title: "Nachhaltig Reisen – Wie geht das wirklich?",
    seoTitle: "Nachhaltig Reisen – CO2-Kompensation, Slow Travel, Tipps",
    seoDescription: "Nachhaltiges Reisen ohne Verzicht: Praktische Tipps für CO2-Kompensation, klimafreundliche Anreise, faire Hotels und ehrliche Selbstreflexion.",
    lead: "Reisen ist eines unserer schönsten Erlebnisse – und gleichzeitig eines der klimabelastendsten. Wie geht nachhaltig Reisen, ohne Greenwashing und ohne Verzicht?",
    heroImage: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1600&q=80&auto=format&fit=crop",
    category: "Nachhaltigkeit",
    readingTimeMin: 7,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Die ehrliche CO2-Bilanz", body: "Ein einziger Flug nach Mallorca verursacht etwa 350 kg CO2 pro Person. Eine Fernreise nach Thailand: 4-5 Tonnen pro Person – mehr als ein deutscher Durchschnitts-Bürger in 4 Monaten. Auto fahren: 200 kg/1000 km. Bahn: 30 kg/1000 km. Diese Zahlen sind unbequem, aber wichtig zu kennen." },
      { heading: "CO2-Kompensation – sinnvoll oder Ablasshandel?", body: "Kompensation funktioniert nur, wenn das Geld in echte Klimaprojekte fließt. Empfehlung: atmosfair.de (Gold Standard), myclimate.org. Für einen Flug nach Mallorca kostet eine seriöse Kompensation 8-15 €, für Thailand 80-120 €. Das ist kein Freifahrtschein, aber besser als nichts. Nicht ausreichend allein, gehört aber dazu." },
      { heading: "Slow Travel als Alternative", body: "Slow Travel bedeutet: weniger Ziele, mehr Tiefe. Statt 3 Hauptstädte in 7 Tagen, eine Region 14 Tage erkunden. Bahn statt Flugzeug für Strecken bis 1.000 km. Bus oder Mietwagen statt Inlandsflüge. Lokale Unterkünfte statt großer Resorts. Weniger reisen, dafür länger – das ist die wirksamste Klimaschutzmaßnahme." },
      { heading: "Klimafreundlich anreisen", body: "Bahn nach Italien, Frankreich, Niederlande, Schweiz, Österreich ist oft schneller als Fliegen, wenn man Anfahrtszeit zum Flughafen einrechnet. Nachtzüge sind zurück: ÖBB Nightjet erreicht Rom, Wien, Mailand. Fernbus für Budget-Reisende. Wenn fliegen unvermeidbar: Direktflüge wählen (Start/Landung sind die emissionsstärksten Phasen)." },
      { heading: "Nachhaltige Unterkünfte erkennen", body: "Achte auf echte Zertifikate: Green Key, EU Ecolabel, GreenSign Hotel, BIO Hotels. Vermeide vage Begriffe wie 'eco' oder 'sustainable' ohne Prüfung. Frage beim Hotel direkt nach: Solarstrom, Wasserspar-Maßnahmen, regionale Küche, faire Löhne. Booking.com markiert nachhaltige Hotels mit einem grünen Blatt." },
      { heading: "Vor Ort verantwortungsvoll handeln", body: "Lokal essen statt international (kürzere Lieferketten, bessere Wertschöpfung vor Ort). Wasser aus wiederbefüllbaren Flaschen statt Plastik. Sonnencreme: riff-freundlich (ohne Oxybenzon, Octinoxat). Tier-Aktivitäten meiden, wenn Tiere zur Show gezwungen werden (Elefantenreiten, Tiger-Tempel). Lokale Guides buchen statt Großveranstalter." },
    ],
    faqs: [
      { question: "Ist Bahn fahren wirklich klimafreundlicher als Fliegen?", answer: "Ja, deutlich. Eine Bahnfahrt München-Berlin emittiert etwa 30 kg CO2 pro Person, ein Flug auf gleicher Strecke 150 kg. Das ist ein Faktor 5. Bei längeren Strecken wird der Vorsprung der Bahn noch größer (mit Strom aus erneuerbaren Quellen)." },
      { question: "Wie viel CO2 verursacht ein Mittelmeer-Urlaub?", answer: "Ein einwöchiger Mallorca-Urlaub mit Flug und Hotel: ca. 700-900 kg CO2 pro Person (Flug + Hotelübernachtungen). Vergleich: Ein deutscher Durchschnittsbürger emittiert pro Jahr 8-10 Tonnen. Eine Mallorca-Woche entspricht also etwa 4-5 Wochen 'Normalverbrauch'." },
      { question: "Ist All-Inclusive klimafreundlich?", answer: "Tendenziell nein. All-Inclusive-Resorts importieren oft Lebensmittel aus dem Ausland, haben mehr Wasser- und Stromverbrauch als kleinere Hotels und führen zu mehr Lebensmittelverschwendung. Halbpension oder lokale Restaurants sind nachhaltiger." },
      { question: "Lohnt sich ein nachhaltiger Veranstalter?", answer: "Ja, wenn du es ernst meinst. Forum Anders Reisen e.V. listet zertifizierte deutsche Veranstalter mit Fokus auf Nachhaltigkeit. Auch atmosfair, Studiosus und Hauser Exkursionen sind für ihren bewussten Ansatz bekannt." },
    ],
    relatedSlugs: ["fernreise-tipps", "pauschalreise-vs-einzelbuchung", "all-inclusive-oder-nicht"],
  },

  {
    slug: "kreuzfahrt-anfaenger",
    title: "Kreuzfahrt für Anfänger – Was du vor der ersten Reise wissen musst",
    seoTitle: "Kreuzfahrt für Anfänger – Tipps für die erste Schiffsreise",
    seoDescription: "Erste Kreuzfahrt? Unser Anfänger-Guide zu Kabinenwahl, Ausflügen, Trinkgeld, Verpflegung und Reisezielen. Ehrlich und ohne Marketing-Sprech.",
    lead: "Kreuzfahrten polarisieren: Genuss-Reise oder Massenabfertigung? Für Anfänger ist die erste Buchung oft schwer einzuschätzen. Unsere ehrliche Einführung.",
    heroImage: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1600&q=80&auto=format&fit=crop",
    category: "Reisemittel",
    readingTimeMin: 8,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Welche Art von Kreuzfahrt passt zu dir?", body: "Mittelmeer-Kreuzfahrten (1 Woche, ab 600 €) sind ideal für Einsteiger: kurze Anreise, viele Häfen, milde Temperaturen Mai-Oktober. Karibik-Kreuzfahrten brauchen einen Transatlantik-Flug, sind dafür ganzjährig warm. Nordkap-Kreuzfahrten sind ruhiger, älter, mit Naturschauspiel. Flusskreuzfahrten (Rhein, Donau, Nil) sind kleiner, ruhiger und exklusiver – aber teurer." },
      { heading: "Die Kabinen-Wahl: Innen, Außen, Balkon, Suite", body: "Innenkabine (ab 600 €/Woche): Du schläfst sowieso nur drinnen, verbringst den Rest auf Deck. Wer das Schiff erkunden will und sparen möchte, fährt günstig. Außenkabine mit Bullauge (+150-300 €): Etwas heller, aber nicht zwingend mehr Komfort. Balkonkabine (+400-700 €): Wertvoll auf Mittelmeer- und Karibik-Kreuzfahrten – Sonnenaufgänge vom eigenen Balkon. Suite (1.500+ €): Lohnt sich nur für Luxus-Liebhaber." },
      { heading: "All-Inclusive bei Kreuzfahrten – was ist drin?", body: "Standard: Frühstück, Mittagessen, Abendessen, Snacks, Saft, Wasser, Kaffee. NICHT inklusive: Alkohol, Spezialitätenrestaurants, Wellness/Spa, Ausflüge, Shopping, Casino, Kabinenservice-Trinkgeld. Wer viel trinkt, sollte ein Getränkepaket dazu buchen (30-60 €/Tag) – sonst kosten 2 Bier 12 €, 1 Glas Wein 8 €, am Abend macht das schnell 30-40 € pro Person." },
      { heading: "Trinkgelder & versteckte Kosten", body: "Auf vielen Kreuzfahrten wird automatisch ein 'Service-Charge' von 12-18 € pro Person und Tag berechnet (sogenannte 'Gratuities'). Dazu kommen: Ausflüge (50-150 € pro Person), Internet (200-400 € pro Reise), Kabinen-Service-Tip (5-10 € pro Tag), Spa & Bilder. Realistisch sollte man bei einer 1-Wochen-Mittelmeer-Kreuzfahrte mit 200-400 € Extra-Kosten pro Person rechnen." },
      { heading: "Ausflüge selbst organisieren oder buchen?", body: "Hafenausflüge der Reederei sind oft 30-100% teurer als selbst organisierte. Vorteile: Schiffsgarantie (kein Verlassen des Hafens ohne dich). Nachteil: oft Massenbusse, gehetzt, oberflächlich. Selbst organisiert: günstiger, individueller, aber Eigenverantwortung. Tipp: Bei den ersten 1-2 Häfen Reederei-Ausflüge nehmen, sich orientieren, dann selbst weiter." },
      { heading: "Seekrankheit – wie schlimm ist es wirklich?", body: "Auf modernen Kreuzfahrtschiffen mit Stabilisatoren ist Seekrankheit selten ein Problem – außer bei sehr starken Stürmen. Tipps: Wähle eine Kabine in der Schiffsmitte auf einem niedrigeren Deck (weniger Schwankungen). Halte dich auf Deck auf (frische Luft hilft). Iss leicht, trinke Wasser. Bei Anzeichen: Reisetabletten (Vomex), Akupressur-Bänder oder verschreibungspflichtige Pflaster (Scopoderm)." },
    ],
    faqs: [
      { question: "Wann ist die beste Reisezeit für eine Mittelmeer-Kreuzfahrt?", answer: "Mai bis Oktober. Mai und September sind ideal: angenehme Temperaturen, weniger volle Schiffe, günstigere Preise. Juli und August sind Hochsaison mit Familien an Bord – mehr Trubel, höhere Preise." },
      { question: "Wie viel Trinkgeld ist bei einer Kreuzfahrt üblich?", answer: "Auf den meisten Schiffen ist ein 'Service-Charge' von 12-18 € pro Person/Tag automatisch im Preis. Zusätzlich: 1-2 € pro Getränk an der Bar, 2-5 € pro Massage/Spa-Behandlung. Wer besonders zufrieden ist, kann am Ende der Reise einen extra-Tip geben (5-10 € pro Tag für die Kabinen-Steward)." },
      { question: "Sind Kreuzfahrten klimafreundlich?", answer: "Definitiv nein. Eine Tagesfahrt auf einer Kreuzfahrt verursacht etwa 300 kg CO2 pro Person – das ist mehr als ein Tag im Auto fahren. Plus: Schweröl-Verbrennung produziert Feinstaub und Schwefelausstoß. Wer klimabewusst reisen will, sollte Kreuzfahrten meiden." },
      { question: "Gibt es Kreuzfahrten unter 500€?", answer: "Ja, in der Nebensaison oder als Last-Minute. Eine 4-5 Tage Mittelmeer-Cruise mit Innenkabine ist ab 350 € möglich. Wichtig: Service-Charge und Getränke nicht vergessen, sonst sind es schnell 200-300 € mehr." },
    ],
    relatedSlugs: ["all-inclusive-oder-nicht", "wann-last-minute-buchen", "versteckte-reisekosten"],
  },

  {
    slug: "alleinreisen-tipps",
    title: "Alleine Reisen – Der Guide für Solo-Traveler",
    seoTitle: "Alleine Reisen – Sicherheit, Kosten, Reiseziele für Solo-Traveler",
    seoDescription: "Alleine Reisen lernen: Sicherheits-Tipps, beste Reiseziele für Anfänger, Kostentipps und wie du Einsamkeit unterwegs vermeidest.",
    lead: "Alleine Reisen ist eines der intensivsten Erlebnisse, die man machen kann. Aber wo anfangen? Unser Guide für die ersten Solo-Trips – ehrlich und praxisnah.",
    heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80&auto=format&fit=crop",
    category: "Planung",
    readingTimeMin: 7,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Warum alleine Reisen?", body: "Solo-Travel zwingt dich, eigene Entscheidungen zu treffen – Tagesplan, Restaurant, Aktivitäten. Du lernst dich selbst besser kennen. Du bist viel offener für andere Menschen (alleine spricht man eher mit Fremden). Du kannst spontan sein, ohne Kompromisse. Und der wichtigste Effekt: Selbstvertrauen wächst rasant." },
      { heading: "Beste Einsteiger-Ziele", body: "Sichere und einsteigerfreundliche Solo-Ziele: Portugal (Lissabon, Porto, Algarve), Spanien (Barcelona, Mallorca, Sevilla), Griechenland (Athen, Inseln), Thailand (Bangkok, Chiang Mai – sehr touristen-erfahren), Japan (extrem sicher, höfliche Kultur), Island (Solo-Wandern, geringe Bevölkerungsdichte), Schweiz (sicher, gut erschlossen). Vermeide für die erste Solo-Reise: Länder mit großer Sprachbarriere oder hoher Kriminalität." },
      { heading: "Alleine Reisen vs. Solo in der Gruppe", body: "Reine Solo-Reise: maximale Freiheit, aber auch mehr Eigenverantwortung. Solo-Reise mit Group-Tour (G Adventures, Intrepid, Studiosus): du reist allein an, schließt dich vor Ort einer Gruppe an. Ideal für Anfänger – Sicherheit + Anschluss. Solo-Reise auf einer Kreuzfahrt: viele Reedereien haben spezielle Single-Tarife ohne Aufpreis. Hostels statt Hotels: Einfaches Kennenlernen anderer Backpacker." },
      { heading: "Sicherheit als Solo-Reisender", body: "Goldene Regeln: Teile deine Route mit jemandem zuhause (täglicher Check-in via Whatsapp). Vermeide Alkohol-Exzesse mit Fremden. Behalte Wertsachen am Körper, nicht im Hostel-Zimmer. Vertraue deinem Bauchgefühl – wenn etwas komisch wirkt, geh weg. Im Notfall: Polizei (EU 112), Botschaft, Auslandskrankenversicherungs-Notruf. Frauen: Achte besonders auf konservative Regionen, kleide dich entsprechend." },
      { heading: "Einsamkeit vermeiden", body: "Solo bedeutet nicht einsam. Tipps: Buche Aktivitäten in Gruppen (Kochkurse, Touren, Walking-Tours). Wähle Hostels mit Common-Room oder Bar – Backpacker sind extrem offen. Apps wie Couchsurfing oder Meetup zeigen lokale Events. Frauen-only-Communities (Solo Female Travelers Club auf Facebook). Nimm Augustabend-Spaziergänge mit – der ideale Moment, um Leute zu treffen." },
      { heading: "Solo-Kosten optimieren", body: "Solo-Reisen sind oft teurer pro Person, weil Doppelzimmer geteilt billiger sind. Lösungen: Hostels (Schlafsaal ab 15 €/Nacht), Airbnb-Privatzimmer, Couchsurfing (kostenlos), Single-Aufpreis-freie Veranstalter (Studiosus, Wikinger Reisen), Off-Season reisen, früh buchen. Faustregel: Solo-Reise kostet 20-40% mehr pro Person als zu zweit – nicht das Doppelte." },
    ],
    faqs: [
      { question: "Ist es sicher, als Frau alleine zu reisen?", answer: "Ja, in den meisten Ländern. Beliebte sichere Solo-Frauen-Ziele: Japan, Island, Schweiz, Neuseeland, Norwegen, Portugal, Schottland. Mit einigen Vorsichtsmaßnahmen sind auch Spanien, Italien, Thailand und Costa Rica gut machbar. Risikoreicher: Indien, Ägypten (außerhalb Touristenzonen), Mittelamerika, einige nordafrikanische Länder." },
      { question: "Wie buche ich Hotels als Single am besten?", answer: "Suche nach 'Single Room' (deutlich günstiger als Einzelnutzung eines Doppelzimmers). Booking.com hat einen 'Solo Traveler' Filter. Hostels via Hostelworld. Bei Pauschalreisen: Veranstalter wie Studiosus, Wikinger oder GTA Reisen haben single-freundliche Tarife. Generell: Hostels und kleine B&Bs sind günstiger als Hotelketten." },
      { question: "Wie gehe ich mit dem Heimweh um?", answer: "Heimweh ist normal, besonders auf längeren Reisen. Tipps: Routine schaffen (Morgenritual, festes Frühstück), regelmäßig Familie/Freunde anrufen, ein Tagebuch schreiben, kleine Souvenirs für zuhause sammeln (Vorfreude!). Wenn es zu schlimm wird: Es ist okay, eine Reise früher abzubrechen. Du hast bereits etwas Mutiges getan." },
      { question: "Welche Versicherungen brauchen Solo-Reisende?", answer: "Auslandskrankenversicherung (Pflicht!), Reiserücktrittsversicherung, idealerweise auch eine Reiseabbruchversicherung. Bei Backpacking: Spezielle Backpacker-Versicherungen (z. B. Hanse Merkur Travel) decken auch Diebstahl von Wertsachen ab." },
    ],
    relatedSlugs: ["fernreise-tipps", "reiseversicherung-sinnvoll", "wie-frueh-urlaub-buchen"],
  },

  {
    slug: "mietwagen-im-urlaub",
    title: "Mietwagen im Urlaub – Vom Vergleich bis zur Rückgabe",
    seoTitle: "Mietwagen Urlaub – Vergleich, Tipps & versteckte Kosten",
    seoDescription: "Mietwagen-Tipps für den Urlaub: So findest du das beste Angebot, vermeidest Versicherungs-Fallen und sparst hunderte Euro.",
    lead: "Ein Mietwagen kann den Urlaub revolutionieren – aber auch tief in die Tasche greifen. Unser Komplett-Guide vom Vergleich bis zur Rückgabe.",
    heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80&auto=format&fit=crop",
    category: "Reisemittel",
    readingTimeMin: 8,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Mietwagen vergleichen – die besten Plattformen", body: "Beste Vergleichsportale: billiger-mietwagen.de, sunny cars (mit Vollkasko ohne SB), check24 mietwagen, holidaycars. Vergleiche immer 2-3 Plattformen – die Preise variieren oft erheblich. Direkt bei Anbietern (Hertz, Sixt, Europcar) ist meist teurer, dafür flexiblere Stornierung." },
      { heading: "Versicherung – DAS große Thema", body: "Vollkasko ohne Selbstbeteiligung (CDW) ist Pflicht. Sonst zahlst du im Schadensfall 800-3.000 €. Achte auf den Begriff 'Vollkasko ohne SB' (oder 'Excess Waiver' / 'Zero Excess'). Viele günstige Angebote zeigen Pseudo-Vollkasko mit hoher SB. Anbieter wie sunny cars und billiger-mietwagen schließen Vollkasko ohne SB standardmäßig ein. Reifen, Glas, Unterboden sind oft NICHT in der Vollkasko enthalten – frage explizit nach." },
      { heading: "Versteckte Kosten erkennen", body: "Häufige Aufschläge: Junge Fahrer (unter 25, +20-50 €/Tag), Zusatzfahrer (+5-15 €/Tag, bei Sunny Cars meist gratis), Einwegmiete (oft 50-200 €), Tank-Service (oft günstiger selbst tanken vor Rückgabe), Kindersitz (bei Mietwagen-Anbieter ca. 5-10 €/Tag, lieber selbst mitnehmen), Navi (Smartphone reicht meist), Maut-Box. Lies die AGB vor Buchung!" },
      { heading: "Übernahme & Rückgabe – Tricks der Anbieter", body: "Wichtig: Vor der Übernahme das Auto rundum fotografieren. Kratzer, Dellen, Schäden im Innenraum dokumentieren und im Mietvertrag eintragen lassen. Sonst werden später Schäden auf dich abgewälzt. Bei Rückgabe: gleichen vollen Tank wie bei Übernahme abgeben (sonst Tankfüllung zu Apothekenpreisen). Auto wieder fotografieren. Sich die Rückgabe schriftlich bestätigen lassen." },
      { heading: "Die häufigsten Fallen", body: "1. Upgrade-Versuche: 'Wir haben Ihre Klasse nicht mehr, möchten Sie für nur 10 € mehr pro Tag ein Upgrade?' – meist überteuert. 2. Zusatz-Versicherung am Schalter: oft erhältlich für 100-200 €, obwohl du schon Vollkasko hast – nicht doppelt zahlen. 3. Cashback-Karten an der Tankstelle: viele Anbieter nehmen die Kreditkarten-PIN nicht an, du musst Bargeld nutzen. 4. Vorab-Tank-Voll-Service: meist 30-50 € teurer als selbst tanken." },
      { heading: "Die besten Mietwagen-Länder", body: "Sehr empfehlenswert: USA (gute Straßen, günstig, viel Distanz), Australien, Island, Schottland, Irland, Italien (Toskana), Portugal (Algarve), Kroatien. Schwierig: Italien (Mailand-Stadt, Neapel – viel Verkehr), Türkei (oft chaotisch), Griechenland (manche Inseln haben enge Straßen), Kanada im Winter (Schnee). Linksverkehr: UK, Irland, Australien, Neuseeland, Südafrika, Thailand – bedarf etwas Eingewöhnung." },
    ],
    faqs: [
      { question: "Wie früh sollte ich einen Mietwagen buchen?", answer: "2-4 Monate vor Reisebeginn ist ideal. In der Hochsaison (Juli/August) sind die Preise zum Reisetermin oft 50-100% höher als bei früher Buchung. Last-Minute-Deals gibt es selten, da die Nachfrage hoch ist." },
      { question: "Brauche ich einen internationalen Führerschein?", answer: "In der EU reicht der deutsche Führerschein. Für USA, Kanada, Australien, Neuseeland: deutscher Führerschein + internationaler Führerschein (kostet 16 € beim Bürgeramt, gilt 3 Jahre). Für Asien (Thailand, Vietnam, Indonesien): internationaler Führerschein meist Pflicht." },
      { question: "Was tun bei Unfall mit dem Mietwagen?", answer: "1. Polizei rufen (Pflicht!), Bericht erstellen lassen (auch bei kleinem Schaden – sonst Probleme bei der Versicherung). 2. Mietwagenfirma anrufen (Notfallnummer im Vertrag). 3. Fotos machen, Personalien austauschen, Schaden dokumentieren. 4. Nicht selbst reparieren lassen – nur Vertragspartner der Mietwagenfirma." },
      { question: "Kann ich in der EU mit Deutschland-Auto Maut zahlen?", answer: "Maut-Systeme variieren: Frankreich/Italien/Spanien: zahlen am Toll Booth (Karte oder Bar). Österreich/Schweiz/Tschechien: Vignette nötig (am Mietwagen oft schon dran). Norwegen: Auto-Pass (Mietwagen-Firma stellt Rechnung). Tipp: Vor Reisebeginn Maut-Anforderungen für jedes durchquerte Land prüfen." },
    ],
    relatedSlugs: ["versteckte-reisekosten", "fernreise-tipps", "wie-frueh-urlaub-buchen"],
  },

  {
    slug: "essen-im-urlaub",
    title: "Essen im Urlaub – Magenprobleme vermeiden, lokale Küche genießen",
    seoTitle: "Essen im Urlaub – Magenprobleme vermeiden & lokale Küche entdecken",
    seoDescription: "Magenprobleme im Urlaub vermeiden: Welche Lebensmittel sind sicher? Wie isst man lokal? Tipps für Türkei, Ägypten, Asien und Karibik.",
    lead: "Magen-Darm im Urlaub ist der Klassiker. Mit den richtigen Tipps verbringst du mehr Zeit am Strand als im Bad – und entdeckst trotzdem die lokale Küche.",
    heroImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop",
    category: "Sicherheit",
    readingTimeMin: 6,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Die Goldene Regel: Cook it, peel it, boil it – or forget it", body: "Diese alte Backpacker-Regel gilt immer noch: Was gekocht ist (heiß serviert), was du selbst schälen kannst (Bananen, Mango, Eier), und was abgekocht ist (Tee, Kaffee, abgekochtes Wasser), ist sicher. Was lange offen herumliegt, an Marktständen unhygienisch wirkt oder roh ist (Salat, ungeschältes Obst), birgt Risiken. In Buffets: Speisen immer dampfend heiß auswählen, nichts Lauwarmes." },
      { heading: "Wasser – die größte Gefahr", body: "In den meisten warmen Ländern ist Leitungswasser nicht trinkbar. Auch nicht zum Zähneputzen. Eiswürfel? Oft aus Leitungswasser gemacht – meiden, wenn unsicher. Alkoholische Getränke schützen nicht (Bakterien überleben). Sicher: Industriell verschlossenes Wasser aus Flaschen, Tee aus heißem Wasser, Kaffee, Cola/Limo aus Dosen. Risiko: 'Frischer Saft' aus offenen Behältern, Smoothies mit Eis, Obst gewaschen mit Leitungswasser." },
      { heading: "Magenprobleme – was hilft wirklich?", body: "Bei Durchfall: Viel trinken (verschlossene Wasserflaschen, abgekochter Tee), Elektrolyt-Pulver (Elotrans), keine Milchprodukte, kein Alkohol, keine fettigen Speisen. Heller Reis, Bananen, Toast und Bouillon helfen. Loperamid (Imodium) stoppt den Durchfall, aber nur bei nicht-bakteriellen Erkrankungen empfehlenswert (sonst werden die Bakterien länger im Darm gehalten). Bei Fieber, Blut im Stuhl oder mehr als 3 Tagen: Arzt aufsuchen." },
      { heading: "Lokale Küche genießen – aber wie?", body: "Eines der schönsten Reise-Erlebnisse: lokal essen. Tipps für sichere Genuss-Touren: Achte auf belebte Restaurants (mehr Umsatz = frischere Zutaten), schau, wo Einheimische essen (nicht nur Touristen-Lokale), gegrilltes Fleisch und Fisch sind meist sicher (heiß), Suppen und Eintöpfe sind immer eine gute Wahl, Brot und gekochte Beilagen sind unproblematisch. Am ersten Tag noch zurückhaltend, ab Tag 3 mutiger." },
      { heading: "Länderspezifische Hinweise", body: "Türkei/Ägypten: Achtung bei Salat und ungeschältem Obst. Buffet-Speisen heiß auswählen. Thailand: Street Food ist meist sicher – wenn frisch zubereitet vor deinen Augen. Indien: Höchstes Risiko, sehr vorsichtig sein, möglichst vegetarisch oder gut durchgegartes Fleisch. Mexiko: Tequila und Salsa nicht zu wild kombinieren. Karibik: Fisch frisch bevorzugen, Eiswürfel meiden. Europa: Generell unproblematisch, nur Italien/Spanien können Magen-Darm verursachen, wenn extrem ungewohnt." },
      { heading: "Was in die Reise-Apotheke gehört", body: "Loperamid (Imodium) – stoppt akuten Durchfall, max. 2 Tage einnehmen. Elotrans/Oralpädon – Elektrolyte bei starkem Flüssigkeitsverlust. Bismutsubsalicylat (Pepto-Bismol) – beruhigt den Magen. Probiotika (Yomogi, Mutaflor) – aufbau der Darmflora. Cetirizin – falls Lebensmittel-Allergie. Schmerzmittel mit Magenschutz (Ibuprofen + Pantoprazol). Im Verdachtsfall einer Lebensmittelvergiftung: Aktivkohle-Tabletten." },
    ],
    faqs: [
      { question: "Sollte ich vorbeugend Antibiotika nehmen?", answer: "Nein! Vorbeugende Antibiotika werden nicht mehr empfohlen – sie führen zu Resistenzen und schädigen die natürliche Darmflora. Im Notfall verschreibt der Arzt vor Ort oder in der Heimat das richtige Medikament." },
      { question: "Wie unterscheide ich harmlose Reisediarrhoe von etwas Ernsthaftem?", answer: "Harmlos: Wässriger Durchfall, max. 3 Tage, kein Fieber, gutes Allgemeinbefinden. Bedenklich: Fieber über 38.5 °C, Blut im Stuhl, starke Schmerzen, mehr als 4 Tage, starke Dehydrierung (trockener Mund, dunkler Urin). Bei Bedenklichkeit: Arzt aufsuchen!" },
      { question: "Wie schnell darf ich nach Magenproblemen wieder normal essen?", answer: "Tag 1-2: Schonkost (Reis, Banane, Toast, Bouillon). Tag 3: Vorsichtig wieder feste Nahrung (Kartoffeln, Nudeln, gekochtes Gemüse). Ab Tag 4-5: Normal essen, aber noch keine fettigen oder scharfen Sachen. Sport und Alkohol erst nach kompletter Erholung." },
      { question: "Was tun, wenn meine Familie sich gegenseitig ansteckt?", answer: "Hygiene ist entscheidend: Hände waschen, separate Handtücher, Toilette mit Desinfektionsmittel reinigen. Bei Kindern und Älteren besonders aufpassen wegen Dehydrierungs-Risiko. Trinkflaschen und Strohhalme nicht teilen. In schweren Fällen: lokale Apotheke oder Hotelarzt." },
    ],
    relatedSlugs: ["reiseapotheke-checkliste", "was-bei-krankheit-im-urlaub", "fernreise-tipps"],
  },

  {
    slug: "reisetrends-2026",
    title: "Reisetrends 2026 – Was du jetzt wissen musst",
    seoTitle: "Reisetrends 2026 – Wohin reisen die Deutschen?",
    seoDescription: "Die wichtigsten Reisetrends 2026: Trend-Destinationen, neue Reisestile, Booking-Verhalten und was die Branche prägt.",
    lead: "Welche Reiseziele sind in 2026 angesagt? Welche Stile überraschen? Unsere Analyse der wichtigsten Trends für deutsche Urlauber.",
    heroImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80&auto=format&fit=crop",
    category: "Trends",
    readingTimeMin: 7,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Trend 1: Slow Travel & Längere Aufenthalte", body: "Statt 3 Städte in 7 Tagen reisen Deutsche zunehmend tiefer und länger. 14-21 Tage in EINER Region statt Hopping. Slow Travel als Antwort auf Stress, Klimabewusstsein und das Bedürfnis nach echtem Erleben statt oberflächlichem Abhaken. Beliebte Slow-Travel-Ziele 2026: Toskana, Andalusien, Algarve, kroatische Inseln, schottische Highlands." },
      { heading: "Trend 2: Workation & Digital Nomad", body: "Remote Work hat das Reisen verändert. Hotels und Resorts werben mit High-Speed-WLAN, Co-Working-Spaces, Workation-Paketen. Top-Destinationen für Workation: Lissabon (Portugal), Bali (Indonesien), Mexico City, Madeira (Portugal hat sogar ein 'Digital Nomad Village'). Kombi aus Job + Sonne + neue Kultur ist besonders bei 25-40-Jährigen populär." },
      { heading: "Trend 3: Naturerlebnis & Wellness", body: "Nach Pandemie-Jahren ist Naturerleben so beliebt wie nie. Forest Bathing (japanisches Shinrin-Yoku), Wandern, Berghütten-Urlaub, Wellness-Retreats mit Yoga und Meditation. Wachstum: Nationalparks (Schweden, Slowenien), abgelegene Berghütten (Schweiz, Österreich), Wellness-Hotels mit Detox-Programmen." },
      { heading: "Trend 4: Set-Jetting (Reisen wegen Filmen/Serien)", body: "Netflix und Co. machen es vor: 'Emily in Paris' boostet Paris-Besuche, 'White Lotus' machte Sizilien zum Hotspot, 'The Crown' lockt nach Schottland. Dieser Effekt nennt sich Set-Jetting. Plattformen wie Atlas Obscura listen Drehorte. Tipp: Wenn ein Reiseziel plötzlich überall in den Medien ist, sind Preise meist hoch – warte 6-12 Monate." },
      { heading: "Trend 5: Last-Minute & Spontaneität", body: "Durch das Ende der Pandemie-Unsicherheit wurden Last-Minute-Buchungen nicht weniger – sondern mehr. Veranstalter berichten von 30-40% mehr Buchungen unter 14 Tagen vor Abflug. Apps und Push-Benachrichtigungen treiben das Verhalten. Faustregel: 2-4 Wochen vor Abflug gibt es die besten Deals, besonders außerhalb der Schulferien." },
      { heading: "Trend 6: Nachhaltige Reiseanbieter wachsen", body: "Veranstalter wie Forum Anders Reisen, Studiosus und Hauser Exkursionen wachsen jährlich zweistellig. Konsumenten fragen nach: CO2-Bilanz, Auflagen vor Ort (lokale Guides, faire Bezahlung), Bahn-Reisen statt Flügen. Prognose: Bis 2030 wird 'nachhaltig' kein Marketing-Argument mehr sein, sondern Voraussetzung." },
    ],
    faqs: [
      { question: "Welche Reiseziele werden 2026 besonders beliebt?", answer: "Im europäischen Raum: Slowenien, Albanien, Georgien, Cornwall, Schottland. Außerhalb Europas: Vietnam, Sri Lanka, Kolumbien, Madagaskar. Diese Ziele sind authentisch, oft günstig und noch nicht überlaufen – ideal für reisefreudige Entdecker." },
      { question: "Sind Pauschalreisen 2026 noch im Trend?", answer: "Ja, mehr denn je. Pauschalreisen erleben einen Boom: einfacher Buchungsprozess, planungssicher, durch EU-Recht abgesichert. Besonders bei Familien und älteren Reisenden. Innerhalb Pauschalreisen wachsen aber Premium-Segmente und individuell zusammengestellte Pakete." },
      { question: "Wird Reisen immer teurer?", answer: "Ja, leider. Inflation, Energiekosten und gestiegene Arbeitskosten treiben Preise nach oben. Für 2026 wird ein Anstieg von 5-10% gegenüber 2025 erwartet. Wer sparen will: Frühbucher-Tarife, Nebensaison reisen, alternative Ziele wählen, Flexibilität bei Abflughafen." },
      { question: "Welche Apps sind 2026 unverzichtbar fürs Reisen?", answer: "Maps.me (Offline-Karten), Google Translate (mit Offline-Sprachpaketen), Booking.com / Airbnb, Skyscanner (Flugsuche), Wise (Geld umrechnen), TripAdvisor (Restaurants), atmosfair (CO2-Kompensation), Triplt (Reiseplaner)." },
    ],
    relatedSlugs: ["nachhaltig-reisen", "wann-last-minute-buchen", "fernreise-tipps"],
  },

  {
    slug: "geheimtipp-destinationen",
    title: "10 Geheimtipp-Destinationen abseits der Massen",
    seoTitle: "Geheimtipp-Reiseziele 2026 – 10 unentdeckte Destinationen",
    seoDescription: "10 echte Geheimtipps in Europa und der Welt: Destinationen ohne Massentourismus, mit authentischer Kultur und fairen Preisen.",
    lead: "Mallorca ist nicht für jeden. Diese 10 Destinationen sind wenig bekannt, aber jede einzelne reicht an die Top-Ziele heran – ohne den Touristenrummel.",
    heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop",
    category: "Trends",
    readingTimeMin: 9,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "1. Albanien – Die unbekannte Riviera", body: "Albanien war jahrzehntelang abgeschottet. Seit kurzer Zeit ist es offen – und überrascht alle Besucher. Saranda, Ksamil und Vlora bieten kristallklares Wasser, leere Strände und Pauschalreisen ab 400 €. Tipp: Frühbucher 2026, denn die Preise steigen jährlich. Beste Reisezeit: Mai-Oktober." },
      { heading: "2. Madeira – Die Blumeninsel ohne Massen", body: "Während die Kanaren überlaufen sind, bleibt Madeira ein Geheimtipp. Wanderparadies, ganzjährig 18-25 °C, exzellente Küche, freundliche Menschen. Funchal als charmante Hauptstadt. Ideal für Aktivurlauber, weniger für reine Strand-Sonnen-Anbeter (Strände sind oft Felsen). Pauschalreisen ab 500 €." },
      { heading: "3. Slowenien – Mini-Schweiz im Süden", body: "Slowenien hat alles: Berge wie die Alpen (Triglav-Nationalpark), Höhlen (Postojna), Wein (Goriška Brda), Strand (Piran), Hauptstadt mit Charme (Ljubljana). Klein genug, um in einer Woche viel zu sehen. Sicher, sauber, EU-Standard. Häufig vergessen, weil es zwischen Italien, Österreich und Kroatien liegt." },
      { heading: "4. Georgien – Wein, Berge, Gastfreundschaft", body: "Georgien ist eine Offenbarung: einer der ältesten Weinländer der Welt, dramatische Kaukasus-Berge, exzellentes Essen (Khachapuri!), unglaublich gastfreundliche Menschen. Tbilisi als Hauptstadt mit altem Stadtkern. Visumfrei für Deutsche. Sehr günstig: Hotels ab 30 €/Nacht. Direktflüge aus mehreren deutschen Städten." },
      { heading: "5. Sri Lanka – Klein und vielfältig", body: "Sri Lanka ist klein (kann in 2-3 Wochen erkundet werden), bietet aber: Strände (Mirissa, Bentota), Berge mit Tee-Plantagen (Ella, Nuwara Eliya), Tempel (Sigiriya), Wildlife-Safaris (Yala-Nationalpark). Sehr günstig (5-Sterne-Hotels ab 80 €), warm-herzliche Bevölkerung, gute Infrastruktur." },
      { heading: "6. Korsika – Frankreichs unbekannte Insel", body: "Korsika ist viel weniger touristisch als Sardinien oder Sizilien. Wunderschöne Strände (Palombaggia, Plage de Saleccia), wilde Berge mit Wandermöglichkeiten (GR20), authentische Dörfer (Bonifacio, Sartène). Französisch geprägt, mit korsischer Identität. Zugänglich per Fähre oder Flug." },
      { heading: "7. Estland – Mittelalter trifft Moderne", body: "Tallinn hat einen der besterhaltenen mittelalterlichen Altstädte Europas (UNESCO). Plus: Estland ist das digitalste Land der Welt (5G überall, e-Government), hat tiefe Wälder (Lahemaa-Nationalpark), Ostseeinseln (Saaremaa) und ist sehr günstig im Vergleich zu Finnland oder Schweden." },
      { heading: "8. Sansibar – Karibik-Atmosphäre vor Ostafrika", body: "Sansibar (Tansania) ist die Alternative zur Karibik: Kristallklares Wasser, weiße Strände, Gewürz-Kultur, Stone Town (UNESCO). Kombinierbar mit Safari auf dem afrikanischen Festland (Serengeti, Ngorongoro). Beste Reisezeit Juni-Oktober (Trockenzeit). Direktflüge ab 600 €, Pauschalreisen ab 1.200 €." },
      { heading: "9. Kanada – Mehr als Niagara-Fälle", body: "Kanada ist riesig und divers: Vancouver Island (Walbeobachtung), Banff (Bergpanorama), Quebec City (französisches Flair), Neufundland (rauhe Atlantik-Schönheit). Sicheres Land, gutes Englisch, viele direkte Flüge. Beste Reisezeit Juni-September. Camper-Reisen sind besonders beliebt." },
      { heading: "10. Vietnam – Fernreise zum kleinen Preis", body: "Vietnam bietet das beste Preis-Leistungs-Verhältnis aller Fernreiseziele: 3-Sterne-Hotels ab 25 €, Street Food für 1-3 €, Halong Bay als UNESCO-Weltnaturerbe, alte Hauptstadt Hanoi, moderne Wirtschaftsmetropole Saigon, Strandparadies Phu Quoc. Beste Reisezeit Nov-April." },
    ],
    faqs: [
      { question: "Was bedeutet 'Geheimtipp' wirklich?", answer: "Im Reisemarketing wird der Begriff inflationär benutzt. Echte Geheimtipps haben wir hier nach 3 Kriterien ausgewählt: 1) Weniger als 1/3 der Besucherzahlen vergleichbarer Ziele, 2) Authentische lokale Kultur (kein Disneyland-Effekt), 3) Faire Preise (deutlich unter Mainstream-Zielen)." },
      { question: "Welche Geheimtipps eignen sich für Familien?", answer: "Slowenien, Madeira, Korsika und Estland sind besonders familienfreundlich: gute Infrastruktur, sicheres Essen, kurze Flugzeiten, kindgerechte Aktivitäten. Vietnam und Sri Lanka sind für Familien mit größeren Kindern (ab 8) zu empfehlen." },
      { question: "Wie lange bleiben Geheimtipps geheim?", answer: "Meist 3-5 Jahre. Sobald Reise-Magazine, Influencer und große Veranstalter aufmerksam werden, steigen Preise und Besucherzahlen. Slowenien und Madeira sind aktuell genau in dieser Phase – wer noch günstig reisen will, sollte schnell sein." },
      { question: "Gibt es echte Off-the-grid-Reiseziele in Europa?", answer: "Ja, aber selten. Im Norden Schwedens (Lappland), im Kosovo, in den albanischen Bergen, auf einigen schottischen Hebriden-Inseln. Diese Ziele erfordern aber Eigenständigkeit, gute Vorbereitung und meist eigenen Mietwagen." },
    ],
    relatedSlugs: ["fernreise-tipps", "reisetrends-2026", "alleinreisen-tipps"],
  },

  {
    slug: "kreuzfahrt-vs-pauschal",
    title: "Kreuzfahrt vs. Pauschalreise – Was passt besser zu dir?",
    seoTitle: "Kreuzfahrt oder Pauschalreise? Vergleich, Kosten & Vorteile",
    seoDescription: "Kreuzfahrt vs. Pauschalreise: Was ist günstiger, wer hat mehr zu sehen, was ist entspannter? Ehrlicher Vergleich für Erstreisende.",
    lead: "Beide Reisetypen versprechen Erholung, aber unterscheiden sich grundlegend. Wann lohnt sich welche? Unser ehrlicher Vergleich.",
    heroImage: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1600&q=80&auto=format&fit=crop",
    category: "Buchung",
    readingTimeMin: 7,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Kostenvergleich (für 1 Woche, 2 Personen)", body: "Pauschalreise Mittelmeer: 800-1.800 € (Hotel 4★, All Inclusive, Flug, Transfer). Kreuzfahrt Mittelmeer Innenkabine: 700-1.300 € (plus 200-400 € Trinkgeld/Ausflüge/Getränke). Kreuzfahrt mit Balkon: 1.400-2.500 €. In Summe oft Pauschalreise günstiger, wenn man alle versteckten Kreuzfahrt-Kosten einrechnet." },
      { heading: "Was sieht man mehr?", body: "Kreuzfahrt: Mehrere Häfen in einer Woche (oft 4-7), aber jeweils nur 6-10 Stunden. Du 'sammelst' viele Eindrücke, aber siehst nichts wirklich tief. Pauschalreise: Eine Region, du kannst 1-2 Tagesausflüge machen, hast aber Zeit für Strand, Erholung und tiefere Erkundung. Tendenziell: Kreuzfahrt = mehr Breite, Pauschalreise = mehr Tiefe." },
      { heading: "Komfort & Entspannung", body: "Pauschalreise gewinnt: Kein tägliches Umpacken, kein 'Ankunft im neuen Hafen um 7 Uhr'. Du wachst im gleichen Zimmer auf, kannst entscheiden, ob du am Strand liegen oder etwas erkunden willst. Kreuzfahrt: Du bist im Schiff bewegt, oft Nachts. Manche lieben das Gefühl, viele finden es anstrengend – besonders bei Seekrankheit." },
      { heading: "Für wen ist was?", body: "Pauschalreise: Ideal für Familien mit Kindern (Routine, Kinderclub), Erholungs-Suchende, Strand-Liebhaber, Budget-Reisende. Kreuzfahrt: Ideal für Sightseeing-Fans (viele Häfen), ältere Reisende (alles wird zu dir gebracht, kein Reisestress), Genießer von Schiffs-Atmosphäre, Paare ohne Kinder." },
      { heading: "Verpflegung im Vergleich", body: "All-Inclusive in Pauschalreisen: meist gut bis sehr gut, manchmal 4-5 Restaurants im Hotel, teils internationale und lokale Küche. Kreuzfahrten: oft Buffet-zentriert (24/7 verfügbar), Premium-Restaurants gegen Aufpreis (15-50 € pro Mahlzeit). Vorteil Kreuzfahrt: Mehr Vielfalt durch verschiedene Häfen-Mahlzeiten." },
      { heading: "Klimabilanz", body: "Beide sind nicht klimafreundlich. Kreuzfahrt: ca. 300 kg CO2 pro Tag pro Person (Schweröl, riesiges Schiff). Pauschalreise: ca. 350 kg CO2 für eine Mallorca-Woche (Flug + Hotel). Wenn dir Nachhaltigkeit wichtig ist, sind beide nicht ideal – Bahn-Reise zu europäischen Zielen ist die einzig wirklich klimafreundliche Option." },
    ],
    faqs: [
      { question: "Ist eine Kreuzfahrt günstiger als eine Pauschalreise?", answer: "Auf den ersten Blick ja, aber mit allen versteckten Kosten oft nein. Kreuzfahrt-Grundpreis ist meist 600-1.200 €. Mit Trinkgeld (90 €), Ausflügen (200-400 €), Getränken (150-300 €), Internet (200 €) kommt man schnell auf 1.500-2.500 €. Pauschalreise All Inclusive für ähnlichen Komfort ist oft günstiger." },
      { question: "Welcher Reisetyp ist entspannter?", answer: "Pauschalreise. Bei einer Kreuzfahrt bist du täglich an einem neuen Ort, musst Ausflüge planen, hast feste Essenszeiten und ein klares Programm. Pauschalurlaub gibt dir maximale Flexibilität – heute Strand, morgen Ausflug, übermorgen nur faulenzen." },
      { question: "Eignet sich eine Kreuzfahrt für die erste Reise?", answer: "Eher nicht. Kreuzfahrten sind komplex (Kabinenwahl, Trinkgeld, Ausflüge, Getränke-Pakete) und fühlen sich für Anfänger oft chaotisch an. Eine Pauschalreise ist deutlich einfacher: Flug, Hotel, fertig. Wer Kreuzfahrt probieren will, sollte mit einer kurzen 4-5 Tage Cruise im Mittelmeer beginnen." },
      { question: "Welche Reiseart gewinnt insgesamt?", answer: "Es kommt auf dich an. Wer Erholung sucht und Kinder hat → Pauschalreise. Wer viele Orte sehen will und Schiffs-Atmosphäre mag → Kreuzfahrt. Wer beides haben will: Versuche eine Kombi-Reise – z. B. erst 4 Tage Mittelmeer-Cruise, dann 7 Tage in einem Mallorca-Resort." },
    ],
    relatedSlugs: ["kreuzfahrt-anfaenger", "all-inclusive-oder-nicht", "pauschalreise-vs-einzelbuchung"],
  },

  {
    slug: "wohnmobil-urlaub",
    title: "Wohnmobil-Urlaub – Der Einstieg in die Vanlife-Welt",
    seoTitle: "Wohnmobil Urlaub – Tipps, Routen & Versicherung für Anfänger",
    seoDescription: "Wohnmobil-Urlaub für Einsteiger: Beste Routen in Europa, Mietkosten, Tipps zu Stellplätzen und was vor der ersten Tour wichtig ist.",
    lead: "Wohnmobil-Reisen boomen seit Corona. Die Kombination aus Freiheit, Natur und Komfort lockt Familien wie Solo-Reisende. Unser Einsteiger-Guide.",
    heroImage: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=1600&q=80&auto=format&fit=crop",
    category: "Reisemittel",
    readingTimeMin: 8,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Wohnmobil mieten oder kaufen?", body: "Mieten lohnt sich für die ersten 1-3 Reisen – Kosten 100-200 €/Tag in der Hauptsaison, 60-120 €/Tag in der Nebensaison. Anbieter: McRent, Roadsurfer, Indie Campers, Yescapa. Kaufen lohnt sich erst ab etwa 30+ Reisetagen pro Jahr. Gebrauchte Camper ab 30.000 €, neue ab 60.000 €. Plus: Versicherung, Wartung, Stellplatz." },
      { heading: "Welcher Wohnmobil-Typ passt zu dir?", body: "Kompakte Vans (z. B. VW California): Perfekt für Paare, leicht zu fahren, in Städten parkbar, aber wenig Platz. Teilintegrierte: Klassisches Wohnmobil mit fester Kabine, mehr Platz, gut für Familien. Vollintegrierte: Maximaler Komfort, oft mit Doppelbett im Heck und Hubbett vorne. Alkoven: Mit Bett über dem Fahrerhaus, klassisch für Familien. Für Einsteiger: Teilintegriert oder Van." },
      { heading: "Die schönsten europäischen Camper-Routen", body: "1. Norwegen Atlantikstraße (1.500 km, traumhafte Fjorde, Mitternachtssonne im Sommer). 2. Italien Toskana + Cinque Terre (entspanntes Klima, Wein, Strand). 3. Schottland North Coast 500 (wild, einsam, atemberaubend). 4. Portugal Algarve (Atlantik-Klippen, Surfen, mild). 5. Kroatien Adria-Küste (klares Wasser, viele Inseln, viele Stellplätze). 6. Island (Ringstraße, Geysire, Wasserfälle – aber teuer)." },
      { heading: "Stellplätze finden", body: "Apps & Ressourcen: Park4Night (kostenlos, Community-basiert, ca. 200.000 Stellplätze in Europa), Camper-Contact, ADAC-Stellplatzführer, Stellplatz.info. Es gibt: Offizielle Wohnmobilstellplätze (oft 8-25 €/Nacht, mit Strom/Wasser), Campingplätze (15-50 €/Nacht, mehr Komfort), Wildes Stehen (in vielen Ländern erlaubt – Norwegen, Schweden, Schottland mit Allemansrätt). Verboten meist in Italien, Frankreich, Kroatien." },
      { heading: "Was du als Anfänger wissen musst", body: "Höhe: Unterführungen messen oft 2,8-3,2 m. Dein Wohnmobil ist meist 2,5-3,2 m. Kontrolliere bei jeder Tank- und Brückenstelle! Strom: Camping-Stromkabel (16 A blau) ist Standard, manche Plätze brauchen Adapter. Wasser: Tank regelmäßig nachfüllen, max. 100 L. Abwasser: Grauwasser (Spülbecken) und Schwarzwasser (WC) nur an offiziellen Entsorgungsstellen ablassen. Gas: Reicht meist 1-2 Wochen, je nach Heizung." },
      { heading: "Kosten realistisch kalkulieren", body: "1 Woche Wohnmobil-Urlaub mit 2 Personen, 1.500 km Fahrtstrecke: Miete 700-1.200 €, Diesel 250-400 €, Stellplätze 70-150 €, Maut 50-150 €, Lebensmittel 150-250 € (selbst kochen), Gas 30-60 €, Versicherung im Mietpreis. Gesamt: 1.250-2.200 € pro Woche für 2 Personen. Vergleichbar mit Mittelklasse-Pauschalreise, aber mit deutlich mehr Erlebnis." },
    ],
    faqs: [
      { question: "Brauche ich einen Spezialführerschein?", answer: "Für Wohnmobile bis 3,5 t reicht der normale PKW-Führerschein (Klasse B). Größere Camper (über 3,5 t) brauchen die Klasse C1 (zwischen 1999-2018 für viele automatisch erworben). Alle modernen Mietfahrzeuge sind unter 3,5 t." },
      { question: "Was, wenn etwas am Wohnmobil kaputt geht?", answer: "Bei Mietfahrzeugen: Pannenservice ist meist im Preis. Anrufen, Schaden melden, oft kommt jemand vorbei. Bei eigenem Camper: ADAC oder ähnliche Pannendienste haben Camper-Tarife. Kleine Reparaturen (Sicherung, Glühbirne) selbst machen können – ein Werkzeugkasten gehört in jedes Wohnmobil." },
      { question: "Lohnt sich ein Wohnmobil-Urlaub mit Kindern?", answer: "Ja, sehr! Kinder lieben das Abenteuer-Gefühl, eigene Abenteuer im Camper, viele Stopps an spannenden Orten. Tipps: Tagesetappen kurz halten (max. 3-4 Stunden Fahrt), Kinder-Spiele für Pausen, regelmäßige Spielplatz-Stopps. Ideal: Norwegen, Schweden, Niederlande (sicher, viele Spielplätze)." },
      { question: "Kann man das ganze Jahr im Wohnmobil reisen?", answer: "Theoretisch ja, praktisch nur im Sommer komfortabel. Im Winter wird es kalt (außer mit Standheizung und gut isoliertem Camper), Wassertanks können einfrieren, viele Stellplätze sind geschlossen. Wer Winter-Camping möchte, sollte ein Wohnmobil mit Wintertauglichkeit wählen." },
    ],
    relatedSlugs: ["alleinreisen-tipps", "geheimtipp-destinationen", "fernreise-tipps"],
  },

  {
    slug: "kofferchaos-vermeiden",
    title: "Kofferchaos vermeiden – Der ultimative Pack-Guide",
    seoTitle: "Koffer richtig packen – Tipps gegen Überpack & Knitter",
    seoDescription: "Koffer richtig packen: Wie du nie mehr zu viel mitnimmst, Knitter vermeidest, Gewicht sparst und alles findest, was du brauchst.",
    lead: "Der Koffer: jedes Mal das gleiche Drama. Zu viel, zu schwer, zerknittert. Mit unseren Tipps packst du wie ein Profi – egal ob Wochenende oder Welt-Reise.",
    heroImage: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=1600&q=80&auto=format&fit=crop",
    category: "Planung",
    readingTimeMin: 6,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Die Pack-Formel: Liste, halbieren, packen", body: "Schritt 1: Erstelle eine Liste mit allem, was du mitnehmen 'könntest'. Schritt 2: Streiche alles, was du nicht 100% brauchst – meist die Hälfte. Schritt 3: Lege alles, was übrig ist, auf das Bett. Schritt 4: Streiche nochmal die Hälfte. Schritt 5: Packen. Sounds drastisch, funktioniert aber – du wirst nichts wirklich vermissen." },
      { heading: "Kleidung clever planen", body: "Faustregel: 1 Outfit pro 2-3 Tage. Bei einer 7-Tage-Reise: 3-4 Tagesoutfits + 1 Abend-Outfit. Wähle Kombi-fähige Stücke (basics: weiß, schwarz, beige, jeans). Eine Hose zu 4 Shirts statt 4 verschiedene Komplet-Outfits. Strandurlaub: 2 Badehosen/Bikinis, 3 Tagesoutfits, 1 Abendkleidung. Stadt: 4 Shirts, 2 Hosen, 1 Pullover, bequeme Schuhe." },
      { heading: "Rolltechnik vs. Falten vs. Pack-Cubes", body: "Rollen: Spart 20-30% Platz im Koffer, vermeidet Knitter, ideal für Casual Kleidung. Falten: Klassisch, gut für formale Kleidung (Anzüge, Kleider). Pack-Cubes: Stoff-Boxen, die deinen Koffer organisieren. Eine Box für Shirts, eine für Unterwäsche, eine für Kabel. Massiver Vorteil: du findest alles sofort, der Koffer bleibt aufgeräumt. Empfehlung: Kombination aus Rollen + Pack-Cubes." },
      { heading: "Schuhe – die größten Platzfresser", body: "Schuhe nehmen am meisten Platz. Tipps: Trage die größten/schwersten Schuhe im Flugzeug an (Boots, Sneaker). Pack max. 2 weitere Paare ein (Sandalen + Sneaker oder Sandalen + Schicke). Stopfe Strümpfe/Unterwäsche IN die Schuhe – spart Platz und hält Schuhform. Stoff-Schuhbeutel verhindern, dass dreckige Sohlen alles beschmutzen." },
      { heading: "Wertsachen & Elektronik im Handgepäck", body: "Pflicht ins Handgepäck: Reisepass, Geld, Kreditkarten, Smartphone, Laptop/Tablet, Ladegeräte, wichtige Medikamente, eine Wechselgarnitur (für den Fall dass der Koffer verloren geht). Lithium-Akkus müssen im Handgepäck (nicht im Koffer!). Powerbanks dürfen nur im Handgepäck. E-Zigaretten: nur Handgepäck. Laptops, Tablets, Kameras separat in der Sicherheitskontrolle ablegen." },
      { heading: "Die häufigsten Pack-Fehler", body: "1. Zu viele 'für den Fall dass'-Outfits: Du wirst sie nicht tragen. 2. Volumenscheue Klamotten: Kapuzenpullis, dicke Jacken nehmen viel Platz. Lieber im Flugzeug tragen. 3. Komplette Größen-Sets: 'Ich nehme den Tankini UND den Bikini mit'. Wähle eine. 4. Originalverpackungen: Nimm Shampoo in 100ml-Behältern, nicht die ganze Flasche. 5. Souvenirs einplanen: Lasse 10-15% Platz für die Heimreise!" },
    ],
    faqs: [
      { question: "Wie viel darf mein Handgepäck wiegen?", answer: "Bei den meisten Airlines: Lufthansa und Eurowings 8 kg, Ryanair und Wizzair 10 kg im großen Trolley + 5 kg im kleinen 'Personal Item' (Handtasche oder Laptop-Tasche). Maße: meist 55x40x20 cm für den großen Trolley. Vor Check-in immer prüfen – Strafgebühren am Gate sind extrem teuer (oft 50-80 €)." },
      { question: "Was darf nicht ins Handgepäck?", answer: "Flüssigkeiten über 100 ml, scharfe Gegenstände (Nagelschere mit Klinge >6 cm, Messer), Feuerwerk, brennbare Stoffe, Batterien über 100 Wh, Werkzeuge (Schraubenzieher, Hammer). Erlaubt: Babynahrung, Medikamente in Originalverpackung mit Rezept, Insulin." },
      { question: "Wie packe ich am besten für einen Strand-Urlaub?", answer: "Strandurlaub braucht weniger als gedacht: 2 Badeoutfits, 3-4 Tag-Outfits (T-Shirt + Shorts), 1 leichtes Abendoutfit, 1 Strandtuch (oft im Hotel inklusive), Sonnencreme (vor Ort meist teurer kaufen), Sonnenbrille, Hut, Flip-Flops. Bei All-Inclusive: nichts zum Selbstkochen mitnehmen. Lass Platz für Souvenirs." },
      { question: "Sollte ich meinen Koffer wiegen?", answer: "Unbedingt – mit einer Kofferwaage (5-15 €). Übergewicht kostet bei den meisten Airlines 20-50 € pro Kilo, am Flughafen oft noch mehr. Eine 10 €-Kofferwaage ist die beste Investition deines Reise-Lebens. Plane bei 23 kg-Limit auf 22 kg hin – Reservepolster für Souvenirs." },
    ],
    relatedSlugs: ["fernreise-tipps", "reiseapotheke-checkliste", "alleinreisen-tipps"],
  },

  {
    slug: "haustier-im-urlaub",
    title: "Mit Hund in den Urlaub – Was wirklich wichtig ist",
    seoTitle: "Urlaub mit Hund – Reisetipps, Hotels & Einreisebestimmungen",
    seoDescription: "Urlaub mit Hund: Welche Hotels nehmen Hunde, was ist im EU-Heimtierausweis, wo darf der Hund mit – kompletter Guide.",
    lead: "Den Hund daheim lassen tut weh. Aber Urlaub MIT Hund braucht Vorbereitung. Unser Guide für entspannten Urlaub mit deinem Vierbeiner.",
    heroImage: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1600&q=80&auto=format&fit=crop",
    category: "Familie",
    readingTimeMin: 7,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "EU-Heimtierausweis – die Pflicht", body: "Für Reisen innerhalb der EU brauchst du: EU-Heimtierausweis (vom Tierarzt, ca. 15 €), gültige Tollwut-Impfung (mindestens 21 Tage alt vor Reisebeginn, dann jährlich auffrischen), Mikrochip (Pflicht in vielen Ländern), Wurmkur 1-5 Tage vor Reisebeginn (Pflicht für Großbritannien, Irland, Norwegen, Finnland, Malta). Bei Reisen außerhalb der EU: Zusätzliche Bestimmungen prüfen, oft Wartezeiten." },
      { heading: "Welche Verkehrsmittel?", body: "Auto: Ideal – Hund hat Routine, du kannst Pausen einlegen. Wichtig: Sicherung im Auto (Hundebox, Sicherheitsgurt). Bahn: In Deutschland: Hunde unter 5 kg in Tasche kostenlos, größere als 'Kind' (50% Preis). Flugzeug: Kleine Hunde (bis 8 kg) in Box im Passagierraum (50-100 €). Größere Hunde im Frachtraum (oft 200-400 €). Vermeide Fluglatzgeladene Routen oder Sommertage – Frachtraum-Stress!" },
      { heading: "Hundefreundliche Hotels finden", body: "Plattformen: Booking.com (Filter 'Haustiere erlaubt'), bringfido.com, hundehotel.info. Wichtig: 'Erlaubt' bedeutet nicht 'willkommen'. Frage nach: Größenbeschränkung, Aufpreis (oft 5-25 €/Nacht), Zimmer mit Hund-Eingang (kein Aufzug nötig), Hundebar/Hunde-Strand in der Nähe. Top-Länder für Hunde-Urlaub: Österreich, Schweiz, Italien (Italiener lieben Hunde), Kroatien, Niederlande." },
      { heading: "Beste Reiseziele mit Hund", body: "Innerhalb Deutschlands: Nordsee/Ostsee (viele Hundestrände), Bayern (Wandern), Schwarzwald, Mecklenburgische Seenplatte. International: Italien/Toskana (entspannt mit Hund), Österreich/Kärnten (viele hundefreundliche Hotels), Niederlande (Hundestrände), Frankreich/Bretagne (offene Strände im Winter), Kroatien (viele Hundestrände). Vermeide: Türkei, Ägypten, USA (komplexe Bestimmungen), Tropen (Hitze + Krankheiten)." },
      { heading: "Was im Hunde-Reise-Set unverzichtbar ist", body: "Futter (gewohnte Marke, nicht vor Ort wechseln), Wasser-Schüssel zum Mitnehmen, Leine (extra lang für Strände), Halsband mit Adresse + Telefonnummer (UNBEDINGT Aufkleber mit Hotel + Telefon), Hundedecke (vertrauter Geruch), Lieblings-Spielzeug, Kotbeutel, Floh-/Zeckenschutz (besonders wichtig im Mittelmeer wegen Sandmücken/Leishmaniose), Erste-Hilfe für Hunde (Wundsalbe, Verband, Pinzette für Zecken)." },
      { heading: "Was tun, wenn der Hund krank wird?", body: "Ein Tierarzt im Ausland kann teuer werden (50-300 € pro Behandlung). Eine Tierkrankenversicherung mit Auslandsdeckung lohnt sich (15-50 €/Monat, je nach Hund). Apps wie Petbacker zeigen Tierärzte in der Nähe. Bei Notfall: Lokale Polizei oder Hotelrezeption fragen – meist kennen sie einen vertrauenswürdigen Tierarzt. Häufig bei Hunden im Süden: Hitzschlag (Schatten + Wasser), Sandmücken (Schutzmittel), aufgenommene Reste (toxisch)." },
    ],
    faqs: [
      { question: "Welche Hunde dürfen nicht ins Flugzeug?", answer: "Brachycephale Rassen (Bulldoggen, Möpse, Boxer) werden von vielen Airlines nicht akzeptiert wegen Atemproblemen unter Stress. Auch listenhunde (Pitbulls) sind oft ausgeschlossen. Sehr großen Hunden (über 70 kg) wird oft nur Frachtraum angeboten – sehr stressig. Empfehlung für solche Rassen: Auto-Reise im EU-Raum." },
      { question: "Brauche ich für meinen Hund eine eigene Reiseversicherung?", answer: "Eine reguläre Tierkrankenversicherung deckt oft nur Inland. Für längere Reisen oder Risikoländer ist eine spezielle Reise-Tierkrankenversicherung sinnvoll (10-30 € pro Reise). Achte auf: Notfall-Behandlung, Operation, Rücktransport, Deckung im Reiseland." },
      { question: "Sollte ich meinen Hund vor der Reise sedieren?", answer: "Nein, niemals ohne Tierarzt-Absprache. Sedierung kann zu Atemstillstand oder Kreislaufproblemen führen, besonders im Flugzeug. Stattdessen: Adaptil-Spray oder -Halsband (beruhigender Pheromon-Duft), gewohnte Decke, viel Auslauf vor Reisebeginn. Bei extrem ängstlichen Hunden: Mit dem Tierarzt sanftere Optionen besprechen." },
      { question: "Was kostet ein Urlaub mit Hund extra?", answer: "Realistisch 200-500 € extra pro Reise: Hotel-Aufpreis (5-25 €/Nacht = 35-175 €), Tierarzt vor Reise (20-40 €), Wurmkur/Reise-Apotheke (30 €), Zubehör (50 €), bei Flug extra Gebühren (100-400 €). Auto-Reise im EU-Raum ist günstiger als Flug." },
    ],
    relatedSlugs: ["reisen-mit-kleinkindern", "reiseapotheke-checkliste", "fernreise-tipps"],
  },

  {
    slug: "trinkgeld-im-urlaub",
    title: "Trinkgeld im Urlaub – Was ist wo üblich?",
    seoTitle: "Trinkgeld im Urlaub – Übersicht für jedes Land",
    seoDescription: "Trinkgeld im Ausland: Wie viel ist wo üblich? USA, Türkei, Italien, Thailand – komplette Übersicht ohne peinliche Momente.",
    lead: "Trinkgeld ist eine kulturelle Sache – und kann im Urlaub für Verwirrung sorgen. Hier ist die ehrliche Übersicht für die wichtigsten Reiseländer.",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80&auto=format&fit=crop",
    category: "Verpflegung",
    readingTimeMin: 5,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Warum Trinkgeld so unterschiedlich ist", body: "In manchen Ländern ist Trinkgeld Teil des Lohns, in anderen eine Höflichkeit. In den USA wird die Bedienung praktisch ausschließlich vom Trinkgeld bezahlt – nicht zu zahlen ist eine Beleidigung. In Japan dagegen ist Trinkgeld unhöflich – Service gehört zum Preis. Es lohnt sich, die lokale Sitte vor der Reise zu kennen." },
      { heading: "Europa – die wichtigsten Länder", body: "Deutschland, Österreich, Schweiz: 5-10% bei zufriedenstellendem Service. Aufrunden ist üblich. Italien: 'Coperto' (1-3 € pro Person Gedeckpreis) ist meist im Preis. Trinkgeld 5-10% optional. Frankreich: 'Service compris' im Preis. 5% extra ist nett, aber nicht erwartet. Spanien: 5-10% bei guter Bedienung. Im Tapas-Lokal 1-2 € reichen. Portugal: ähnlich Spanien." },
      { heading: "USA – das Trinkgeld-Land", body: "Restaurants: 18-25% Pflicht (in vielen Bundesstaaten verdient Personal nur 2-3 USD/Stunde Grundlohn). Bar: 1-2 USD pro Drink. Taxi: 15-20%. Hotel-Concierge: 5-20 USD. Hotel-Housekeeping: 2-5 USD pro Tag. Friseur: 15-20%. Manche Restaurants berechnen Trinkgeld bei Gruppen automatisch (20-22%). Trinkgeld nicht zu zahlen wird als grobe Beleidigung empfunden." },
      { heading: "Türkei, Ägypten, Marokko", body: "Türkei: 5-10% in Restaurants (außer in All Inclusive-Hotels). 1-2 € pro Service-Mitarbeiter im Hotel ist üblich. Trinkgeld in Lira oder Euro akzeptiert. Ägypten: Trinkgeld ('Baksheesh') ist Lebensgrundlage – auch für kleine Dienstleistungen (Toilette, Hotel-Boy, Reiseleiter). 5-15% in Restaurants, 1-5 USD für persönliche Dienstleistungen. Marokko: 10% in Restaurants, 1-2 € für kleine Dienste." },
      { heading: "Asien – sehr unterschiedlich", body: "Thailand: Trinkgeld nicht traditionell, aber in Touristengebieten erwartet. 10% in Restaurants, kleine Beträge für Massagen (50-100 Baht). Vietnam: Ähnlich Thailand. Bali/Indonesien: 5-10% in Restaurants, wenig Trinkgeld bei Roller-Taxi. Japan: KEIN Trinkgeld – wird oft als Beleidigung empfunden. Service ist Stolz, kein Bittgeld. Singapur/Hongkong: Service-Charge schon im Preis, kein Trinkgeld nötig." },
      { heading: "Die häufigsten Fehler", body: "1. Zu viel in Niedriglohnländern: 100 USD Trinkgeld in Vietnam (wo das ein Wochenlohn ist) wirkt aufdringlich. 2. Zu wenig in den USA: Unter 15% gilt als Beleidigung. 3. Bargeld vs. Karte: In den USA Trinkgeld auf der Karte (man trägt die Summe selbst ein), in Europa und Asien meist Bargeld besser – kommt direkt beim Personal an. 4. Vergessen, Wechselgeld zurückzubekommen: In Italien etc. solltest du das Wechselgeld nicht 'einfach behalten lassen' – du wirst übers Ohr gehauen." },
    ],
    faqs: [
      { question: "Ist Trinkgeld im 'All Inclusive' nicht inklusive?", answer: "Service ist im Preis, aber Trinkgeld an einzelne Mitarbeiter ist trotzdem üblich und gerne gesehen. In der Türkei etwa: 1-2 € pro Mitarbeiter pro Tag, oder 10-20 € in der Mitte des Aufenthalts an die wichtigsten (Bar, Animateure, Kellner). In sehr günstigen Resorts ist das Trinkgeld oft ein wichtiger Teil des Lohns." },
      { question: "Soll ich in der Heimatwährung oder lokal Trinkgeld geben?", answer: "Lokale Währung ist immer besser – das Personal kann sie sofort nutzen. Euro wird in vielen Ländern akzeptiert (Türkei, Ägypten, Bulgarien), aber zu schlechteren Kursen. USD wird weltweit akzeptiert, aber das Personal muss es erst tauschen." },
      { question: "Gibt's Länder, wo Trinkgeld unhöflich ist?", answer: "Ja: Japan (sehr strikt), Südkorea (eher unüblich), Schweiz (nicht erwartet, nur aufrunden), Singapur (Service-Charge schon im Preis), Australien (kein Trinkgeld nötig, außer Top-Restaurants). In diesen Ländern keinesfalls Trinkgeld erzwingen – es ist peinlich für beide Seiten." },
      { question: "Was tun, wenn ich kein Bargeld habe?", answer: "Hebe vor jeder Reise etwas lokale Währung ab (am Geldautomaten am Flughafen) oder trage einen kleinen Notgroschen (10-20 €) für Trinkgelder. In den USA: Trinkgeld auf der Kreditkarte ist Standard. In Bali/Vietnam: Wechselstuben am Flughafen sind günstiger als Hotel-Wechsel." },
    ],
    relatedSlugs: ["all-inclusive-oder-nicht", "fernreise-tipps", "versteckte-reisekosten"],
  },

  {
    slug: "reiseziele-fuer-jede-jahreszeit",
    title: "Wo ist es wann am schönsten? – Reiseziele für jede Jahreszeit",
    seoTitle: "Reiseziele nach Jahreszeit – Wann wohin reisen?",
    seoDescription: "Welches Reiseziel ist wann am schönsten? Saisonaler Guide für Frühling, Sommer, Herbst und Winter – mit konkreten Empfehlungen.",
    lead: "Die beste Reisezeit ist der Schlüssel zum perfekten Urlaub. Diese Übersicht hilft dir, Wetter, Preise und Erlebnis perfekt zu kombinieren.",
    heroImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80&auto=format&fit=crop",
    category: "Trends",
    readingTimeMin: 7,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Frühling (März-Mai) – Aufblühen und Mildes Klima", body: "Top-Ziele: Mittelmeer-Inseln (Mallorca, Kreta, Zypern – warm, nicht überfüllt), Andalusien (Sevilla, Cordoba – Orangenblüte), Japan (Kirschblüte Ende März/April), Niederlande (Tulpenfelder Keukenhof), Türkei (Frühling auf der Riviera), Marokko (angenehme Temperaturen vor Sommerhitze). Vorteile: Niedrige Preise, weniger Touristen, mildes Wetter. Nachteile: Wassertemperaturen oft noch kühl." },
      { heading: "Sommer (Juni-August) – Hauptsaison", body: "Top-Ziele: Skandinavien (Norwegen, Schweden – Mitternachtssonne), Schottland (mild, lang), Alpenländer (Wandern), Mittelmeer (für Strand-Liebhaber), Polen Ostsee, Baltikum. Vermeiden: Mittelmeer im Süden (Türkei, Andalusien, Griechenland) wenn Hitze unangenehm – oft 35+ °C. Vorteile: Lange Tage, perfektes Strandwetter, viele Festivals. Nachteile: Höchste Preise, Touristenmassen." },
      { heading: "Herbst (September-November) – Geheimsaison", body: "Top-Ziele: Mittelmeer (immer noch warm, viel günstiger), Toskana (Weinlese, mildes Wetter), New England (Indian Summer mit bunten Blättern), Neuseeland (Frühling), Japan (Herbstlaub), Marokko (angenehme Temperaturen wieder), Spanien (San Sebastian, La Rioja – Wein). Vorteile: Top-Wetter, halbe Preise, leere Strände. Nachteile: Mancherorts mehr Regen." },
      { heading: "Winter (Dezember-Februar) – Wintersonne oder Schnee", body: "Top-Ziele für Wintersonne: Kanaren (ganzjährig warm), Ägypten (Hurghada, Sharm), Dubai, Thailand, Karibik, Mexiko, Vietnam, Madeira. Top-Ziele für Schnee: Alpen (Österreich, Schweiz, Italien, Frankreich), Lappland (Polarlichter), Quebec (Eis-Hotel). Vorteile: Wintersonne als Urlaubs-Highlight, Skifahren, Polarlichter. Nachteile: Höchste Preise zu Weihnachten/Silvester." },
      { heading: "Die unterschätzten Übergangs-Wochen", body: "Mai (vor Pfingsten): Mittelmeer ist warm, aber die Familien-Massen kommen erst zu Pfingsten. Mitte September: Schulferien sind vorbei, Wetter noch wie im August, Preise fallen um 30-50%. Ende Oktober: Letzte Möglichkeit für Mittelmeer-Bade-Urlaub, sehr günstig. Zweite Januar-Hälfte: Nach Neujahr ist alles frei, Schnee ist ideal, Hotels günstig." },
      { heading: "Wettertipps für Fernreisen", body: "Asien: Trockenzeit ist meist Nov-April, Regenzeit Mai-Oktober. Karibik: Trockenzeit Dez-April, Hurrikan-Saison Juni-November. Australien/Neuseeland: Sommer ist Dezember-Februar (umgekehrt zur EU). Südamerika: Vielfältig – Brasilien Sommer Dez-März, Patagonien Sommer Nov-März, Peru Trockenzeit Mai-Sept. Afrika: Safari-Saison meist Mai-Oktober (Trockenzeit, beste Wildlife-Beobachtung)." },
    ],
    faqs: [
      { question: "Wann ist die günstigste Zeit für eine Mallorca-Reise?", answer: "April und Oktober sind die billigsten Monate (außerhalb der Osterferien). Pauschalreisen ab 350-450 €. Mai und September sind nur etwas teurer (450-600 €), bieten aber bereits warmes Badewetter. August ist mit 800-1.200 € deutlich am teuersten." },
      { question: "Welche Reiseziele sind im Winter besonders beliebt?", answer: "Bei deutschen Reisenden: Kanaren (Teneriffa, Gran Canaria, Fuerteventura) für Sonne, Österreich (Tirol, Salzburg) für Skifahren, Bayern (Garmisch, Berchtesgaden) für Wellness, Dubai für Sonne und Shopping, Thailand für Fernreise, Ägypten für günstige Sonne." },
      { question: "Wann reisen die meisten Deutschen?", answer: "Hauptreisesaison: Juli und August (Schulferien). Pfingsten ist die intensivste 'kurze' Reisewoche. Winterurlaub im Februar (Faschingsferien). Herbstferien Oktober. Wer flexibel ist und außerhalb dieser Zeiten reist, spart 30-60% und hat viel weniger Trubel." },
      { question: "Lohnt sich ein Wochenendtrip im Winter?", answer: "Ja, gerade im Winter sind Städtereisen perfekt: Wien Weihnachtsmarkt, Prag, Krakau, Budapest – alle wunderschön mit Schnee und festlich beleuchtet. Flüge günstig (Donnerstag-Sonntag oft 50-100 €), Hotels günstiger als im Sommer." },
    ],
    relatedSlugs: ["wie-frueh-urlaub-buchen", "wann-last-minute-buchen", "fernreise-tipps"],
  },

  {
    slug: "mit-eltern-reisen",
    title: "Reisen mit den Eltern – So wird es entspannt",
    seoTitle: "Reisen mit Eltern – Tipps für entspannte Familienreisen",
    seoDescription: "Reisen mit den Eltern (oder Senioren) ohne Stress: Praktische Tipps zu Reiseziel, Hotel, Aktivitäten und Konflikte vermeiden.",
    lead: "Mit den eigenen Eltern verreisen kann wundervoll sein – oder anstrengend. Mit den richtigen Entscheidungen wird es ein Highlight. Unser ehrlicher Guide.",
    heroImage: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1600&q=80&auto=format&fit=crop",
    category: "Familie",
    readingTimeMin: 7,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Die richtigen Erwartungen setzen", body: "Bevor du buchst: Sprich mit deinen Eltern offen über Erwartungen. Was wollen sie erleben? Wie viel Aktivität schaffen sie? Wie wichtig ist Kultur, wie wichtig Erholung? Oft haben Eltern andere Vorstellungen als du – lieber im Vorfeld klären als im Urlaub streiten. Tipp: Macht eine Wunschliste, vergleicht und findet einen Kompromiss." },
      { heading: "Mobilität & Gesundheit beachten", body: "Wichtige Fragen: Können deine Eltern lange Strecken laufen? Können sie Treppen steigen? Brauchen sie Rollator, Stock, Rollstuhl? Habt ihr Medikamente dabei (genug für die ganze Reise + 3 Tage Reserve)? Auslandskrankenversicherung mit Senioren-Tarif. Tipp: Wähle ein Hotel mit Aufzug, ohne lange Wege zum Strand/Pool, mit Behinderten-freundlichen Zimmern." },
      { heading: "Reiseziele für Senioren-Reisen", body: "Top-Ziele: Mittelmeer-Inseln im Frühling/Herbst (mild, nicht zu heiß), Mallorca (kurzer Flug, gute Infrastruktur, deutsche Sprache überall), Italien Toskana (Kultur + Genuss), Madeira (Wandern für die Fitten), Wellness-Hotels in Österreich/Südtirol, Donau-Kreuzfahrten (komfortabel, viele Sehenswürdigkeiten), Andalusien (Sevilla, Granada). Vermeide: Trekking-Reisen, Backpacking, sehr heiße Länder im Sommer, Fernreisen mit langen Flügen für gesundheitlich Eingeschränkte." },
      { heading: "Der ideale Tagesablauf", body: "Statt 10-Stunden-Sightseeing-Marathons: Morgens eine Aktivität (1-2 Stunden), dann Pause/Mittagessen, dann Ruhepause oder leichte Aktivität, abends ein gemeinsames Essen. Plane Pufferzeit für Pausen und Toiletten. Ältere Menschen brauchen oft mehr Schlaf – respektiere das. Tipp: Eltern entscheiden zur Hälfte das Programm, du zur anderen Hälfte." },
      { heading: "Konflikte vermeiden", body: "Häufige Konfliktthemen: Tempo (du gehst zu schnell), Essenszeiten (sie sind hungrig zu anderen Zeiten), Geld (wer zahlt was?), Privatsphäre (wann brauchst du Pause für dich?). Tipp: Sprecht offen darüber. Plant vor der Reise: Geld-Pool für gemeinsame Ausgaben, Pausen-Zeit eingebaut, jeder hat 1-2 Stunden für sich. Bei Konflikten: Tief durchatmen, nicht persönlich nehmen." },
      { heading: "Pauschalreise oder Individual?", body: "Pauschalreise ist oft ideal: Klare Struktur, alles organisiert, Stress reduziert. Studiosus, Wikinger Reisen und Hauser Exkursionen haben spezielle Senioren-Reisen mit moderater Aktivität. Individual reise ist möglich, braucht aber mehr Energie zum Planen. Bei Senioren: Lieber 1-2 Reiseziele tief erkunden statt viele oberflächlich abhaken." },
    ],
    faqs: [
      { question: "Was tun, wenn meine Eltern reisemüde werden?", answer: "Pause! Geht zurück ins Hotel, ruht euch aus, esst was Leichtes, vielleicht ein Mittagsschlaf. Plane immer Pufferzeit ein. Statt sich zu zwingen, weiterzumachen, ist es besser, am nächsten Tag erholt zu sein. Tipp: Plane einen 'Faulenzer-Tag' nach 2-3 aktiven Tagen ein." },
      { question: "Welche Versicherungen sind für Senioren wichtig?", answer: "Auslandskrankenversicherung mit Senioren-Tarif (manche Versicherungen haben Altersgrenzen!), Reiserücktrittsversicherung (vor allem bei chronischen Krankheiten wichtig), Reiseabbruchversicherung. Bei Vorerkrankungen: Auslandskrankenschutz mit 'Vorerkrankungs-Klausel' wählen – sonst greift sie bei der typischen Krankheit nicht." },
      { question: "Soll ich für meine Eltern alles buchen?", answer: "Ja, meist eine gute Idee. Senioren sind oft mit modernen Buchungsportalen überfordert. Du als Junger kannst Vergleichen, beste Deals finden, Reiseapotheke organisieren. Aber: Nicht alle Entscheidungen ohne Rücksprache treffen – hole dein Eltern in den Entscheidungsprozess ein." },
      { question: "Wie viel Aktivität ist für Senioren zumutbar?", answer: "Sehr individuell. Faustregel: Sehr fitte Senioren (60-70 Jahre, regelmäßig aktiv) können fast jedes Programm mitmachen. Durchschnittlich Fitte (70+): Maximal 4-5 Stunden Aktivität pro Tag, Pausen einbauen. Eingeschränkt Mobile (mit Stock/Rollator): Pauschalreise mit Hotel-Ausflügen, kein Tempo." },
    ],
    relatedSlugs: ["reisen-mit-kleinkindern", "reiseversicherung-sinnvoll", "all-inclusive-oder-nicht"],
  },

  {
    slug: "fotografieren-im-urlaub",
    title: "Fotografieren im Urlaub – Vom Smartphone zur Profi-Kamera",
    seoTitle: "Reisefotografie Tipps – Bessere Fotos im Urlaub",
    seoDescription: "Bessere Urlaubsfotos: Tipps für Smartphone und Kamera, beste Tageszeiten, Komposition und ehrliche Tipps gegen Touristen-Fotos.",
    lead: "Jeder will tolle Urlaubsfotos. Aber wie kommt man von Schnappschüssen zu Bildern, die wirklich begeistern? Unser Praxis-Guide.",
    heroImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1600&q=80&auto=format&fit=crop",
    category: "Trends",
    readingTimeMin: 6,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Smartphone reicht für 90% der Fotos", body: "Moderne Smartphones (iPhone 12+, Samsung S20+, Pixel 6+) machen unglaublich gute Fotos. Du brauchst keine 1500 € Spiegelreflex für tolle Urlaubsfotos. Vorteile: Immer dabei, schnell einsatzbereit, leichter, gute Bildqualität, automatische HDR und Nachtmodus. Kamera lohnt sich nur, wenn du wirklich tief ins Foto-Hobby einsteigst oder spezifische Bedürfnisse hast (Wildlife, Sport)." },
      { heading: "Die wichtigsten Komposition-Tricks", body: "1. Rule of Thirds: Stelle dein Hauptmotiv auf die Drittel-Linien (nicht in die Mitte). Aktiviere das Raster in den Kamera-Einstellungen. 2. Vordergrund einbeziehen: Ein interessanter Vordergrund (Felsen, Blumen, Personen) macht das Bild dreidimensional. 3. Symmetrie nutzen: Spiegelungen in Wasser, symmetrische Gebäude. 4. Linien führen den Blick: Straßen, Stege, Reihen führen den Blick ins Bild. 5. Weniger ist mehr: Eine klare Aussage statt 'alles drin'." },
      { heading: "Die goldene Stunde nutzen", body: "Die besten Fotos entstehen 1 Stunde nach Sonnenaufgang und 1 Stunde vor Sonnenuntergang ('Golden Hour'). Das Licht ist warm, weich und schmeichelt jedem Motiv. Mittagslicht (11-15 Uhr) ist hart, kontrastreich und unvorteilhaft. Apps wie 'PhotoPills' oder 'GoldenHour.one' zeigen exakte Zeiten für deinen Standort. Plan deine wichtigsten Foto-Spots für Morgen oder Abend." },
      { heading: "Personen ins Bild – aber wie?", body: "Pure Landschaftsfotos werden schnell langweilig. Ein Mensch im Bild gibt Kontext und Maßstab. Tipps: Kein Posen-Lächeln in die Kamera (wirkt steif). Lass die Person etwas tun (gehen, schauen, sitzen). Zeige sie von der Seite oder von hinten – mysteriös und hochwertiger. Verstecke das Gesicht teilweise (Hut, Sonnenbrille, Haare). Die Person sollte etwa 1/4 des Bildes ausmachen, nicht die ganze Hälfte." },
      { heading: "Häufige Anfänger-Fehler", body: "1. Alles fotografieren wollen: Lieber 10 gute Bilder als 200 mittelmäßige. 2. Nur in Hochformat: Querformat ist oft besser für Landschaft. 3. Im Auto-Modus bleiben: Nutze Belichtungskorrektur (+/- bei Smartphone möglich) bei zu hellen oder dunklen Szenen. 4. Mit Blitz in der Nacht: Macht meist hässliche Fotos. Ohne Blitz und mit höheren ISO experimentieren. 5. Filter übertreiben: Dezent ist immer besser." },
      { heading: "Foto-Backup im Urlaub", body: "Wichtig: Sichere deine Fotos täglich! Plus-Tipp: Du verlierst dein Handy oder es geht kaputt – ohne Backup sind die Fotos weg. Lösungen: iCloud / Google Photos automatisches Backup über WLAN, externe Festplatte mit OTG-Adapter, Cloud-Service wie Dropbox. Bei wichtigen Reisen: Speichere wichtige Fotos zusätzlich in einer 2. Cloud (z. B. Dropbox + Google Photos)." },
    ],
    faqs: [
      { question: "Welches Smartphone ist am besten für Fotos?", answer: "iPhone 14/15 Pro (sehr gute Computational Photography), Samsung Galaxy S23/S24 Ultra (große Sensoren, Zoom), Google Pixel 8 Pro (KI-basierte Bildverarbeitung, oft beste Nacht-Fotos). Alle drei machen exzellente Fotos – die Unterschiede sind im Alltag minimal." },
      { question: "Brauche ich eine extra Reise-Kamera?", answer: "Nein, in 90% der Fälle. Wann sich eine Kamera lohnt: Wildlife/Vögel (Telezoom), Sport in Bewegung (schneller Autofokus), professionelle Reportage. Empfehlung für Foto-Enthusiasten: Sony Alpha 6700 oder Canon R10 mit 18-150 mm Objektiv – kompakt, vielseitig, gute Qualität." },
      { question: "Wie umgehe ich Touristen-Fotos?", answer: "Steh früh auf (vor 8 Uhr ist alles leer), wähle ungewöhnliche Perspektiven (von unten, durch Objekte), suche unbekannte Spots in der Region (Google Maps + 'best photo spot near X'), warte auf den richtigen Moment (Geduld zahlt sich aus). Die berühmten Spots sind oft schon zu Tausenden Malen fotografiert – gehe ein paar Schritte weiter." },
      { question: "Soll ich meine Fotos im Urlaub bearbeiten?", answer: "Leichtes Editing ja: Helligkeit, Kontrast, Sättigung anpassen. Apps: VSCO, Lightroom Mobile, Snapseed (alle kostenfrei). Vermeide: Filter mit extremem Look, übertriebene HDR, künstliche Farben. Ein gutes Bild braucht 30 Sekunden Bearbeitung, kein 30-Minuten-Manipulationen." },
    ],
    relatedSlugs: ["alleinreisen-tipps", "reisetrends-2026", "kofferchaos-vermeiden"],
  },

  {
    slug: "hotelbewertungen-richtig-lesen",
    title: "Hotelbewertungen richtig lesen – Marketing vs. Realität",
    seoTitle: "Hotelbewertungen richtig lesen – Tipps gegen Fake-Reviews",
    seoDescription: "Hotelbewertungen verstehen: Wie du Marketing-Sprech, Fake-Reviews und übertriebene Klagen erkennst und das richtige Hotel findest.",
    lead: "5-Sterne-Bewertungen sehen alle gleich aus. Aber welche sind echt? Wie unterscheidest du Marketing von Realität? Unser Praxis-Guide.",
    heroImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=80&auto=format&fit=crop",
    category: "Buchung",
    readingTimeMin: 6,
    updatedAt: "2026-04-10",
    sections: [
      { heading: "Die wichtigsten Bewertungsportale", body: "Holidaycheck (deutscher Marktführer für Pauschalreisen, vielfach geprüfte Reviews), TripAdvisor (international, sehr breit), Booking.com (nur verifizierte Gäste, daher meist seriös), Trustpilot (für Veranstalter, weniger für Hotels), Google Bewertungen (gemischte Qualität). Faustregel: Lese mindestens 2-3 verschiedene Plattformen, um ein realistisches Bild zu bekommen." },
      { heading: "Wie viele Bewertungen sind aussagekräftig?", body: "Unter 30 Bewertungen: Vorsicht, nicht aussagekräftig. 30-100 Bewertungen: Ein guter Anhaltspunkt. 100-500: Verlässliche Tendenzen. 500+: Sehr verlässlich, kaum Manipulationsmöglichkeit. Wichtig: Schau auch das Datum an – Bewertungen, die älter als 12 Monate sind, geben kein aktuelles Bild (Renovierung, Personalwechsel, Eigentümerwechsel)." },
      { heading: "Fake-Reviews erkennen", body: "Warnzeichen: Mehrere euphorische 5-Sterne-Reviews am gleichen Tag, sehr generische Beschreibungen ('Tolles Hotel, schöner Pool, gutes Essen'), keine konkreten Details, perfekt geschriebenes Deutsch ohne Tippfehler (oder umgekehrt: schlechtes Deutsch mit Standardphrasen), Reviewer hat nur 1-2 Bewertungen insgesamt, alle gleich strahlend. Echte Reviews haben oft Highlights UND Kleine Kritiken – das ist menschlich." },
      { heading: "Negative Bewertungen richtig interpretieren", body: "Nicht jede 1-Stern-Bewertung ist berechtigt. Häufige Fälle: 'Wir haben den Zimmerwechsel verlangt, weil das Hotel Direktansicht zur Straße hatte – wurde abgelehnt' (möglicherweise unrealistische Erwartungen). 'Die Klimaanlage war kaputt für 2 Tage' (unangenehm, aber kein Hotel-Killer). 'Das Buffet war geschlossen 30 Minuten vor offizieller Schließung' (kleinere Probleme passieren). Achte auf Muster: Mehrere unabhängige Klagen über das gleiche Problem = ernst." },
      { heading: "Was wirklich relevant ist", body: "Wichtige Bewertungs-Aspekte: Sauberkeit (für die meisten Gäste das Wichtigste), Lage (Strand, Stadt, Verkehr), Personal (freundlich, hilfsbereit, kompetent), Essen (Vielfalt, Qualität, Frische), Wert für den Preis. Weniger relevant: Persönliche Vorlieben (jemand mochte das Frühstück nicht), einmalige Ereignisse (Heizung kaputt für 1 Tag), Kleinigkeiten (Lichtschalter im falschen Raum)." },
      { heading: "Filter clever nutzen", body: "Holidaycheck und Booking.com erlauben Filter: Reisedatum (nur Reviews der letzten 6 Monate), Reisetyp (Familie, Paare, Solo), Geschäftsreise vs. Urlaub, Aufenthaltsdauer. Filter nach DEINEM Reisetyp – eine 5-Sterne-Bewertung von einer Senioren-Gruppe sagt wenig über Familienurlaub mit Kindern. Tipp: Sortiere nach 'Negative zuerst' – dann siehst du, was potenziell problematisch ist." },
    ],
    faqs: [
      { question: "Welches Bewertungsportal ist am vertrauenswürdigsten?", answer: "Booking.com hat den Vorteil, dass nur Gäste bewerten dürfen, die nachweislich dort übernachtet haben – das macht Fake-Reviews schwer. Holidaycheck ist sehr genau für deutsche Pauschalreisen mit detaillierten Einzelaspekten. TripAdvisor ist international am breitesten, aber anfälliger für Manipulation." },
      { question: "Wie wichtig ist die Bewertungs-Anzahl?", answer: "Sehr wichtig. Ein Hotel mit 4.8 Sternen aus 50 Reviews ist weniger verlässlich als 4.3 Sterne aus 2.000 Reviews. Mehr Bewertungen = robustere Aussage. Empfehlung: Bei großen Hotels mindestens 200 Reviews, bei kleinen Boutique-Hotels mindestens 50." },
      { question: "Was bedeutet die Empfehlungsrate (z. B. 88% Empfehlung)?", answer: "Das ist der Anteil der Gäste, die das Hotel weiterempfehlen würden. Über 85%: Sehr gut. 75-85%: Gut. 65-75%: Akzeptabel mit Vorbehalten. Unter 65%: Problematisch. Tipp: Suche bei Pauschalreisen nach Hotels mit mindestens 80% Empfehlungsrate." },
      { question: "Soll ich mich auf neueste oder beliebteste Reviews konzentrieren?", answer: "Beides ist wichtig. Neueste: Aktueller Stand (Renovierungen, neuer Manager, COVID-Anpassungen). Beliebteste/Hilfreichste: Die ausgewogensten und detailliertesten – meist die wichtigsten. Ich empfehle: Lies erst die 5 hilfreichsten, dann die 3 neuesten, dann die 3 schlechtesten – das gibt dir den vollständigen Überblick in 10 Minuten." },
    ],
    relatedSlugs: ["pauschalreise-vs-einzelbuchung", "all-inclusive-oder-nicht", "wie-frueh-urlaub-buchen"],
  },
];

export function getRatgeberArticle(slug: string): RatgeberArticle | undefined {
  return RATGEBER_ARTICLES.find((a) => a.slug === slug);
}
