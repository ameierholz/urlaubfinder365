/**
 * Demo-Daten für Werbeplatz-Widgets.
 * Werden gezeigt, wenn keine echten Partner/Anbieter in der DB vorhanden sind.
 * Ziel: Potenzielle Werbepartner sehen aktive Platzierungen → erhöht Conversion.
 */

/** Für LocalPartnersWidget — lokale Unternehmen (Hotels, Restaurants, Anbieter vor Ort) */
export const DEMO_LOKALE_PARTNER = [
  {
    id: "demo-lp-1",
    name: "Hotel Sonnenterrasse",
    kategorie: "Hotel",
    bio: "4-Sterne-Boutiquehotel · Strandlage · Pool & Spa inklusive",
    beschreibung: "Direkt am Sandstrand gelegen bietet das Hotel Sonnenterrasse traumhafte Meerblick-Zimmer, einen Infinity-Pool und ein Spa-Bereich. Perfekt für Paare und Familien.",
    avatar_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&q=80&fit=crop&auto=format",
    titelbild_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=160&q=70&fit=crop&auto=format",
    google_maps_url: "https://maps.google.com/?q=Hotel+Sonnenterrasse",
    website_url: "https://www.urlaubfinder365.de/werbepartner/",
    verifiziert: true,
  },
  {
    id: "demo-lp-2",
    name: "Café del Hafen",
    kategorie: "Restaurant",
    bio: "Frühstück, Mittagessen & Cocktails mit Meerblick",
    beschreibung: "Unser gemütliches Café direkt am Hafenbecken verwöhnt euch mit frischen Meeresfrüchten, hausgemachten Kuchen und dem besten Sonnenuntergangs-Cocktail der Stadt.",
    avatar_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=80&h=80&q=80&fit=crop&auto=format",
    titelbild_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=160&q=70&fit=crop&auto=format",
    google_maps_url: "https://maps.google.com/?q=Cafe+del+Hafen",
    website_url: "https://www.urlaubfinder365.de/werbepartner/",
    verifiziert: true,
  },
  {
    id: "demo-lp-3",
    name: "Blue Dive Center",
    kategorie: "Wassersport",
    bio: "Tauch- & Schnorchel-Touren für Anfänger & Profis",
    beschreibung: "Erlebe die Unterwasserwelt mit unseren PADI-zertifizierten Tauchguides. Wir bieten Tageskurse, Open-Water-Zertifizierungen und geführte Tauch-Safaris.",
    avatar_url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=80&h=80&q=80&fit=crop&auto=format",
    titelbild_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=160&q=70&fit=crop&auto=format",
    google_maps_url: "https://maps.google.com/?q=Blue+Dive+Center",
    website_url: "https://www.urlaubfinder365.de/werbepartner/",
    verifiziert: false,
  },
] as const;

/** Für SponsoredAnbieter — Aktivitäten-Anbieter im Marktplatz (mit Featured-Angebot) */
export const DEMO_ANBIETER = [
  {
    id: "demo-ab-1",
    name: "Andalusian Trails",
    standort: "Andalusien, Spanien",
    bio: "Reit- & Wandertouren durch Andalusiens Naturparks",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&q=80&fit=crop&auto=format",
    titelbild_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=160&q=70&fit=crop&auto=format",
    verifiziert: true,
    bewertung: 4.8,
    bewertungenAnzahl: 94,
    featured_angebot: {
      titel: "Geführte Reitour durch die Olivenhaine",
      preis: 79,
      preistyp: "pro_person",
      foto_url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=300&h=150&q=70&fit=crop&auto=format",
    },
    href: "/marktplatz/",
  },
  {
    id: "demo-ab-2",
    name: "Istanbul Flavors",
    standort: "Istanbul, Türkei",
    bio: "Kulinarische Stadtführungen & traditionelle Kochkurse",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&q=80&fit=crop&auto=format",
    titelbild_url: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=160&q=70&fit=crop&auto=format",
    verifiziert: true,
    bewertung: 4.9,
    bewertungenAnzahl: 213,
    featured_angebot: {
      titel: "Gewürzbasar-Tour & türkisches Kochkurs-Dinner",
      preis: 55,
      preistyp: "pro_person",
      foto_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=150&q=70&fit=crop&auto=format",
    },
    href: "/marktplatz/",
  },
  {
    id: "demo-ab-3",
    name: "Aegean Water Sports",
    standort: "Bodrum, Griechenland",
    bio: "Schnorcheln, Segeln & Jetski auf der Ägäis",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&q=80&fit=crop&auto=format",
    titelbild_url: "https://images.unsplash.com/photo-1503854426928-f94c39fdf3d7?w=400&h=160&q=70&fit=crop&auto=format",
    verifiziert: true,
    bewertung: 4.7,
    bewertungenAnzahl: 127,
    featured_angebot: {
      titel: "Halbtages-Schnorchel-Safari & Bootstour",
      preis: 38,
      preistyp: "pro_person",
      foto_url: "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=300&h=150&q=70&fit=crop&auto=format",
    },
    href: "/marktplatz/",
  },
] as const;

/** Für SponsoredAngebote — gesponserte Aktivitäten/Angebote */
export const DEMO_ANGEBOTE = [
  {
    id: "demo-ao-1",
    titel: "Ganztages-Bootstour Türkische Riviera",
    slug: "demo-bootstour-antalya",
    ziel: "Antalya, Türkei",
    preis: 49,
    preistyp: "pro_person",
    foto_url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=250&q=70&fit=crop&auto=format",
    kategorie: "tagesausflug",
    anbieter_profile: {
      name: "Antalya Sea Tours",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&q=80&fit=crop&auto=format",
      verifiziert: true,
    },
  },
  {
    id: "demo-ao-2",
    titel: "Tapas & Wein-Stadtführung Barcelona",
    slug: "demo-tapas-barcelona",
    ziel: "Barcelona, Spanien",
    preis: 65,
    preistyp: "pro_person",
    foto_url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=250&q=70&fit=crop&auto=format",
    kategorie: "kulinarik",
    anbieter_profile: {
      name: "Barcelona Food Tours",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&q=80&fit=crop&auto=format",
      verifiziert: true,
    },
  },
  {
    id: "demo-ao-3",
    titel: "Schnorchel-Abenteuer Rotes Meer",
    slug: "demo-schnorcheln-hurghada",
    ziel: "Hurghada, Ägypten",
    preis: 35,
    preistyp: "pro_person",
    foto_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&q=70&fit=crop&auto=format",
    kategorie: "wassersport",
    anbieter_profile: {
      name: "Red Sea Divers",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&q=80&fit=crop&auto=format",
      verifiziert: true,
    },
  },
  {
    id: "demo-ao-4",
    titel: "Akropolis-Führung & Olympieion",
    slug: "demo-akropolis-athen",
    ziel: "Athen, Griechenland",
    preis: 42,
    preistyp: "pro_person",
    foto_url: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=250&q=70&fit=crop&auto=format",
    kategorie: "stadtfuehrung",
    anbieter_profile: {
      name: "Athens City Walks",
      avatar_url: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=40&h=40&q=80&fit=crop&auto=format",
      verifiziert: false,
    },
  },
] as const;
