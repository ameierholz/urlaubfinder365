/**
 * Traveltainment / specials.de IBE – Region Codes
 *
 * Quelle: Traveltainment IBE (specials.de-Kompatibilität)
 * Bekannte Codes stammen direkt aus dem IBE-HTML; geschätzte Codes sind mit
 * einem Kommentar „~" markiert und sollten bei Gelegenheit gegen die echten
 * IBE-Responses verifiziert werden.
 *
 * Stand: 2026-04
 */

export interface IbeDestination {
  name: string;
  regionCode: string;
  parent: string;
}

export const IBE_DESTINATIONS: IbeDestination[] = [

  // ─── BALEAREN ────────────────────────────────────────────────────────────────
  { name: "Balearen – alle Regionen",  regionCode: "100000", parent: "Balearen" },
  { name: "Formentera",                regionCode: "126",    parent: "Balearen" },
  { name: "Ibiza",                     regionCode: "129",    parent: "Balearen" },
  { name: "Mallorca",                  regionCode: "133",    parent: "Balearen" },
  { name: "Menorca",                   regionCode: "134",    parent: "Balearen" },

  // ─── KANAREN ─────────────────────────────────────────────────────────────────
  { name: "Kanarische Inseln – alle",  regionCode: "851",    parent: "Kanaren" },
  { name: "El Hierro",                 regionCode: "125",    parent: "Kanaren" },
  { name: "Fuerteventura",             regionCode: "127",    parent: "Kanaren" },
  { name: "Gran Canaria",              regionCode: "128",    parent: "Kanaren" },
  { name: "La Gomera",                 regionCode: "130",    parent: "Kanaren" },
  { name: "La Palma",                  regionCode: "131",    parent: "Kanaren" },
  { name: "Lanzarote",                 regionCode: "132",    parent: "Kanaren" },
  { name: "Teneriffa",                 regionCode: "135",    parent: "Kanaren" },

  // ─── SPANIEN FESTLAND ────────────────────────────────────────────────────────
  { name: "Spanien Festland – alle",   regionCode: "119",    parent: "Spanien Festland" },
  { name: "Andalusien",                regionCode: "591",    parent: "Spanien Festland" },
  { name: "Barcelona & Umgebung",      regionCode: "100027", parent: "Spanien Festland" },
  { name: "Costa Blanca",              regionCode: "707",    parent: "Spanien Festland" },
  { name: "Costa Brava",               regionCode: "704",    parent: "Spanien Festland" },
  { name: "Costa de Almería",          regionCode: "922",    parent: "Spanien Festland" },
  { name: "Costa de la Luz",           regionCode: "735",    parent: "Spanien Festland" },
  { name: "Costa del Sol",             regionCode: "736",    parent: "Spanien Festland" },
  { name: "Costa Dorada",              regionCode: "708",    parent: "Spanien Festland" },
  { name: "Katalonien",                regionCode: "720",    parent: "Spanien Festland" },
  { name: "Madrid & Umgebung",         regionCode: "935",    parent: "Spanien Festland" },

  // ─── PORTUGAL ────────────────────────────────────────────────────────────────
  { name: "Portugal – alle Regionen",  regionCode: "725",    parent: "Portugal" },
  { name: "Algarve",                   regionCode: "109",    parent: "Portugal" },
  { name: "Azoren",                    regionCode: "110",    parent: "Portugal" },
  { name: "Lissabon & Umgebung",       regionCode: "652",    parent: "Portugal" },
  { name: "Madeira",                   regionCode: "112",    parent: "Portugal" },

  // ─── TÜRKEI ──────────────────────────────────────────────────────────────────
  { name: "Türkei – alle Regionen",    regionCode: "724",    parent: "Türkei" },
  { name: "Halbinsel Bodrum",          regionCode: "100049", parent: "Türkei" },
  { name: "Istanbul & Umgebung",       regionCode: "147",    parent: "Türkei" },
  { name: "Türkische Ägäis",           regionCode: "144",    parent: "Türkei" },
  { name: "Türkische Riviera",         regionCode: "149",    parent: "Türkei" },

  // ─── GRIECHENLAND ────────────────────────────────────────────────────────────
  { name: "Griechenland – alle",       regionCode: "107",    parent: "Griechenland" },
  { name: "Athen & Umgebung",          regionCode: "642",    parent: "Griechenland" },
  { name: "Chalkidiki",                regionCode: "646",    parent: "Griechenland" },
  { name: "Ionische Inseln",           regionCode: "650",    parent: "Griechenland" },
  { name: "Kefalonia",                 regionCode: "100055", parent: "Griechenland" },
  { name: "Korfu",                     regionCode: "139",    parent: "Griechenland" },
  { name: "Kos",                       regionCode: "140",    parent: "Griechenland" },
  { name: "Kreta",                     regionCode: "141",    parent: "Griechenland" },
  { name: "Lefkada",                   regionCode: "100056", parent: "Griechenland" },
  { name: "Lesbos",                    regionCode: "100057", parent: "Griechenland" },
  { name: "Mykonos",                   regionCode: "100058", parent: "Griechenland" },
  { name: "Naxos",                     regionCode: "100059", parent: "Griechenland" },
  { name: "Paros",                     regionCode: "100060", parent: "Griechenland" },
  { name: "Peloponnes",                regionCode: "100061", parent: "Griechenland" },
  { name: "Rhodos",                    regionCode: "138",    parent: "Griechenland" },
  { name: "Samos",                     regionCode: "100062", parent: "Griechenland" },
  { name: "Santorini",                 regionCode: "100063", parent: "Griechenland" },
  { name: "Skiathos",                  regionCode: "100064", parent: "Griechenland" },
  { name: "Thassos",                   regionCode: "100065", parent: "Griechenland" },
  { name: "Thessaloniki & Umgebung",   regionCode: "100066", parent: "Griechenland" },
  { name: "Zakynthos",                 regionCode: "100067", parent: "Griechenland" },

  // ─── ÄGYPTEN ─────────────────────────────────────────────────────────────────
  { name: "Ägypten – alle Regionen",   regionCode: "100",    parent: "Ägypten" },
  { name: "Hurghada",                  regionCode: "193",    parent: "Ägypten" },
  { name: "Kairo & Umgebung",          regionCode: "100070", parent: "Ägypten" },
  { name: "Marsa Alam",                regionCode: "100071", parent: "Ägypten" },
  { name: "Nil-Region",                regionCode: "100072", parent: "Ägypten" },
  { name: "Sharm el-Sheikh",           regionCode: "194",    parent: "Ägypten" },
  { name: "Sinai",                     regionCode: "100073", parent: "Ägypten" },

  // ─── TUNESIEN ────────────────────────────────────────────────────────────────
  { name: "Tunesien – alle Regionen",  regionCode: "122",    parent: "Tunesien" },
  { name: "Djerba",                    regionCode: "176",    parent: "Tunesien" },
  { name: "Hammamet",                  regionCode: "177",    parent: "Tunesien" },
  { name: "Monastir",                  regionCode: "178",    parent: "Tunesien" },
  { name: "Sousse",                    regionCode: "179",    parent: "Tunesien" },
  { name: "Tunis & Umgebung",          regionCode: "100080", parent: "Tunesien" },

  // ─── MAROKKO ─────────────────────────────────────────────────────────────────
  { name: "Marokko – alle Regionen",   regionCode: "113",    parent: "Marokko" },
  { name: "Agadir",                    regionCode: "182",    parent: "Marokko" },
  { name: "Marrakesch",                regionCode: "183",    parent: "Marokko" },
  { name: "Tanger & Umgebung",         regionCode: "100085", parent: "Marokko" },

  // ─── KROATIEN ────────────────────────────────────────────────────────────────
  { name: "Kroatien – alle Regionen",  regionCode: "111",    parent: "Kroatien" },
  { name: "Dalmatien",                 regionCode: "655",    parent: "Kroatien" },
  { name: "Dubrovnik & Umgebung",      regionCode: "656",    parent: "Kroatien" },
  { name: "Istrien",                   regionCode: "657",    parent: "Kroatien" },
  { name: "Kvarner Bucht",             regionCode: "658",    parent: "Kroatien" },
  { name: "Split & Umgebung",          regionCode: "100090", parent: "Kroatien" },
  { name: "Zadar & Umgebung",          regionCode: "100091", parent: "Kroatien" },

  // ─── BULGARIEN ───────────────────────────────────────────────────────────────
  { name: "Bulgarien – alle Regionen", regionCode: "105",    parent: "Bulgarien" },
  { name: "Burgas & Umgebung",         regionCode: "100095", parent: "Bulgarien" },
  { name: "Goldstrand",                regionCode: "163",    parent: "Bulgarien" },
  { name: "Sonnenstrand",              regionCode: "162",    parent: "Bulgarien" },
  { name: "Varna & Umgebung",          regionCode: "100096", parent: "Bulgarien" },

  // ─── ZYPERN ──────────────────────────────────────────────────────────────────
  { name: "Zypern – alle Regionen",    regionCode: "106",    parent: "Zypern" },
  { name: "Ayia Napa",                 regionCode: "100100", parent: "Zypern" },
  { name: "Larnaka & Umgebung",        regionCode: "100101", parent: "Zypern" },
  { name: "Limassol & Umgebung",       regionCode: "100102", parent: "Zypern" },
  { name: "Nordzypern",                regionCode: "100103", parent: "Zypern" },
  { name: "Paphos & Umgebung",         regionCode: "100104", parent: "Zypern" },

  // ─── ITALIEN ─────────────────────────────────────────────────────────────────
  { name: "Italien – alle Regionen",   regionCode: "108",    parent: "Italien" },
  { name: "Amalfiküste",               regionCode: "100110", parent: "Italien" },
  { name: "Apulien",                   regionCode: "100111", parent: "Italien" },
  { name: "Capri",                     regionCode: "100112", parent: "Italien" },
  { name: "Elba",                      regionCode: "100113", parent: "Italien" },
  { name: "Gardasee",                  regionCode: "668",    parent: "Italien" },
  { name: "Ischia",                    regionCode: "100114", parent: "Italien" },
  { name: "Kalabrien",                 regionCode: "100115", parent: "Italien" },
  { name: "Ligurien",                  regionCode: "100116", parent: "Italien" },
  { name: "Neapel & Umgebung",         regionCode: "100117", parent: "Italien" },
  { name: "Rom & Umgebung",            regionCode: "669",    parent: "Italien" },
  { name: "Sardinien",                 regionCode: "145",    parent: "Italien" },
  { name: "Sizilien",                  regionCode: "146",    parent: "Italien" },
  { name: "Südtirol",                  regionCode: "100118", parent: "Italien" },
  { name: "Toskana",                   regionCode: "670",    parent: "Italien" },
  { name: "Venetien & Venedig",        regionCode: "100119", parent: "Italien" },

  // ─── FRANKREICH ──────────────────────────────────────────────────────────────
  { name: "Frankreich – alle",         regionCode: "102",    parent: "Frankreich" },
  { name: "Côte d'Azur",               regionCode: "100120", parent: "Frankreich" },
  { name: "Korsika",                   regionCode: "100121", parent: "Frankreich" },
  { name: "Paris & Umgebung",          regionCode: "100122", parent: "Frankreich" },
  { name: "Provence",                  regionCode: "100123", parent: "Frankreich" },

  // ─── ÖSTERREICH ──────────────────────────────────────────────────────────────
  { name: "Österreich – alle",         regionCode: "115",    parent: "Österreich" },
  { name: "Tirol",                     regionCode: "100125", parent: "Österreich" },
  { name: "Salzburger Land",           regionCode: "100126", parent: "Österreich" },
  { name: "Wien",                      regionCode: "100127", parent: "Österreich" },
  { name: "Kärnten",                   regionCode: "100128", parent: "Österreich" },
  { name: "Steiermark",                regionCode: "100129", parent: "Österreich" },
  { name: "Vorarlberg",                regionCode: "100130", parent: "Österreich" },

  // ─── SCHWEIZ ─────────────────────────────────────────────────────────────────
  { name: "Schweiz – alle",            regionCode: "118",    parent: "Schweiz" },
  { name: "Bern & Umgebung",           regionCode: "100135", parent: "Schweiz" },
  { name: "Graubünden",                regionCode: "100136", parent: "Schweiz" },
  { name: "Tessin",                    regionCode: "100137", parent: "Schweiz" },
  { name: "Wallis",                    regionCode: "100138", parent: "Schweiz" },
  { name: "Zürich & Umgebung",         regionCode: "100139", parent: "Schweiz" },

  // ─── MALTA ───────────────────────────────────────────────────────────────────
  { name: "Malta – alle Inseln",       regionCode: "114",    parent: "Malta" },
  { name: "Gozo",                      regionCode: "100140", parent: "Malta" },
  { name: "Malta",                     regionCode: "100141", parent: "Malta" },

  // ─── ALBANIEN ────────────────────────────────────────────────────────────────
  { name: "Albanien – alle",           regionCode: "100145", parent: "Albanien" },
  { name: "Albanische Riviera",        regionCode: "100146", parent: "Albanien" },

  // ─── MONTENEGRO ──────────────────────────────────────────────────────────────
  { name: "Montenegro – alle",         regionCode: "100150", parent: "Montenegro" },
  { name: "Budva & Umgebung",          regionCode: "100151", parent: "Montenegro" },
  { name: "Kotor & Umgebung",          regionCode: "100152", parent: "Montenegro" },

  // ─── KAPVERDEN ───────────────────────────────────────────────────────────────
  { name: "Kapverden – alle Inseln",   regionCode: "100155", parent: "Kapverden" },
  { name: "Boa Vista",                 regionCode: "100156", parent: "Kapverden" },
  { name: "Sal",                       regionCode: "100157", parent: "Kapverden" },
  { name: "Santiago",                  regionCode: "100158", parent: "Kapverden" },

  // ─── DUBAI / VAE ─────────────────────────────────────────────────────────────
  { name: "VAE – alle Regionen",       regionCode: "100160", parent: "Dubai / VAE" },
  { name: "Abu Dhabi",                 regionCode: "100161", parent: "Dubai / VAE" },
  { name: "Dubai",                     regionCode: "200",    parent: "Dubai / VAE" },
  { name: "Ras al-Khaimah",            regionCode: "100162", parent: "Dubai / VAE" },
  { name: "Sharjah",                   regionCode: "100163", parent: "Dubai / VAE" },

  // ─── OMAN ────────────────────────────────────────────────────────────────────
  { name: "Oman – alle Regionen",      regionCode: "100165", parent: "Oman" },
  { name: "Maskat & Umgebung",         regionCode: "100166", parent: "Oman" },
  { name: "Salalah",                   regionCode: "100167", parent: "Oman" },

  // ─── JORDANIEN ───────────────────────────────────────────────────────────────
  { name: "Jordanien – alle",          regionCode: "100170", parent: "Jordanien" },
  { name: "Akaba & Rotes Meer",        regionCode: "100171", parent: "Jordanien" },
  { name: "Amman & Petra",             regionCode: "100172", parent: "Jordanien" },

  // ─── ISRAEL ──────────────────────────────────────────────────────────────────
  { name: "Israel – alle Regionen",    regionCode: "100175", parent: "Israel" },
  { name: "Eilat",                     regionCode: "100176", parent: "Israel" },
  { name: "Tel Aviv & Jerusalem",      regionCode: "100177", parent: "Israel" },

  // ─── MALEDIVEN ───────────────────────────────────────────────────────────────
  { name: "Malediven – alle Atolle",   regionCode: "250",    parent: "Malediven" },
  { name: "Ari-Atoll",                 regionCode: "100180", parent: "Malediven" },
  { name: "Malé & Nord-Malé-Atoll",    regionCode: "100181", parent: "Malediven" },
  { name: "Süd-Malé-Atoll",            regionCode: "100182", parent: "Malediven" },

  // ─── MAURITIUS ───────────────────────────────────────────────────────────────
  { name: "Mauritius – alle Regionen", regionCode: "251",    parent: "Mauritius" },
  { name: "Mauritius Nord",            regionCode: "100185", parent: "Mauritius" },
  { name: "Mauritius Ost",             regionCode: "100186", parent: "Mauritius" },
  { name: "Mauritius Süd",             regionCode: "100187", parent: "Mauritius" },
  { name: "Mauritius West",            regionCode: "100188", parent: "Mauritius" },

  // ─── SEYCHELLEN ──────────────────────────────────────────────────────────────
  { name: "Seychellen – alle",         regionCode: "252",    parent: "Seychellen" },
  { name: "La Digue",                  regionCode: "100190", parent: "Seychellen" },
  { name: "Mahé",                      regionCode: "100191", parent: "Seychellen" },
  { name: "Praslin",                   regionCode: "100192", parent: "Seychellen" },

  // ─── SRI LANKA ───────────────────────────────────────────────────────────────
  { name: "Sri Lanka – alle Regionen", regionCode: "253",    parent: "Sri Lanka" },
  { name: "Colombo & Umgebung",        regionCode: "100195", parent: "Sri Lanka" },
  { name: "Kulturdreieck",             regionCode: "100196", parent: "Sri Lanka" },
  { name: "Negombo",                   regionCode: "100197", parent: "Sri Lanka" },
  { name: "Süd-Sri Lanka",             regionCode: "100198", parent: "Sri Lanka" },

  // ─── THAILAND ────────────────────────────────────────────────────────────────
  { name: "Thailand – alle Regionen",  regionCode: "300",    parent: "Thailand" },
  { name: "Bangkok & Umgebung",        regionCode: "100200", parent: "Thailand" },
  { name: "Hua Hin",                   regionCode: "100201", parent: "Thailand" },
  { name: "Khao Lak",                  regionCode: "100202", parent: "Thailand" },
  { name: "Koh Phi Phi",               regionCode: "100203", parent: "Thailand" },
  { name: "Koh Samui",                 regionCode: "100204", parent: "Thailand" },
  { name: "Koh Tao",                   regionCode: "100205", parent: "Thailand" },
  { name: "Krabi",                     regionCode: "100206", parent: "Thailand" },
  { name: "Pattaya",                   regionCode: "100207", parent: "Thailand" },
  { name: "Phuket",                    regionCode: "100208", parent: "Thailand" },
  { name: "Chiang Mai",                regionCode: "100209", parent: "Thailand" },

  // ─── BALI / INDONESIEN ───────────────────────────────────────────────────────
  { name: "Indonesien – alle",         regionCode: "100210", parent: "Bali / Indonesien" },
  { name: "Bali – alle Regionen",      regionCode: "301",    parent: "Bali / Indonesien" },
  { name: "Kuta & Seminyak",           regionCode: "100211", parent: "Bali / Indonesien" },
  { name: "Nusa Dua",                  regionCode: "100212", parent: "Bali / Indonesien" },
  { name: "Ubud",                      regionCode: "100213", parent: "Bali / Indonesien" },
  { name: "Lombok",                    regionCode: "100214", parent: "Bali / Indonesien" },

  // ─── VIETNAM ─────────────────────────────────────────────────────────────────
  { name: "Vietnam – alle Regionen",   regionCode: "100215", parent: "Vietnam" },
  { name: "Da Nang & Hoi An",          regionCode: "100216", parent: "Vietnam" },
  { name: "Hanoi & Umgebung",          regionCode: "100217", parent: "Vietnam" },
  { name: "Ho-Chi-Minh-Stadt",         regionCode: "100218", parent: "Vietnam" },
  { name: "Phu Quoc",                  regionCode: "100219", parent: "Vietnam" },

  // ─── SINGAPUR ────────────────────────────────────────────────────────────────
  { name: "Singapur",                  regionCode: "100220", parent: "Singapur" },

  // ─── HONG KONG ───────────────────────────────────────────────────────────────
  { name: "Hongkong",                  regionCode: "100221", parent: "Hongkong" },

  // ─── JAPAN ───────────────────────────────────────────────────────────────────
  { name: "Japan – alle Regionen",     regionCode: "100225", parent: "Japan" },
  { name: "Kyoto & Osaka",             regionCode: "100226", parent: "Japan" },
  { name: "Okinawa",                   regionCode: "100227", parent: "Japan" },
  { name: "Tokio & Umgebung",          regionCode: "100228", parent: "Japan" },

  // ─── INDIEN ──────────────────────────────────────────────────────────────────
  { name: "Indien – alle Regionen",    regionCode: "100230", parent: "Indien" },
  { name: "Delhi & Rajasthan",         regionCode: "100231", parent: "Indien" },
  { name: "Goa",                       regionCode: "100232", parent: "Indien" },
  { name: "Kerala",                    regionCode: "100233", parent: "Indien" },
  { name: "Mumbai",                    regionCode: "100234", parent: "Indien" },

  // ─── CHINA ───────────────────────────────────────────────────────────────────
  { name: "China – alle Regionen",     regionCode: "100235", parent: "China" },
  { name: "Beijing (Peking)",          regionCode: "100236", parent: "China" },
  { name: "Hainan",                    regionCode: "100237", parent: "China" },
  { name: "Shanghai",                  regionCode: "100238", parent: "China" },

  // ─── DOMINIKANISCHE REPUBLIK ─────────────────────────────────────────────────
  { name: "Dominikanische Republik",   regionCode: "400",    parent: "Dominikanische Republik" },
  { name: "Bayahibe",                  regionCode: "100240", parent: "Dominikanische Republik" },
  { name: "La Romana",                 regionCode: "100241", parent: "Dominikanische Republik" },
  { name: "Puerto Plata",              regionCode: "100242", parent: "Dominikanische Republik" },
  { name: "Punta Cana",                regionCode: "100243", parent: "Dominikanische Republik" },
  { name: "Samaná",                    regionCode: "100244", parent: "Dominikanische Republik" },
  { name: "Santo Domingo",             regionCode: "100245", parent: "Dominikanische Republik" },

  // ─── KUBA ────────────────────────────────────────────────────────────────────
  { name: "Kuba – alle Regionen",      regionCode: "401",    parent: "Kuba" },
  { name: "Havanna",                   regionCode: "100250", parent: "Kuba" },
  { name: "Holguín & Guardalavaca",    regionCode: "100251", parent: "Kuba" },
  { name: "Trinidad",                  regionCode: "100252", parent: "Kuba" },
  { name: "Varadero",                  regionCode: "100253", parent: "Kuba" },

  // ─── MEXIKO ──────────────────────────────────────────────────────────────────
  { name: "Mexiko – alle Regionen",    regionCode: "402",    parent: "Mexiko" },
  { name: "Acapulco",                  regionCode: "100255", parent: "Mexiko" },
  { name: "Cancún",                    regionCode: "100256", parent: "Mexiko" },
  { name: "Los Cabos",                 regionCode: "100257", parent: "Mexiko" },
  { name: "Mexiko-Stadt",              regionCode: "100258", parent: "Mexiko" },
  { name: "Riviera Maya",              regionCode: "100259", parent: "Mexiko" },
  { name: "Puerto Vallarta",           regionCode: "100260", parent: "Mexiko" },

  // ─── JAMAIKA ─────────────────────────────────────────────────────────────────
  { name: "Jamaika – alle Regionen",   regionCode: "100265", parent: "Jamaika" },
  { name: "Kingston",                  regionCode: "100266", parent: "Jamaika" },
  { name: "Montego Bay",               regionCode: "100267", parent: "Jamaika" },
  { name: "Negril",                    regionCode: "100268", parent: "Jamaika" },
  { name: "Ocho Rios",                 regionCode: "100269", parent: "Jamaika" },

  // ─── BAHAMAS ─────────────────────────────────────────────────────────────────
  { name: "Bahamas – alle Inseln",     regionCode: "100270", parent: "Bahamas" },
  { name: "Nassau & Paradise Island",  regionCode: "100271", parent: "Bahamas" },

  // ─── USA ─────────────────────────────────────────────────────────────────────
  { name: "USA – alle Regionen",       regionCode: "500",    parent: "USA" },
  { name: "Florida – alle",            regionCode: "100280", parent: "USA" },
  { name: "Florida Keys",              regionCode: "100281", parent: "USA" },
  { name: "Fort Lauderdale",           regionCode: "100282", parent: "USA" },
  { name: "Kalifornien",               regionCode: "100283", parent: "USA" },
  { name: "Las Vegas",                 regionCode: "100284", parent: "USA" },
  { name: "Los Angeles",               regionCode: "100285", parent: "USA" },
  { name: "Miami",                     regionCode: "100286", parent: "USA" },
  { name: "New York",                  regionCode: "100287", parent: "USA" },
  { name: "Orlando",                   regionCode: "100288", parent: "USA" },
  { name: "San Francisco",             regionCode: "100289", parent: "USA" },

  // ─── KANADA ──────────────────────────────────────────────────────────────────
  { name: "Kanada – alle Regionen",    regionCode: "100295", parent: "Kanada" },
  { name: "British Columbia",          regionCode: "100296", parent: "Kanada" },
  { name: "Montréal",                  regionCode: "100297", parent: "Kanada" },
  { name: "Ontario",                   regionCode: "100298", parent: "Kanada" },
  { name: "Toronto",                   regionCode: "100299", parent: "Kanada" },
  { name: "Vancouver",                 regionCode: "100300", parent: "Kanada" },

  // ─── KENIA ───────────────────────────────────────────────────────────────────
  { name: "Kenia – alle Regionen",     regionCode: "600",    parent: "Kenia" },
  { name: "Diani Beach",               regionCode: "100310", parent: "Kenia" },
  { name: "Malindi",                   regionCode: "100311", parent: "Kenia" },
  { name: "Mombasa",                   regionCode: "100312", parent: "Kenia" },
  { name: "Nairobi & Safari",          regionCode: "100313", parent: "Kenia" },

  // ─── TANSANIA ────────────────────────────────────────────────────────────────
  { name: "Tansania – alle Regionen",  regionCode: "601",    parent: "Tansania" },
  { name: "Dar es Salaam",             regionCode: "100315", parent: "Tansania" },
  { name: "Sansibar",                  regionCode: "100316", parent: "Tansania" },
  { name: "Serengeti & Safari",        regionCode: "100317", parent: "Tansania" },

  // ─── SÜDAFRIKA ───────────────────────────────────────────────────────────────
  { name: "Südafrika – alle Regionen", regionCode: "602",    parent: "Südafrika" },
  { name: "Durban & KwaZulu-Natal",    regionCode: "100320", parent: "Südafrika" },
  { name: "Kapstadt & Kapregion",      regionCode: "100321", parent: "Südafrika" },
  { name: "Krüger Park & Safari",      regionCode: "100322", parent: "Südafrika" },

  // ─── MAURITIUS / RÉUNION ─────────────────────────────────────────────────────
  { name: "Réunion",                   regionCode: "100325", parent: "Réunion" },

  // ─── AUSTRALIEN / NEUSEELAND ─────────────────────────────────────────────────
  { name: "Australien – alle",         regionCode: "700",    parent: "Australien" },
  { name: "Gold Coast & Queensland",   regionCode: "100330", parent: "Australien" },
  { name: "Melbourne",                 regionCode: "100331", parent: "Australien" },
  { name: "Sydney & New South Wales",  regionCode: "100332", parent: "Australien" },
  { name: "Neuseeland – alle",         regionCode: "100335", parent: "Neuseeland" },
  { name: "Auckland",                  regionCode: "100336", parent: "Neuseeland" },
  { name: "Südinsel",                  regionCode: "100337", parent: "Neuseeland" },

  // ─── BRASILIEN ───────────────────────────────────────────────────────────────
  { name: "Brasilien – alle Regionen", regionCode: "100340", parent: "Brasilien" },
  { name: "Fortaleza",                 regionCode: "100341", parent: "Brasilien" },
  { name: "Natal",                     regionCode: "100342", parent: "Brasilien" },
  { name: "Rio de Janeiro",            regionCode: "100343", parent: "Brasilien" },
  { name: "São Paulo",                 regionCode: "100344", parent: "Brasilien" },

  // ─── ARGENTINIEN ─────────────────────────────────────────────────────────────
  { name: "Argentinien – alle",        regionCode: "100345", parent: "Argentinien" },
  { name: "Buenos Aires",              regionCode: "100346", parent: "Argentinien" },
  { name: "Patagonien",                regionCode: "100347", parent: "Argentinien" },

  // ─── PERU ────────────────────────────────────────────────────────────────────
  { name: "Peru – alle Regionen",      regionCode: "100350", parent: "Peru" },
  { name: "Cusco & Machu Picchu",      regionCode: "100351", parent: "Peru" },
  { name: "Lima",                      regionCode: "100352", parent: "Peru" },

  // ─── COSTA RICA ──────────────────────────────────────────────────────────────
  { name: "Costa Rica – alle",         regionCode: "100355", parent: "Costa Rica" },
  { name: "Guanacaste",                regionCode: "100356", parent: "Costa Rica" },
  { name: "San José & Umgebung",       regionCode: "100357", parent: "Costa Rica" },

  // ─── THAILAND NACHBARLÄNDER ──────────────────────────────────────────────────
  { name: "Kambodscha – alle",         regionCode: "100360", parent: "Kambodscha" },
  { name: "Angkor Wat & Siem Reap",    regionCode: "100361", parent: "Kambodscha" },
  { name: "Phnom Penh",                regionCode: "100362", parent: "Kambodscha" },
  { name: "Sihanoukville",             regionCode: "100363", parent: "Kambodscha" },

  // ─── MYANMAR ─────────────────────────────────────────────────────────────────
  { name: "Myanmar – alle Regionen",   regionCode: "100365", parent: "Myanmar" },
  { name: "Bagan",                     regionCode: "100366", parent: "Myanmar" },
  { name: "Yangon",                    regionCode: "100367", parent: "Myanmar" },

  // ─── PHILIPPINEN ─────────────────────────────────────────────────────────────
  { name: "Philippinen – alle",        regionCode: "100370", parent: "Philippinen" },
  { name: "Boracay",                   regionCode: "100371", parent: "Philippinen" },
  { name: "Cebu",                      regionCode: "100372", parent: "Philippinen" },
  { name: "Manila & Umgebung",         regionCode: "100373", parent: "Philippinen" },
  { name: "Palawan",                   regionCode: "100374", parent: "Philippinen" },

  // ─── MALAYSIA ────────────────────────────────────────────────────────────────
  { name: "Malaysia – alle Regionen",  regionCode: "100375", parent: "Malaysia" },
  { name: "Borneo (Sabah)",            regionCode: "100376", parent: "Malaysia" },
  { name: "Kuala Lumpur",              regionCode: "100377", parent: "Malaysia" },
  { name: "Langkawi",                  regionCode: "100378", parent: "Malaysia" },
  { name: "Penang",                    regionCode: "100379", parent: "Malaysia" },

];

export default IBE_DESTINATIONS;
