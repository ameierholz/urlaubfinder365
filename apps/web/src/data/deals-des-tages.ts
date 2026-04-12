/**
 * Demo-Daten: Deal des Tages – je Zielgebiet
 * Pro Destination-Slug mehrere Hotels → wird tagesabhängig rotiert.
 * Direkt-Buchungslink via GIATA-ID (gleicher Mechanismus wie HomeDealCard).
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

/** Direkt-Buchungslink mit GIATA-ID (identisch zu HomeDealCard) */
const BOOK = (giataId: number, nights = "7-7") =>
  `https://b2b.specials.de/index/jump/119/2780/993243/?giataId=${giataId}&from=7&to=180&duration=${nights}&adults=2&category=5&minRecommrate=80`;

const DEALS_BY_SLUG: Record<string, DealDesTages[]> = {

  // ─── BALEAREN / MALLORCA ──────────────────────────────────────────────────
  balearen: [
    {
      id: "balearen-1",
      hotelName: "Riu Palace Bonanza Playa ★★★★★",
      location: "Mallorca, Balearen",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75&auto=format",
      price: 273, originalPrice: 399, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(20436),
    },
    {
      id: "balearen-2",
      hotelName: "Hipotels Hipocampo Playa ★★★★",
      location: "Mallorca, Balearen",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=380&fit=crop&q=75&auto=format",
      price: 319, originalPrice: 459, discount: 30, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(18540),
    },
    {
      id: "balearen-3",
      hotelName: "Meliá Palma Bay ★★★★★",
      location: "Palma, Mallorca",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 519, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(22810),
    },
    {
      id: "balearen-4",
      hotelName: "Iberostar Selection Playa de Palma ★★★★★",
      location: "Playa de Palma, Mallorca",
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=380&fit=crop&q=75&auto=format",
      price: 289, originalPrice: 419, discount: 31, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(25103),
    },
    {
      id: "balearen-5",
      hotelName: "Barceló Pueblo Park ★★★★",
      location: "Mallorca, Balearen",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75&auto=format",
      price: 239, originalPrice: 349, discount: 32, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(3221),
    },
  ],

  mallorca: [
    {
      id: "mallorca-1",
      hotelName: "Riu Palace Bonanza Playa ★★★★★",
      location: "Mallorca, Balearen",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75&auto=format",
      price: 273, originalPrice: 399, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(20436),
    },
    {
      id: "mallorca-2",
      hotelName: "Meliá Palma Bay ★★★★★",
      location: "Palma, Mallorca",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 519, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(22810),
    },
    {
      id: "mallorca-3",
      hotelName: "Protur Biomar Gran Hotel & Spa ★★★★★",
      location: "Sa Coma, Mallorca",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75&auto=format",
      price: 309, originalPrice: 459, discount: 33, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(31780),
    },
  ],

  ibiza: [
    {
      id: "ibiza-1",
      hotelName: "Hard Rock Hotel Ibiza ★★★★★",
      location: "Playa d'en Bossa, Ibiza",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 429, originalPrice: 629, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(14477),
    },
    {
      id: "ibiza-2",
      hotelName: "Iberostar Cala Millor ★★★★",
      location: "Ibiza Stadt, Ibiza",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
      price: 379, originalPrice: 549, discount: 31, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(25105),
    },
  ],

  // ─── KANAREN ─────────────────────────────────────────────────────────────
  kanaren: [
    {
      id: "kanaren-1",
      hotelName: "Barceló Corralejo Bay ★★★★",
      location: "Fuerteventura, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=380&fit=crop&q=75&auto=format",
      price: 373, originalPrice: 519, discount: 28, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(8278),
    },
    {
      id: "kanaren-2",
      hotelName: "Lopesan Costa Meloneras ★★★★★",
      location: "Gran Canaria, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 420, originalPrice: 599, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(12451),
    },
    {
      id: "kanaren-3",
      hotelName: "Riu Palace Jandia ★★★★★",
      location: "Fuerteventura, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 389, originalPrice: 559, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(8284),
    },
    {
      id: "kanaren-4",
      hotelName: "Iberostar Torviscas Playa ★★★★",
      location: "Teneriffa, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(9210),
    },
    {
      id: "kanaren-5",
      hotelName: "Meliá Salinas ★★★★★",
      location: "Lanzarote, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=380&fit=crop&q=75&auto=format",
      price: 399, originalPrice: 579, discount: 31, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(8021),
    },
    {
      id: "kanaren-6",
      hotelName: "Siam Park Beach House ★★★★",
      location: "Teneriffa, Kanaren",
      imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=380&fit=crop&q=75&auto=format",
      price: 319, originalPrice: 459, discount: 30, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(9218),
    },
  ],

  teneriffa: [
    {
      id: "teneriffa-1",
      hotelName: "Iberostar Torviscas Playa ★★★★",
      location: "Costa Adeje, Teneriffa",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(9210),
    },
    {
      id: "teneriffa-2",
      hotelName: "Gran Meliá Palacio de Isora ★★★★★",
      location: "Alcalá, Teneriffa",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75&auto=format",
      price: 499, originalPrice: 729, discount: 32, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(9219),
    },
    {
      id: "teneriffa-3",
      hotelName: "Bahia del Duque ★★★★★",
      location: "Costa Adeje, Teneriffa",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 559, originalPrice: 799, discount: 30, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(9225),
    },
  ],

  fuerteventura: [
    {
      id: "fuerteventura-1",
      hotelName: "Barceló Corralejo Bay ★★★★",
      location: "Corralejo, Fuerteventura",
      imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=380&fit=crop&q=75&auto=format",
      price: 373, originalPrice: 519, discount: 28, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(8278),
    },
    {
      id: "fuerteventura-2",
      hotelName: "Riu Palace Jandia ★★★★★",
      location: "Jandia, Fuerteventura",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 389, originalPrice: 559, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(8284),
    },
    {
      id: "fuerteventura-3",
      hotelName: "Meliá Fuerteventura ★★★★★",
      location: "Playa Barca, Fuerteventura",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 419, originalPrice: 609, discount: 31, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(8286),
    },
  ],

  // ─── SPANIEN ──────────────────────────────────────────────────────────────
  spanien: [
    {
      id: "spanien-1",
      hotelName: "Hard Rock Hotel Marbella ★★★★★",
      location: "Costa del Sol, Spanien",
      imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(5834),
    },
    {
      id: "spanien-2",
      hotelName: "Meliá Costa del Sol ★★★★",
      location: "Torremolinos, Spanien",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75&auto=format",
      price: 218, originalPrice: 319, discount: 32, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(5830),
    },
    {
      id: "spanien-3",
      hotelName: "Vincci Selección Aleysa ★★★★★",
      location: "Benalmádena, Spanien",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 269, originalPrice: 389, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(5842),
    },
    {
      id: "spanien-4",
      hotelName: "Barceló Illetas Albatros ★★★★",
      location: "Costa Brava, Spanien",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=380&fit=crop&q=75&auto=format",
      price: 239, originalPrice: 349, discount: 32, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(5848),
    },
  ],

  "costa-brava": [
    {
      id: "costa-brava-1",
      hotelName: "Hotel Cap Roig by Brava Hoteles ★★★★",
      location: "Costa Brava, Katalonien",
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=380&fit=crop&q=75&auto=format",
      price: 249, originalPrice: 369, discount: 33, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(6020),
    },
    {
      id: "costa-brava-2",
      hotelName: "GHT Oasis Park & Spa ★★★★",
      location: "Lloret de Mar, Costa Brava",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 219, originalPrice: 319, discount: 31, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(6025),
    },
  ],

  "costa-del-sol": [
    {
      id: "costa-del-sol-1",
      hotelName: "Hard Rock Hotel Marbella ★★★★★",
      location: "Marbella, Costa del Sol",
      imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(5834),
    },
    {
      id: "costa-del-sol-2",
      hotelName: "Meliá Costa del Sol ★★★★",
      location: "Torremolinos, Costa del Sol",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75&auto=format",
      price: 218, originalPrice: 319, discount: 32, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(5830),
    },
    {
      id: "costa-del-sol-3",
      hotelName: "Hipotels Barrosa Park ★★★★",
      location: "Chiclana, Costa del Sol",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=380&fit=crop&q=75&auto=format",
      price: 199, originalPrice: 289, discount: 31, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(5852),
    },
  ],

  // ─── TÜRKEI ───────────────────────────────────────────────────────────────
  tuerkei: [
    {
      id: "tuerkei-1",
      hotelName: "Rixos Premium Belek ★★★★★",
      location: "Belek, Türkische Riviera",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=380&fit=crop&q=75&auto=format",
      price: 195, originalPrice: 299, discount: 35, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42194),
    },
    {
      id: "tuerkei-2",
      hotelName: "Cornelia De Luxe Resort ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=380&fit=crop&q=75&auto=format",
      price: 259, originalPrice: 389, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(34920),
    },
    {
      id: "tuerkei-3",
      hotelName: "Limak Atlantis De Luxe ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 219, originalPrice: 329, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42210),
    },
    {
      id: "tuerkei-4",
      hotelName: "Maxx Royal Belek Golf & Spa ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75&auto=format",
      price: 299, originalPrice: 449, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42220),
    },
    {
      id: "tuerkei-5",
      hotelName: "Amara Dolce Vita ★★★★★",
      location: "Kemer, Türkische Riviera",
      imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=380&fit=crop&q=75&auto=format",
      price: 179, originalPrice: 269, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42199),
    },
    {
      id: "tuerkei-6",
      hotelName: "Delphin Be Grand Resort ★★★★★",
      location: "Lara Beach, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
      price: 209, originalPrice: 309, discount: 32, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42215),
    },
    {
      id: "tuerkei-7",
      hotelName: "Ela Quality Resort ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75&auto=format",
      price: 229, originalPrice: 339, discount: 32, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42205),
    },
    {
      id: "tuerkei-8",
      hotelName: "IC Hotels Santai Family Resort ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 189, originalPrice: 279, discount: 32, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42208),
    },
  ],

  antalya: [
    {
      id: "antalya-1",
      hotelName: "Rixos Premium Belek ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=380&fit=crop&q=75&auto=format",
      price: 195, originalPrice: 299, discount: 35, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42194),
    },
    {
      id: "antalya-2",
      hotelName: "Cornelia De Luxe Resort ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=380&fit=crop&q=75&auto=format",
      price: 259, originalPrice: 389, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(34920),
    },
    {
      id: "antalya-3",
      hotelName: "Ela Quality Resort ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75&auto=format",
      price: 229, originalPrice: 339, discount: 32, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42205),
    },
    {
      id: "antalya-4",
      hotelName: "Maxx Royal Belek Golf & Spa ★★★★★",
      location: "Belek, Antalya",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75&auto=format",
      price: 299, originalPrice: 449, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(42220),
    },
  ],

  // ─── GRIECHENLAND ─────────────────────────────────────────────────────────
  "griechische-inseln": [
    {
      id: "griechenland-1",
      hotelName: "Atlantica Kalliston Resort ★★★★★",
      location: "Kreta, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69480),
    },
    {
      id: "griechenland-2",
      hotelName: "Mitsis Alila Resort & Spa ★★★★★",
      location: "Rhodos, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=380&fit=crop&q=75&auto=format",
      price: 319, originalPrice: 469, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69501),
    },
    {
      id: "griechenland-3",
      hotelName: "Ikos Olivia ★★★★★",
      location: "Chalkidiki, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 499, originalPrice: 729, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69520),
    },
    {
      id: "griechenland-4",
      hotelName: "Doryssa Seaside Resort ★★★★★",
      location: "Samos, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 289, originalPrice: 419, discount: 31, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(69510),
    },
    {
      id: "griechenland-5",
      hotelName: "Iberostar Creta Panorama ★★★★",
      location: "Kreta, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 279, originalPrice: 409, discount: 32, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(69485),
    },
  ],

  griechenland: [
    {
      id: "griechenland-g1",
      hotelName: "Atlantica Kalliston Resort ★★★★★",
      location: "Kreta, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69480),
    },
    {
      id: "griechenland-g2",
      hotelName: "Ikos Olivia ★★★★★",
      location: "Chalkidiki, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 499, originalPrice: 729, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69520),
    },
    {
      id: "griechenland-g3",
      hotelName: "Mitsis Alila Resort & Spa ★★★★★",
      location: "Rhodos, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=380&fit=crop&q=75&auto=format",
      price: 319, originalPrice: 469, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69501),
    },
  ],

  kreta: [
    {
      id: "kreta-1",
      hotelName: "Atlantica Kalliston Resort ★★★★★",
      location: "Kolymbia, Kreta",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
      price: 349, originalPrice: 499, discount: 30, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69480),
    },
    {
      id: "kreta-2",
      hotelName: "Iberostar Creta Panorama ★★★★",
      location: "Rethymno, Kreta",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 279, originalPrice: 409, discount: 32, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(69485),
    },
    {
      id: "kreta-3",
      hotelName: "Grecotel Creta Palace ★★★★★",
      location: "Rethymno, Kreta",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 329, originalPrice: 479, discount: 31, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(69488),
    },
  ],

  rhodos: [
    {
      id: "rhodos-1",
      hotelName: "Mitsis Alila Resort & Spa ★★★★★",
      location: "Rhodos Stadt, Rhodos",
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=380&fit=crop&q=75&auto=format",
      price: 319, originalPrice: 469, discount: 32, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69501),
    },
    {
      id: "rhodos-2",
      hotelName: "Ikos Aria ★★★★★",
      location: "Kos, Griechenland",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 549, originalPrice: 799, discount: 31, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(69525),
    },
  ],

  // ─── PORTUGAL ─────────────────────────────────────────────────────────────
  portugal: [
    {
      id: "portugal-1",
      hotelName: "Vila Vita Parc Resort ★★★★★",
      location: "Algarve, Portugal",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=380&fit=crop&q=75&auto=format",
      price: 302, originalPrice: 449, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(11001),
    },
    {
      id: "portugal-2",
      hotelName: "Penina Hotel & Golf Resort ★★★★★",
      location: "Algarve, Portugal",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 339, originalPrice: 479, discount: 29, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(11010),
    },
    {
      id: "portugal-3",
      hotelName: "Conrad Algarve ★★★★★",
      location: "Almancil, Algarve",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75&auto=format",
      price: 399, originalPrice: 579, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(11015),
    },
    {
      id: "portugal-4",
      hotelName: "Tivoli Carvoeiro Algarve Resort ★★★★★",
      location: "Carvoeiro, Algarve",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 289, originalPrice: 419, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(11020),
    },
  ],

  algarve: [
    {
      id: "algarve-1",
      hotelName: "Vila Vita Parc Resort ★★★★★",
      location: "Porches, Algarve",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=380&fit=crop&q=75&auto=format",
      price: 302, originalPrice: 449, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(11001),
    },
    {
      id: "algarve-2",
      hotelName: "Tivoli Carvoeiro Algarve Resort ★★★★★",
      location: "Carvoeiro, Algarve",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 289, originalPrice: 419, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(11020),
    },
    {
      id: "algarve-3",
      hotelName: "Pine Cliffs Resort ★★★★★",
      location: "Albufeira, Algarve",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75&auto=format",
      price: 449, originalPrice: 649, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(11025),
    },
  ],

  // ─── ÄGYPTEN ──────────────────────────────────────────────────────────────
  aegypten: [
    {
      id: "aegypten-1",
      hotelName: "Steigenberger Aldau Resort ★★★★★",
      location: "Hurghada, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&h=380&fit=crop&q=75&auto=format",
      price: 299, originalPrice: 449, discount: 33, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(76358),
    },
    {
      id: "aegypten-2",
      hotelName: "Rixos Sharm El Sheikh ★★★★★",
      location: "Sharm el-Sheikh, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=600&h=380&fit=crop&q=75&auto=format",
      price: 329, originalPrice: 489, discount: 33, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(76380),
    },
    {
      id: "aegypten-3",
      hotelName: "Movenpick Resort Hurghada ★★★★★",
      location: "Hurghada, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75&auto=format",
      price: 249, originalPrice: 359, discount: 31, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(76360),
    },
    {
      id: "aegypten-4",
      hotelName: "Jaz Aquamarine Resort ★★★★★",
      location: "Hurghada, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 219, originalPrice: 319, discount: 31, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(76370),
    },
  ],

  hurghada: [
    {
      id: "hurghada-1",
      hotelName: "Steigenberger Aldau Resort ★★★★★",
      location: "Hurghada, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&h=380&fit=crop&q=75&auto=format",
      price: 299, originalPrice: 449, discount: 33, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(76358),
    },
    {
      id: "hurghada-2",
      hotelName: "Movenpick Resort Hurghada ★★★★★",
      location: "Hurghada, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75&auto=format",
      price: 249, originalPrice: 359, discount: 31, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(76360),
    },
    {
      id: "hurghada-3",
      hotelName: "Jaz Aquamarine Resort ★★★★★",
      location: "Hurghada, Ägypten",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 219, originalPrice: 319, discount: 31, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(76370),
    },
  ],

  // ─── TUNESIEN ─────────────────────────────────────────────────────────────
  tunesien: [
    {
      id: "tunesien-1",
      hotelName: "Mövenpick Hotel Gammarth ★★★★★",
      location: "Hammamet, Tunesien",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75&auto=format",
      price: 279, originalPrice: 419, discount: 33, nights: 7,
      board: "All Inclusive", stars: 5,
      href: BOOK(80050),
    },
    {
      id: "tunesien-2",
      hotelName: "Iberostar Averroes ★★★★",
      location: "Hammamet, Tunesien",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
      price: 219, originalPrice: 319, discount: 31, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(80055),
    },
    {
      id: "tunesien-3",
      hotelName: "Riu Bellevue Park ★★★★",
      location: "Sousse, Tunesien",
      imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=380&fit=crop&q=75&auto=format",
      price: 199, originalPrice: 289, discount: 31, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(80060),
    },
  ],

  // ─── MAROKKO ──────────────────────────────────────────────────────────────
  marokko: [
    {
      id: "marokko-1",
      hotelName: "Mazagan Beach & Golf Resort ★★★★★",
      location: "El Jadida, Marokko",
      imageUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=380&fit=crop&q=75&auto=format",
      price: 359, originalPrice: 519, discount: 31, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(82100),
    },
    {
      id: "marokko-2",
      hotelName: "Sofitel Agadir Royal Bay ★★★★★",
      location: "Agadir, Marokko",
      imageUrl: "https://images.unsplash.com/photo-1597212720450-2c4f49f50040?w=600&h=380&fit=crop&q=75&auto=format",
      price: 299, originalPrice: 439, discount: 32, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(82105),
    },
    {
      id: "marokko-3",
      hotelName: "Club Med Agadir ★★★★",
      location: "Agadir, Marokko",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 249, originalPrice: 359, discount: 31, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(82110),
    },
  ],

  // ─── VAE / DUBAI ──────────────────────────────────────────────────────────
  vae: [
    {
      id: "vae-1",
      hotelName: "Atlantis The Palm ★★★★★",
      location: "Dubai, VAE",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=380&fit=crop&q=75&auto=format",
      price: 799, originalPrice: 1199, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(99581),
    },
    {
      id: "vae-2",
      hotelName: "Burj Al Arab Jumeirah ★★★★★",
      location: "Dubai, VAE",
      imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=380&fit=crop&q=75&auto=format",
      price: 1299, originalPrice: 1899, discount: 32, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(99590),
    },
    {
      id: "vae-3",
      hotelName: "Jumeirah Beach Hotel ★★★★★",
      location: "Dubai, VAE",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75&auto=format",
      price: 649, originalPrice: 949, discount: 32, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(99585),
    },
    {
      id: "vae-4",
      hotelName: "Rixos Premium Dubai ★★★★★",
      location: "Dubai, VAE",
      imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&h=380&fit=crop&q=75&auto=format",
      price: 549, originalPrice: 799, discount: 31, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(99595),
    },
  ],

  dubai: [
    {
      id: "dubai-1",
      hotelName: "Atlantis The Palm ★★★★★",
      location: "Palm Jumeirah, Dubai",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=380&fit=crop&q=75&auto=format",
      price: 799, originalPrice: 1199, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(99581),
    },
    {
      id: "dubai-2",
      hotelName: "Jumeirah Beach Hotel ★★★★★",
      location: "Jumeirah Beach, Dubai",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75&auto=format",
      price: 649, originalPrice: 949, discount: 32, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(99585),
    },
    {
      id: "dubai-3",
      hotelName: "Rixos Premium Dubai ★★★★★",
      location: "Dubai, VAE",
      imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&h=380&fit=crop&q=75&auto=format",
      price: 549, originalPrice: 799, discount: 31, nights: 7,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(99595),
    },
  ],

  // ─── THAILAND ─────────────────────────────────────────────────────────────
  thailand: [
    {
      id: "thailand-1",
      hotelName: "Dusit Thani Laguna Phuket ★★★★★",
      location: "Phuket, Thailand",
      imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=380&fit=crop&q=75&auto=format",
      price: 799, originalPrice: 1149, discount: 30, nights: 10,
      board: "Frühstück", stars: 5,
      href: BOOK(3901, "10-14"),
    },
    {
      id: "thailand-2",
      hotelName: "Anantara Layan Phuket Resort ★★★★★",
      location: "Phuket, Thailand",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 899, originalPrice: 1299, discount: 31, nights: 10,
      board: "Frühstück", stars: 5,
      href: BOOK(3910, "10-14"),
    },
    {
      id: "thailand-3",
      hotelName: "Sala Samui Chaweng Beach ★★★★",
      location: "Koh Samui, Thailand",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=380&fit=crop&q=75&auto=format",
      price: 849, originalPrice: 1229, discount: 31, nights: 10,
      board: "Frühstück", stars: 4,
      href: BOOK(3925, "10-14"),
    },
    {
      id: "thailand-4",
      hotelName: "Avani Plus Koh Lanta Resort ★★★★★",
      location: "Koh Lanta, Thailand",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
      price: 699, originalPrice: 999, discount: 30, nights: 10,
      board: "Frühstück", stars: 5,
      href: BOOK(3920, "10-14"),
    },
  ],

  phuket: [
    {
      id: "phuket-1",
      hotelName: "Dusit Thani Laguna Phuket ★★★★★",
      location: "Laguna Beach, Phuket",
      imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=380&fit=crop&q=75&auto=format",
      price: 799, originalPrice: 1149, discount: 30, nights: 10,
      board: "Frühstück", stars: 5,
      href: BOOK(3901, "10-14"),
    },
    {
      id: "phuket-2",
      hotelName: "Anantara Layan Phuket Resort ★★★★★",
      location: "Layan Beach, Phuket",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=380&fit=crop&q=75&auto=format",
      price: 899, originalPrice: 1299, discount: 31, nights: 10,
      board: "Frühstück", stars: 5,
      href: BOOK(3910, "10-14"),
    },
    {
      id: "phuket-3",
      hotelName: "Paresa Resort Phuket ★★★★★",
      location: "Kamala, Phuket",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 749, originalPrice: 1099, discount: 32, nights: 10,
      board: "Frühstück", stars: 5,
      href: BOOK(3915, "10-14"),
    },
  ],

  // ─── KROATIEN ─────────────────────────────────────────────────────────────
  kroatien: [
    {
      id: "kroatien-1",
      hotelName: "Falkensteiner Hotel Iadera ★★★★★",
      location: "Zadar, Kroatien",
      imageUrl: "https://images.unsplash.com/photo-1555990538-c55f2f7c4d8c?w=600&h=380&fit=crop&q=75&auto=format",
      price: 329, originalPrice: 489, discount: 33, nights: 7,
      board: "Halbpension", stars: 5,
      href: BOOK(135464),
    },
    {
      id: "kroatien-2",
      hotelName: "Aminess Liburna Hotel ★★★★",
      location: "Korčula, Kroatien",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 289, originalPrice: 419, discount: 31, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(135470),
    },
    {
      id: "kroatien-3",
      hotelName: "Bluesun Elaphusa ★★★★",
      location: "Brač, Kroatien",
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&h=380&fit=crop&q=75&auto=format",
      price: 259, originalPrice: 379, discount: 32, nights: 7,
      board: "Halbpension", stars: 4,
      href: BOOK(135480),
    },
    {
      id: "kroatien-4",
      hotelName: "Rixos Premium Dubrovnik ★★★★★",
      location: "Dubrovnik, Kroatien",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&q=75&auto=format",
      price: 449, originalPrice: 649, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(135490),
    },
  ],

  // ─── ITALIEN ──────────────────────────────────────────────────────────────
  italien: [
    {
      id: "italien-1",
      hotelName: "Grand Hotel Timeo ★★★★★",
      location: "Taormina, Sizilien",
      imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=380&fit=crop&q=75&auto=format",
      price: 389, originalPrice: 579, discount: 33, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(50100),
    },
    {
      id: "italien-2",
      hotelName: "Vivosa Apulia Resort ★★★★",
      location: "Apulien, Italien",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=380&fit=crop&q=75&auto=format",
      price: 299, originalPrice: 439, discount: 32, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(50110),
    },
    {
      id: "italien-3",
      hotelName: "Bravo Club Torre Rinalda ★★★★",
      location: "Lecce, Apulien",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 249, originalPrice: 359, discount: 31, nights: 7,
      board: "All Inclusive", stars: 4,
      href: BOOK(50115),
    },
    {
      id: "italien-4",
      hotelName: "Parco dei Principi Grand Hotel & Spa ★★★★★",
      location: "Sorrent, Kampanien",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=380&fit=crop&q=75&auto=format",
      price: 429, originalPrice: 629, discount: 32, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(50120),
    },
  ],

  // ─── DOMINIKANISCHE REPUBLIK ──────────────────────────────────────────────
  "dominikanische-republik": [
    {
      id: "domrep-1",
      hotelName: "Paradisus Palma Real ★★★★★",
      location: "Punta Cana, Dom. Republik",
      imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&h=380&fit=crop&q=75&auto=format",
      price: 899, originalPrice: 1299, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(62100, "10-14"),
    },
    {
      id: "domrep-2",
      hotelName: "Puntacana Resort & Club ★★★★★",
      location: "Punta Cana, Dom. Republik",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 849, originalPrice: 1229, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(62105, "10-14"),
    },
    {
      id: "domrep-3",
      hotelName: "Hard Rock Hotel & Casino Punta Cana ★★★★★",
      location: "Punta Cana, Dom. Republik",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 999, originalPrice: 1449, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(62110, "10-14"),
    },
  ],

  "punta-cana": [
    {
      id: "punta-cana-1",
      hotelName: "Paradisus Palma Real ★★★★★",
      location: "Punta Cana, Dom. Republik",
      imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&h=380&fit=crop&q=75&auto=format",
      price: 899, originalPrice: 1299, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(62100, "10-14"),
    },
    {
      id: "punta-cana-2",
      hotelName: "Hard Rock Hotel & Casino Punta Cana ★★★★★",
      location: "Punta Cana, Dom. Republik",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 999, originalPrice: 1449, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(62110, "10-14"),
    },
  ],

  // ─── MEXIKO ───────────────────────────────────────────────────────────────
  mexiko: [
    {
      id: "mexiko-1",
      hotelName: "Grand Velas Riviera Maya ★★★★★",
      location: "Riviera Maya, Mexiko",
      imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&h=380&fit=crop&q=75&auto=format",
      price: 999, originalPrice: 1449, discount: 31, nights: 10,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(63100, "10-14"),
    },
    {
      id: "mexiko-2",
      hotelName: "Paradisus Cancún ★★★★★",
      location: "Cancún, Mexiko",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 879, originalPrice: 1279, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(63105, "10-14"),
    },
    {
      id: "mexiko-3",
      hotelName: "Live Aqua Beach Resort Cancún ★★★★★",
      location: "Cancún, Mexiko",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 949, originalPrice: 1379, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(63110, "10-14"),
    },
  ],

  cancun: [
    {
      id: "cancun-1",
      hotelName: "Grand Velas Riviera Maya ★★★★★",
      location: "Riviera Maya, Mexiko",
      imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&h=380&fit=crop&q=75&auto=format",
      price: 999, originalPrice: 1449, discount: 31, nights: 10,
      board: "Ultra All Inclusive", stars: 5,
      href: BOOK(63100, "10-14"),
    },
    {
      id: "cancun-2",
      hotelName: "Paradisus Cancún ★★★★★",
      location: "Cancún, Mexiko",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 879, originalPrice: 1279, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(63105, "10-14"),
    },
  ],

  // ─── KUBA ─────────────────────────────────────────────────────────────────
  kuba: [
    {
      id: "kuba-1",
      hotelName: "Meliá Cayo Coco ★★★★★",
      location: "Cayo Coco, Kuba",
      imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=380&fit=crop&q=75&auto=format",
      price: 849, originalPrice: 1239, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(64100, "10-14"),
    },
    {
      id: "kuba-2",
      hotelName: "Iberostar Selection Varadero ★★★★★",
      location: "Varadero, Kuba",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 799, originalPrice: 1159, discount: 31, nights: 10,
      board: "All Inclusive", stars: 5,
      href: BOOK(64105, "10-14"),
    },
  ],

  // ─── MALEDIVEN ────────────────────────────────────────────────────────────
  malediven: [
    {
      id: "malediven-1",
      hotelName: "Cheval Blanc Randheli ★★★★★",
      location: "Noonu Atoll, Malediven",
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=380&fit=crop&q=75&auto=format",
      price: 2499, originalPrice: 3599, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(95100),
    },
    {
      id: "malediven-2",
      hotelName: "Meeru Maldives Resort Island ★★★★",
      location: "Nord Malé Atoll, Malediven",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 1299, originalPrice: 1899, discount: 32, nights: 7,
      board: "Vollpension", stars: 4,
      href: BOOK(95110),
    },
    {
      id: "malediven-3",
      hotelName: "Kurumba Maldives ★★★★★",
      location: "Nord Malé Atoll, Malediven",
      imageUrl: "https://images.unsplash.com/photo-1540541338537-4fd68f91a8c0?w=600&h=380&fit=crop&q=75&auto=format",
      price: 1499, originalPrice: 2199, discount: 32, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(95105),
    },
  ],

  // ─── MALEDIVEN / INDISCHER OZEAN ──────────────────────────────────────────
  "indischer-ozean": [
    {
      id: "ind-ozean-1",
      hotelName: "Cheval Blanc Randheli ★★★★★",
      location: "Malediven",
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=380&fit=crop&q=75&auto=format",
      price: 2499, originalPrice: 3599, discount: 31, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(95100),
    },
    {
      id: "ind-ozean-2",
      hotelName: "Constance Lemuria ★★★★★",
      location: "Praslin, Seychellen",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop&q=75&auto=format",
      price: 1899, originalPrice: 2799, discount: 32, nights: 7,
      board: "Frühstück", stars: 5,
      href: BOOK(95200),
    },
  ],

};

// ─── FALLBACK-DEALS ────────────────────────────────────────────────────────
const FALLBACK_DEALS: DealDesTages[] = [
  {
    id: "fallback-1",
    hotelName: "Rixos Premium Belek ★★★★★",
    location: "Türkische Riviera",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=380&fit=crop&q=75&auto=format",
    price: 195, originalPrice: 299, discount: 35, nights: 7,
    board: "Ultra All Inclusive", stars: 5,
    href: BOOK(42194),
  },
  {
    id: "fallback-2",
    hotelName: "Barceló Corralejo Bay ★★★★",
    location: "Fuerteventura, Kanaren",
    imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=380&fit=crop&q=75&auto=format",
    price: 373, originalPrice: 519, discount: 28, nights: 7,
    board: "All Inclusive", stars: 4,
    href: BOOK(8278),
  },
  {
    id: "fallback-3",
    hotelName: "Atlantica Kalliston Resort ★★★★★",
    location: "Kreta, Griechenland",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&h=380&fit=crop&q=75&auto=format",
    price: 349, originalPrice: 499, discount: 30, nights: 7,
    board: "All Inclusive", stars: 5,
    href: BOOK(69480),
  },
  {
    id: "fallback-4",
    hotelName: "Steigenberger Aldau Resort ★★★★★",
    location: "Hurghada, Ägypten",
    imageUrl: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&h=380&fit=crop&q=75&auto=format",
    price: 299, originalPrice: 449, discount: 33, nights: 7,
    board: "All Inclusive", stars: 5,
    href: BOOK(76358),
  },
  {
    id: "fallback-5",
    hotelName: "Riu Palace Bonanza Playa ★★★★★",
    location: "Mallorca, Balearen",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=380&fit=crop&q=75&auto=format",
    price: 273, originalPrice: 399, discount: 32, nights: 7,
    board: "All Inclusive", stars: 5,
    href: BOOK(20436),
  },
  {
    id: "fallback-6",
    hotelName: "Dusit Thani Laguna Phuket ★★★★★",
    location: "Phuket, Thailand",
    imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=380&fit=crop&q=75&auto=format",
    price: 799, originalPrice: 1149, discount: 30, nights: 10,
    board: "Frühstück", stars: 5,
    href: BOOK(3901, "10-14"),
  },
  {
    id: "fallback-7",
    hotelName: "Atlantis The Palm ★★★★★",
    location: "Dubai, VAE",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=380&fit=crop&q=75&auto=format",
    price: 799, originalPrice: 1199, discount: 33, nights: 7,
    board: "Frühstück", stars: 5,
    href: BOOK(99581),
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
