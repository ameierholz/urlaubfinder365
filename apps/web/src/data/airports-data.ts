export type Airport = { iata: string; name: string; city: string; country: string };

export const AIRPORTS_DATA: Airport[] = [
  // ── Deutschland ──────────────────────────────────────────────────────────────
  { iata: "FRA", name: "Frankfurt Airport", city: "Frankfurt am Main", country: "Deutschland" },
  { iata: "MUC", name: "München Franz Josef Strauß", city: "München", country: "Deutschland" },
  { iata: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Deutschland" },
  { iata: "DUS", name: "Düsseldorf Airport", city: "Düsseldorf", country: "Deutschland" },
  { iata: "HAM", name: "Hamburg Airport", city: "Hamburg", country: "Deutschland" },
  { iata: "STR", name: "Stuttgart Airport", city: "Stuttgart", country: "Deutschland" },
  { iata: "CGN", name: "Köln Bonn Airport", city: "Köln", country: "Deutschland" },
  { iata: "NUE", name: "Nürnberg Airport", city: "Nürnberg", country: "Deutschland" },
  { iata: "HAJ", name: "Hannover Airport", city: "Hannover", country: "Deutschland" },
  { iata: "BRE", name: "Bremen Airport", city: "Bremen", country: "Deutschland" },
  { iata: "FMO", name: "Münster Osnabrück Airport", city: "Münster", country: "Deutschland" },
  { iata: "DTM", name: "Dortmund Airport", city: "Dortmund", country: "Deutschland" },
  { iata: "PAD", name: "Paderborn Lippstadt Airport", city: "Paderborn", country: "Deutschland" },
  { iata: "SCN", name: "Saarbrücken Airport", city: "Saarbrücken", country: "Deutschland" },
  { iata: "FDH", name: "Friedrichshafen Airport", city: "Friedrichshafen", country: "Deutschland" },
  { iata: "FKB", name: "Karlsruhe Baden-Baden Airport", city: "Karlsruhe", country: "Deutschland" },
  { iata: "FMM", name: "Memmingen Airport", city: "Memmingen", country: "Deutschland" },
  { iata: "NRN", name: "Weeze Airport", city: "Weeze", country: "Deutschland" },
  { iata: "HHN", name: "Frankfurt Hahn Airport", city: "Hahn", country: "Deutschland" },
  { iata: "ERF", name: "Erfurt Weimar Airport", city: "Erfurt", country: "Deutschland" },
  { iata: "DRS", name: "Dresden Airport", city: "Dresden", country: "Deutschland" },
  { iata: "LEJ", name: "Leipzig Halle Airport", city: "Leipzig", country: "Deutschland" },
  { iata: "RLG", name: "Rostock Laage Airport", city: "Rostock", country: "Deutschland" },
  { iata: "LBC", name: "Lübeck Airport", city: "Lübeck", country: "Deutschland" },

  // ── Österreich ───────────────────────────────────────────────────────────────
  { iata: "VIE", name: "Wien Schwechat Airport", city: "Wien", country: "Österreich" },
  { iata: "GRZ", name: "Graz Airport", city: "Graz", country: "Österreich" },
  { iata: "INN", name: "Innsbruck Airport", city: "Innsbruck", country: "Österreich" },
  { iata: "KLU", name: "Klagenfurt Airport", city: "Klagenfurt", country: "Österreich" },
  { iata: "LNZ", name: "Linz Airport", city: "Linz", country: "Österreich" },
  { iata: "SZG", name: "Salzburg Airport", city: "Salzburg", country: "Österreich" },

  // ── Schweiz ──────────────────────────────────────────────────────────────────
  { iata: "ZRH", name: "Zürich Airport", city: "Zürich", country: "Schweiz" },
  { iata: "GVA", name: "Genf Cointrin Airport", city: "Genf", country: "Schweiz" },
  { iata: "BSL", name: "EuroAirport Basel-Mulhouse", city: "Basel", country: "Schweiz" },
  { iata: "BRN", name: "Bern Airport", city: "Bern", country: "Schweiz" },

  // ── Türkei ───────────────────────────────────────────────────────────────────
  { iata: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Türkei" },
  { iata: "SAW", name: "Istanbul Sabiha Gökçen", city: "Istanbul", country: "Türkei" },
  { iata: "AYT", name: "Antalya Airport", city: "Antalya", country: "Türkei" },
  { iata: "ESB", name: "Ankara Esenboğa Airport", city: "Ankara", country: "Türkei" },
  { iata: "ADB", name: "İzmir Adnan Menderes Airport", city: "İzmir", country: "Türkei" },
  { iata: "DLM", name: "Dalaman Airport", city: "Dalaman", country: "Türkei" },
  { iata: "BJV", name: "Bodrum Milas Airport", city: "Bodrum", country: "Türkei" },
  { iata: "GZT", name: "Gaziantep Airport", city: "Gaziantep", country: "Türkei" },
  { iata: "TZX", name: "Trabzon Airport", city: "Trabzon", country: "Türkei" },
  { iata: "ADF", name: "Adıyaman Airport", city: "Adıyaman", country: "Türkei" },
  { iata: "MLX", name: "Malatya Erhaç Airport", city: "Malatya", country: "Türkei" },
  { iata: "VAN", name: "Van Ferit Melen Airport", city: "Van", country: "Türkei" },
  { iata: "DIY", name: "Diyarbakır Airport", city: "Diyarbakır", country: "Türkei" },
  { iata: "KYA", name: "Konya Airport", city: "Konya", country: "Türkei" },
  { iata: "ASR", name: "Kayseri Erkilet Airport", city: "Kayseri", country: "Türkei" },
  { iata: "EZS", name: "Elazığ Airport", city: "Elazığ", country: "Türkei" },
  { iata: "SFQ", name: "Şanlıurfa GAP Airport", city: "Şanlıurfa", country: "Türkei" },

  // ── Griechenland ─────────────────────────────────────────────────────────────
  { iata: "ATH", name: "Athen Eleftherios Venizelos", city: "Athen", country: "Griechenland" },
  { iata: "HER", name: "Heraklion Nikos Kazantzakis", city: "Heraklion", country: "Griechenland" },
  { iata: "RHO", name: "Rhodos Diagoras Airport", city: "Rhodos", country: "Griechenland" },
  { iata: "CFU", name: "Korfu Ioannis Kapodistrias", city: "Korfu", country: "Griechenland" },
  { iata: "JTR", name: "Santorini Airport", city: "Santorini", country: "Griechenland" },
  { iata: "JMK", name: "Mykonos Airport", city: "Mykonos", country: "Griechenland" },
  { iata: "KGS", name: "Kos Hippocrates Airport", city: "Kos", country: "Griechenland" },
  { iata: "ZTH", name: "Zakynthos Airport", city: "Zakynthos", country: "Griechenland" },
  { iata: "EFL", name: "Kefalonia Airport", city: "Kefalonia", country: "Griechenland" },
  { iata: "JSI", name: "Skiathos Airport", city: "Skiathos", country: "Griechenland" },
  { iata: "CHQ", name: "Chania Airport", city: "Chania", country: "Griechenland" },
  { iata: "SKG", name: "Thessaloniki Makedonia Airport", city: "Thessaloniki", country: "Griechenland" },
  { iata: "PVK", name: "Preveza Lefkada Airport", city: "Preveza", country: "Griechenland" },
  { iata: "KLX", name: "Kalamata Airport", city: "Kalamata", country: "Griechenland" },
  { iata: "AOK", name: "Karpathos Airport", city: "Karpathos", country: "Griechenland" },
  { iata: "SMI", name: "Samos Airport", city: "Samos", country: "Griechenland" },
  { iata: "MJT", name: "Mytilene Airport", city: "Mytilene", country: "Griechenland" },
  { iata: "LXS", name: "Lemnos Airport", city: "Lemnos", country: "Griechenland" },

  // ── Spanien ──────────────────────────────────────────────────────────────────
  { iata: "MAD", name: "Madrid Barajas Airport", city: "Madrid", country: "Spanien" },
  { iata: "BCN", name: "Barcelona El Prat Airport", city: "Barcelona", country: "Spanien" },
  { iata: "PMI", name: "Palma de Mallorca Airport", city: "Palma de Mallorca", country: "Spanien" },
  { iata: "TFS", name: "Teneriffa Süd Airport", city: "Teneriffa", country: "Spanien" },
  { iata: "LPA", name: "Gran Canaria Airport", city: "Las Palmas", country: "Spanien" },
  { iata: "ACE", name: "Lanzarote Airport", city: "Lanzarote", country: "Spanien" },
  { iata: "FUE", name: "Fuerteventura Airport", city: "Fuerteventura", country: "Spanien" },
  { iata: "IBZ", name: "Ibiza Airport", city: "Ibiza", country: "Spanien" },
  { iata: "AGP", name: "Málaga Costa del Sol Airport", city: "Málaga", country: "Spanien" },
  { iata: "VLC", name: "Valencia Airport", city: "Valencia", country: "Spanien" },
  { iata: "SVQ", name: "Sevilla Airport", city: "Sevilla", country: "Spanien" },
  { iata: "ALC", name: "Alicante Airport", city: "Alicante", country: "Spanien" },
  { iata: "SDR", name: "Santander Airport", city: "Santander", country: "Spanien" },
  { iata: "BIO", name: "Bilbao Airport", city: "Bilbao", country: "Spanien" },
  { iata: "SCQ", name: "Santiago de Compostela Airport", city: "Santiago de Compostela", country: "Spanien" },
  { iata: "OVD", name: "Asturien Airport", city: "Oviedo", country: "Spanien" },
  { iata: "TFN", name: "Teneriffa Nord Airport", city: "Teneriffa", country: "Spanien" },
  { iata: "GRX", name: "Granada Airport", city: "Granada", country: "Spanien" },
  { iata: "ZAZ", name: "Zaragoza Airport", city: "Zaragoza", country: "Spanien" },
  { iata: "MAH", name: "Menorca Airport", city: "Menorca", country: "Spanien" },
  { iata: "MHC", name: "La Coruña Airport", city: "La Coruña", country: "Spanien" },
  { iata: "GMZ", name: "La Gomera Airport", city: "La Gomera", country: "Spanien" },
  { iata: "SPC", name: "La Palma Airport", city: "La Palma", country: "Spanien" },
  { iata: "VDE", name: "El Hierro Airport", city: "El Hierro", country: "Spanien" },

  // ── Italien ──────────────────────────────────────────────────────────────────
  { iata: "FCO", name: "Rom Fiumicino Airport", city: "Rom", country: "Italien" },
  { iata: "MXP", name: "Mailand Malpensa Airport", city: "Mailand", country: "Italien" },
  { iata: "LIN", name: "Mailand Linate Airport", city: "Mailand", country: "Italien" },
  { iata: "BGY", name: "Bergamo Orio al Serio Airport", city: "Bergamo", country: "Italien" },
  { iata: "VCE", name: "Venedig Marco Polo Airport", city: "Venedig", country: "Italien" },
  { iata: "TSF", name: "Treviso Airport", city: "Treviso", country: "Italien" },
  { iata: "NAP", name: "Neapel Capodichino Airport", city: "Neapel", country: "Italien" },
  { iata: "BLQ", name: "Bologna Guglielmo Marconi Airport", city: "Bologna", country: "Italien" },
  { iata: "PSA", name: "Pisa Galileo Galilei Airport", city: "Pisa", country: "Italien" },
  { iata: "TRN", name: "Turin Airport", city: "Turin", country: "Italien" },
  { iata: "CTA", name: "Catania Fontanarossa Airport", city: "Catania", country: "Italien" },
  { iata: "PMO", name: "Palermo Falcone Borsellino Airport", city: "Palermo", country: "Italien" },
  { iata: "BRI", name: "Bari Karol Wojtyla Airport", city: "Bari", country: "Italien" },
  { iata: "VRN", name: "Verona Airport", city: "Verona", country: "Italien" },
  { iata: "CAG", name: "Cagliari Elmas Airport", city: "Cagliari", country: "Italien" },
  { iata: "OLB", name: "Olbia Costa Smeralda Airport", city: "Olbia", country: "Italien" },
  { iata: "AOI", name: "Ancona Falconara Airport", city: "Ancona", country: "Italien" },
  { iata: "FLR", name: "Florenz Peretola Airport", city: "Florenz", country: "Italien" },
  { iata: "REG", name: "Reggio Calabria Airport", city: "Reggio Calabria", country: "Italien" },
  { iata: "BDS", name: "Brindisi Casale Airport", city: "Brindisi", country: "Italien" },

  // ── Portugal ─────────────────────────────────────────────────────────────────
  { iata: "LIS", name: "Lissabon Humberto Delgado Airport", city: "Lissabon", country: "Portugal" },
  { iata: "OPO", name: "Porto Francisco Sá Carneiro Airport", city: "Porto", country: "Portugal" },
  { iata: "FAO", name: "Faro Airport", city: "Faro", country: "Portugal" },
  { iata: "FNC", name: "Funchal Airport", city: "Funchal", country: "Portugal" },
  { iata: "PDL", name: "Ponta Delgada João Paulo II Airport", city: "Ponta Delgada", country: "Portugal" },
  { iata: "TER", name: "Terceira Lajes Airport", city: "Terceira", country: "Portugal" },
  { iata: "PIX", name: "Pico Airport", city: "Pico", country: "Portugal" },
  { iata: "HOR", name: "Horta Airport", city: "Horta", country: "Portugal" },
  { iata: "SMA", name: "Santa Maria Airport", city: "Santa Maria", country: "Portugal" },

  // ── Frankreich ───────────────────────────────────────────────────────────────
  { iata: "CDG", name: "Paris Charles de Gaulle Airport", city: "Paris", country: "Frankreich" },
  { iata: "ORY", name: "Paris Orly Airport", city: "Paris", country: "Frankreich" },
  { iata: "NCE", name: "Nizza Côte d'Azur Airport", city: "Nizza", country: "Frankreich" },
  { iata: "LYS", name: "Lyon Saint-Exupéry Airport", city: "Lyon", country: "Frankreich" },
  { iata: "MRS", name: "Marseille Provence Airport", city: "Marseille", country: "Frankreich" },
  { iata: "BOD", name: "Bordeaux Mérignac Airport", city: "Bordeaux", country: "Frankreich" },
  { iata: "TLS", name: "Toulouse Blagnac Airport", city: "Toulouse", country: "Frankreich" },
  { iata: "NTE", name: "Nantes Atlantique Airport", city: "Nantes", country: "Frankreich" },
  { iata: "SXB", name: "Straßburg Airport", city: "Straßburg", country: "Frankreich" },
  { iata: "MPL", name: "Montpellier Airport", city: "Montpellier", country: "Frankreich" },
  { iata: "LIL", name: "Lille Lesquin Airport", city: "Lille", country: "Frankreich" },
  { iata: "BIQ", name: "Biarritz Airport", city: "Biarritz", country: "Frankreich" },
  { iata: "RNS", name: "Rennes Airport", city: "Rennes", country: "Frankreich" },
  { iata: "GNB", name: "Grenoble Isère Airport", city: "Grenoble", country: "Frankreich" },
  { iata: "CFE", name: "Clermont-Ferrand Airport", city: "Clermont-Ferrand", country: "Frankreich" },

  // ── Vereinigtes Königreich ───────────────────────────────────────────────────
  { iata: "LHR", name: "London Heathrow Airport", city: "London", country: "Vereinigtes Königreich" },
  { iata: "LGW", name: "London Gatwick Airport", city: "London", country: "Vereinigtes Königreich" },
  { iata: "STN", name: "London Stansted Airport", city: "London", country: "Vereinigtes Königreich" },
  { iata: "LTN", name: "London Luton Airport", city: "London", country: "Vereinigtes Königreich" },
  { iata: "LCY", name: "London City Airport", city: "London", country: "Vereinigtes Königreich" },
  { iata: "MAN", name: "Manchester Airport", city: "Manchester", country: "Vereinigtes Königreich" },
  { iata: "BHX", name: "Birmingham Airport", city: "Birmingham", country: "Vereinigtes Königreich" },
  { iata: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "Vereinigtes Königreich" },
  { iata: "GLA", name: "Glasgow Airport", city: "Glasgow", country: "Vereinigtes Königreich" },
  { iata: "BRS", name: "Bristol Airport", city: "Bristol", country: "Vereinigtes Königreich" },
  { iata: "BHD", name: "Belfast George Best City Airport", city: "Belfast", country: "Vereinigtes Königreich" },
  { iata: "BFS", name: "Belfast International Airport", city: "Belfast", country: "Vereinigtes Königreich" },
  { iata: "NCL", name: "Newcastle Airport", city: "Newcastle", country: "Vereinigtes Königreich" },
  { iata: "LPL", name: "Liverpool John Lennon Airport", city: "Liverpool", country: "Vereinigtes Königreich" },
  { iata: "ABZ", name: "Aberdeen Airport", city: "Aberdeen", country: "Vereinigtes Königreich" },
  { iata: "INV", name: "Inverness Airport", city: "Inverness", country: "Vereinigtes Königreich" },
  { iata: "EXT", name: "Exeter Airport", city: "Exeter", country: "Vereinigtes Königreich" },
  { iata: "SOU", name: "Southampton Airport", city: "Southampton", country: "Vereinigtes Königreich" },
  { iata: "NWI", name: "Norwich Airport", city: "Norwich", country: "Vereinigtes Königreich" },
  { iata: "DSA", name: "Doncaster Sheffield Airport", city: "Doncaster", country: "Vereinigtes Königreich" },
  { iata: "HUY", name: "Humberside Airport", city: "Humberside", country: "Vereinigtes Königreich" },

  // ── Niederlande ──────────────────────────────────────────────────────────────
  { iata: "AMS", name: "Amsterdam Schiphol Airport", city: "Amsterdam", country: "Niederlande" },
  { iata: "EIN", name: "Eindhoven Airport", city: "Eindhoven", country: "Niederlande" },
  { iata: "RTM", name: "Rotterdam The Hague Airport", city: "Rotterdam", country: "Niederlande" },
  { iata: "GRQ", name: "Groningen Airport Eelde", city: "Groningen", country: "Niederlande" },
  { iata: "MST", name: "Maastricht Aachen Airport", city: "Maastricht", country: "Niederlande" },

  // ── Belgien ──────────────────────────────────────────────────────────────────
  { iata: "BRU", name: "Brüssel Airport", city: "Brüssel", country: "Belgien" },
  { iata: "CRL", name: "Brüssel Charleroi Airport", city: "Charleroi", country: "Belgien" },
  { iata: "LGG", name: "Lüttich Airport", city: "Lüttich", country: "Belgien" },
  { iata: "ANR", name: "Antwerpen Airport", city: "Antwerpen", country: "Belgien" },

  // ── Luxemburg ────────────────────────────────────────────────────────────────
  { iata: "LUX", name: "Luxemburg Findel Airport", city: "Luxemburg", country: "Luxemburg" },

  // ── Dänemark ─────────────────────────────────────────────────────────────────
  { iata: "CPH", name: "Kopenhagen Kastrup Airport", city: "Kopenhagen", country: "Dänemark" },
  { iata: "AAR", name: "Aarhus Airport", city: "Aarhus", country: "Dänemark" },
  { iata: "AAL", name: "Aalborg Airport", city: "Aalborg", country: "Dänemark" },
  { iata: "BLL", name: "Billund Airport", city: "Billund", country: "Dänemark" },
  { iata: "ODE", name: "Odense Airport", city: "Odense", country: "Dänemark" },
  { iata: "EBJ", name: "Esbjerg Airport", city: "Esbjerg", country: "Dänemark" },

  // ── Schweden ─────────────────────────────────────────────────────────────────
  { iata: "ARN", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Schweden" },
  { iata: "BMA", name: "Stockholm Bromma Airport", city: "Stockholm", country: "Schweden" },
  { iata: "GOT", name: "Göteborg Landvetter Airport", city: "Göteborg", country: "Schweden" },
  { iata: "MMX", name: "Malmö Airport", city: "Malmö", country: "Schweden" },
  { iata: "LLA", name: "Luleå Airport", city: "Luleå", country: "Schweden" },
  { iata: "UME", name: "Umeå Airport", city: "Umeå", country: "Schweden" },
  { iata: "OSD", name: "Åre Östersund Airport", city: "Östersund", country: "Schweden" },
  { iata: "KRN", name: "Kiruna Airport", city: "Kiruna", country: "Schweden" },
  { iata: "SDL", name: "Sundsvall Härnösand Airport", city: "Sundsvall", country: "Schweden" },

  // ── Norwegen ─────────────────────────────────────────────────────────────────
  { iata: "OSL", name: "Oslo Gardermoen Airport", city: "Oslo", country: "Norwegen" },
  { iata: "TRF", name: "Oslo Sandefjord Airport", city: "Sandefjord", country: "Norwegen" },
  { iata: "BGO", name: "Bergen Flesland Airport", city: "Bergen", country: "Norwegen" },
  { iata: "TRD", name: "Trondheim Værnes Airport", city: "Trondheim", country: "Norwegen" },
  { iata: "BOO", name: "Bodø Airport", city: "Bodø", country: "Norwegen" },
  { iata: "SVG", name: "Stavanger Sola Airport", city: "Stavanger", country: "Norwegen" },
  { iata: "TOS", name: "Tromsø Airport", city: "Tromsø", country: "Norwegen" },
  { iata: "AES", name: "Ålesund Vigra Airport", city: "Ålesund", country: "Norwegen" },
  { iata: "ALF", name: "Alta Airport", city: "Alta", country: "Norwegen" },
  { iata: "LKL", name: "Lakselv Airport", city: "Lakselv", country: "Norwegen" },
  { iata: "KKN", name: "Kirkenes Airport", city: "Kirkenes", country: "Norwegen" },

  // ── Finnland ─────────────────────────────────────────────────────────────────
  { iata: "HEL", name: "Helsinki Vantaa Airport", city: "Helsinki", country: "Finnland" },
  { iata: "TMP", name: "Tampere Pirkkala Airport", city: "Tampere", country: "Finnland" },
  { iata: "TKU", name: "Turku Airport", city: "Turku", country: "Finnland" },
  { iata: "OUL", name: "Oulu Airport", city: "Oulu", country: "Finnland" },
  { iata: "RVN", name: "Rovaniemi Airport", city: "Rovaniemi", country: "Finnland" },
  { iata: "IVL", name: "Ivalo Airport", city: "Ivalo", country: "Finnland" },
  { iata: "JOE", name: "Joensuu Airport", city: "Joensuu", country: "Finnland" },
  { iata: "JYV", name: "Jyväskylä Airport", city: "Jyväskylä", country: "Finnland" },
  { iata: "KAO", name: "Kuusamo Airport", city: "Kuusamo", country: "Finnland" },

  // ── Irland ───────────────────────────────────────────────────────────────────
  { iata: "DUB", name: "Dublin Airport", city: "Dublin", country: "Irland" },
  { iata: "SNN", name: "Shannon Airport", city: "Shannon", country: "Irland" },
  { iata: "ORK", name: "Cork Airport", city: "Cork", country: "Irland" },
  { iata: "KIR", name: "Kerry Airport", city: "Kerry", country: "Irland" },
  { iata: "NOC", name: "Ireland West Knock Airport", city: "Knock", country: "Irland" },

  // ── Polen ────────────────────────────────────────────────────────────────────
  { iata: "WAW", name: "Warschau Chopin Airport", city: "Warschau", country: "Polen" },
  { iata: "KRK", name: "Krakau John Paul II Airport", city: "Krakau", country: "Polen" },
  { iata: "WRO", name: "Breslau Copernicus Airport", city: "Breslau", country: "Polen" },
  { iata: "KTW", name: "Katowice Airport", city: "Katowice", country: "Polen" },
  { iata: "POZ", name: "Posen Ławica Airport", city: "Posen", country: "Polen" },
  { iata: "GDN", name: "Danzig Lech Walesa Airport", city: "Danzig", country: "Polen" },
  { iata: "RZE", name: "Rzeszów Jasionka Airport", city: "Rzeszów", country: "Polen" },
  { iata: "LUZ", name: "Lublin Airport", city: "Lublin", country: "Polen" },
  { iata: "LCJ", name: "Łódź Władysław Reymont Airport", city: "Łódź", country: "Polen" },
  { iata: "BZG", name: "Bydgoszcz Ignacy Jan Paderewski Airport", city: "Bydgoszcz", country: "Polen" },
  { iata: "SZZ", name: "Stettin Solidarność Airport", city: "Stettin", country: "Polen" },

  // ── Tschechien ───────────────────────────────────────────────────────────────
  { iata: "PRG", name: "Prag Václav Havel Airport", city: "Prag", country: "Tschechien" },
  { iata: "BRQ", name: "Brünn Tuřany Airport", city: "Brünn", country: "Tschechien" },
  { iata: "OSR", name: "Ostrava Mošnov Airport", city: "Ostrava", country: "Tschechien" },
  { iata: "KLV", name: "Karlovy Vary Airport", city: "Karlovy Vary", country: "Tschechien" },

  // ── Ungarn ───────────────────────────────────────────────────────────────────
  { iata: "BUD", name: "Budapest Ferenc Liszt Airport", city: "Budapest", country: "Ungarn" },
  { iata: "DEB", name: "Debrecen International Airport", city: "Debrecen", country: "Ungarn" },

  // ── Slowakei ─────────────────────────────────────────────────────────────────
  { iata: "BTS", name: "Bratislava M. R. Štefánik Airport", city: "Bratislava", country: "Slowakei" },
  { iata: "KSC", name: "Košice Airport", city: "Košice", country: "Slowakei" },

  // ── Slowenien ────────────────────────────────────────────────────────────────
  { iata: "LJU", name: "Ljubljana Jože Pučnik Airport", city: "Ljubljana", country: "Slowenien" },

  // ── Kroatien ─────────────────────────────────────────────────────────────────
  { iata: "ZAG", name: "Zagreb Franjo Tuđman Airport", city: "Zagreb", country: "Kroatien" },
  { iata: "SPU", name: "Split Airport", city: "Split", country: "Kroatien" },
  { iata: "DBV", name: "Dubrovnik Airport", city: "Dubrovnik", country: "Kroatien" },
  { iata: "PUY", name: "Pula Airport", city: "Pula", country: "Kroatien" },
  { iata: "ZAD", name: "Zadar Airport", city: "Zadar", country: "Kroatien" },
  { iata: "LSZ", name: "Lošinj Airport", city: "Lošinj", country: "Kroatien" },
  { iata: "BWK", name: "Brač Airport", city: "Brač", country: "Kroatien" },
  { iata: "OSI", name: "Osijek Airport", city: "Osijek", country: "Kroatien" },
  { iata: "RJK", name: "Rijeka Airport", city: "Rijeka", country: "Kroatien" },

  // ── Serbien ──────────────────────────────────────────────────────────────────
  { iata: "BEG", name: "Belgrad Nikola Tesla Airport", city: "Belgrad", country: "Serbien" },
  { iata: "INI", name: "Niš Constantine the Great Airport", city: "Niš", country: "Serbien" },

  // ── Rumänien ─────────────────────────────────────────────────────────────────
  { iata: "OTP", name: "Bukarest Henri Coandă Airport", city: "Bukarest", country: "Rumänien" },
  { iata: "CLJ", name: "Cluj-Napoca Airport", city: "Cluj-Napoca", country: "Rumänien" },
  { iata: "TSR", name: "Timișoara Traian Vuia Airport", city: "Timișoara", country: "Rumänien" },
  { iata: "SBZ", name: "Sibiu Airport", city: "Sibiu", country: "Rumänien" },
  { iata: "IAS", name: "Iași Airport", city: "Iași", country: "Rumänien" },
  { iata: "CND", name: "Constanța Mihail Kogălniceanu Airport", city: "Constanța", country: "Rumänien" },
  { iata: "OMR", name: "Oradea Airport", city: "Oradea", country: "Rumänien" },

  // ── Bulgarien ────────────────────────────────────────────────────────────────
  { iata: "SOF", name: "Sofia Airport", city: "Sofia", country: "Bulgarien" },
  { iata: "VAR", name: "Varna Airport", city: "Varna", country: "Bulgarien" },
  { iata: "BOJ", name: "Burgas Airport", city: "Burgas", country: "Bulgarien" },
  { iata: "PDV", name: "Plovdiv Airport", city: "Plovdiv", country: "Bulgarien" },

  // ── Zypern ───────────────────────────────────────────────────────────────────
  { iata: "LCA", name: "Larnaka International Airport", city: "Larnaka", country: "Zypern" },
  { iata: "PFO", name: "Paphos International Airport", city: "Paphos", country: "Zypern" },

  // ── Malta ────────────────────────────────────────────────────────────────────
  { iata: "MLA", name: "Malta International Airport", city: "Valletta", country: "Malta" },

  // ── Island ───────────────────────────────────────────────────────────────────
  { iata: "KEF", name: "Reykjavík Keflavík International Airport", city: "Reykjavík", country: "Island" },
  { iata: "AEY", name: "Akureyri Airport", city: "Akureyri", country: "Island" },
  { iata: "EGS", name: "Egilsstaðir Airport", city: "Egilsstaðir", country: "Island" },
  { iata: "RKV", name: "Reykjavík Domestic Airport", city: "Reykjavík", country: "Island" },
  { iata: "IFJ", name: "Ísafjörður Airport", city: "Ísafjörður", country: "Island" },

  // ── Ukraine ──────────────────────────────────────────────────────────────────
  { iata: "KBP", name: "Kiew Boryspil International Airport", city: "Kiew", country: "Ukraine" },
  { iata: "LWO", name: "Lemberg Danylo Halytskyi Airport", city: "Lemberg", country: "Ukraine" },
  { iata: "ODS", name: "Odessa International Airport", city: "Odessa", country: "Ukraine" },
  { iata: "HRK", name: "Charkiw International Airport", city: "Charkiw", country: "Ukraine" },

  // ── Russland ─────────────────────────────────────────────────────────────────
  { iata: "SVO", name: "Moskau Scheremetjewo Airport", city: "Moskau", country: "Russland" },
  { iata: "DME", name: "Moskau Domodedowo Airport", city: "Moskau", country: "Russland" },
  { iata: "VKO", name: "Moskau Wnukowo Airport", city: "Moskau", country: "Russland" },
  { iata: "LED", name: "Sankt Petersburg Pulkovo Airport", city: "Sankt Petersburg", country: "Russland" },
  { iata: "SVX", name: "Jekaterinburg Airport", city: "Jekaterinburg", country: "Russland" },
  { iata: "OVB", name: "Nowosibirsk Tolmachevo Airport", city: "Nowosibirsk", country: "Russland" },
  { iata: "KJA", name: "Krasnojarsk Yemelyanovo Airport", city: "Krasnojarsk", country: "Russland" },
  { iata: "IKT", name: "Irkutsk Airport", city: "Irkutsk", country: "Russland" },
  { iata: "VVO", name: "Wladiwostok International Airport", city: "Wladiwostok", country: "Russland" },
  { iata: "KHV", name: "Chabarowsk Novy Airport", city: "Chabarowsk", country: "Russland" },
  { iata: "UFA", name: "Ufa International Airport", city: "Ufa", country: "Russland" },
  { iata: "KZN", name: "Kasan International Airport", city: "Kasan", country: "Russland" },
  { iata: "ROV", name: "Rostow am Don Platov Airport", city: "Rostow am Don", country: "Russland" },
  { iata: "AER", name: "Sotschi Airport", city: "Sotschi", country: "Russland" },

  // ── Albanien ─────────────────────────────────────────────────────────────────
  { iata: "TIA", name: "Tirana Mutter Teresa Airport", city: "Tirana", country: "Albanien" },

  // ── Bosnien-Herzegowina ──────────────────────────────────────────────────────
  { iata: "SJJ", name: "Sarajevo Airport", city: "Sarajevo", country: "Bosnien-Herzegowina" },

  // ── Nordmazedonien ───────────────────────────────────────────────────────────
  { iata: "SKP", name: "Skopje Alexander der Große Airport", city: "Skopje", country: "Nordmazedonien" },

  // ── Montenegro ───────────────────────────────────────────────────────────────
  { iata: "TGD", name: "Podgorica Airport", city: "Podgorica", country: "Montenegro" },
  { iata: "TIV", name: "Tivat Airport", city: "Tivat", country: "Montenegro" },

  // ── Moldova ──────────────────────────────────────────────────────────────────
  { iata: "KIV", name: "Chișinău International Airport", city: "Chișinău", country: "Moldova" },

  // ── Belarus ──────────────────────────────────────────────────────────────────
  { iata: "MSQ", name: "Minsk National Airport", city: "Minsk", country: "Belarus" },

  // ── Litauen ──────────────────────────────────────────────────────────────────
  { iata: "VNO", name: "Vilnius Airport", city: "Vilnius", country: "Litauen" },
  { iata: "KUN", name: "Kaunas Airport", city: "Kaunas", country: "Litauen" },
  { iata: "PLQ", name: "Palanga Airport", city: "Palanga", country: "Litauen" },

  // ── Lettland ─────────────────────────────────────────────────────────────────
  { iata: "RIX", name: "Riga International Airport", city: "Riga", country: "Lettland" },

  // ── Estland ──────────────────────────────────────────────────────────────────
  { iata: "TLL", name: "Tallinn Lennart Meri Airport", city: "Tallinn", country: "Estland" },

  // ── Georgien ─────────────────────────────────────────────────────────────────
  { iata: "TBS", name: "Tiflis International Airport", city: "Tiflis", country: "Georgien" },
  { iata: "BUS", name: "Batumi International Airport", city: "Batumi", country: "Georgien" },

  // ── Armenien ─────────────────────────────────────────────────────────────────
  { iata: "EVN", name: "Jerewan Zvartnots Airport", city: "Jerewan", country: "Armenien" },

  // ── Aserbaidschan ────────────────────────────────────────────────────────────
  { iata: "GYD", name: "Baku Heydar Aliyev Airport", city: "Baku", country: "Aserbaidschan" },

  // ── Kasachstan ───────────────────────────────────────────────────────────────
  { iata: "NQZ", name: "Astana International Airport", city: "Astana", country: "Kasachstan" },
  { iata: "ALA", name: "Almaty International Airport", city: "Almaty", country: "Kasachstan" },

  // ── Usbekistan ───────────────────────────────────────────────────────────────
  { iata: "TAS", name: "Taschkent Islam Karimov Airport", city: "Taschkent", country: "Usbekistan" },
  { iata: "SKD", name: "Samarkand Airport", city: "Samarkand", country: "Usbekistan" },

  // ── Ägypten ──────────────────────────────────────────────────────────────────
  { iata: "CAI", name: "Kairo International Airport", city: "Kairo", country: "Ägypten" },
  { iata: "HRG", name: "Hurghada International Airport", city: "Hurghada", country: "Ägypten" },
  { iata: "SSH", name: "Sharm el-Sheikh Airport", city: "Sharm el-Sheikh", country: "Ägypten" },
  { iata: "RMF", name: "Marsa Alam Airport", city: "Marsa Alam", country: "Ägypten" },
  { iata: "LXR", name: "Luxor Airport", city: "Luxor", country: "Ägypten" },
  { iata: "ASW", name: "Assuan Airport", city: "Assuan", country: "Ägypten" },
  { iata: "HBE", name: "Alexandria Borg El Arab Airport", city: "Alexandria", country: "Ägypten" },
  { iata: "SPX", name: "Sphinx Airport", city: "Kairo", country: "Ägypten" },
  { iata: "ABS", name: "Abu Simbel Airport", city: "Abu Simbel", country: "Ägypten" },

  // ── Tunesien ─────────────────────────────────────────────────────────────────
  { iata: "TUN", name: "Tunis Carthage Airport", city: "Tunis", country: "Tunesien" },
  { iata: "MIR", name: "Monastir Habib Bourguiba Airport", city: "Monastir", country: "Tunesien" },
  { iata: "DJE", name: "Djerba Zarzis Airport", city: "Djerba", country: "Tunesien" },
  { iata: "TOE", name: "Tozeur Nefta Airport", city: "Tozeur", country: "Tunesien" },
  { iata: "GAF", name: "Gafsa Airport", city: "Gafsa", country: "Tunesien" },
  { iata: "SFA", name: "Sfax Thyna Airport", city: "Sfax", country: "Tunesien" },

  // ── Marokko ──────────────────────────────────────────────────────────────────
  { iata: "CMN", name: "Casablanca Mohammed V Airport", city: "Casablanca", country: "Marokko" },
  { iata: "RAK", name: "Marrakesch Menara Airport", city: "Marrakesch", country: "Marokko" },
  { iata: "AGA", name: "Agadir Al Massira Airport", city: "Agadir", country: "Marokko" },
  { iata: "TNG", name: "Tanger Ibn Battuta Airport", city: "Tanger", country: "Marokko" },
  { iata: "OUD", name: "Oujda Angads Airport", city: "Oujda", country: "Marokko" },
  { iata: "FEZ", name: "Fès Saïss Airport", city: "Fès", country: "Marokko" },
  { iata: "NDR", name: "Nador Al Aroui Airport", city: "Nador", country: "Marokko" },
  { iata: "RBA", name: "Rabat-Salé Airport", city: "Rabat", country: "Marokko" },
  { iata: "ESU", name: "Essaouira Mogador Airport", city: "Essaouira", country: "Marokko" },
  { iata: "EUN", name: "Laayoune Hassan I Airport", city: "Laayoune", country: "Marokko" },

  // ── Algerien ─────────────────────────────────────────────────────────────────
  { iata: "ALG", name: "Algier Houari Boumediene Airport", city: "Algier", country: "Algerien" },
  { iata: "ORN", name: "Oran Ahmed Ben Bella Airport", city: "Oran", country: "Algerien" },
  { iata: "CZL", name: "Konstantin Mohamed Boudiaf Airport", city: "Konstantin", country: "Algerien" },
  { iata: "AAE", name: "Annaba Rabah Bitat Airport", city: "Annaba", country: "Algerien" },
  { iata: "TMR", name: "Tamanrasset Aguenar Airport", city: "Tamanrasset", country: "Algerien" },
  { iata: "GJL", name: "Jijel Ferhat Abbas Airport", city: "Jijel", country: "Algerien" },
  { iata: "BJA", name: "Béjaïa Abane Ramdane Airport", city: "Béjaïa", country: "Algerien" },

  // ── Libyen ───────────────────────────────────────────────────────────────────
  { iata: "TIP", name: "Tripolis Mitiga International Airport", city: "Tripolis", country: "Libyen" },
  { iata: "BEN", name: "Bengasi Benina Airport", city: "Bengasi", country: "Libyen" },

  // ── Vereinigte Arabische Emirate ─────────────────────────────────────────────
  { iata: "DXB", name: "Dubai International Airport", city: "Dubai", country: "Vereinigte Arabische Emirate" },
  { iata: "DWC", name: "Dubai Al Maktoum Airport", city: "Dubai", country: "Vereinigte Arabische Emirate" },
  { iata: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi", country: "Vereinigte Arabische Emirate" },
  { iata: "SHJ", name: "Sharjah International Airport", city: "Sharjah", country: "Vereinigte Arabische Emirate" },
  { iata: "RKT", name: "Ras al-Khaimah Airport", city: "Ras al-Khaimah", country: "Vereinigte Arabische Emirate" },

  // ── Katar ────────────────────────────────────────────────────────────────────
  { iata: "DOH", name: "Doha Hamad International Airport", city: "Doha", country: "Katar" },

  // ── Saudi-Arabien ────────────────────────────────────────────────────────────
  { iata: "RUH", name: "Riad King Khalid Airport", city: "Riad", country: "Saudi-Arabien" },
  { iata: "JED", name: "Dschidda King Abdulaziz Airport", city: "Dschidda", country: "Saudi-Arabien" },
  { iata: "DMM", name: "Dammam King Fahd Airport", city: "Dammam", country: "Saudi-Arabien" },
  { iata: "MED", name: "Medina Prince Mohammad Bin Abdulaziz Airport", city: "Medina", country: "Saudi-Arabien" },
  { iata: "TUU", name: "Tabuk Regional Airport", city: "Tabuk", country: "Saudi-Arabien" },
  { iata: "AHB", name: "Abha Airport", city: "Abha", country: "Saudi-Arabien" },

  // ── Kuwait ───────────────────────────────────────────────────────────────────
  { iata: "KWI", name: "Kuwait International Airport", city: "Kuwait-Stadt", country: "Kuwait" },

  // ── Bahrain ──────────────────────────────────────────────────────────────────
  { iata: "BAH", name: "Bahrain International Airport", city: "Manama", country: "Bahrain" },

  // ── Oman ─────────────────────────────────────────────────────────────────────
  { iata: "MCT", name: "Maskat Muscat International Airport", city: "Maskat", country: "Oman" },
  { iata: "SLL", name: "Salalah Airport", city: "Salalah", country: "Oman" },
  { iata: "SUR", name: "Sur Airport", city: "Sur", country: "Oman" },

  // ── Jordanien ────────────────────────────────────────────────────────────────
  { iata: "AMM", name: "Amman Queen Alia Airport", city: "Amman", country: "Jordanien" },
  { iata: "AQJ", name: "Aqaba King Hussein Airport", city: "Aqaba", country: "Jordanien" },

  // ── Israel ───────────────────────────────────────────────────────────────────
  { iata: "TLV", name: "Tel Aviv Ben Gurion Airport", city: "Tel Aviv", country: "Israel" },
  { iata: "ETH", name: "Eilat J. Hozman Airport", city: "Eilat", country: "Israel" },
  { iata: "VDA", name: "Eilat Ramon Airport", city: "Eilat", country: "Israel" },
  { iata: "HFA", name: "Haifa Airport", city: "Haifa", country: "Israel" },

  // ── Libanon ──────────────────────────────────────────────────────────────────
  { iata: "BEY", name: "Beirut Rafic Hariri Airport", city: "Beirut", country: "Libanon" },

  // ── Iran ─────────────────────────────────────────────────────────────────────
  { iata: "IKA", name: "Teheran Imam Khomeini Airport", city: "Teheran", country: "Iran" },
  { iata: "THR", name: "Teheran Mehrabad Airport", city: "Teheran", country: "Iran" },
  { iata: "MHD", name: "Maschhad Shahid Hashemi Nejad Airport", city: "Maschhad", country: "Iran" },
  { iata: "SYZ", name: "Schiras International Airport", city: "Schiras", country: "Iran" },
  { iata: "IFN", name: "Isfahan International Airport", city: "Isfahan", country: "Iran" },
  { iata: "TBZ", name: "Täbris International Airport", city: "Täbris", country: "Iran" },

  // ── Irak ─────────────────────────────────────────────────────────────────────
  { iata: "BGW", name: "Bagdad International Airport", city: "Bagdad", country: "Irak" },
  { iata: "BSR", name: "Basra Airport", city: "Basra", country: "Irak" },
  { iata: "EBL", name: "Erbil International Airport", city: "Erbil", country: "Irak" },
  { iata: "NJF", name: "Nadschaf Airport", city: "Nadschaf", country: "Irak" },

  // ── Pakistan ─────────────────────────────────────────────────────────────────
  { iata: "KHI", name: "Karachi Jinnah International Airport", city: "Karachi", country: "Pakistan" },
  { iata: "LHE", name: "Lahore Allama Iqbal Airport", city: "Lahore", country: "Pakistan" },
  { iata: "ISB", name: "Islamabad New Islamabad Airport", city: "Islamabad", country: "Pakistan" },
  { iata: "PEW", name: "Peschawar Bacha Khan Airport", city: "Peschawar", country: "Pakistan" },
  { iata: "SKT", name: "Sialkot Airport", city: "Sialkot", country: "Pakistan" },
  { iata: "MUX", name: "Multan International Airport", city: "Multan", country: "Pakistan" },
  { iata: "UET", name: "Quetta Airport", city: "Quetta", country: "Pakistan" },

  // ── Indien ───────────────────────────────────────────────────────────────────
  { iata: "DEL", name: "Delhi Indira Gandhi Airport", city: "Delhi", country: "Indien" },
  { iata: "BOM", name: "Mumbai Chhatrapati Shivaji Airport", city: "Mumbai", country: "Indien" },
  { iata: "MAA", name: "Chennai Airport", city: "Chennai", country: "Indien" },
  { iata: "BLR", name: "Bengaluru Kempegowda Airport", city: "Bengaluru", country: "Indien" },
  { iata: "HYD", name: "Hyderabad Rajiv Gandhi Airport", city: "Hyderabad", country: "Indien" },
  { iata: "CCU", name: "Kolkata Netaji Subhash Chandra Bose Airport", city: "Kolkata", country: "Indien" },
  { iata: "AMD", name: "Ahmedabad Sardar Vallabhbhai Patel Airport", city: "Ahmedabad", country: "Indien" },
  { iata: "PNQ", name: "Pune Airport", city: "Pune", country: "Indien" },
  { iata: "COK", name: "Kochi Airport", city: "Kochi", country: "Indien" },
  { iata: "GOI", name: "Goa Dabolim Airport", city: "Goa", country: "Indien" },
  { iata: "TRV", name: "Thiruvananthapuram Airport", city: "Thiruvananthapuram", country: "Indien" },
  { iata: "IXC", name: "Chandigarh Airport", city: "Chandigarh", country: "Indien" },
  { iata: "ATQ", name: "Amritsar Sri Guru Ram Dass Jee Airport", city: "Amritsar", country: "Indien" },
  { iata: "JAI", name: "Jaipur Airport", city: "Jaipur", country: "Indien" },
  { iata: "LKO", name: "Lucknow Chaudhary Charan Singh Airport", city: "Lucknow", country: "Indien" },
  { iata: "IXB", name: "Bagdogra Airport", city: "Siliguri", country: "Indien" },
  { iata: "CCJ", name: "Kozhikode Calicut Airport", city: "Kozhikode", country: "Indien" },
  { iata: "VTZ", name: "Visakhapatnam Airport", city: "Visakhapatnam", country: "Indien" },
  { iata: "GAU", name: "Guwahati Lokpriya Gopinath Bordoloi Airport", city: "Guwahati", country: "Indien" },
  { iata: "IXR", name: "Ranchi Birsa Munda Airport", city: "Ranchi", country: "Indien" },
  { iata: "BHO", name: "Bhopal Raja Bhoj Airport", city: "Bhopal", country: "Indien" },
  { iata: "NAG", name: "Nagpur Dr. Babasaheb Ambedkar Airport", city: "Nagpur", country: "Indien" },
  { iata: "PAT", name: "Patna Jay Prakash Narayan Airport", city: "Patna", country: "Indien" },
  { iata: "VNS", name: "Varanasi Lal Bahadur Shastri Airport", city: "Varanasi", country: "Indien" },
  { iata: "SXR", name: "Srinagar Airport", city: "Srinagar", country: "Indien" },
  { iata: "IXE", name: "Mangaluru Airport", city: "Mangaluru", country: "Indien" },
  { iata: "MYQ", name: "Mysore Airport", city: "Mysore", country: "Indien" },

  // ── Sri Lanka ────────────────────────────────────────────────────────────────
  { iata: "CMB", name: "Colombo Bandaranaike Airport", city: "Colombo", country: "Sri Lanka" },
  { iata: "HRI", name: "Hambantota Mattala Rajapaksa Airport", city: "Hambantota", country: "Sri Lanka" },

  // ── Bangladesh ───────────────────────────────────────────────────────────────
  { iata: "DAC", name: "Dhaka Hazrat Shahjalal Airport", city: "Dhaka", country: "Bangladesch" },
  { iata: "CGP", name: "Chittagong Shah Amanat Airport", city: "Chittagong", country: "Bangladesch" },

  // ── Nepal ────────────────────────────────────────────────────────────────────
  { iata: "KTM", name: "Kathmandu Tribhuvan Airport", city: "Kathmandu", country: "Nepal" },
  { iata: "PKR", name: "Pokhara Airport", city: "Pokhara", country: "Nepal" },

  // ── Thailand ─────────────────────────────────────────────────────────────────
  { iata: "BKK", name: "Bangkok Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
  { iata: "DMK", name: "Bangkok Don Mueang Airport", city: "Bangkok", country: "Thailand" },
  { iata: "HKT", name: "Phuket Airport", city: "Phuket", country: "Thailand" },
  { iata: "CNX", name: "Chiang Mai Airport", city: "Chiang Mai", country: "Thailand" },
  { iata: "USM", name: "Koh Samui Airport", city: "Koh Samui", country: "Thailand" },
  { iata: "KBV", name: "Krabi Airport", city: "Krabi", country: "Thailand" },
  { iata: "HDY", name: "Hat Yai Airport", city: "Hat Yai", country: "Thailand" },
  { iata: "UTP", name: "Pattaya U-Tapao Airport", city: "Pattaya", country: "Thailand" },
  { iata: "KKC", name: "Khon Kaen Airport", city: "Khon Kaen", country: "Thailand" },
  { iata: "UBP", name: "Ubon Ratchathani Airport", city: "Ubon Ratchathani", country: "Thailand" },
  { iata: "NAW", name: "Narathiwat Airport", city: "Narathiwat", country: "Thailand" },

  // ── Malaysia ─────────────────────────────────────────────────────────────────
  { iata: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
  { iata: "LGK", name: "Langkawi Airport", city: "Langkawi", country: "Malaysia" },
  { iata: "PEN", name: "Penang Airport", city: "Penang", country: "Malaysia" },
  { iata: "BKI", name: "Kota Kinabalu Airport", city: "Kota Kinabalu", country: "Malaysia" },
  { iata: "KCH", name: "Kuching Airport", city: "Kuching", country: "Malaysia" },
  { iata: "JHB", name: "Johor Bahru Senai Airport", city: "Johor Bahru", country: "Malaysia" },
  { iata: "AOR", name: "Alor Setar Sultan Abdul Halim Airport", city: "Alor Setar", country: "Malaysia" },
  { iata: "MYY", name: "Miri Airport", city: "Miri", country: "Malaysia" },

  // ── Singapur ─────────────────────────────────────────────────────────────────
  { iata: "SIN", name: "Singapur Changi Airport", city: "Singapur", country: "Singapur" },

  // ── Indonesien ───────────────────────────────────────────────────────────────
  { iata: "CGK", name: "Jakarta Soekarno-Hatta Airport", city: "Jakarta", country: "Indonesien" },
  { iata: "DPS", name: "Bali Ngurah Rai Airport", city: "Denpasar", country: "Indonesien" },
  { iata: "SUB", name: "Surabaya Juanda Airport", city: "Surabaya", country: "Indonesien" },
  { iata: "UPG", name: "Makassar Sultan Hasanuddin Airport", city: "Makassar", country: "Indonesien" },
  { iata: "MDC", name: "Manado Sam Ratulangi Airport", city: "Manado", country: "Indonesien" },
  { iata: "PLM", name: "Palembang Sultan Mahmud Badaruddin II Airport", city: "Palembang", country: "Indonesien" },
  { iata: "HLP", name: "Jakarta Halim Perdanakusuma Airport", city: "Jakarta", country: "Indonesien" },
  { iata: "SRG", name: "Semarang Ahmad Yani Airport", city: "Semarang", country: "Indonesien" },
  { iata: "MES", name: "Medan Kualanamu Airport", city: "Medan", country: "Indonesien" },
  { iata: "BPN", name: "Balikpapan Sultan Aji Muhammad Sulaiman Airport", city: "Balikpapan", country: "Indonesien" },
  { iata: "LOP", name: "Lombok International Airport", city: "Lombok", country: "Indonesien" },
  { iata: "AMQ", name: "Ambon Pattimura Airport", city: "Ambon", country: "Indonesien" },

  // ── Vietnam ──────────────────────────────────────────────────────────────────
  { iata: "HAN", name: "Hanoi Noi Bai Airport", city: "Hanoi", country: "Vietnam" },
  { iata: "SGN", name: "Ho-Chi-Minh-Stadt Tan Son Nhat Airport", city: "Ho-Chi-Minh-Stadt", country: "Vietnam" },
  { iata: "DAD", name: "Da Nang Airport", city: "Da Nang", country: "Vietnam" },
  { iata: "CXR", name: "Nha Trang Cam Ranh Airport", city: "Nha Trang", country: "Vietnam" },
  { iata: "PQC", name: "Phu Quoc Airport", city: "Phu Quoc", country: "Vietnam" },
  { iata: "UIH", name: "Qui Nhon Phu Cat Airport", city: "Qui Nhon", country: "Vietnam" },
  { iata: "VCS", name: "Con Dao Airport", city: "Con Dao", country: "Vietnam" },
  { iata: "HPH", name: "Haiphong Cat Bi Airport", city: "Haiphong", country: "Vietnam" },
  { iata: "HUI", name: "Hue Phu Bai Airport", city: "Hue", country: "Vietnam" },
  { iata: "VCA", name: "Can Tho Airport", city: "Can Tho", country: "Vietnam" },

  // ── Philippinen ──────────────────────────────────────────────────────────────
  { iata: "MNL", name: "Manila Ninoy Aquino Airport", city: "Manila", country: "Philippinen" },
  { iata: "CEB", name: "Cebu Mactan-Cebu Airport", city: "Cebu", country: "Philippinen" },
  { iata: "DVO", name: "Davao Francisco Bangoy Airport", city: "Davao", country: "Philippinen" },
  { iata: "ILO", name: "Iloilo Airport", city: "Iloilo", country: "Philippinen" },
  { iata: "KLO", name: "Kalibo Airport", city: "Kalibo", country: "Philippinen" },
  { iata: "BCD", name: "Bacolod-Silay Airport", city: "Bacolod", country: "Philippinen" },
  { iata: "PPS", name: "Puerto Princesa Airport", city: "Puerto Princesa", country: "Philippinen" },
  { iata: "ZAM", name: "Zamboanga Airport", city: "Zamboanga", country: "Philippinen" },
  { iata: "GES", name: "General Santos Airport", city: "General Santos", country: "Philippinen" },

  // ── China ────────────────────────────────────────────────────────────────────
  { iata: "PEK", name: "Peking Capital Airport", city: "Peking", country: "China" },
  { iata: "PKX", name: "Peking Daxing Airport", city: "Peking", country: "China" },
  { iata: "PVG", name: "Shanghai Pudong Airport", city: "Shanghai", country: "China" },
  { iata: "SHA", name: "Shanghai Hongqiao Airport", city: "Shanghai", country: "China" },
  { iata: "CAN", name: "Guangzhou Baiyun Airport", city: "Guangzhou", country: "China" },
  { iata: "SZX", name: "Shenzhen Bao'an Airport", city: "Shenzhen", country: "China" },
  { iata: "CTU", name: "Chengdu Tianfu Airport", city: "Chengdu", country: "China" },
  { iata: "TFU", name: "Chengdu Shuangliu Airport", city: "Chengdu", country: "China" },
  { iata: "KMG", name: "Kunming Changshui Airport", city: "Kunming", country: "China" },
  { iata: "XMN", name: "Xiamen Gaoqi Airport", city: "Xiamen", country: "China" },
  { iata: "NKG", name: "Nanjing Lukou Airport", city: "Nanjing", country: "China" },
  { iata: "TSN", name: "Tianjin Binhai Airport", city: "Tianjin", country: "China" },
  { iata: "HGH", name: "Hangzhou Xiaoshan Airport", city: "Hangzhou", country: "China" },
  { iata: "WUH", name: "Wuhan Tianhe Airport", city: "Wuhan", country: "China" },
  { iata: "XIY", name: "Xi'an Xianyang Airport", city: "Xi'an", country: "China" },
  { iata: "CGO", name: "Zhengzhou Xinzheng Airport", city: "Zhengzhou", country: "China" },
  { iata: "CSX", name: "Changsha Huanghua Airport", city: "Changsha", country: "China" },
  { iata: "TNA", name: "Jinan Yaoqiang Airport", city: "Jinan", country: "China" },
  { iata: "TAO", name: "Qingdao Jiaodong Airport", city: "Qingdao", country: "China" },
  { iata: "DLC", name: "Dalian Zhoushuizi Airport", city: "Dalian", country: "China" },
  { iata: "FOC", name: "Fuzhou Changle Airport", city: "Fuzhou", country: "China" },
  { iata: "SYX", name: "Sanya Phoenix Airport", city: "Sanya", country: "China" },
  { iata: "CKG", name: "Chongqing Jiangbei Airport", city: "Chongqing", country: "China" },
  { iata: "KWE", name: "Guiyang Longdongbao Airport", city: "Guiyang", country: "China" },
  { iata: "NNG", name: "Nanning Wuxu Airport", city: "Nanning", country: "China" },
  { iata: "HAK", name: "Haikou Meilan Airport", city: "Haikou", country: "China" },
  { iata: "LHW", name: "Lanzhou Zhongchuan Airport", city: "Lanzhou", country: "China" },
  { iata: "URC", name: "Ürümqi Diwopu Airport", city: "Ürümqi", country: "China" },
  { iata: "HRB", name: "Harbin Taiping Airport", city: "Harbin", country: "China" },
  { iata: "SHE", name: "Shenyang Taoxian Airport", city: "Shenyang", country: "China" },

  // ── Japan ────────────────────────────────────────────────────────────────────
  { iata: "NRT", name: "Tokio Narita Airport", city: "Tokio", country: "Japan" },
  { iata: "HND", name: "Tokio Haneda Airport", city: "Tokio", country: "Japan" },
  { iata: "KIX", name: "Osaka Kansai Airport", city: "Osaka", country: "Japan" },
  { iata: "ITM", name: "Osaka Itami Airport", city: "Osaka", country: "Japan" },
  { iata: "NGO", name: "Nagoya Chubu Centrair Airport", city: "Nagoya", country: "Japan" },
  { iata: "FUK", name: "Fukuoka Airport", city: "Fukuoka", country: "Japan" },
  { iata: "CTS", name: "Sapporo New Chitose Airport", city: "Sapporo", country: "Japan" },
  { iata: "OKA", name: "Okinawa Naha Airport", city: "Naha", country: "Japan" },
  { iata: "HIJ", name: "Hiroshima Airport", city: "Hiroshima", country: "Japan" },
  { iata: "SDJ", name: "Sendai Airport", city: "Sendai", country: "Japan" },
  { iata: "KOJ", name: "Kagoshima Airport", city: "Kagoshima", country: "Japan" },
  { iata: "KMI", name: "Miyazaki Airport", city: "Miyazaki", country: "Japan" },
  { iata: "OIT", name: "Oita Airport", city: "Oita", country: "Japan" },
  { iata: "NGS", name: "Nagasaki Airport", city: "Nagasaki", country: "Japan" },
  { iata: "KMJ", name: "Kumamoto Airport", city: "Kumamoto", country: "Japan" },
  { iata: "AOJ", name: "Aomori Airport", city: "Aomori", country: "Japan" },
  { iata: "KIJ", name: "Niigata Airport", city: "Niigata", country: "Japan" },
  { iata: "ISG", name: "Ishigaki Airport", city: "Ishigaki", country: "Japan" },

  // ── Südkorea ─────────────────────────────────────────────────────────────────
  { iata: "ICN", name: "Seoul Incheon Airport", city: "Seoul", country: "Südkorea" },
  { iata: "GMP", name: "Seoul Gimpo Airport", city: "Seoul", country: "Südkorea" },
  { iata: "PUS", name: "Busan Gimhae Airport", city: "Busan", country: "Südkorea" },
  { iata: "CJU", name: "Jeju Airport", city: "Jeju", country: "Südkorea" },
  { iata: "TAE", name: "Daegu Airport", city: "Daegu", country: "Südkorea" },
  { iata: "CJJ", name: "Cheongju Airport", city: "Cheongju", country: "Südkorea" },
  { iata: "KWJ", name: "Gwangju Airport", city: "Gwangju", country: "Südkorea" },

  // ── Hongkong ─────────────────────────────────────────────────────────────────
  { iata: "HKG", name: "Hongkong International Airport", city: "Hongkong", country: "Hongkong" },

  // ── Macau ────────────────────────────────────────────────────────────────────
  { iata: "MFM", name: "Macau International Airport", city: "Macau", country: "Macau" },

  // ── Taiwan ───────────────────────────────────────────────────────────────────
  { iata: "TPE", name: "Taipeh Taoyuan Airport", city: "Taipeh", country: "Taiwan" },
  { iata: "KHH", name: "Kaohsiung Airport", city: "Kaohsiung", country: "Taiwan" },
  { iata: "RMQ", name: "Taichung Airport", city: "Taichung", country: "Taiwan" },
  { iata: "TNN", name: "Tainan Airport", city: "Tainan", country: "Taiwan" },

  // ── Myanmar ──────────────────────────────────────────────────────────────────
  { iata: "RGN", name: "Yangon Airport", city: "Yangon", country: "Myanmar" },
  { iata: "MDL", name: "Mandalay Airport", city: "Mandalay", country: "Myanmar" },

  // ── Kambodscha ───────────────────────────────────────────────────────────────
  { iata: "PNH", name: "Phnom Penh Airport", city: "Phnom Penh", country: "Kambodscha" },
  { iata: "REP", name: "Siem Reap Angkor Airport", city: "Siem Reap", country: "Kambodscha" },

  // ── Laos ─────────────────────────────────────────────────────────────────────
  { iata: "VTE", name: "Vientiane Wattay Airport", city: "Vientiane", country: "Laos" },
  { iata: "LPQ", name: "Luang Prabang Airport", city: "Luang Prabang", country: "Laos" },

  // ── Australien ───────────────────────────────────────────────────────────────
  { iata: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australien" },
  { iata: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australien" },
  { iata: "BNE", name: "Brisbane Airport", city: "Brisbane", country: "Australien" },
  { iata: "PER", name: "Perth Airport", city: "Perth", country: "Australien" },
  { iata: "ADL", name: "Adelaide Airport", city: "Adelaide", country: "Australien" },
  { iata: "CBR", name: "Canberra Airport", city: "Canberra", country: "Australien" },
  { iata: "DRW", name: "Darwin Airport", city: "Darwin", country: "Australien" },
  { iata: "HBA", name: "Hobart Airport", city: "Hobart", country: "Australien" },
  { iata: "OOL", name: "Gold Coast Airport", city: "Gold Coast", country: "Australien" },
  { iata: "CNS", name: "Cairns Airport", city: "Cairns", country: "Australien" },
  { iata: "TSV", name: "Townsville Airport", city: "Townsville", country: "Australien" },
  { iata: "MKY", name: "Mackay Airport", city: "Mackay", country: "Australien" },
  { iata: "ROK", name: "Rockhampton Airport", city: "Rockhampton", country: "Australien" },
  { iata: "ASP", name: "Alice Springs Airport", city: "Alice Springs", country: "Australien" },
  { iata: "KTA", name: "Karratha Airport", city: "Karratha", country: "Australien" },
  { iata: "LST", name: "Launceston Airport", city: "Launceston", country: "Australien" },

  // ── Neuseeland ───────────────────────────────────────────────────────────────
  { iata: "AKL", name: "Auckland Airport", city: "Auckland", country: "Neuseeland" },
  { iata: "CHC", name: "Christchurch Airport", city: "Christchurch", country: "Neuseeland" },
  { iata: "WLG", name: "Wellington Airport", city: "Wellington", country: "Neuseeland" },
  { iata: "ZQN", name: "Queenstown Airport", city: "Queenstown", country: "Neuseeland" },
  { iata: "DUD", name: "Dunedin Airport", city: "Dunedin", country: "Neuseeland" },
  { iata: "ROT", name: "Rotorua Airport", city: "Rotorua", country: "Neuseeland" },
  { iata: "HLZ", name: "Hamilton Airport", city: "Hamilton", country: "Neuseeland" },
  { iata: "NPE", name: "Hawke's Bay Airport", city: "Napier", country: "Neuseeland" },
  { iata: "PMR", name: "Palmerston North Airport", city: "Palmerston North", country: "Neuseeland" },

  // ── USA ──────────────────────────────────────────────────────────────────────
  { iata: "ATL", name: "Atlanta Hartsfield-Jackson Airport", city: "Atlanta", country: "USA" },
  { iata: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { iata: "ORD", name: "Chicago O'Hare International Airport", city: "Chicago", country: "USA" },
  { iata: "DFW", name: "Dallas Fort Worth Airport", city: "Dallas", country: "USA" },
  { iata: "DEN", name: "Denver International Airport", city: "Denver", country: "USA" },
  { iata: "JFK", name: "New York John F. Kennedy Airport", city: "New York", country: "USA" },
  { iata: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA" },
  { iata: "SEA", name: "Seattle-Tacoma International Airport", city: "Seattle", country: "USA" },
  { iata: "LAS", name: "Las Vegas Harry Reid Airport", city: "Las Vegas", country: "USA" },
  { iata: "MCO", name: "Orlando International Airport", city: "Orlando", country: "USA" },
  { iata: "MIA", name: "Miami International Airport", city: "Miami", country: "USA" },
  { iata: "CLT", name: "Charlotte Douglas Airport", city: "Charlotte", country: "USA" },
  { iata: "PHX", name: "Phoenix Sky Harbor Airport", city: "Phoenix", country: "USA" },
  { iata: "IAH", name: "Houston George Bush Intercontinental Airport", city: "Houston", country: "USA" },
  { iata: "BOS", name: "Boston Logan Airport", city: "Boston", country: "USA" },
  { iata: "EWR", name: "Newark Liberty Airport", city: "Newark", country: "USA" },
  { iata: "MSP", name: "Minneapolis-Saint Paul Airport", city: "Minneapolis", country: "USA" },
  { iata: "DTW", name: "Detroit Metropolitan Airport", city: "Detroit", country: "USA" },
  { iata: "PHL", name: "Philadelphia Airport", city: "Philadelphia", country: "USA" },
  { iata: "LGA", name: "New York LaGuardia Airport", city: "New York", country: "USA" },
  { iata: "FLL", name: "Fort Lauderdale Hollywood Airport", city: "Fort Lauderdale", country: "USA" },
  { iata: "BWI", name: "Baltimore Washington Airport", city: "Baltimore", country: "USA" },
  { iata: "IAD", name: "Washington Dulles Airport", city: "Washington D.C.", country: "USA" },
  { iata: "DCA", name: "Washington Reagan National Airport", city: "Washington D.C.", country: "USA" },
  { iata: "SLC", name: "Salt Lake City Airport", city: "Salt Lake City", country: "USA" },
  { iata: "SAN", name: "San Diego International Airport", city: "San Diego", country: "USA" },
  { iata: "TPA", name: "Tampa International Airport", city: "Tampa", country: "USA" },
  { iata: "PDX", name: "Portland Airport", city: "Portland", country: "USA" },
  { iata: "STL", name: "St. Louis Lambert Airport", city: "St. Louis", country: "USA" },
  { iata: "HOU", name: "Houston William Hobby Airport", city: "Houston", country: "USA" },
  { iata: "MCI", name: "Kansas City Airport", city: "Kansas City", country: "USA" },
  { iata: "RDU", name: "Raleigh Durham Airport", city: "Raleigh", country: "USA" },
  { iata: "HNL", name: "Honolulu Daniel K. Inouye Airport", city: "Honolulu", country: "USA" },
  { iata: "AUS", name: "Austin-Bergstrom Airport", city: "Austin", country: "USA" },
  { iata: "DAL", name: "Dallas Love Field Airport", city: "Dallas", country: "USA" },
  { iata: "MDW", name: "Chicago Midway Airport", city: "Chicago", country: "USA" },
  { iata: "OAK", name: "Oakland Airport", city: "Oakland", country: "USA" },
  { iata: "SJC", name: "San Jose Airport", city: "San Jose", country: "USA" },
  { iata: "BUR", name: "Hollywood Burbank Airport", city: "Burbank", country: "USA" },
  { iata: "LGB", name: "Long Beach Airport", city: "Long Beach", country: "USA" },
  { iata: "SNA", name: "Orange County John Wayne Airport", city: "Orange County", country: "USA" },
  { iata: "OGG", name: "Kahului Airport Maui", city: "Maui", country: "USA" },
  { iata: "ITO", name: "Hilo Airport", city: "Hilo", country: "USA" },
  { iata: "KOA", name: "Kona Airport", city: "Kona", country: "USA" },
  { iata: "LIH", name: "Lihue Airport Kauai", city: "Kauai", country: "USA" },
  { iata: "MSY", name: "New Orleans Armstrong Airport", city: "New Orleans", country: "USA" },
  { iata: "SAT", name: "San Antonio Airport", city: "San Antonio", country: "USA" },
  { iata: "JAX", name: "Jacksonville Airport", city: "Jacksonville", country: "USA" },
  { iata: "PBI", name: "Palm Beach Airport", city: "Palm Beach", country: "USA" },
  { iata: "RSW", name: "Fort Myers Airport", city: "Fort Myers", country: "USA" },
  { iata: "PIT", name: "Pittsburgh Airport", city: "Pittsburgh", country: "USA" },
  { iata: "CVG", name: "Cincinnati Airport", city: "Cincinnati", country: "USA" },
  { iata: "IND", name: "Indianapolis Airport", city: "Indianapolis", country: "USA" },
  { iata: "CMH", name: "Columbus Airport", city: "Columbus", country: "USA" },
  { iata: "CLE", name: "Cleveland Hopkins Airport", city: "Cleveland", country: "USA" },
  { iata: "MKE", name: "Milwaukee Mitchell Airport", city: "Milwaukee", country: "USA" },
  { iata: "OMA", name: "Omaha Eppley Airfield", city: "Omaha", country: "USA" },
  { iata: "ABQ", name: "Albuquerque Airport", city: "Albuquerque", country: "USA" },
  { iata: "BNA", name: "Nashville Airport", city: "Nashville", country: "USA" },
  { iata: "MEM", name: "Memphis Airport", city: "Memphis", country: "USA" },
  { iata: "BHM", name: "Birmingham Airport", city: "Birmingham", country: "USA" },
  { iata: "OKC", name: "Oklahoma City Will Rogers Airport", city: "Oklahoma City", country: "USA" },
  { iata: "TUL", name: "Tulsa Airport", city: "Tulsa", country: "USA" },
  { iata: "ELP", name: "El Paso Airport", city: "El Paso", country: "USA" },
  { iata: "SJU", name: "San Juan Luis Muñoz Marín Airport", city: "San Juan", country: "USA" },

  // ── Kanada ───────────────────────────────────────────────────────────────────
  { iata: "YYZ", name: "Toronto Pearson Airport", city: "Toronto", country: "Kanada" },
  { iata: "YVR", name: "Vancouver Airport", city: "Vancouver", country: "Kanada" },
  { iata: "YUL", name: "Montréal Pierre Elliott Trudeau Airport", city: "Montréal", country: "Kanada" },
  { iata: "YYC", name: "Calgary Airport", city: "Calgary", country: "Kanada" },
  { iata: "YEG", name: "Edmonton Airport", city: "Edmonton", country: "Kanada" },
  { iata: "YWG", name: "Winnipeg Airport", city: "Winnipeg", country: "Kanada" },
  { iata: "YOW", name: "Ottawa Airport", city: "Ottawa", country: "Kanada" },
  { iata: "YHZ", name: "Halifax Stanfield Airport", city: "Halifax", country: "Kanada" },
  { iata: "YQB", name: "Québec City Airport", city: "Québec City", country: "Kanada" },
  { iata: "YXE", name: "Saskatoon John G. Diefenbaker Airport", city: "Saskatoon", country: "Kanada" },
  { iata: "YYJ", name: "Victoria Airport", city: "Victoria", country: "Kanada" },
  { iata: "YKF", name: "Waterloo Airport", city: "Waterloo", country: "Kanada" },
  { iata: "YQR", name: "Regina Airport", city: "Regina", country: "Kanada" },
  { iata: "YXU", name: "London Airport", city: "London", country: "Kanada" },
  { iata: "YFC", name: "Fredericton Airport", city: "Fredericton", country: "Kanada" },
  { iata: "YQM", name: "Moncton Airport", city: "Moncton", country: "Kanada" },
  { iata: "YYT", name: "St. John's Airport", city: "St. John's", country: "Kanada" },
  { iata: "YZF", name: "Yellowknife Airport", city: "Yellowknife", country: "Kanada" },

  // ── Mexiko ───────────────────────────────────────────────────────────────────
  { iata: "MEX", name: "Mexiko-Stadt Benito Juárez Airport", city: "Mexiko-Stadt", country: "Mexiko" },
  { iata: "CUN", name: "Cancún Airport", city: "Cancún", country: "Mexiko" },
  { iata: "GDL", name: "Guadalajara Don Miguel Hidalgo Airport", city: "Guadalajara", country: "Mexiko" },
  { iata: "MTY", name: "Monterrey Mariano Escobedo Airport", city: "Monterrey", country: "Mexiko" },
  { iata: "TIJ", name: "Tijuana General Abelardo L. Rodríguez Airport", city: "Tijuana", country: "Mexiko" },
  { iata: "BJX", name: "Guanajuato Del Bajío Airport", city: "Guanajuato", country: "Mexiko" },
  { iata: "SJD", name: "Los Cabos Airport", city: "Los Cabos", country: "Mexiko" },
  { iata: "ACA", name: "Acapulco Airport", city: "Acapulco", country: "Mexiko" },
  { iata: "PVR", name: "Puerto Vallarta Airport", city: "Puerto Vallarta", country: "Mexiko" },
  { iata: "MZT", name: "Mazatlán Airport", city: "Mazatlán", country: "Mexiko" },
  { iata: "ZIH", name: "Ixtapa Zihuatanejo Airport", city: "Zihuatanejo", country: "Mexiko" },
  { iata: "HUX", name: "Huatulco Airport", city: "Huatulco", country: "Mexiko" },
  { iata: "CME", name: "Ciudad del Carmen Airport", city: "Ciudad del Carmen", country: "Mexiko" },
  { iata: "VER", name: "Veracruz Heriberto Jara Airport", city: "Veracruz", country: "Mexiko" },
  { iata: "OAX", name: "Oaxaca Airport", city: "Oaxaca", country: "Mexiko" },
  { iata: "ZLO", name: "Manzanillo Airport", city: "Manzanillo", country: "Mexiko" },
  { iata: "MID", name: "Mérida Manuel Crescencio Rejón Airport", city: "Mérida", country: "Mexiko" },
  { iata: "CZM", name: "Cozumel Airport", city: "Cozumel", country: "Mexiko" },
  { iata: "TAM", name: "Tampico General Francisco Javier Mina Airport", city: "Tampico", country: "Mexiko" },

  // ── Karibik ──────────────────────────────────────────────────────────────────
  { iata: "PUJ", name: "Punta Cana Airport", city: "Punta Cana", country: "Dominikanische Republik" },
  { iata: "STI", name: "Santiago Cibao Airport", city: "Santiago", country: "Dominikanische Republik" },
  { iata: "SDQ", name: "Santo Domingo Las Américas Airport", city: "Santo Domingo", country: "Dominikanische Republik" },
  { iata: "SXM", name: "Sint Maarten Princess Juliana Airport", city: "Sint Maarten", country: "Sint Maarten" },
  { iata: "AUA", name: "Aruba Reina Beatrix Airport", city: "Oranjestad", country: "Aruba" },
  { iata: "CUR", name: "Curaçao Hato Airport", city: "Willemstad", country: "Curaçao" },
  { iata: "BGI", name: "Barbados Grantley Adams Airport", city: "Bridgetown", country: "Barbados" },
  { iata: "GCM", name: "Grand Cayman Owen Roberts Airport", city: "Grand Cayman", country: "Kaimaninseln" },
  { iata: "POS", name: "Port of Spain Airport", city: "Port of Spain", country: "Trinidad und Tobago" },
  { iata: "MBJ", name: "Montego Bay Sangster Airport", city: "Montego Bay", country: "Jamaika" },
  { iata: "KIN", name: "Kingston Norman Manley Airport", city: "Kingston", country: "Jamaika" },
  { iata: "NAS", name: "Nassau Lynden Pindling Airport", city: "Nassau", country: "Bahamas" },
  { iata: "PLS", name: "Providenciales Airport", city: "Providenciales", country: "Turks- und Caicosinseln" },
  { iata: "UVF", name: "St. Lucia Hewanorra Airport", city: "Vieux Fort", country: "St. Lucia" },
  { iata: "SKB", name: "St. Kitts Robert L. Bradshaw Airport", city: "Basseterre", country: "St. Kitts und Nevis" },
  { iata: "ANU", name: "Antigua V.C. Bird Airport", city: "St. John's", country: "Antigua und Barbuda" },
  { iata: "SLU", name: "St. Lucia George F.L. Charles Airport", city: "Castries", country: "St. Lucia" },
  { iata: "SVD", name: "St. Vincent E.T. Joshua Airport", city: "Kingstown", country: "St. Vincent" },
  { iata: "TAB", name: "Tobago Arthur Napoleon Raymond Robinson Airport", city: "Scarborough", country: "Trinidad und Tobago" },
  { iata: "GND", name: "Grenada Maurice Bishop Airport", city: "St. George's", country: "Grenada" },
  { iata: "HAV", name: "Havanna José Martí Airport", city: "Havanna", country: "Kuba" },
  { iata: "CCC", name: "Cayo Coco Jardines del Rey Airport", city: "Cayo Coco", country: "Kuba" },
  { iata: "VRA", name: "Varadero Juan Gualberto Gómez Airport", city: "Varadero", country: "Kuba" },
  { iata: "HOG", name: "Holguín Frank País Airport", city: "Holguín", country: "Kuba" },
  { iata: "SCU", name: "Santiago de Cuba Airport", city: "Santiago de Cuba", country: "Kuba" },
  { iata: "BDA", name: "Bermuda L.F. Wade Airport", city: "Hamilton", country: "Bermuda" },
  { iata: "PTP", name: "Guadeloupe Pointe-à-Pitre Airport", city: "Pointe-à-Pitre", country: "Guadeloupe" },
  { iata: "FDF", name: "Martinique Aimé Césaire Airport", city: "Fort-de-France", country: "Martinique" },
  { iata: "SFG", name: "Sint Maarten Grand Case Airport", city: "Saint-Martin", country: "Saint-Martin" },

  // ── Mittelamerika ────────────────────────────────────────────────────────────
  { iata: "GUA", name: "Guatemala-Stadt La Aurora Airport", city: "Guatemala-Stadt", country: "Guatemala" },
  { iata: "SAL", name: "San Salvador Monseñor Óscar Arnulfo Romero Airport", city: "San Salvador", country: "El Salvador" },
  { iata: "MGA", name: "Managua Augusto C. Sandino Airport", city: "Managua", country: "Nicaragua" },
  { iata: "SJO", name: "San José Juan Santamaría Airport", city: "San José", country: "Costa Rica" },
  { iata: "LIR", name: "Liberia Daniel Oduber Quirós Airport", city: "Liberia", country: "Costa Rica" },
  { iata: "PTY", name: "Panama-Stadt Tocumen Airport", city: "Panama-Stadt", country: "Panama" },
  { iata: "TGU", name: "Tegucigalpa Toncontín Airport", city: "Tegucigalpa", country: "Honduras" },
  { iata: "BZE", name: "Belize City Philip S.W. Goldson Airport", city: "Belize City", country: "Belize" },

  // ── Südamerika ───────────────────────────────────────────────────────────────
  { iata: "GRU", name: "São Paulo Guarulhos Airport", city: "São Paulo", country: "Brasilien" },
  { iata: "GIG", name: "Rio de Janeiro Galeão Airport", city: "Rio de Janeiro", country: "Brasilien" },
  { iata: "CGH", name: "São Paulo Congonhas Airport", city: "São Paulo", country: "Brasilien" },
  { iata: "SDU", name: "Rio de Janeiro Santos Dumont Airport", city: "Rio de Janeiro", country: "Brasilien" },
  { iata: "BSB", name: "Brasília Airport", city: "Brasília", country: "Brasilien" },
  { iata: "SSA", name: "Salvador Deputado Luís Eduardo Magalhães Airport", city: "Salvador", country: "Brasilien" },
  { iata: "FOR", name: "Fortaleza Pinto Martins Airport", city: "Fortaleza", country: "Brasilien" },
  { iata: "REC", name: "Recife Guararapes Airport", city: "Recife", country: "Brasilien" },
  { iata: "VCP", name: "Campinas Viracopos Airport", city: "Campinas", country: "Brasilien" },
  { iata: "CNF", name: "Belo Horizonte Confins Airport", city: "Belo Horizonte", country: "Brasilien" },
  { iata: "CWB", name: "Curitiba Afonso Pena Airport", city: "Curitiba", country: "Brasilien" },
  { iata: "POA", name: "Porto Alegre Salgado Filho Airport", city: "Porto Alegre", country: "Brasilien" },
  { iata: "FLN", name: "Florianópolis Hercílio Luz Airport", city: "Florianópolis", country: "Brasilien" },
  { iata: "MAO", name: "Manaus Eduardo Gomes Airport", city: "Manaus", country: "Brasilien" },
  { iata: "BEL", name: "Belém Val de Cans Airport", city: "Belém", country: "Brasilien" },
  { iata: "MCZ", name: "Maceió Zumbi dos Palmares Airport", city: "Maceió", country: "Brasilien" },
  { iata: "JPA", name: "João Pessoa Presidente Castro Pinto Airport", city: "João Pessoa", country: "Brasilien" },
  { iata: "NAT", name: "Natal Governador Aluízio Alves Airport", city: "Natal", country: "Brasilien" },
  { iata: "BOG", name: "Bogotá El Dorado Airport", city: "Bogotá", country: "Kolumbien" },
  { iata: "MED", name: "Medellín José María Córdova Airport", city: "Medellín", country: "Kolumbien" },
  { iata: "CLO", name: "Cali Alfonso Bonilla Aragón Airport", city: "Cali", country: "Kolumbien" },
  { iata: "ADZ", name: "San Andrés Sesquicentenario Airport", city: "San Andrés", country: "Kolumbien" },
  { iata: "CTG", name: "Cartagena Rafael Núñez Airport", city: "Cartagena", country: "Kolumbien" },
  { iata: "BAQ", name: "Barranquilla Ernesto Cortissoz Airport", city: "Barranquilla", country: "Kolumbien" },
  { iata: "LIM", name: "Lima Jorge Chávez Airport", city: "Lima", country: "Peru" },
  { iata: "CUZ", name: "Cusco Airport", city: "Cusco", country: "Peru" },
  { iata: "AQP", name: "Arequipa Rodríguez Ballón Airport", city: "Arequipa", country: "Peru" },
  { iata: "JUL", name: "Juliaca Airport", city: "Juliaca", country: "Peru" },
  { iata: "IQT", name: "Iquitos Coronel FAP Francisco Secada Airport", city: "Iquitos", country: "Peru" },
  { iata: "GYE", name: "Guayaquil José Joaquín de Olmedo Airport", city: "Guayaquil", country: "Ecuador" },
  { iata: "UIO", name: "Quito Mariscal Sucre Airport", city: "Quito", country: "Ecuador" },
  { iata: "GPS", name: "Baltra Seymour Airport Galapagos", city: "Galápagos", country: "Ecuador" },
  { iata: "SCL", name: "Santiago Arturo Merino Benítez Airport", city: "Santiago", country: "Chile" },
  { iata: "ANF", name: "Antofagasta Cerro Moreno Airport", city: "Antofagasta", country: "Chile" },
  { iata: "IQQ", name: "Iquique Diego Aracena Airport", city: "Iquique", country: "Chile" },
  { iata: "LSC", name: "La Serena Airport", city: "La Serena", country: "Chile" },
  { iata: "PMC", name: "Puerto Montt El Tepual Airport", city: "Puerto Montt", country: "Chile" },
  { iata: "ZCO", name: "Temuco Maquehue Airport", city: "Temuco", country: "Chile" },
  { iata: "PUQ", name: "Punta Arenas Carlos Ibáñez Airport", city: "Punta Arenas", country: "Chile" },
  { iata: "EZE", name: "Buenos Aires Ezeiza Airport", city: "Buenos Aires", country: "Argentinien" },
  { iata: "AEP", name: "Buenos Aires Aeroparque Jorge Newbery Airport", city: "Buenos Aires", country: "Argentinien" },
  { iata: "COR", name: "Córdoba Ambrosio L.V. Taravella Airport", city: "Córdoba", country: "Argentinien" },
  { iata: "MDZ", name: "Mendoza Governor Francisco Gabrielli Airport", city: "Mendoza", country: "Argentinien" },
  { iata: "TUC", name: "Tucumán Benjamín Matienzo Airport", city: "Tucumán", country: "Argentinien" },
  { iata: "CRD", name: "Comodoro Rivadavia Airport", city: "Comodoro Rivadavia", country: "Argentinien" },
  { iata: "FTE", name: "El Calafate Airport", city: "El Calafate", country: "Argentinien" },
  { iata: "USH", name: "Ushuaia Malvinas Argentinas Airport", city: "Ushuaia", country: "Argentinien" },
  { iata: "MVD", name: "Montevideo Carrasco Airport", city: "Montevideo", country: "Uruguay" },
  { iata: "PDP", name: "Punta del Este Airport", city: "Punta del Este", country: "Uruguay" },
  { iata: "ASU", name: "Asunción Silvio Pettirossi Airport", city: "Asunción", country: "Paraguay" },
  { iata: "VVI", name: "Santa Cruz Viru Viru Airport", city: "Santa Cruz", country: "Bolivien" },
  { iata: "LPB", name: "La Paz El Alto Airport", city: "La Paz", country: "Bolivien" },
  { iata: "CBB", name: "Cochabamba Jorge Wilstermann Airport", city: "Cochabamba", country: "Bolivien" },
  { iata: "GEO", name: "Georgetown Cheddi Jagan Airport", city: "Georgetown", country: "Guyana" },
  { iata: "PBM", name: "Paramaribo Johan Adolf Pengel Airport", city: "Paramaribo", country: "Suriname" },
  { iata: "CCS", name: "Caracas Simón Bolívar Airport", city: "Caracas", country: "Venezuela" },
  { iata: "MAR", name: "Maracaibo La Chinita Airport", city: "Maracaibo", country: "Venezuela" },
  { iata: "CJS", name: "Ciudad Juárez Abraham González Airport", city: "Ciudad Juárez", country: "Mexiko" },

  // ── Afrika ───────────────────────────────────────────────────────────────────
  { iata: "JNB", name: "Johannesburg O.R. Tambo Airport", city: "Johannesburg", country: "Südafrika" },
  { iata: "CPT", name: "Kapstadt Airport", city: "Kapstadt", country: "Südafrika" },
  { iata: "DUR", name: "Durban King Shaka Airport", city: "Durban", country: "Südafrika" },
  { iata: "HLA", name: "Johannesburg Lanseria Airport", city: "Johannesburg", country: "Südafrika" },
  { iata: "GRJ", name: "George Airport", city: "George", country: "Südafrika" },
  { iata: "PLZ", name: "Port Elizabeth Airport", city: "Port Elizabeth", country: "Südafrika" },
  { iata: "ELS", name: "East London Airport", city: "East London", country: "Südafrika" },
  { iata: "BFN", name: "Bloemfontein Airport", city: "Bloemfontein", country: "Südafrika" },
  { iata: "LOS", name: "Lagos Murtala Muhammed Airport", city: "Lagos", country: "Nigeria" },
  { iata: "ABV", name: "Abuja Nnamdi Azikiwe Airport", city: "Abuja", country: "Nigeria" },
  { iata: "KAN", name: "Kano Mallam Aminu Kano Airport", city: "Kano", country: "Nigeria" },
  { iata: "PHC", name: "Port Harcourt Airport", city: "Port Harcourt", country: "Nigeria" },
  { iata: "ACC", name: "Accra Kotoka Airport", city: "Accra", country: "Ghana" },
  { iata: "ABJ", name: "Abidjan Port Bouet Airport", city: "Abidjan", country: "Elfenbeinküste" },
  { iata: "DKR", name: "Dakar Léopold Sédar Senghor Airport", city: "Dakar", country: "Senegal" },
  { iata: "DSS", name: "Dakar Blaise Diagne Airport", city: "Dakar", country: "Senegal" },
  { iata: "ADD", name: "Addis Abeba Bole Airport", city: "Addis Abeba", country: "Äthiopien" },
  { iata: "NBO", name: "Nairobi Jomo Kenyatta Airport", city: "Nairobi", country: "Kenia" },
  { iata: "MBA", name: "Mombasa Moi Airport", city: "Mombasa", country: "Kenia" },
  { iata: "DAR", name: "Daressalam Julius Nyerere Airport", city: "Daressalam", country: "Tansania" },
  { iata: "ZNZ", name: "Sansibar Abeid Amani Karume Airport", city: "Sansibar", country: "Tansania" },
  { iata: "JRO", name: "Kilimandscharo Airport", city: "Arusha", country: "Tansania" },
  { iata: "LUN", name: "Lusaka Kenneth Kaunda Airport", city: "Lusaka", country: "Sambia" },
  { iata: "LAD", name: "Luanda Quatro de Fevereiro Airport", city: "Luanda", country: "Angola" },
  { iata: "HAR", name: "Harare Robert Gabriel Mugabe Airport", city: "Harare", country: "Simbabwe" },
  { iata: "BUQ", name: "Bulawayo Airport", city: "Bulawayo", country: "Simbabwe" },
  { iata: "MRU", name: "Mauritius Sir Seewoosagur Ramgoolam Airport", city: "Port Louis", country: "Mauritius" },
  { iata: "TNR", name: "Antananarivo Ivato Airport", city: "Antananarivo", country: "Madagaskar" },
  { iata: "SEZ", name: "Seychellen Mahé Airport", city: "Victoria", country: "Seychellen" },
  { iata: "RUN", name: "La Réunion Roland Garros Airport", city: "Saint-Denis", country: "Réunion" },
  { iata: "MPM", name: "Maputo Airport", city: "Maputo", country: "Mosambik" },
  { iata: "BLZ", name: "Blantyre Chileka Airport", city: "Blantyre", country: "Malawi" },
  { iata: "EBB", name: "Entebbe International Airport", city: "Kampala", country: "Uganda" },
  { iata: "KGL", name: "Kigali International Airport", city: "Kigali", country: "Ruanda" },
  { iata: "BKO", name: "Bamako Modibo Keïta Airport", city: "Bamako", country: "Mali" },
  { iata: "OUA", name: "Ouagadougou Airport", city: "Ouagadougou", country: "Burkina Faso" },
  { iata: "NIM", name: "Niamey Diori Hamani Airport", city: "Niamey", country: "Niger" },
  { iata: "NDJ", name: "N'Djamena Hassan Djamous Airport", city: "N'Djamena", country: "Tschad" },
  { iata: "LFW", name: "Lomé Tokoin Airport", city: "Lomé", country: "Togo" },
  { iata: "COO", name: "Cotonou Cadjehoun Airport", city: "Cotonou", country: "Benin" },
  { iata: "SSG", name: "Malabo Santa Isabel Airport", city: "Malabo", country: "Äquatorialguinea" },
  { iata: "LBV", name: "Libreville Leon M'ba Airport", city: "Libreville", country: "Gabun" },
  { iata: "BZV", name: "Brazzaville Maya-Maya Airport", city: "Brazzaville", country: "Kongo" },
  { iata: "FIH", name: "Kinshasa N'djili Airport", city: "Kinshasa", country: "DR Kongo" },
  { iata: "DLA", name: "Douala Airport", city: "Douala", country: "Kamerun" },
  { iata: "YAO", name: "Yaoundé Nsimalen Airport", city: "Yaoundé", country: "Kamerun" },
  { iata: "BKO", name: "Bamako Modibo Keïta Airport", city: "Bamako", country: "Mali" },
  { iata: "RAK", name: "Marrakesch Menara Airport", city: "Marrakesch", country: "Marokko" },

  // ── Mongolei ─────────────────────────────────────────────────────────────────
  { iata: "ULN", name: "Ulaanbaatar Chinggis Khaan Airport", city: "Ulaanbaatar", country: "Mongolei" },

  // ── Afghanistan ──────────────────────────────────────────────────────────────
  { iata: "KBL", name: "Kabul Hamid Karzai Airport", city: "Kabul", country: "Afghanistan" },

  // ── Malediven ────────────────────────────────────────────────────────────────
  { iata: "MLE", name: "Malé Velana Airport", city: "Malé", country: "Malediven" },

  // ── Papua-Neuguinea ──────────────────────────────────────────────────────────
  { iata: "POM", name: "Port Moresby Jacksons Airport", city: "Port Moresby", country: "Papua-Neuguinea" },

  // ── Fidschi ──────────────────────────────────────────────────────────────────
  { iata: "NAN", name: "Nadi Airport", city: "Nadi", country: "Fidschi" },
  { iata: "SUV", name: "Suva Nausori Airport", city: "Suva", country: "Fidschi" },

  // ── Tahiti/Französisch-Polynesien ────────────────────────────────────────────
  { iata: "PPT", name: "Papeete Faa'a Airport", city: "Papeete", country: "Französisch-Polynesien" },

  // ── Neukaledonien ────────────────────────────────────────────────────────────
  { iata: "NOU", name: "Noumea La Tontouta Airport", city: "Nouméa", country: "Neukaledonien" },

  // ── Vanuatu ──────────────────────────────────────────────────────────────────
  { iata: "VLI", name: "Port Vila Bauerfield Airport", city: "Port Vila", country: "Vanuatu" },

  // ── Samoa ────────────────────────────────────────────────────────────────────
  { iata: "APW", name: "Apia Faleolo Airport", city: "Apia", country: "Samoa" },

  // ── Tonga ────────────────────────────────────────────────────────────────────
  { iata: "TBU", name: "Nuku'alofa Fua'amotu Airport", city: "Nuku'alofa", country: "Tonga" },

  // ── Nordafrika / Weitere Afrika ──────────────────────────────────────────────
  { iata: "KRT", name: "Khartum International Airport", city: "Khartum", country: "Sudan" },
  { iata: "MGQ", name: "Mogadischu Aden Adde Airport", city: "Mogadischu", country: "Somalia" },
  { iata: "JIB", name: "Dschibuti Ambouli Airport", city: "Dschibuti", country: "Dschibuti" },
  { iata: "ASM", name: "Asmara International Airport", city: "Asmara", country: "Eritrea" },
  { iata: "GZA", name: "Gaza Airport", city: "Gaza", country: "Palästina" },
  { iata: "WIL", name: "Nairobi Wilson Airport", city: "Nairobi", country: "Kenia" },
  { iata: "MWZ", name: "Mwanza Airport", city: "Mwanza", country: "Tansania" },
  { iata: "ARK", name: "Arusha Airport", city: "Arusha", country: "Tansania" },
  { iata: "BBO", name: "Berbera Airport", city: "Berbera", country: "Somalia" },

  // ── Weitere Asien ────────────────────────────────────────────────────────────
  { iata: "MNL", name: "Manila Ninoy Aquino Airport", city: "Manila", country: "Philippinen" },
  { iata: "BWN", name: "Bandar Seri Begawan Airport", city: "Bandar Seri Begawan", country: "Brunei" },
  { iata: "TLS", name: "Dili Presidente Nicolau Lobato Airport", city: "Dili", country: "Osttimor" },
  { iata: "HAN", name: "Hanoi Noi Bai Airport", city: "Hanoi", country: "Vietnam" },
  { iata: "GAN", name: "Addu Atoll Gan Airport", city: "Addu Atoll", country: "Malediven" },
  { iata: "VAM", name: "Maamigili Villa Airport", city: "South Ari Atoll", country: "Malediven" },
  { iata: "KDO", name: "Kadhdhoo Airport", city: "Laamu Atoll", country: "Malediven" },

  // ── Zentralasien ─────────────────────────────────────────────────────────────
  { iata: "FRU", name: "Bischkek Manas Airport", city: "Bischkek", country: "Kirgisistan" },
  { iata: "DYU", name: "Duschanbe Airport", city: "Duschanbe", country: "Tadschikistan" },
  { iata: "ASB", name: "Aschgabat Airport", city: "Aschgabat", country: "Turkmenistan" },
  { iata: "MYP", name: "Mary Airport", city: "Mary", country: "Turkmenistan" },

  // ── Weitere Europa ───────────────────────────────────────────────────────────
  { iata: "FAE", name: "Vagar Airport Färöer", city: "Vagar", country: "Färöer" },
  { iata: "TRN", name: "Turin Airport", city: "Turin", country: "Italien" },
  { iata: "AOI", name: "Ancona Airport", city: "Ancona", country: "Italien" },
  { iata: "GDT", name: "Grand Turk JAGS McCartney Airport", city: "Grand Turk", country: "Turks- und Caicosinseln" },

  // ── Weitere Ozeanien ─────────────────────────────────────────────────────────
  { iata: "GUM", name: "Guam Antonio B. Won Pat Airport", city: "Hagåtña", country: "Guam" },
  { iata: "SPN", name: "Saipan Francisco C. Ada Airport", city: "Saipan", country: "Nördliche Marianen" },
  { iata: "MAJ", name: "Majuro Marshall Islands Airport", city: "Majuro", country: "Marshallinseln" },
  { iata: "TRW", name: "Tarawa Bonriki Airport", city: "Tarawa", country: "Kiribati" },
  { iata: "IUE", name: "Niue Hanan Airport", city: "Alofi", country: "Niue" },
  { iata: "HVB", name: "Hervey Bay Airport", city: "Hervey Bay", country: "Australien" },
  { iata: "BDB", name: "Bundaberg Airport", city: "Bundaberg", country: "Australien" },
  { iata: "ARM", name: "Armidale Airport", city: "Armidale", country: "Australien" },
  { iata: "NTL", name: "Newcastle Airport", city: "Newcastle", country: "Australien" },
  { iata: "MCY", name: "Sunshine Coast Airport", city: "Maroochydore", country: "Australien" },
];
