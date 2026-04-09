import type { FaqItem } from "@/components/ui/faq-section";

export const pageFaqs: Record<string, FaqItem[]> = {
  "/guenstig-urlaub-buchen": [
    {
      question: "Wie finde ich den günstigsten Urlaub?",
      answer:
        "Den günstigsten Urlaub findest du durch einen Preisvergleich auf urlaubfinder365.de. Wir aggregieren Angebote von über 50 Reiseanbietern in Echtzeit. Flexibilität bei Reisedatum und Abflughafen spart oft 20–40 % – besonders Mittwoche und Donnerstage sind günstige Abflugtage.",
    },
    {
      question: "Wann ist die beste Zeit, um günstig Urlaub zu buchen?",
      answer:
        "Pauschalreisen in beliebte Sonnendestinationen wie Türkei, Griechenland oder Spanien sind am günstigsten, wenn du 4–6 Wochen vor Reisebeginn buchst (Last Minute) oder sehr früh, also 10–12 Monate im Voraus (Early Bird). Unsere Preisverlauf-Charts zeigen dir den historischen Preistrend je Ziel.",
    },
    {
      question: "Was ist der Unterschied zwischen Pauschalreise und Einzelbuchung?",
      answer:
        "Bei einer Pauschalreise buchst du Flug, Hotel und oft Transfer als Komplettpaket zu einem Gesamtpreis – mit gesetzlichem Reiseschutz nach EU-Pauschalreiserichtlinie. Bei der Einzelbuchung kombinierst du selbst, was mehr Flexibilität bietet, aber höhere Eigenverantwortung und oft mehr Gesamtkosten bedeutet.",
    },
    {
      question: "Welche Reiseziele sind besonders günstig?",
      answer:
        "Zu den günstigsten Urlaubszielen für deutsche Reisende zählen aktuell Bulgarien (Sonnenstrand), Türkei (Antalya, Side), Ägypten (Hurghada, Sharm el-Sheikh) und Tunesien. Auch Albanien und Portugal sind im Preis-Leistungs-Verhältnis sehr attraktiv.",
    },
    {
      question: "Gibt es versteckte Kosten beim günstigen Urlaub buchen?",
      answer:
        "Ja – achte auf Gepäckgebühren, Sitzplatzreservierung, Resort-Gebühren vor Ort und Kreditkartenaufschläge. Auf urlaubfinder365.de zeigen wir dir den Endpreis inklusive aller Gebühren, damit du wirklich günstige Angebote erkennst.",
    },
  ],

  "/last-minute": [
    {
      question: "Was versteht man unter Last-Minute-Urlaub?",
      answer:
        "Last-Minute-Urlaub bezeichnet Reiseangebote, die wenige Tage bis maximal 4 Wochen vor Abreise zu stark reduzierten Preisen angeboten werden. Reiseveranstalter verkaufen unverkaufte Kapazitäten in Hotels und Flugzeugen günstig, um Leerkosten zu vermeiden.",
    },
    {
      question: "Wie viel kann man mit Last Minute sparen?",
      answer:
        "Mit Last-Minute-Deals sparst du typischerweise 20–50 % gegenüber dem ursprünglichen Preis. In Extremfällen – besonders bei All-Inclusive-Türkei oder Ägypten – sind Rabatte von bis zu 60 % möglich. Die besten Deals erscheinen oft dienstags und mittwochs.",
    },
    {
      question: "Welche Last-Minute-Ziele sind aktuell besonders beliebt?",
      answer:
        "Zu den beliebtesten Last-Minute-Zielen zählen Mallorca, Antalya, Rhodos, Kreta, Hurghada und die Kanaren. Diese Ziele haben besonders viele Flugverbindungen und Hotelangebote, was die Chance auf günstige Restkontingente erhöht.",
    },
    {
      question: "Für wen eignet sich Last-Minute-Urlaub besonders?",
      answer:
        "Last Minute ist ideal für Singles, Paare und Freundesgruppen, die spontan verreisen können. Familien mit schulpflichtigen Kindern haben weniger Flexibilität. Wichtig: Reisepass und ggf. Visum sollten immer aktuell sein, damit du sofort losreisen kannst.",
    },
    {
      question: "Wie funktioniert ein Last-Minute-Preisalarm?",
      answer:
        "Mit unserem Preisalarm auf urlaubfinder365.de legst du Wunschziel, Budget und Reisezeitraum fest. Sobald ein passendes Last-Minute-Angebot erscheint, erhältst du eine Push-Benachrichtigung oder E-Mail – so verpasst du keine Schnäppchen.",
    },
  ],

  "/hotelsuche": [
    {
      question: "Wie finde ich das beste Hotel für meinen Urlaub?",
      answer:
        "Das beste Hotel findest du durch den Vergleich von Preis, Lage, Bewertungen und Ausstattung. Auf urlaubfinder365.de kannst du nach Sternekategorie, Verpflegungsart (z. B. All Inclusive), Entfernung zum Strand und Bewertungsscore filtern.",
    },
    {
      question: "Was bedeuten die Hotelkategorien 3, 4 und 5 Sterne?",
      answer:
        "Die Sternekategorie gibt den Ausstattungsstandard an: 3-Sterne-Hotels bieten solide Grundausstattung, 4 Sterne stehen für gehobenen Komfort mit Restaurant und oft Spa, 5 Sterne bedeuten Luxus mit erstklassigem Service, Suite-Optionen und exklusiver Gastronomie.",
    },
    {
      question: "Ist es günstiger, das Hotel direkt oder über ein Portal zu buchen?",
      answer:
        "Portale wie urlaubfinder365.de bieten oft günstigere Konditionen durch Volumenrabatte und exklusive Deals. Hotels bieten manchmal bei Direktbuchung kleine Extras wie Frühstück oder spätes Auschecken. Ein Preisvergleich lohnt sich in jedem Fall.",
    },
    {
      question: "Was ist der Unterschied zwischen All Inclusive und Halbpension?",
      answer:
        "Bei All Inclusive sind alle Mahlzeiten, Getränke (auch Alkohol) und oft Freizeitangebote im Preis inbegriffen. Halbpension umfasst nur Frühstück und Abendessen. All Inclusive lohnt sich besonders an Strandresorts, wo man kaum das Hotel verlässt.",
    },
    {
      question: "Wie sicher sind Hotelbewertungen in Portalen?",
      answer:
        "Auf urlaubfinder365.de zeigen wir verifizierte Bewertungen von echten Reisenden. Lies immer mehrere aktuelle Bewertungen und achte auf wiederkehrende Themen. Einzelne Extrembewertungen (sehr positiv oder sehr negativ) sind oft weniger repräsentativ als der Gesamtdurchschnitt.",
    },
  ],

  "/flugsuche": [
    {
      question: "Wie finde ich günstige Flüge?",
      answer:
        "Günstige Flüge findest du durch Preisvergleich, Flexibilität beim Reisedatum und die Nutzung von Preiswarnungen. Fliegen unter der Woche (dienstags, mittwochs) ist oft günstiger als am Wochenende. Auch Abflüge am frühen Morgen oder späten Abend sind häufig preiswerter.",
    },
    {
      question: "Wann sollte man Flüge am besten buchen?",
      answer:
        "Für Kurzstreckenflüge innerhalb Europas gilt: 4–8 Wochen vor Abflug. Für Langstrecken nach Asien, Amerika oder Afrika buche 3–6 Monate im Voraus. Last-Minute-Flüge können günstig sein, sind aber riskant, wenn du einen bestimmten Termin brauchst.",
    },
    {
      question: "Was ist der Unterschied zwischen Direktflug und Nonstop-Flug?",
      answer:
        "Nonstop bedeutet: keine Zwischenlandung. Direktflug kann trotzdem eine Zwischenlandung haben (ohne Umsteigen). Nonstop ist immer die schnellste Option. Bei Umsteigeverbindungen solltest du mindestens 90 Minuten Umsteigezeit einplanen.",
    },
    {
      question: "Was sind versteckte Kosten bei Billigfliegern?",
      answer:
        "Billigflieger wie Ryanair, easyJet oder Wizz Air berechnen oft extra für: aufgegebenes Gepäck, Handgepäck über Normgröße, Sitzplatzreservierung und Kreditkartenzahlung. Vergleiche immer den Endpreis inklusive aller Extras, bevor du buchst.",
    },
    {
      question: "Lohnen sich Business Class Upgrades?",
      answer:
        "Für Langstreckenflüge über 7 Stunden kann ein Business-Class-Upgrade den Komfort erheblich steigern – besonders mit Liegesitzen und besserem Service. Achte auf Last-Minute-Upgrade-Angebote direkt am Gate oder via App, die oft 40–60 % günstiger sind als bei Buchung.",
    },
  ],

  "/kreuzfahrten": [
    {
      question: "Was ist bei einer Kreuzfahrt alles inklusive?",
      answer:
        "Der Umfang variiert je nach Reederei und Tarif. Standard-Kreuzfahrten beinhalten Kabine, alle Mahlzeiten im Hauptrestaurant, Unterhaltungsprogramm und Landgang-Transfers. Getränke, Spezialrestaurants, Ausflüge und Trinkgeld sind oft extra. All-Inclusive-Kreuzfahrten decken auch Alkohol ab.",
    },
    {
      question: "Welche Kreuzfahrt-Destination ist am beliebtesten?",
      answer:
        "Das Mittelmeer ist die beliebteste Kreuzfahrtregion für Deutsche – besonders Routen entlang der italienischen Küste, Griechenlands und der Türkei. Die Karibik ist die Traumdestination für Fernreisen. Nordeuropas Fjorde und Kanaren-Routen sind ebenfalls sehr gefragt.",
    },
    {
      question: "Wann ist die beste Zeit für eine Mittelmeer-Kreuzfahrt?",
      answer:
        "Mai, Juni und September sind ideal: angenehme Temperaturen um 25–28 °C, weniger Touristenmassen als im Hochsommer und günstigere Preise. Juli und August sind am heißesten und teuersten. Herbst-Kreuzfahrten im Oktober bieten oft die besten Schnäppchen.",
    },
    {
      question: "Wie viel Trinkgeld ist auf Kreuzfahrtschiffen üblich?",
      answer:
        "Auf den meisten großen Kreuzfahrtschiffen wird automatisch ein Service-Charge von 12–20 USD pro Person und Tag erhoben. Du kannst diese Gebühr an der Rezeption anpassen. Zusätzliches Trinkgeld in Bar ist für besonders guten Service willkommen, aber nicht verpflichtend.",
    },
    {
      question: "Eignet sich eine Kreuzfahrt für Familien mit Kindern?",
      answer:
        "Ja – viele große Reedereien bieten ausgezeichnete Kinderbetreuung (Kids Clubs), Wasserparks und familienfreundliche Ausflüge. MSC, Costa und Norwegian sind besonders familienfreundlich. Kinder bis 12 oder sogar 17 Jahre reisen bei vielen Anbietern kostenlos in der Kabine der Eltern.",
    },
  ],

  "/urlaubsarten/all-inclusive-urlaub": [
    {
      question: "Was ist alles bei All Inclusive enthalten?",
      answer:
        "All Inclusive umfasst typischerweise alle Mahlzeiten (Frühstück, Mittagessen, Abendessen), Snacks, lokale Getränke (Alkohol und alkoholfrei), Nutzung der Hotelanlage sowie Animationsprogramm. Premium-All-Inclusive schließt auch internationale Markengetränke und Spezialrestaurants ein.",
    },
    {
      question: "Lohnt sich All Inclusive wirklich?",
      answer:
        "All Inclusive lohnt sich besonders, wenn du viel im Hotel bleibst und wenig Ausflüge planst. An Strandresorts in Türkei, Ägypten oder der Dominikanischen Republik bist du oft günstiger als mit Halbpension plus Restaurantbesuchen. Vergleiche den Preisunterschied und rechne deinen voraussichtlichen Konsum.",
    },
    {
      question: "Welche Länder sind besonders gut für All-Inclusive-Urlaub?",
      answer:
        "Spitzenreiter bei All-Inclusive sind die Türkei (Antalya, Bodrum, Marmaris), Ägypten (Hurghada, Sharm el-Sheikh), Tunesien, Kuba, die Dominikanische Republik und Mexiko (Cancún, Riviera Maya). Griechenland und Spanien holen aber stark auf.",
    },
    {
      question: "Was ist der Unterschied zwischen All Inclusive und Ultra All Inclusive?",
      answer:
        "Ultra All Inclusive (auch Premium All Inclusive) geht über den Standard hinaus: Es beinhaltet internationale Markengetränke, mehrere À-la-carte-Restaurants ohne Aufpreis, Strandhandtücher, Minibar, Zimmerservice und manchmal sogar Ausflüge oder Spa-Leistungen.",
    },
    {
      question: "Kann man beim All-Inclusive-Urlaub trotzdem die Landesküche kennenlernen?",
      answer:
        "Ja – viele All-Inclusive-Hotels integrieren lokale Gerichte ins Buffet. Für ein authentisches Erlebnis empfehlen sich Tagesausflüge in die nächste Stadt mit Mittagessen in lokalen Restaurants. Das ist meist auch mit All-Inclusive-Armband problemlos möglich, da nur das Abendessen strikt ans Hotel gebunden ist.",
    },
  ],

  "/urlaubsarten/pauschalreisen": [
    {
      question: "Was ist eine Pauschalreise und welche Vorteile hat sie?",
      answer:
        "Eine Pauschalreise kombiniert mindestens zwei Reiseleistungen (z. B. Flug + Hotel) zu einem Gesamtpreis. Der größte Vorteil: Du bist durch die EU-Pauschalreiserichtlinie geschützt – der Reiseveranstalter haftet für alle gebuchten Leistungen, und bei Insolvenz ist dein Geld abgesichert.",
    },
    {
      question: "Was kostet eine Pauschalreise im Durchschnitt?",
      answer:
        "Pauschalreisen nach Spanien oder Griechenland starten ab ca. 300–500 € pro Person für eine Woche inkl. Flug und Frühstückshotel. Eine Woche All Inclusive in der Türkei kostet ab ca. 500–800 € pro Person. Fernreisen nach Thailand oder Bali beginnen bei ca. 1.000–1.500 € pro Person.",
    },
    {
      question: "Welche Reiseveranstalter bieten die besten Pauschalreisen an?",
      answer:
        "Zu den größten deutschen Pauschalreise-Veranstaltern gehören TUI, DERTOUR, Thomas Cook, Alltours und FTI. Sie unterscheiden sich in Zielgebieten, Hotelqualität und Service. Ein Vergleich auf urlaubfinder365.de zeigt dir immer das aktuell günstigste Angebot über alle Veranstalter.",
    },
    {
      question: "Kann ich eine Pauschalreise kurzfristig stornieren?",
      answer:
        "Ja, aber je kurzfristiger, desto höher die Stornogebühren. Üblich sind: bis 31 Tage vor Abreise 25 %, bis 14 Tage 50 %, bis 7 Tage 75 %, danach 90–100 % des Reisepreises. Eine Reiserücktrittsversicherung übernimmt die Kosten bei wichtigen Gründen wie Krankheit.",
    },
    {
      question: "Gibt es Pauschalreisen für Alleinreisende?",
      answer:
        "Ja – viele Reiseveranstalter bieten spezielle Einzelzimmer-Arrangements oder Alleinreisenden-Zuschläge (oft 10–30 % Aufpreis). Manche Clubs und Resort-Hotels sind sogar speziell auf Alleinreisende ausgerichtet und bieten strukturierte Gruppenaktivitäten für neue Bekanntschaften.",
    },
  ],

  "/urlaubsarten/last-minute-urlaub": [
    {
      question: "Ab wann spricht man von einem Last-Minute-Angebot?",
      answer:
        "In der Reisebranche gelten Angebote als Last Minute, wenn sie 1–28 Tage vor Abreise buchbar sind. Manche Portale erweitern den Begriff auf bis zu 6 Wochen. Die günstigsten Angebote gibt es oft 3–10 Tage vor Abflug, wenn Veranstalter Restplätze loswerden wollen.",
    },
    {
      question: "Wie spontan muss ich für Last-Minute-Urlaub sein?",
      answer:
        "Sehr spontan – du musst oft innerhalb von 24–48 Stunden entscheiden und abreisen können. Reisepass sollte aktuell und griffbereit sein. Arbeitgeber sollten kurzfristigen Urlaub genehmigen können. Haustier-Betreuung, Pflanzenbewässerung und Pakete sollten organisierbar sein.",
    },
    {
      question: "Kann man Last-Minute-Urlaub mit Kindern machen?",
      answer:
        "Eingeschränkt – mit Schulkindern ist Last Minute in den Schulferien besonders schwer, da gerade dann die Preise steigen. In den Ferien sind Last-Minute-Deals selten. Für Familien mit Kleinkindern unter 3 Jahren ist Last Minute dagegen gut machbar, da sie schulunabhängig reisen.",
    },
    {
      question: "Welche Last-Minute-Ziele bieten das beste Preis-Leistungs-Verhältnis?",
      answer:
        "Türkei und Ägypten führen das Last-Minute-Ranking für Preis-Leistung an: günstige All-Inclusive-Preise, kurze Flugzeiten aus Deutschland und verlässliches Wetter. Bulgarien am Schwarzen Meer ist das günstigste europäische Last-Minute-Ziel. Für mehr Kultur bieten Marokko und Tunesien gute Last-Minute-Angebote.",
    },
    {
      question: "Sind Last-Minute-Reisen sicher?",
      answer:
        "Grundsätzlich ja – bei Pauschalreisen greift die EU-Reiseschutz-Richtlinie auch bei Last-Minute-Buchungen. Informiere dich vor Abreise über aktuelle Reisewarnungen des Auswärtigen Amts. Eine Auslandskrankenversicherung ist immer empfehlenswert, auch bei kurzfristigen Reisen.",
    },
  ],

  "/urlaubsthemen/familienurlaub": [
    {
      question: "Welche Urlaubsziele eignen sich besonders für Familien mit Kindern?",
      answer:
        "Die besten Familienziele kombinieren Sicherheit, Kinderanimation, Strand und gute Infrastruktur. Top-Empfehlungen: Mallorca (flache Buchten, kurze Flugreise), Kroatien (sauberes Meer, kinderfreundlich), Türkei (All-Inclusive-Resorts mit Kinderclubs), Österreich (Bergurlaub, Schwimmbäder) und die Ostsee (Natur, kein Trubel).",
    },
    {
      question: "Ab welchem Alter können Kinder fliegen?",
      answer:
        "Babys dürfen ab ca. 7–14 Tagen fliegen (Rückfrage beim Kinderarzt). Viele Airlines erlauben Babys ab 2 Wochen. Kinder bis 2 Jahre fliegen auf dem Schoß der Eltern meist kostenlos oder günstig. Ab 2 Jahren benötigen Kinder einen eigenen Sitzplatz und Reisepass.",
    },
    {
      question: "Was ist der Vorteil eines All-Inclusive-Hotels für Familien?",
      answer:
        "All Inclusive macht Familienurlaub kalkulierbar und stressfrei: Kinder können essen, wann sie wollen, es gibt keine Diskussionen über Restaurantkosten und die Eltern müssen keine Getränke schleppen. Viele Familienhotels bieten zudem Kinderclubs, Babysitting und altersgerechte Pools.",
    },
    {
      question: "Wie reisen Familien am günstigsten?",
      answer:
        "Familienurlaub ist am günstigsten in der Nebensaison (Mai/Juni und September), aber das ist mit Schulkindern oft nicht möglich. Frühbucher-Rabatte (10–14 Monate vor Abreise) helfen besonders. Viele Veranstalter bieten Kinder-fliegen-gratis oder Kinder-wohnen-gratis Aktionen an.",
    },
    {
      question: "Was sollte man beim Familienurlaub unbedingt versichern?",
      answer:
        "Unbedingt: Auslandskrankenversicherung für alle Familienmitglieder (oft als Jahrespolice für Familien günstig). Empfehlenswert: Reiserücktrittsversicherung (Kinder können kurzfristig krank werden). Optional: Reisegepäckversicherung und Reiseunfallversicherung.",
    },
  ],

  "/urlaubsthemen/strandurlaub": [
    {
      question: "Welche Strände gelten als die schönsten weltweit?",
      answer:
        "Zu den weltweit schönsten Stränden zählen: Whitehaven Beach (Australien), Grace Bay (Turks & Caicos), Seven Mile Beach (Grand Cayman), Anse Source d'Argent (Seychellen), Railay Beach (Thailand) und Playa de Ses Illetes (Formentera). Für europäische Strände sind Sardinien, Korsika und Kroatien unschlagbar.",
    },
    {
      question: "Wann ist die beste Zeit für einen Strandurlaub?",
      answer:
        "Je nach Ziel: Mittelmeer (Mallorca, Griechenland, Türkei) von Mai bis Oktober, Karibik und Mexiko von Dezember bis April (außerhalb der Hurrikan-Saison), Thailand von November bis März, Malediven das ganze Jahr – beste Bedingungen November bis April. Unsere Klimacharts helfen bei der Entscheidung.",
    },
    {
      question: "Wie erkenne ich einen sicheren Badestrand?",
      answer:
        "Sichere Badestrände tragen die Blaue Flagge (Qualitätssiegel für Wasserqualität, Sicherheit und Umweltschutz) oder das Green Coast Award. Achte auf Badeverbotsschilder, Rettungsschwimmer-Türme und das Flaggensystem: Grün = sicher, Gelb = Vorsicht, Rot = Badeverbot.",
    },
    {
      question: "Was sollte man im Strandurlaub nicht vergessen?",
      answer:
        "Packliste für den Strandurlaub: Hoher Sonnenschutz (LSF 30–50+), Sonnenhut, Sonnenbrille (UV400), Strandtuch oder Strandmatte, Wasserflasche, Insektenschutz für den Abend, Schnorchel-Set für klares Wasser, leichte Strandkleidung und wasserdichte Tasche für Wertsachen.",
    },
    {
      question: "Welche günstigen Alternativen zu teuren Strandresorts gibt es?",
      answer:
        "Günstige Strandalternativen: Ferienwohnung direkt am Meer statt Resort, Camping an der Küste (Kroatien, Frankreich, Spanien), Hostels mit Strandnähe für Backpacker, Pauschalreisen in die Nebensaison oder kurzfristige Last-Minute-Deals. Weniger bekannte Küstenorte wie Albanien oder Nordalbanien bieten Top-Strände zu Niedrigpreisen.",
    },
  ],
};
