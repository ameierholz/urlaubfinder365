/**
 * Demo-Daten: Deal des Tages – je Zielgebiet
 * Preise aus dem IBE-Widget, "war"-Preise +30 % aufgeschlagen (Demo).
 * Pro Destination-Slug ein Array von Deals → wird tagesabhängig rotiert.
 */

export interface DealDesTages {
  id: string;
  hotelName: string;
  location: string;
  imageUrl: string;
  price: number;        // ab €/Person
  originalPrice: number;
  discount: number;     // %
  nights: number;
  board: string;
  stars: number;
  href: string;
}

// Basis-Buchungs-URL (IBE)
const IBE = "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&adults=2";

const DEALS_BY_SLUG: Record<string, DealDesTages[]> = {
  balearen: [
    {
      id: "balearen-1",
      hotelName: "Riu Bravo Alcudia ★★★★",
      location: "Mallorca, Balearen",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75",
      price: 273, originalPrice: 399, discount: 32, nights: 7,
      board: "All Inclusive", stars: 4,
      href: `${IBE}&regionId=133&duration=7-7&boardCode=AI`,
    },
    {
      id: "balearen-2",
      hotelName: "Hipotels Hipocampo Playa ★★★★",
      location: "Mallorca, Balearen",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=380&fit=crop&q=75",
      price: 319, originalPrice: 459, discount: 30, nights: 7,
      board: "Halbpension", stars: 4,
      href: `${IBE}&regionId=133&duration=7-7`,
    },
  ],
  kanaren: [
    {
      id: "kanaren-1",
      hotelName: "Barceló Corralejo Bay ★★★★",
      location: "Fuerteventura, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=380&fit=crop&q=75",
      price: 373, originalPrice: 519, discount: 28, nights: 7,
      board: "All Inclusive", stars: 4,
      href: `${IBE}&regionId=127&duration=7-7&boardCode=AI`,
    },
    {
      id: "kanaren-2",
      hotelName: "Lopesan Costa Meloneras ★★★★★",
      location: "Gran Canaria, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&q=75",
      price: 420, originalPrice: 599, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=128&duration=7-7&boardCode=AI`,
    },
  ],
  spanien: [
    {
      id: "spanien-1",
      hotelName: "Hotel Costa Dorada Palace ★★★★",
      location: "Costa Dorada, Spanien",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75",
      price: 218, originalPrice: 329, discount: 34, nights: 7,
      board: "Halbpension", stars: 4,
      href: `${IBE}&regionId=708&duration=7-7`,
    },
    {
      id: "spanien-2",
      hotelName: "Hard Rock Hotel Marbella ★★★★★",
      location: "Costa del Sol, Spanien",
      imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&h=380&fit=crop&q=75",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=736&duration=7-7&boardCode=AI`,
    },
  ],
  portugal: [
    {
      id: "portugal-1",
      hotelName: "Vila Vita Parc Resort ★★★★★",
      location: "Algarve, Portugal",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=380&fit=crop&q=75",
      price: 302, originalPrice: 449, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: `${IBE}&regionId=109&duration=7-7`,
    },
    {
      id: "portugal-2",
      hotelName: "Penina Hotel & Golf Resort ★★★★★",
      location: "Algarve, Portugal",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=380&fit=crop&q=75",
      price: 339, originalPrice: 479, discount: 29, nights: 7,
      board: "Halbpension", stars: 5,
      href: `${IBE}&regionId=109&duration=7-7`,
    },
  ],
  tuerkei: [
    {
      id: "tuerkei-1",
      hotelName: "Rixos Premium Belek ★★★★★",
      location: "Türkische Riviera, Türkei",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=380&fit=crop&q=75",
      price: 195, originalPrice: 299, discount: 35, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: `${IBE}&regionId=149&duration=7-7&boardCode=UAI`,
    },
    {
      id: "tuerkei-2",
      hotelName: "Cornelia De Luxe Resort ★★★★★",
      location: "Antalya, Türkei",
      imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=380&fit=crop&q=75",
      price: 259, originalPrice: 389, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: `${IBE}&regionId=149&duration=7-7&boardCode=UAI`,
    },
  ],
  "griechische-inseln": [
    {
      id: "griechenland-1",
      hotelName: "Atlantica Kalliston Resort ★★★★★",
      location: "Kreta, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=116&duration=7-7&boardCode=AI`,
    },
    {
      id: "griechenland-2",
      hotelName: "Sun Beach Resort ★★★★",
      location: "Rhodos, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=380&fit=crop&q=75",
      price: 319, originalPrice: 469, discount: 32, nights: 7,
      board: "Halbpension", stars: 4,
      href: `${IBE}&regionId=116&duration=7-7`,
    },
  ],
  griechenland: [
    {
      id: "griechenland-3",
      hotelName: "Atlantica Kalliston Resort ★★★★★",
      location: "Kreta, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=116&duration=7-7&boardCode=AI`,
    },
  ],
  aegypten: [
    {
      id: "aegypten-1",
      hotelName: "Steigenberger Aldau Resort ★★★★★",
      location: "Hurghada, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&h=380&fit=crop&q=75",
      price: 299, originalPrice: 449, discount: 33, nights: 7,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=117&duration=7-7&boardCode=AI`,
    },
  ],
  tunesien: [
    {
      id: "tunesien-1",
      hotelName: "Mövenpick Hotel Gammarth ★★★★★",
      location: "Hammamet, Tunesien",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75",
      price: 279, originalPrice: 419, discount: 33, nights: 7,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=724&duration=7-7&boardCode=AI`,
    },
  ],
  marokko: [
    {
      id: "marokko-1",
      hotelName: "Mazagan Beach & Golf Resort ★★★★★",
      location: "Agadir, Marokko",
      imageUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=380&fit=crop&q=75",
      price: 359, originalPrice: 519, discount: 31, nights: 7,
      board: "Halbpension", stars: 5,
      href: `${IBE}&regionId=708&duration=7-7`,
    },
  ],
  thailand: [
    {
      id: "thailand-1",
      hotelName: "Dusit Thani Laguna Phuket ★★★★★",
      location: "Phuket, Thailand",
      imageUrl: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&h=380&fit=crop&q=75",
      price: 799, originalPrice: 1149, discount: 30, nights: 10,
      board: "Frühstück", stars: 5,
      href: `${IBE}&regionId=702&duration=10-14`,
    },
  ],
  "dominikanische-republik": [
    {
      id: "domrep-1",
      hotelName: "Paradisus Palma Real ★★★★★",
      location: "Punta Cana, Dom. Republik",
      imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&h=380&fit=crop&q=75",
      price: 899, originalPrice: 1299, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=838&duration=10-14&boardCode=AI`,
    },
  ],
  mexiko: [
    {
      id: "mexiko-1",
      hotelName: "Grand Velas Riviera Maya ★★★★★",
      location: "Cancún, Mexiko",
      imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&h=380&fit=crop&q=75",
      price: 999, originalPrice: 1449, discount: 31, nights: 10,
      board: "Ultra All Inclusive", stars: 5,
      href: `${IBE}&regionId=700&duration=10-14&boardCode=UAI`,
    },
  ],
  vae: [
    {
      id: "vae-1",
      hotelName: "Atlantis The Palm ★★★★★",
      location: "Dubai, VAE",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=380&fit=crop&q=75",
      price: 799, originalPrice: 1199, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: `${IBE}&regionId=102&duration=7-7`,
    },
  ],
  italien: [
    {
      id: "italien-1",
      hotelName: "Grand Hotel Excelsior Vittoria ★★★★★",
      location: "Sizilien, Italien",
      imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=380&fit=crop&q=75",
      price: 389, originalPrice: 579, discount: 33, nights: 7,
      board: "Halbpension", stars: 5,
      href: `${IBE}&regionId=120&duration=7-7`,
    },
  ],
  kroatien: [
    {
      id: "kroatien-1",
      hotelName: "Falkensteiner Hotel Iadera ★★★★★",
      location: "Dalmatien, Kroatien",
      imageUrl: "https://images.unsplash.com/photo-1555990538-c55f2f7c4d8c?w=600&h=380&fit=crop&q=75",
      price: 329, originalPrice: 489, discount: 33, nights: 7,
      board: "Halbpension", stars: 5,
      href: `${IBE}&regionId=121&duration=7-7`,
    },
  ],
  mallorca: [
    {
      id: "mallorca-1",
      hotelName: "Riu Palace Bonanza Playa ★★★★★",
      location: "Mallorca, Balearen",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75",
      price: 273, originalPrice: 399, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: `${IBE}&regionId=133&duration=7-7&boardCode=AI`,
    },
  ],
};

// Fallback-Deal für alle anderen Ziele
const FALLBACK_DEALS: DealDesTages[] = [
  {
    id: "fallback-1",
    hotelName: "Riu Palace Cabo San Lucas ★★★★★",
    location: "Last-Minute Schnäppchen",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75",
    price: 299, originalPrice: 449, discount: 33, nights: 7,
    board: "All Inclusive", stars: 5,
    href: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&adults=2",
  },
  {
    id: "fallback-2",
    hotelName: "Sunprime Beachfront Resort ★★★★",
    location: "Beliebteste Angebote",
    imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75",
    price: 349, originalPrice: 529, discount: 34, nights: 7,
    board: "All Inclusive", stars: 4,
    href: "https://ibe.specials.de/?action=offer&agent=993243&product=package&language=de&adults=2",
  },
];

/**
 * Gibt den tagesaktuellen Deal für ein Ziel zurück.
 * Rotiert täglich durch die verfügbaren Deals (kein Random → stabil bei SSG).
 */
export function getDealDesTages(destinationSlug?: string): DealDesTages {
  const deals =
    (destinationSlug && DEALS_BY_SLUG[destinationSlug]) ||
    FALLBACK_DEALS;

  // Tag des Jahres als Seed für die Rotation
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return deals[dayOfYear % deals.length];
}
