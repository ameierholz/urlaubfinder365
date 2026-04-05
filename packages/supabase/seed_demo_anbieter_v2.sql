-- ══════════════════════════════════════════════════════════════════════════════
-- DEMO ANBIETER & LOKALE PARTNER v2
-- 30 Reiseanbieter + 30 Lokale Partner
-- Logos: DiceBear Shapes – algorithmisch generiert, kein Echtes Logo
-- Fix: Spalte "beschreibung" existiert nicht → nur "bio" verwenden
-- ══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. AUTH USERS für Anbieter
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES
  ('a2000000-0000-0000-0000-000000000001'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'info@suntours-demo.urlaubfinder365.de', crypt('AnbieterPass123!', gen_salt('bf')), now(),
   '{"full_name":"SunTours GmbH","rolle":"anbieter"}'::jsonb, now()-interval '400 days', now(),'','','',''),
  ('a2000000-0000-0000-0000-000000000002'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'info@islanddreams-demo.urlaubfinder365.de', crypt('AnbieterPass123!', gen_salt('bf')), now(),
   '{"full_name":"IslandDreams Griechenland","rolle":"anbieter"}'::jsonb, now()-interval '350 days', now(),'','','',''),
  ('a2000000-0000-0000-0000-000000000003'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'info@exotikreisen-demo.urlaubfinder365.de', crypt('AnbieterPass123!', gen_salt('bf')), now(),
   '{"full_name":"Exotik Reisen GmbH","rolle":"anbieter"}'::jsonb, now()-interval '300 days', now(),'','','',''),
  ('a2000000-0000-0000-0000-000000000004'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'info@aquasports-demo.urlaubfinder365.de', crypt('AnbieterPass123!', gen_salt('bf')), now(),
   '{"full_name":"AquaSports Mallorca","rolle":"anbieter"}'::jsonb, now()-interval '280 days', now(),'','','',''),
  ('a2000000-0000-0000-0000-000000000005'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'info@reisemeer-demo.urlaubfinder365.de', crypt('AnbieterPass123!', gen_salt('bf')), now(),
   '{"full_name":"Reise & Meer Kreuzfahrten","rolle":"anbieter"}'::jsonb, now()-interval '250 days', now(),'','','','')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ANBIETER PROFILE (30 Reiseveranstalter)
-- Spalten ohne "beschreibung" (existiert nicht in der DB)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO anbieter_profile (
  id, user_id, name, email, status, verifiziert,
  webseite, kategorie, stadt, land_name,
  sprachen, erfahrung_jahre, avatar_url, sprache,
  instagram, telefon, bio
) VALUES
  (gen_random_uuid(),'a2000000-0000-0000-0000-000000000001','SunTours GmbH',
   'info@suntours.de','aktiv',true,'https://suntours.de',
   'Tagesausflüge','München','Deutschland',ARRAY['Deutsch','Englisch','Türkisch'],15,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SunToursGmbH&backgroundColor=1db682','de',
   '@suntours_de','+49 89 123456',
   'Ihr Türkei-Spezialist seit 2009! Pauschalreisen Antalya, Side & Belek – jedes Resort persönlich geprüft. Bestpreisgarantie & kostenlose Umbuchung.'),

  (gen_random_uuid(),'a2000000-0000-0000-0000-000000000002','IslandDreams Griechenland',
   'info@islanddreams.de','aktiv',true,'https://islanddreams.de',
   'Stadtführungen','Frankfurt','Deutschland',ARRAY['Deutsch','Griechisch','Englisch'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=IslandDreamsGR&backgroundColor=6991d8','de',
   '@islanddreams','+49 69 234567',
   'Griechenland-Spezialisten! Kreta, Santorini, Rhodos & unbekannte Inseln – wir kennen jede Bucht. Familien & Paare in besten Händen. Deutsche Reiseleitung.'),

  (gen_random_uuid(),'a2000000-0000-0000-0000-000000000003','Exotik Reisen GmbH',
   'info@exotik-reisen.de','aktiv',true,'https://exotik-reisen.de',
   'Kultur & Kunst','Hamburg','Deutschland',ARRAY['Deutsch','Englisch','Spanisch','Französisch'],20,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ExotikReisenGmbH&backgroundColor=f59e0b','de',
   '@exotik_reisen','+49 40 345678',
   'Fernreise-Experten seit 2003! Bali, Thailand, Malediven, Marokko, Kenia. Individuelle Routen & geführte Gruppentouren auf allen Kontinenten.'),

  (gen_random_uuid(),'a2000000-0000-0000-0000-000000000004','AquaSports Mallorca',
   'info@aquasports-mallorca.es','aktiv',true,'https://aquasports-mallorca.es',
   'Wassersport','Alcúdia, Mallorca','Spanien',ARRAY['Deutsch','Englisch','Spanisch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AquaSportsMallorca&backgroundColor=06b6d4','de',
   '@aquasports_mallorca','+34 971 123456',
   'Wassersport pur auf Mallorca! Jetski, Parasailing, Schnorcheln, Tauchen, SUP – sicher, professionell und mit viel Spaß. Für Anfänger & Profis.'),

  (gen_random_uuid(),'a2000000-0000-0000-0000-000000000005','Reise & Meer Kreuzfahrten',
   'info@reise-meer.de','aktiv',true,'https://reise-meer.de',
   'Sonstiges','Bremen','Deutschland',ARRAY['Deutsch','Englisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ReiseMeerKreuzfahrten&backgroundColor=8b5cf6','de',
   '@reisemeer_kreuzfahrten','+49 421 456789',
   'Kreuzfahrt-Spezialisten seit 2005! MSC, AIDA, Costa, Royal Caribbean – Gruppenrabatte & Bestkabinen-Garantie. 18 Jahre Erfahrung.'),

  (gen_random_uuid(),NULL,'Alpine Escape Skiurlaub',
   'ski@alpine-escape.at','aktiv',true,'https://alpine-escape.at',
   'Outdoor & Wandern','Innsbruck','Österreich',ARRAY['Deutsch','Englisch','Französisch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlpineEscapeSki&backgroundColor=3b82f6','de',
   '@alpine_escape','+43 512 789012',
   'Skiurlaub-Spezialist Österreich, Schweiz & Frankreich. Chalets direkt an der Piste, Ski-Verleih & Skischule-Vermittlung inklusive.'),

  (gen_random_uuid(),NULL,'CityBreaks24',
   'hello@citybreaks24.de','aktiv',true,'https://citybreaks24.de',
   'Stadtführungen','Berlin','Deutschland',ARRAY['Deutsch','Englisch'],6,
   'https://api.dicebear.com/9.x/shapes/svg?seed=CityBreaks24&backgroundColor=ec4899','de',
   '@citybreaks24','+49 30 567890',
   'Städtereisen neu gedacht! Barcelona, Paris, Amsterdam, Wien – Wochenendtrips inkl. Stadtführung & Restaurantempfehlungen. 50+ Metropolen im Programm.'),

  (gen_random_uuid(),NULL,'DiveWorld Hurghada',
   'dive@diveworld-hurghada.com','aktiv',true,'https://diveworld-hurghada.com',
   'Wassersport','Hurghada','Ägypten',ARRAY['Deutsch','Englisch','Arabisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=DiveWorldHurghada&backgroundColor=0891b2','de',
   '@diveworld_hurghada','+20 65 3456789',
   'Beste Tauchbasis am Roten Meer! PADI-Zertifizierungen, Tauchsafaris, Schnorchel-Touren. Erfahrene Divemaster, modernes Equipment, max. Sicherheit.'),

  (gen_random_uuid(),NULL,'SandDune Tours Ägypten',
   'info@sanddune-tours.eg','aktiv',true,'https://sanddune-tours.eg',
   'Tagesausflüge','Kairo','Ägypten',ARRAY['Deutsch','Arabisch','Englisch'],17,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SandDuneTours&backgroundColor=d97706','de',
   '@sanddune_tours','+20 2 12345678',
   'Ägypten komplett! Pyramiden, Luxor, Nilkreuzfahrten, Wüstensafaris. Deutsche Reiseleitung & private Transporte im ganzen Land. 17 Jahre Erfahrung.'),

  (gen_random_uuid(),NULL,'Antalya Expert Tours',
   'tours@antalya-expert.tr','aktiv',true,'https://antalya-expert.tr',
   'Tagesausflüge','Antalya','Türkei',ARRAY['Deutsch','Türkisch','Englisch','Russisch'],13,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AntalyaExpert&backgroundColor=1db682','de',
   '@antalya_expert','+90 242 3456789',
   'Ausflüge ab Antalya: Pamukkale, Kappadokien, Ephesus, Side, Aspendos. Abholung direkt vom Hotel. Professionelle deutsche Reiseleitung!'),

  (gen_random_uuid(),NULL,'BarcelonaGuide Experience',
   'hola@barcelonaguide.es','aktiv',true,'https://barcelonaguide.es',
   'Stadtführungen','Barcelona','Spanien',ARRAY['Deutsch','Spanisch','Englisch','Katalanisch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BarcelonaGuide&backgroundColor=ef4444','de',
   '@barcelona_guide','+34 93 7890123',
   'Barcelona wie ein Einheimischer! Führungen durch El Born, Gràcia, Poblenou – Architektur, Food-Touren, Tapas & Gin-Tonic Abende abseits der Touristenpfade.'),

  (gen_random_uuid(),NULL,'MaldivesLux Premium Travel',
   'info@maldiveslux.com','aktiv',true,'https://maldiveslux.com',
   'Sonstiges','Frankfurt','Deutschland',ARRAY['Deutsch','Englisch'],16,
   'https://api.dicebear.com/9.x/shapes/svg?seed=MaldivesLux&backgroundColor=0ea5e9','de',
   '@maldives_lux','+49 69 890123',
   'Malediven-Experten für Luxusreisende! Private Atolls, Overwater-Bungalows, Wasserflugzeuge, Hochzeitsreisen. Nur die besten Resorts in unserer Auswahl.'),

  (gen_random_uuid(),NULL,'DubaiStyle Travel',
   'luxury@dubaistyle.ae','aktiv',true,'https://dubaistyle.ae',
   'Sonstiges','Dubai','VAE',ARRAY['Deutsch','Arabisch','Englisch','Russisch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=DubaiStyle&backgroundColor=f59e0b','de',
   '@dubaistyle_travel','+971 4 1234567',
   'Dubai & Abu Dhabi exklusiv! Wüstensafaris per Helikopter, Desert-Camps, Dhow-Cruises, Burj Khalifa At The Top. VIP-Erlebnisse für anspruchsvolle Reisende.'),

  (gen_random_uuid(),NULL,'BaliSoul Retreats',
   'namaste@balisoul.id','aktiv',true,'https://balisoul.id',
   'Kultur & Kunst','Ubud, Bali','Indonesien',ARRAY['Deutsch','Englisch','Indonesisch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BaliSoul&backgroundColor=84cc16','de',
   '@balisoul_retreats','+62 361 234567',
   'Bali tiefer erleben! Yoga-Retreats, Tempel-Touren, Reisterrassen-Wanderungen, Kochkurse. Authentisch, nachhaltig und unvergesslich.'),

  (gen_random_uuid(),NULL,'KaribikDream Reisen',
   'info@karibikdream.de','aktiv',true,'https://karibikdream.de',
   'Sonstiges','Köln','Deutschland',ARRAY['Deutsch','Englisch','Spanisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=KaribikDream&backgroundColor=06b6d4','de',
   '@karibikdream','+49 221 1234567',
   'Traumurlaub in der Karibik! Cancún, Punta Cana, Kuba, Jamaica, Barbados. All-Inclusive-Experten & individuelle Karibik-Reisen für jeden Geschmack.'),

  (gen_random_uuid(),NULL,'SafariAfrica Tours',
   'safari@safariafrica.ke','aktiv',true,'https://safariafrica.ke',
   'Outdoor & Wandern','Nairobi','Kenia',ARRAY['Deutsch','Englisch','Suaheli'],19,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SafariAfrica&backgroundColor=78350f','de',
   '@safari_africa_ke','+254 20 3456789',
   'Safari-Erlebnisse in Kenia & Tansania! Masai Mara, Serengeti, Ngorongoro. Kleine Gruppen, ethischer Tourismus, exzellente Guides. 19 Jahre Erfahrung.'),

  (gen_random_uuid(),NULL,'OceanClub Wassersport',
   'info@oceanclub.es','aktiv',true,'https://oceanclub.es',
   'Wassersport','Corralejo, Fuerteventura','Spanien',ARRAY['Deutsch','Englisch','Spanisch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=OceanClubWassersport&backgroundColor=0284c7','de',
   '@oceanclub_es','+34 928 345678',
   'Wassersport von A bis Z auf den Kanaren! Windsurfen, Kiten, Surfen, Jetski, Paragliding. Teneriffa, Gran Canaria, Fuerteventura – Kurse für alle Niveaus.'),

  (gen_random_uuid(),NULL,'TravelPremium Luxusreisen',
   'luxury@travelpremium.de','aktiv',true,'https://travelpremium.de',
   'Sonstiges','München','Deutschland',ARRAY['Deutsch','Englisch','Französisch','Arabisch'],22,
   'https://api.dicebear.com/9.x/shapes/svg?seed=TravelPremium&backgroundColor=7c3aed','de',
   '@travelpremium_de','+49 89 567890',
   'First-Class Reisen für höchste Ansprüche! Business & First Class Flüge, 5-Sterne-Resorts, private Transfers, Concierge-Service 24/7. Maßgeschneidert.'),

  (gen_random_uuid(),NULL,'BackpackerHub Community Travel',
   'go@backpackerhub.de','aktiv',true,'https://backpackerhub.de',
   'Tagesausflüge','Berlin','Deutschland',ARRAY['Deutsch','Englisch'],5,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BackpackerHub&backgroundColor=10b981','de',
   '@backpackerhub_de','+49 30 678901',
   'Reisen für Entdecker mit kleinem Budget! Gruppenreisen unter 100€/Tag, Hostel-Buchungen, Rucksack-Touren in Asien, Südamerika & Europa. Community first!'),

  (gen_random_uuid(),NULL,'FamilyVacations Deutschland',
   'familien@familyvacations.de','aktiv',true,'https://familyvacations.de',
   'Sonstiges','Köln','Deutschland',ARRAY['Deutsch','Englisch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=FamilyVacations&backgroundColor=f97316','de',
   '@familyvacations_de','+49 221 456789',
   'Familienurlaub ohne Stress! Kinderfreundliche Hotels, Aktivitätsprogramme, Babysitting, Transfers. Wir planen alles – ihr genießt entspannt die Zeit zusammen.'),

  (gen_random_uuid(),NULL,'WellnessResort Collection',
   'spa@wellnessresort.de','aktiv',true,'https://wellnessresort.de',
   'Sonstiges','Wien','Österreich',ARRAY['Deutsch','Englisch'],13,
   'https://api.dicebear.com/9.x/shapes/svg?seed=WellnessResortCollection&backgroundColor=ec4899','de',
   '@wellnessresort_collection','+43 1 234567',
   'Wellness-Urlaub der Extraklasse! Österreichische Thermen, türkische Hammams, Ayurveda in Kerala. Die besten Wellness-Resorts weltweit kuratiert.'),

  (gen_random_uuid(),NULL,'AlpenClub Bergwandern',
   'info@alpenclub-wandern.at','aktiv',true,'https://alpenclub-wandern.at',
   'Outdoor & Wandern','Salzburg','Österreich',ARRAY['Deutsch','Englisch'],16,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlpenClubBergwandern&backgroundColor=16a34a','de',
   '@alpenclub_wandern','+43 662 345678',
   'Geführte Wandertouren in den Alpen! Von Familienwanderungen bis anspruchsvolle Bergtouren. Certified Mountain Guides, kleine Gruppen, authentische Hüttenerlebnisse.'),

  (gen_random_uuid(),NULL,'KulturReisen Akademie',
   'bildung@kulturreisen.de','aktiv',true,'https://kulturreisen.de',
   'Kultur & Kunst','Leipzig','Deutschland',ARRAY['Deutsch','Englisch','Italienisch','Griechisch'],21,
   'https://api.dicebear.com/9.x/shapes/svg?seed=KulturReisenAkademie&backgroundColor=92400e','de',
   '@kulturreisen_akademie','+49 341 234567',
   'Bildungsreisen mit Kunsthistorikern & Archäologen! Ausgrabungsstätten, Museen, UNESCO-Stätten. Lernen und Staunen auf höchstem Niveau.'),

  (gen_random_uuid(),NULL,'SpeedTours Last Minute',
   'jetzt@speedtours.de','aktiv',true,'https://speedtours.de',
   'Sonstiges','Düsseldorf','Deutschland',ARRAY['Deutsch','Englisch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SpeedToursLastMinute&backgroundColor=dc2626','de',
   '@speedtours_de','+49 211 345678',
   'Last-Minute-Spezialist für spontane Urlauber! Täglich beste Deals für die nächsten 21 Tage. Preisalarm-Service & 24h-Buchungshotline.'),

  (gen_random_uuid(),NULL,'IsleHopper Inselreisen',
   'island@islehopper.eu','aktiv',true,'https://islehopper.eu',
   'Tagesausflüge','Hamburg','Deutschland',ARRAY['Deutsch','Englisch','Griechisch','Kroatisch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=IsleHopperInseln&backgroundColor=0ea5e9','de',
   '@islehopper','+49 40 456789',
   'Inselhüpfen-Spezialisten! Griechenland, Kroatien, Malediven, Kanaren – Fähren, Flüge & Unterkünfte für individuelle Inseltouren. DIY und geführt.'),

  (gen_random_uuid(),NULL,'AsienSpecials Fernreisen',
   'asia@asienspecials.de','aktiv',true,'https://asienspecials.de',
   'Tagesausflüge','Stuttgart','Deutschland',ARRAY['Deutsch','Englisch','Japanisch','Thailändisch'],15,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AsienSpecials&backgroundColor=84cc16','de',
   '@asienspecials','+49 711 567890',
   'Asien individuell erleben! Thailand, Vietnam, Japan, Bali, Singapur, Korea. Maßgeschneiderte Routen, professionelle Betreuung, Best-Price-Garantie.'),

  (gen_random_uuid(),NULL,'AfrikaAdventure Expeditions',
   'adventure@afrikaadventure.de','aktiv',true,'https://afrikaadventure.de',
   'Outdoor & Wandern','Freiburg','Deutschland',ARRAY['Deutsch','Englisch','Suaheli','Französisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AfrikaAdventure&backgroundColor=b45309','de',
   '@afrikaadventure','+49 761 678901',
   'Abenteuerreisen in Afrika! Kilimanjaro-Besteigung, Okavango-Kanu-Safari, Madagaskar-Expedition, Äthiopien-Trekking. Für mutige Entdecker.'),

  (gen_random_uuid(),NULL,'EuroTravel Komfort-Reisen',
   'europa@eurotravel.de','aktiv',true,'https://eurotravel.de',
   'Sonstiges','Nürnberg','Deutschland',ARRAY['Deutsch','Englisch','Französisch','Polnisch'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=EuroTravel&backgroundColor=3b82f6','de',
   '@eurotravel_de','+49 911 789012',
   'Komfortables Europa entdecken! Zugreisen, Busreisen & Flugpakete durch Österreich, Schweiz, Nordeuropa, Osteuropa. Entspannt reisen!'),

  (gen_random_uuid(),NULL,'GolfResort Collection',
   'golf@golfresort.eu','aktiv',true,'https://golfresort.eu',
   'Outdoor & Wandern','Frankfurt','Deutschland',ARRAY['Deutsch','Englisch','Portugiesisch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=GolfResortCollection&backgroundColor=16a34a','de',
   '@golfresort_eu','+49 69 890123',
   'Golfreisen für Handicap-Träger & Einsteiger! Algarve, Costa del Sol, Mallorca, Dubai. Top Golf Courses, Hotel-Kombi, Turniere & Coaching.'),

  (gen_random_uuid(),NULL,'HoneymoonTravel Flitterwochenreisen',
   'love@honeymoontravel.de','aktiv',true,'https://honeymoontravel.de',
   'Sonstiges','München','Deutschland',ARRAY['Deutsch','Englisch','Italienisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=HoneymoonTravel&backgroundColor=ec4899','de',
   '@honeymoon_travel','+49 89 012345',
   'Die schönste Reise Ihres Lebens! Unvergessliche Flitterwochen: Malediven, Seychellen, Bali, Toskana, Santorini. Romantische Details bis ins Kleinste.')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. LOKALE PARTNER (30 lokale Betriebe)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO anbieter_profile (
  id, user_id, name, email, status, verifiziert,
  webseite, kategorie, stadt, land_name,
  sprachen, erfahrung_jahre, avatar_url, sprache,
  instagram, telefon, bio
) VALUES
  (gen_random_uuid(),NULL,'Strand-Café Sunset Antalya',
   'cafe@sunset-antalya.tr','aktiv',true,NULL,
   'Gastronomie','Alanya, Antalya','Türkei',ARRAY['Türkisch','Deutsch','Englisch'],5,
   'https://api.dicebear.com/9.x/shapes/svg?seed=StrandCafeAntalya&backgroundColor=f59e0b','tr',
   '@sunset_cafe_alanya','+90 242 5123456',
   'Direkt am Kleopatra-Strand! Frische Cocktails, türkischer Tee & hausgemachte Baklava mit Meerblick. Der perfekte Sundowner nach einem langen Strandtag.'),

  (gen_random_uuid(),NULL,'DivePro Tauchbasis Hurghada',
   'dive@divepro-hurghada.eg','aktiv',true,NULL,
   'Wassersport','Hurghada','Ägypten',ARRAY['Deutsch','Englisch','Arabisch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=DiveProHurghada&backgroundColor=0891b2','de',
   '@divepro_hurghada','+20 65 4567890',
   'PADI 5-Sterne Dive Center am Roten Meer! Tägliche Bootsausflüge, Nacht-Tauchen, Freediving. Moderne Ausrüstung, professionelle Divemaster.'),

  (gen_random_uuid(),NULL,'La Pasión Flamenca Barcelona',
   'hola@lapasionflamenca.es','aktiv',true,NULL,
   'Kultur & Kunst','El Born, Barcelona','Spanien',ARRAY['Spanisch','Katalanisch','Englisch','Deutsch'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=LaPassionFlamenca&backgroundColor=dc2626','es',
   '@lapasionflamenca','+34 93 8901234',
   'Authentisches Flamenco-Erlebnis im Herzen Barcelonas! Abendliche Shows, Tanzworkshops, Tapas & Weine. Echte Leidenschaft – kein Touristentheater.'),

  (gen_random_uuid(),NULL,'Es Mirador Restaurant Mallorca',
   'reserva@esmirador.es','aktiv',true,NULL,
   'Gastronomie','Alcúdia, Mallorca','Spanien',ARRAY['Spanisch','Deutsch','Englisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=EsMiradorMallorca&backgroundColor=f97316','es',
   '@esmirador_mallorca','+34 971 234567',
   'Das romantischste Restaurant Mallorcas! Auf einem Felsen über dem Mittelmeer, 180°-Panoramablick. Mallorquinische Küche mit modernem Touch. Reservierung empfohlen!'),

  (gen_random_uuid(),NULL,'Sacred River Yoga Ubud Bali',
   'info@sacredriver.id','aktiv',true,NULL,
   'Kultur & Kunst','Ubud, Bali','Indonesien',ARRAY['Englisch','Indonesisch','Deutsch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SacredRiverYoga&backgroundColor=84cc16','en',
   '@sacred_river_yoga','+62 361 345678',
   'Yoga-Retreat am Ayung River! Tägliche Hatha- & Vinyasa-Klassen, Meditation, Ayurveda. Bio-veganes Restaurant, Dschungel-Bungalows, vollständige Abgeschiedenheit.'),

  (gen_random_uuid(),NULL,'Atlantic Surf School Fuerteventura',
   'surf@atlantic-surf.es','aktiv',true,NULL,
   'Wassersport','Corralejo, Fuerteventura','Spanien',ARRAY['Englisch','Spanisch','Deutsch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AtlanticSurfSchool&backgroundColor=0ea5e9','es',
   '@atlantic_surf_fuerteventura','+34 928 456789',
   'Surfen lernen an der besten Welle Europas! ISA-zertifizierte Lehrer, Boards & Neopren inklusive. Anfänger bis Fortgeschrittene, Wochenkurse buchbar.'),

  (gen_random_uuid(),NULL,'Rhodos Explorer Guide Service',
   'guide@rhodos-explorer.gr','aktiv',true,NULL,
   'Stadtführungen','Rhodos-Stadt','Griechenland',ARRAY['Griechisch','Deutsch','Englisch'],15,
   'https://api.dicebear.com/9.x/shapes/svg?seed=RhodoExplorer&backgroundColor=3b82f6','de',
   '@rhodos_explorer','+30 2241 234567',
   'Lizenzierter Reiseführer auf Rhodos – 15 Jahre Erfahrung! Altstadt UNESCO, Lindos, Prasonisi. Individuelle Touren auf Deutsch, eigenem Fahrzeug, flexible Zeiten.'),

  (gen_random_uuid(),NULL,'To Limani Fish Taverna Kreta',
   'opa@tolimani.gr','aktiv',true,NULL,
   'Gastronomie','Chania, Kreta','Griechenland',ARRAY['Griechisch','Deutsch','Englisch'],46,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ToLimaniFishTaverna&backgroundColor=1d4ed8','el',
   '@tolimani_chania','+30 28210 23456',
   'Familiengeführte Fischtaverne am Hafen von Chania seit 1978! Frischer Fang täglich, traditionelle kretische Rezepte, hausgemachter Raki. Kein Touristenlokal!'),

  (gen_random_uuid(),NULL,'Arabian Nights Desert Safari',
   'desert@arabian-nights.ae','aktiv',true,NULL,
   'Tagesausflüge','Dubai','VAE',ARRAY['Arabisch','Englisch','Deutsch','Russisch','Hindi'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ArabianNightsDesert&backgroundColor=d97706','ar',
   '@arabian_nights_dubai','+971 4 2345678',
   'Das ultimative Dubai-Erlebnis! Dünensafari im Land Rover, Kamelreiten bei Sonnenuntergang, BBQ unter Sternenhimmel, Bauchtanz & Henna. Tägliche Abholung ab Hotel.'),

  (gen_random_uuid(),NULL,'La Nonna Cucina Romana',
   'ciao@nonnacucina.it','aktiv',true,NULL,
   'Gastronomie','Trastevere, Rom','Italien',ARRAY['Italienisch','Englisch','Deutsch'],20,
   'https://api.dicebear.com/9.x/shapes/svg?seed=LaNonnaCucinaRomana&backgroundColor=dc2626','it',
   '@nonna_cucina_roma','+39 06 12345678',
   'Kochen wie eine römische Nonna! 3-stündige Kochkurse: Pasta frisch, Tiramisu, Cacio e Pepe. Einkauf auf dem Campo de Fiori inklusive. Seit 20 Jahren beliebt!'),

  (gen_random_uuid(),NULL,'Blue Cave Boat Tours Dubrovnik',
   'ahoy@bluecave-dubrovnik.hr','aktiv',true,NULL,
   'Wassersport','Dubrovnik','Kroatien',ARRAY['Kroatisch','Englisch','Deutsch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BlueCaveBoatDubrovnik&backgroundColor=0284c7','de',
   '@bluecave_dubrovnik','+385 20 345678',
   'Schnellboote durch die Inselwelt! Elaphiten-Inseln, Blaue Höhle, Lokrum, GOT-Drehorte. Täglich 9 Uhr, max. 12 Personen, Sekt & Snacks inklusive.'),

  (gen_random_uuid(),NULL,'Volcano Spa & Wellness Teneriffa',
   'relax@volcano-spa.es','aktiv',true,NULL,
   'Sonstiges','Puerto de la Cruz, Teneriffa','Spanien',ARRAY['Spanisch','Deutsch','Englisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=VolcanoSpaTenerife&backgroundColor=ec4899','de',
   '@volcano_spa_tenerife','+34 922 456789',
   'Exklusives Spa mit Blick auf den Teide! Vulkanstein-Massagen, Lava-Shell-Behandlungen, Thalasso-Pool. Tagestickets & Packages für Nicht-Hotelgäste.'),

  (gen_random_uuid(),NULL,'Bangkok Night Market Food Tour',
   'eat@bangkoknight.th','aktiv',true,NULL,
   'Gastronomie','Chinatown, Bangkok','Thailand',ARRAY['Englisch','Deutsch','Thaiisch'],6,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BangkokNightMarket&backgroundColor=f59e0b','en',
   '@bkk_night_food','+66 2 3456789',
   'Authentische Bangkok-Streetfood-Tour durch Chinatown & Yaowarat! Mit lokalem Guide, 8-10 Gerichte, Tuk-Tuk-Transfer inklusive. Jeden Abend 18 Uhr.'),

  (gen_random_uuid(),NULL,'Assyrtiko Wine Tours Santorini',
   'wine@assyrtiko.gr','aktiv',true,NULL,
   'Gastronomie','Oia, Santorini','Griechenland',ARRAY['Griechisch','Englisch','Deutsch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AssyrtikoWineTours&backgroundColor=7c3aed','el',
   '@assyrtiko_santorini','+30 22860 12345',
   'Weintour durch Santorinis legendäre Vulkan-Weinberge! Assyrtiko, Vinsanto & Nykteri in 3 Weingütern. Sonnenuntergang in Oia inklusive. Transport ab Hotel.'),

  (gen_random_uuid(),NULL,'Sahara Spirit Kamel-Safari Marrakesch',
   'trek@sahara-spirit.ma','aktiv',true,NULL,
   'Outdoor & Wandern','Marrakesch','Marokko',ARRAY['Arabisch','Französisch','Deutsch','Englisch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SaharaSpiritCamel&backgroundColor=d97706','fr',
   '@sahara_spirit_ma','+212 524 234567',
   'Sahara-Erlebnis von Marrakesch aus! Kamel-Trek bei Sonnenuntergang in der Agafay-Wüste, Berberzelt-Dinner, Sternenhimmel. Geländewagen-Transfer inklusive.'),

  (gen_random_uuid(),NULL,'Alpin Pro Skischule Innsbruck',
   'ski@alpinpro.at','aktiv',true,NULL,
   'Outdoor & Wandern','Innsbruck','Österreich',ARRAY['Deutsch','Englisch','Italienisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlpinProSkiInnsbruck&backgroundColor=3b82f6','de',
   '@alpinpro_innsbruck','+43 512 890123',
   'Lizenzierte Skischule mit Österreichischem Staatsdiplom! Privatstunden, Gruppenkurse, Kinder-Skischule. Stubaier Gletscher, Nordkette & Axamer Lizum.'),

  (gen_random_uuid(),NULL,'Venezia Photo Walks',
   'click@veneziaphoto.it','aktiv',true,NULL,
   'Kultur & Kunst','Castello, Venedig','Italien',ARRAY['Italienisch','Englisch','Deutsch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=VeneziaPhotoWalks&backgroundColor=f59e0b','it',
   '@venezia_photo','+39 041 2345678',
   'Fotografie-Touren durch das echte Venedig! Frühmorgens durch verlassene Calli, Rialtomarkt bei Sonnenaufgang. Für Smartphone & Spiegelreflex. Max. 6 Personen.'),

  (gen_random_uuid(),NULL,'Adriatic Kayak Tours Montenegro',
   'paddle@adriatic-kayak.me','aktiv',true,NULL,
   'Wassersport','Kotor, Montenegro','Montenegro',ARRAY['Englisch','Deutsch','Kroatisch','Montenegrinisch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AdriaticKayakMontenegro&backgroundColor=0ea5e9','de',
   '@adriatic_kayak','+382 32 123456',
   'Seekajak-Touren in der Bucht von Kotor! Höhlenerkundung, Abend-Glühwürmchen-Tour. Ausrüstung & Guide inklusive. Halbtages- und Ganztagestouren. Alle Niveaus!'),

  (gen_random_uuid(),NULL,'Istanbul Sokak Food Tour',
   'yemek@istanbul-sokak.tr','aktiv',true,NULL,
   'Gastronomie','Beşiktaş, Istanbul','Türkei',ARRAY['Türkisch','Englisch','Deutsch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=IstanbulSokakFood&backgroundColor=dc2626','tr',
   '@istanbul_sokak_food','+90 212 3456789',
   'Istanbuls Streetfood komplett! Gewürzbasar, Balık Ekmek, Simit, Midye Dolma. 4-stündige Tour durch Beşiktaş & Karaköy mit lokalem Guide.'),

  (gen_random_uuid(),NULL,'Tarihi Hamam Erfahrung Antalya',
   'hammam@tarihi-hamam.tr','aktiv',true,NULL,
   'Sonstiges','Kaleiçi, Antalya','Türkei',ARRAY['Türkisch','Deutsch','Englisch','Russisch'],30,
   'https://api.dicebear.com/9.x/shapes/svg?seed=TarihiHamamAntalya&backgroundColor=92400e','tr',
   '@tarihi_hamam_antalya','+90 242 6789012',
   'Echtes türkisches Hamam im historischen 18. Jh. Hamam der Altstadt! Traditionelle Körperpflege, Kese-Scrub, Seifenmassage. Authentisch – keine Touristenfalle.'),

  (gen_random_uuid(),NULL,'Coral Bay Schnorchel-Touren Hurghada',
   'snorkel@coralbay.eg','aktiv',true,NULL,
   'Wassersport','Hurghada','Ägypten',ARRAY['Arabisch','Deutsch','Englisch','Russisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=CoralBaySnorkel&backgroundColor=0891b2','de',
   '@coralbay_hurghada','+20 65 5678901',
   'Täglich Schnorchel-Touren zu den schönsten Riffen Hurghadas! Paradise Island, Orange Bay, Mahmya. Glasbodenboot, Ausrüstung & Mittagessen inklusive.'),

  (gen_random_uuid(),NULL,'Amsterdam Cycling Adventure',
   'bike@amsterdam-cycling.nl','aktiv',true,NULL,
   'Outdoor & Wandern','Amsterdam','Niederlande',ARRAY['Niederländisch','Englisch','Deutsch'],6,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AmsterdamCycling&backgroundColor=f97316','de',
   '@amsterdam_cycling','+31 20 3456789',
   'Radtouren durch Amsterdam & Umland! Windmühlen-Tour nach Zaanse Schans, Keukenhof-Blumentour. Bikes inklusive, kleine Gruppen, entspannte Atmosphäre.'),

  (gen_random_uuid(),NULL,'Athen Acropolis Expert Guides',
   'logos@acropolis-expert.gr','aktiv',true,NULL,
   'Stadtführungen','Athen','Griechenland',ARRAY['Griechisch','Englisch','Deutsch','Französisch'],22,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AthensAcropolisExpert&backgroundColor=1d4ed8','de',
   '@acropolis_expert','+30 210 2345678',
   'Lizenzierte Archäologin führt durch die Akropolis! Max. 8 Personen, frühmorgens vor den Massen. Nationalmuseum, Agora, Kerameikos auch buchbar.'),

  (gen_random_uuid(),NULL,'Adriatic Boat Rental Split',
   'sail@adriatic-rental.hr','aktiv',true,NULL,
   'Wassersport','Split','Kroatien',ARRAY['Kroatisch','Englisch','Deutsch','Italiano'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AdriaticBoatRentalSplit&backgroundColor=0284c7','de',
   '@adriatic_boat_split','+385 21 234567',
   'Boote ohne Führerschein mieten! Motorboote & Schlauchboote für 4-8 Personen. Dalmatinische Küste & Inseln selbst erkunden. Ab Split, Trogir & Omiš.'),

  (gen_random_uuid(),NULL,'Madrid de Tapas Food Tour',
   'hola@madrid-tapas.es','aktiv',true,NULL,
   'Gastronomie','La Latina, Madrid','Spanien',ARRAY['Spanisch','Englisch','Deutsch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=MadridTapasTour&backgroundColor=dc2626','es',
   '@madrid_tapas_tour','+34 91 5678901',
   'Authentischste Tapas-Tour Madrids! La Latina & Lavapiés – Geheimrestaurants der Einheimischen. Jamon Iberico, Vermouth, 4h, 8-10 Stops, Guide auf Deutsch.'),

  (gen_random_uuid(),NULL,'Algarve Adventure Wassersport',
   'surf@algarve-adventure.pt','aktiv',true,NULL,
   'Wassersport','Lagos, Algarve','Portugal',ARRAY['Portugiesisch','Englisch','Deutsch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlgarveAdventure&backgroundColor=0ea5e9','de',
   '@algarve_adventure','+351 282 345678',
   'Surfen, Kajak, SUP, Coasteering an der Algarve! Meereshöhlen per Kajak, Felsenlandschaften. Tages- & Halbtagstouren ab Lagos & Sagres.'),

  (gen_random_uuid(),NULL,'Sky High Parasailing Malediven',
   'fly@skyhigh-malediven.mv','aktiv',true,NULL,
   'Wassersport','North Malé Atoll, Malediven','Malediven',ARRAY['Englisch','Deutsch'],5,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SkyHighParasailing&backgroundColor=0891b2','en',
   '@skyhigh_malediven','+960 1234567',
   'Parasailing über der blauen Lagune der Malediven! 80m Höhe, Blick auf Atolle & türkises Wasser. Tandem-Flüge ohne Erfahrung möglich. Ab verschiedenen Resorts.'),

  (gen_random_uuid(),NULL,'Buza Bar Dubrovnik Felsbar',
   'cheers@buza-bar.hr','aktiv',true,NULL,
   'Gastronomie','Stare Grad, Dubrovnik','Kroatien',ARRAY['Kroatisch','Englisch','Deutsch'],25,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BuzaBarDubrovnik&backgroundColor=7c3aed','hr',
   '@buza_bar_dubrovnik','+385 20 456789',
   'Die berühmteste Bar Dubrovniks – direkt in die Stadtmauer gehauen! Cocktails & Wein auf Felsen mit Mittelmeer-Blick. Sonnenuntergang hier ist unvergesslich!'),

  (gen_random_uuid(),NULL,'Thai Kitchen Cooking School Chiang Mai',
   'cook@thai-kitchen.th','aktiv',true,NULL,
   'Gastronomie','Nimmanhaemin, Chiang Mai','Thailand',ARRAY['Thaiisch','Englisch','Deutsch'],13,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ThaiKitchenCookingSchool&backgroundColor=84cc16','en',
   '@thai_kitchen_chiangmai','+66 53 234567',
   'Authentischer Thai-Kochkurs! Marktbesuch, 4 Gerichte kochen & essen. Tom Yum, Pad Thai, Green Curry, Mango Sticky Rice. Zertifikat inklusive. Halbtages-Format.'),

  (gen_random_uuid(),NULL,'Cape Nature Safari Guide',
   'guide@capenature.za','aktiv',true,NULL,
   'Outdoor & Wandern','Kapstadt','Südafrika',ARRAY['Englisch','Afrikaans','Deutsch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=CapeNatureSafariGuide&backgroundColor=16a34a','en',
   '@capenature_guide','+27 21 3456789',
   'Halbtagessafaris ab Kapstadt! Pinguine, Cape Point, Chapman''s Peak. FGASA-Guide, max. 4 Personen, kleiner Jeep. Whale Watching September–November.')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. WERBEPLATZ-BUCHUNGEN
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'info@suntours.de' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'region','antalya',6,149,894,'aktiv','Klaus Mayer','SunTours GmbH','info@suntours.de','✈️ Türkei All-Inclusive ab 599€! Bestpreisgarantie & kostenlose Umbuchung.',now()-interval '60 days',now()+interval '120 days',now()-interval '59 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'info@islanddreams.de' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'kategorie','kreta',3,99,297,'aktiv','Sandra Müller','IslandDreams','info@islanddreams.de','🇬🇷 Kreta Traumurlaub! Top-Hotels, Deutsche Reiseleitung, Beste Strände.',now()-interval '30 days',now()+interval '60 days',now()-interval '29 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'info@exotik-reisen.de' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'rundum','bali',12,299,3588,'aktiv','Thomas Berg','Exotik Reisen GmbH','info@exotik-reisen.de','🌴 Bali & Asien Traumreisen! Individuelle Fernreisen ab 1299€. 20 Jahre Expertise.',now()-interval '90 days',now()+interval '275 days',now()-interval '89 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'info@maldiveslux.com' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'region','malediven',6,149,894,'aktiv','Julia Weber','MaldivesLux','info@maldiveslux.com','🏝️ Malediven Exklusiv! Overwater-Bungalows, Privatstrand, All-Inclusive Luxury.',now()-interval '20 days',now()+interval '160 days',now()-interval '19 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'info@reise-meer.de' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'kategorie','mallorca',3,99,297,'aktiv','Peter Schmidt','Reise & Meer','info@reise-meer.de','🚢 Kreuzfahrten ab 499€! MSC, AIDA, Costa. Beste Kabinen, Bestpreisgarantie.',now()-interval '45 days',now()+interval '45 days',now()-interval '44 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'tours@antalya-expert.tr' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'stadt_unten','antalya',3,49,147,'aktiv','Mehmet Demir','Antalya Expert Tours','tours@antalya-expert.tr','🏛️ Ausflüge ab Antalya! Pamukkale, Kappadokien, Ephesus. Deutsche Reiseleitung.',now()-interval '15 days',now()+interval '75 days',now()-interval '14 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'safari@safariafrica.ke' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'kategorie','kapstadt',6,99,594,'aktiv','David Okonkwo','SafariAfrica Tours','safari@safariafrica.ke','🦁 Safari Kenia & Tansania! Masai Mara, kleine Gruppen, ethischer Tourismus.',now()-interval '10 days',now()+interval '170 days',now()-interval '9 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'dive@divepro-hurghada.eg' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'stadt_unten','hurghada',3,49,147,'aktiv','Ahmed Hassan','DivePro Hurghada','dive@divepro-hurghada.eg','🤿 PADI Tauchkurse ab 89€! Bestes Riff Hurghadas, moderne Ausrüstung, sichere Guides.',now()-interval '5 days',now()+interval '85 days',now()-interval '4 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'relax@volcano-spa.es' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'stadt_unten','teneriffa',3,49,147,'aktiv','Carmen López','Volcano Spa Teneriffa','relax@volcano-spa.es','🧖 Vulkan-Wellness auf Teneriffa! Tagestickets ab 59€. Lava-Massagen & Thalasso-Pool.',now()-interval '8 days',now()+interval '82 days',now()-interval '7 days') ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_id FROM anbieter_profile WHERE email = 'hola@lapasionflamenca.es' LIMIT 1;
  IF v_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id,paket,zielseite,laufzeit_monate,preis_monatlich,preis_gesamt,status,kontakt_name,kontakt_firma,kontakt_email,werbeinhalt_text,starts_at,ends_at,bezahlt_at)
    VALUES (v_id,'stadt_unten','barcelona',3,49,147,'aktiv','Rosa García','La Pasión Flamenca','hola@lapasionflamenca.es','💃 Echter Flamenco in Barcelona! Abendliche Shows & Tanzworkshops im El Born.',now()-interval '25 days',now()+interval '65 days',now()-interval '24 days') ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- ERFOLGSMELDUNG
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM auth.users WHERE email LIKE '%demo.urlaubfinder365.de%') AS demo_user_gesamt,
  (SELECT COUNT(*) FROM public.users WHERE id::text LIKE 'a1%') AS reisende_profile,
  (SELECT COUNT(*) FROM travel_groups) AS gruppen,
  (SELECT COUNT(*) FROM group_posts) AS gruppen_beitraege,
  (SELECT COUNT(*) FROM travel_reports WHERE is_published = true) AS reiseberichte,
  (SELECT COUNT(*) FROM travel_tips WHERE status = 'approved') AS karten_tipps,
  (SELECT COUNT(*) FROM anbieter_profile WHERE status = 'aktiv') AS anbieter_und_partner,
  (SELECT COUNT(*) FROM werbeplaetze_buchungen WHERE status = 'aktiv') AS aktive_werbebuchungen;
