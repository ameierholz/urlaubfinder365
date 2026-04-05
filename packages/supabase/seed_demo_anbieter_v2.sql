-- ══════════════════════════════════════════════════════════════════════════════
-- DEMO ANBIETER & LOKALE PARTNER v2
-- 30 Reiseanbieter + 30 Lokale Partner
-- Logos: DiceBear Shapes – algorithmisch generiert, kein Echtes Logo
-- ══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. AUTH USERS für Anbieter (die eine Plattform-Präsenz haben)
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
-- Avatar: DiceBear Shapes für Business-Logos
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO anbieter_profile (
  id, user_id, name, email, status, verifiziert,
  webseite, beschreibung, kategorie, stadt, land_name,
  sprachen, erfahrung_jahre, avatar_url, sprache,
  instagram, telefon, bio
) VALUES
  -- 1. SunTours GmbH
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000001','SunTours GmbH',
   'info@suntours.de','aktiv',true,
   'https://suntours.de','Ihr Spezialist für Pauschalreisen in die Türkei! Seit 15 Jahren bringen wir deutsche Urlauber an die schönsten Strände der Türkischen Riviera. Antalya, Side, Belek – wir kennen jedes Resort!',
   'Tagesausflüge','München','Deutschland',ARRAY['Deutsch','Englisch','Türkisch'],15,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SunToursGmbH&backgroundColor=1db682','de',
   '@suntours_de','+49 89 123456','Ihr Türkei-Experte seit 2009'),

  -- 2. IslandDreams Griechenland
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000002','IslandDreams Griechenland',
   'info@islanddreams.de','aktiv',true,
   'https://islanddreams.de','Griechenland-Spezialisten mit Leidenschaft! Von Kreta über Santorini bis zu unbekannten Inseln – wir kennen jede Bucht und jede Taverne. Familien und Paare in besten Händen.',
   'Stadtführungen','Frankfurt','Deutschland',ARRAY['Deutsch','Griechisch','Englisch'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=IslandDreamsGR&backgroundColor=6991d8','de',
   '@islanddreams','‭+49 69 234567','Griechische Inseln hautnah'),

  -- 3. Exotik Reisen GmbH
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000003','Exotik Reisen GmbH',
   'info@exotik-reisen.de','aktiv',true,
   'https://exotik-reisen.de','Für Weltenbummler und Abenteurer: Bali, Thailand, Malediven, Marokko, Kenia. Wir organisieren individuelle Fernreisen und geführte Gruppentouren auf allen Kontinenten.',
   'Kultur & Kunst','Hamburg','Deutschland',ARRAY['Deutsch','Englisch','Spanisch','Französisch'],20,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ExotikReisenGmbH&backgroundColor=f59e0b','de',
   '@exotik_reisen','+49 40 345678','Fernreise-Experten seit 2003'),

  -- 4. AquaSports Mallorca
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000004','AquaSports Mallorca',
   'info@aquasports-mallorca.es','aktiv',true,
   'https://aquasports-mallorca.es','Wassersport pur auf Mallorca! Jetski, Parasailing, Schnorcheln, Tauchen, SUP – wir bieten alles für Wassersport-Fans. Sicher, professionell und mit viel Spaß!',
   'Wassersport','Alcúdia, Mallorca','Spanien',ARRAY['Deutsch','Englisch','Spanisch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AquaSportsMallorca&backgroundColor=06b6d4','de',
   '@aquasports_mallorca','+34 971 123456','Mallorca''s Wassersport-Profi'),

  -- 5. Reise & Meer Kreuzfahrten
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000005','Reise & Meer Kreuzfahrten',
   'info@reise-meer.de','aktiv',true,
   'https://reise-meer.de','Kreuzfahrt-Spezialisten mit 18 Jahren Erfahrung. MSC, AIDA, Costa, Royal Caribbean – wir finden für Sie die perfekte Reise. Gruppenrabatte und Bestkabinen-Garantie.',
   'Sonstiges','Bremen','Deutschland',ARRAY['Deutsch','Englisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ReiseMeerKreuzfahrten&backgroundColor=8b5cf6','de',
   '@reisemeer_kreuzfahrten','+49 421 456789','Kreuzfahrt-Spezialisten seit 2005'),

  -- 6. Alpine Escape Skiurlaub
  (gen_random_uuid(), NULL,'Alpine Escape Skiurlaub',
   'ski@alpine-escape.at','aktiv',true,
   'https://alpine-escape.at','Skiurlaub-Spezialist für Österreich, Schweiz und Frankreich. Chalets, Ferienwohnungen und Hotels direkt an der Piste. Ski-Verleih und Skischule-Vermittlung inklusive.',
   'Outdoor & Wandern','Innsbruck','Österreich',ARRAY['Deutsch','Englisch','Französisch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlpineEscapeSki&backgroundColor=3b82f6','de',
   '@alpine_escape','+43 512 789012','Ihr Skiurlaub-Experte'),

  -- 7. CityBreaks24
  (gen_random_uuid(), NULL,'CityBreaks24',
   'hello@citybreaks24.de','aktiv',true,
   'https://citybreaks24.de','Städtereisen neu gedacht! Wir kuratieren unvergessliche Wochenend-Trips nach Barcelona, Paris, Amsterdam, Wien und 50 weiteren Metropolen. Inkl. Stadtführung und Restaurantempfehlungen.',
   'Stadtführungen','Berlin','Deutschland',ARRAY['Deutsch','Englisch'],6,
   'https://api.dicebear.com/9.x/shapes/svg?seed=CityBreaks24&backgroundColor=ec4899','de',
   '@citybreaks24','+49 30 567890','Städtereise-Experten'),

  -- 8. DiveWorld Hurghada
  (gen_random_uuid(), NULL,'DiveWorld Hurghada',
   'dive@diveworld-hurghada.com','aktiv',true,
   'https://diveworld-hurghada.com','Die beste Tauchbasis am Roten Meer! PADI-Zertifizierungen, Tauchsafaris, Schnorchel-Touren. Erfahrene Divemaster, modernes Equipment, maximale Sicherheit.',
   'Wassersport','Hurghada','Ägypten',ARRAY['Deutsch','Englisch','Arabisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=DiveWorldHurghada&backgroundColor=0891b2','de',
   '@diveworld_hurghada','+20 65 3456789','Rotes Meer Tauchen Experten'),

  -- 9. SandDune Tours Ägypten
  (gen_random_uuid(), NULL,'SandDune Tours Ägypten',
   'info@sanddune-tours.eg','aktiv',true,
   'https://sanddune-tours.eg','Ägypten komplett erleben! Pyramiden, Luxor, Tempeltouren, Nilkreuzfahrten, Wüstensafaris. Deutsche Reiseleitung und private Transporte im ganzen Land.',
   'Tagesausflüge','Kairo','Ägypten',ARRAY['Deutsch','Arabisch','Englisch'],17,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SandDuneTours&backgroundColor=d97706','de',
   '@sanddune_tours','+20 2 12345678','Ägypten-Spezialisten'),

  -- 10. Antalya Expert
  (gen_random_uuid(), NULL,'Antalya Expert Tours',
   'tours@antalya-expert.tr','aktiv',true,
   'https://antalya-expert.tr','Ausflüge aus Antalya: Pamukkale, Kappadokien, Ephesus, Side, Aspendos. Wir holen Sie direkt vom Hotel ab. Professionelle deutsche Reiseleitung!',
   'Tagesausflüge','Antalya','Türkei',ARRAY['Deutsch','Türkisch','Englisch','Russisch'],13,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AntalyaExpert&backgroundColor=1db682','de',
   '@antalya_expert','+90 242 3456789','Ausflüge ab Antalya'),

  -- 11. BarcelonaGuide Experience
  (gen_random_uuid(), NULL,'BarcelonaGuide Experience',
   'hola@barcelonaguide.es','aktiv',true,
   'https://barcelonaguide.es','Barcelona wie ein Einheimischer! Alternative Führungen abseits der Touristenpfade: El Born, Gràcia, Poblenou. Architektur, Food-Touren, Tapas & Gin-Tonic Abende.',
   'Stadtführungen','Barcelona','Spanien',ARRAY['Deutsch','Spanisch','Englisch','Katalanisch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BarcelonaGuide&backgroundColor=ef4444','de',
   '@barcelona_guide','+34 93 7890123','Barcelona Insider Tours'),

  -- 12. MaldivesLux
  (gen_random_uuid(), NULL,'MaldivesLux Premium Travel',
   'info@maldiveslux.com','aktiv',true,
   'https://maldiveslux.com','Malediven-Experten für Luxusreisende. Private Atolls, Overwater-Bungalows, Tauchen, Wasserflugzeuge, Hochzeitsreisen. Nur die besten Resorts in unserer Auswahl.',
   'Sonstiges','Frankfurt','Deutschland',ARRAY['Deutsch','Englisch'],16,
   'https://api.dicebear.com/9.x/shapes/svg?seed=MaldivesLux&backgroundColor=0ea5e9','de',
   '@maldives_lux','+49 69 890123','Malediven-Luxus Spezialisten'),

  -- 13. DubaiStyle Travel
  (gen_random_uuid(), NULL,'DubaiStyle Travel',
   'luxury@dubaistyle.ae','aktiv',true,
   'https://dubaistyle.ae','Dubai und Abu Dhabi exklusiv! Wüstensafaris per Helikopter, Desert-Camps, Dhow-Cruises, Burj Khalifa At The Top. VIP-Erlebnisse für anspruchsvolle Reisende.',
   'Sonstiges','Dubai','VAE',ARRAY['Deutsch','Arabisch','Englisch','Russisch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=DubaiStyle&backgroundColor=f59e0b','de',
   '@dubaistyle_travel','+971 4 1234567','Dubai VIP Erlebnisse'),

  -- 14. BaliSoul
  (gen_random_uuid(), NULL,'BaliSoul Retreats',
   'namaste@balisoul.id','aktiv',true,
   'https://balisoul.id','Bali tiefer erleben! Yoga-Retreats, Tempel-Touren, Reisterrassen-Wanderungen, Kochkurse, Spirituelle Erlebnisse. Authentisch, nachhaltig und unvergesslich.',
   'Kultur & Kunst','Ubud, Bali','Indonesien',ARRAY['Deutsch','Englisch','Indonesisch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BaliSoul&backgroundColor=84cc16','de',
   '@balisoul_retreats','+62 361 234567','Bali authentisch erleben'),

  -- 15. KaribikDream
  (gen_random_uuid(), NULL,'KaribikDream Reisen',
   'info@karibikdream.de','aktiv',true,
   'https://karibikdream.de','Traumurlaub in der Karibik! Cancún, Punta Cana, Kuba, Jamaica, Barbados. All-Inclusive-Experten und individuelle Karibik-Reisen für jeden Geschmack.',
   'Sonstiges','Köln','Deutschland',ARRAY['Deutsch','Englisch','Spanisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=KaribikDream&backgroundColor=06b6d4','de',
   '@karibikdream','+49 221 1234567','Karibik für jeden'),

  -- 16. SafariAfrica
  (gen_random_uuid(), NULL,'SafariAfrica Tours',
   'safari@safariafrica.ke','aktiv',true,
   'https://safariafrica.ke','Unvergessliche Safari-Erlebnisse in Kenia und Tansania! Masai Mara, Serengeti, Amboseli, Ngorongoro. Kleine Gruppen, ethischer Tourismus, exzellente Guides.',
   'Outdoor & Wandern','Nairobi','Kenia',ARRAY['Deutsch','Englisch','Suaheli'],19,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SafariAfrica&backgroundColor=78350f','de',
   '@safari_africa_ke','+254 20 3456789','Afrikas beste Safari-Experten'),

  -- 17. OceanClub Wassersport
  (gen_random_uuid(), NULL,'OceanClub Wassersport',
   'info@oceanclub.es','aktiv',true,
   'https://oceanclub.es','Wassersport von A bis Z! Teneriffa, Gran Canaria, Fuerteventura – Windsurfen, Kiten, Surfen, Jetski, Paragliding über dem Meer. Kurse für alle Niveaus.',
   'Wassersport','Corralejo, Fuerteventura','Spanien',ARRAY['Deutsch','Englisch','Spanisch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=OceanClubWassersport&backgroundColor=0284c7','de',
   '@oceanclub_es','+34 928 345678','Kanarischer Wassersport'),

  -- 18. TravelPremium
  (gen_random_uuid(), NULL,'TravelPremium Luxusreisen',
   'luxury@travelpremium.de','aktiv',true,
   'https://travelpremium.de','First-Class Reisen für höchste Ansprüche. Business Class und First Class Flüge, 5-Sterne-Resorts, private Transfers, Concierge-Service 24/7. Maßgeschneidert und exklusiv.',
   'Sonstiges','München','Deutschland',ARRAY['Deutsch','Englisch','Französisch','Arabisch'],22,
   'https://api.dicebear.com/9.x/shapes/svg?seed=TravelPremium&backgroundColor=7c3aed','de',
   '@travelpremium_de','+49 89 567890','Luxusreisen First Class'),

  -- 19. BackpackerHub
  (gen_random_uuid(), NULL,'BackpackerHub Community Travel',
   'go@backpackerhub.de','aktiv',true,
   'https://backpackerhub.de','Reisen für Entdecker mit kleinem Budget! Gruppenreisen unter 100€/Tag, Hostel-Buchungen, Rucksack-Touren in Asien, Südamerika und Europa. Community first!',
   'Tagesausflüge','Berlin','Deutschland',ARRAY['Deutsch','Englisch'],5,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BackpackerHub&backgroundColor=10b981','de',
   '@backpackerhub_de','+49 30 678901','Budget-Reisen für Abenteurer'),

  -- 20. FamilyVacations Deutschland
  (gen_random_uuid(), NULL,'FamilyVacations Deutschland',
   'familien@familyvacations.de','aktiv',true,
   'https://familyvacations.de','Familienurlaub ohne Stress! Wir planen alles für Familien mit Kindern. Kinderfreundliche Hotels, Aktivitätsprogramme, Babysitting, Transfers. Entspannt reisen als Familie!',
   'Sonstiges','Köln','Deutschland',ARRAY['Deutsch','Englisch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=FamilyVacations&backgroundColor=f97316','de',
   '@familyvacations_de','+49 221 456789','Familienurlaub-Profis'),

  -- 21. WellnessResort Collection
  (gen_random_uuid(), NULL,'WellnessResort Collection',
   'spa@wellnessresort.de','aktiv',true,
   'https://wellnessresort.de','Wellness-Urlaub der Extraklasse! Von österreichischen Thermen über türkische Hammams bis zu Ayurveda in Kerala. Wir kuratieren die besten Wellness-Resorts weltweit.',
   'Sonstiges','Wien','Österreich',ARRAY['Deutsch','Englisch'],13,
   'https://api.dicebear.com/9.x/shapes/svg?seed=WellnessResortCollection&backgroundColor=ec4899','de',
   '@wellnessresort_collection','+43 1 234567','Wellness-Reise Experten'),

  -- 22. AlpenClub Bergwandern
  (gen_random_uuid(), NULL,'AlpenClub Bergwandern',
   'info@alpenclub-wandern.at','aktiv',true,
   'https://alpenclub-wandern.at','Geführte Wandertouren in den Alpen! Von einfachen Familienwanderungen bis zu anspruchsvollen Bergtouren. Certified Mountain Guides, kleine Gruppen, authentische Hüttenerlebnisse.',
   'Outdoor & Wandern','Salzburg','Österreich',ARRAY['Deutsch','Englisch'],16,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlpenClubBergwandern&backgroundColor=16a34a','de',
   '@alpenclub_wandern','+43 662 345678','Alpen-Wanderführer'),

  -- 23. KulturReisen Akademie
  (gen_random_uuid(), NULL,'KulturReisen Akademie',
   'bildung@kulturreisen.de','aktiv',true,
   'https://kulturreisen.de','Bildungsreisen für Kulturinteressierte! Mit Kunsthistorikern, Archäologen und Kulturexperten zu Ausgrabungsstätten, Museen und UNESCO-Stätten. Lernen und Staunen!',
   'Kultur & Kunst','Leipzig','Deutschland',ARRAY['Deutsch','Englisch','Italienisch','Griechisch'],21,
   'https://api.dicebear.com/9.x/shapes/svg?seed=KulturReisenAkademie&backgroundColor=92400e','de',
   '@kulturreisen_akademie','+49 341 234567','Bildungsreisen Kulturexperten'),

  -- 24. SpeedTours Last Minute
  (gen_random_uuid(), NULL,'SpeedTours Last Minute',
   'jetzt@speedtours.de','aktiv',true,
   'https://speedtours.de','Last-Minute-Spezialist für spontane Urlauber! Wir finden täglich die besten Deals für die nächsten 21 Tage. Preisalarm-Service und 24h-Buchungshotline!',
   'Sonstiges','Düsseldorf','Deutschland',ARRAY['Deutsch','Englisch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SpeedToursLastMinute&backgroundColor=dc2626','de',
   '@speedtours_de','+49 211 345678','Last-Minute Deals täglich'),

  -- 25. IsleHopper Inseln
  (gen_random_uuid(), NULL,'IsleHopper Inselreisen',
   'island@islehopper.eu','aktiv',true,
   'https://islehopper.eu','Inselhüpfen-Spezialisten! Griechenland, Kroatien, Malediven, Kanaren – Fähren, Flüge, Unterkünfte für individuelle Inseltouren. DIY und geführt möglich.',
   'Tagesausflüge','Hamburg','Deutschland',ARRAY['Deutsch','Englisch','Griechisch','Kroatisch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=IsleHopperInseln&backgroundColor=0ea5e9','de',
   '@islehopper','+49 40 456789','Insel-Hopping Experten'),

  -- 26. AsienSpecials
  (gen_random_uuid(), NULL,'AsienSpecials Fernreisen',
   'asia@asienspecials.de','aktiv',true,
   'https://asienspecials.de','Asien individuell erleben! Thailand, Vietnam, Japan, Bali, Singapur, Korea. Maßgeschneiderte Routen, professionelle Betreuung, Best-Price-Garantie.',
   'Tagesausflüge','Stuttgart','Deutschland',ARRAY['Deutsch','Englisch','Japanisch','Thailändisch'],15,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AsienSpecials&backgroundColor=84cc16','de',
   '@asienspecials','+49 711 567890','Asien-Reisen Profis'),

  -- 27. AfrikaAdventure
  (gen_random_uuid(), NULL,'AfrikaAdventure Expeditions',
   'adventure@afrikaadventure.de','aktiv',true,
   'https://afrikaadventure.de','Abenteuerreisen in Afrika! Kilimanjaro-Besteigung, Okavango-Kanu-Safari, Madagaskar-Expedition, Äthiopien-Trekking. Für mutige Entdecker und Naturfreunde.',
   'Outdoor & Wandern','Freiburg','Deutschland',ARRAY['Deutsch','Englisch','Suaheli','Französisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AfrikaAdventure&backgroundColor=b45309','de',
   '@afrikaadventure','+49 761 678901','Afrika Abenteuer-Reisen'),

  -- 28. EuroTravel
  (gen_random_uuid(), NULL,'EuroTravel Komfort-Reisen',
   'europa@eurotravel.de','aktiv',true,
   'https://eurotravel.de','Komfortables Europa entdecken! Zugreisen, Busreisen und Flugpakete durch die schönsten Ecken Europas. Österreich, Schweiz, Nordeuropa, Osteuropa – entspannt reisen!',
   'Sonstiges','Nürnberg','Deutschland',ARRAY['Deutsch','Englisch','Französisch','Polnisch'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=EuroTravel&backgroundColor=3b82f6','de',
   '@eurotravel_de','+49 911 789012','Europa Komfort-Reisen'),

  -- 29. GolfResort Collection
  (gen_random_uuid(), NULL,'GolfResort Collection',
   'golf@golfresort.eu','aktiv',true,
   'https://golfresort.eu','Golfreisen für Handicap-Träger und Einsteiger! Algarve, Costa del Sol, Mallorca, Dubai. Best Golf Courses, Hotel-Kombi, Turniere und Coaching.',
   'Outdoor & Wandern','Frankfurt','Deutschland',ARRAY['Deutsch','Englisch','Portugiesisch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=GolfResortCollection&backgroundColor=16a34a','de',
   '@golfresort_eu','+49 69 890123','Golfreisen Experten'),

  -- 30. HoneymoonTravel
  (gen_random_uuid(), NULL,'HoneymoonTravel Flitterwochenreisen',
   'love@honeymoontravel.de','aktiv',true,
   'https://honeymoontravel.de','Die schönste Reise Ihres Lebens! Wir planen unvergessliche Flitterwochen: Malediven, Seychellen, Bali, Toskana, Santorini. Romantische Details bis ins Kleinste.',
   'Sonstiges','München','Deutschland',ARRAY['Deutsch','Englisch','Italienisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=HoneymoonTravel&backgroundColor=ec4899','de',
   '@honeymoon_travel','+49 89 012345','Flitterwochen-Traumreisen')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. LOKALE PARTNER (30 lokale Betriebe – direkt in anbieter_profile ohne User)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO anbieter_profile (
  id, user_id, name, email, status, verifiziert,
  webseite, beschreibung, kategorie, stadt, land_name,
  sprachen, erfahrung_jahre, avatar_url, sprache,
  instagram, telefon, bio
) VALUES
  -- 1. Strand Café Antalya
  (gen_random_uuid(), NULL,'Strand-Café Sunset Antalya',
   'cafe@sunset-antalya.tr','aktiv',true,
   NULL,'Direkt am Kleopatra-Strand! Frische Cocktails, türkischer Tee und hausgemachte Baklava mit Meerblick. Der perfekte Ort für den Sundowner nach einem langen Strandtag.',
   'Gastronomie','Alanya, Antalya','Türkei',ARRAY['Türkisch','Deutsch','Englisch'],5,
   'https://api.dicebear.com/9.x/shapes/svg?seed=StrandCafeAntalya&backgroundColor=f59e0b','tr',
   '@sunset_cafe_alanya','+90 242 5123456','Ihr Café direkt am Kleopatra-Strand'),

  -- 2. Tauchbasis DivePro Hurghada
  (gen_random_uuid(), NULL,'DivePro Tauchbasis Hurghada',
   'dive@divepro-hurghada.eg','aktiv',true,
   NULL,'PADI 5-Sterne Dive Center am Roten Meer. Kurse für Anfänger bis Profi, tägliche Bootsausflüge zu den Besten Riffen Hurghadas, Nacht-Tauchen, Freediving. Moderne Ausrüstung!',
   'Wassersport','Hurghada','Ägypten',ARRAY['Deutsch','Englisch','Arabisch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=DiveProHurghada&backgroundColor=0891b2','de',
   '@divepro_hurghada','+20 65 4567890','Hurghada Tauchen Profi'),

  -- 3. Flamenco Bar Barcelona
  (gen_random_uuid(), NULL,'La Pasión Flamenca Barcelona',
   'hola@lapasionflamenca.es','aktiv',true,
   NULL,'Authentisches Flamenco-Erlebnis im Herzen von Barcelona! Abendliche Shows, Tanzworkshops, Tapas und spanische Weine. Kein Touristentheater – echte Flamenco-Leidenschaft.',
   'Kultur & Kunst','El Born, Barcelona','Spanien',ARRAY['Spanisch','Katalanisch','Englisch','Deutsch'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=LaPassionFlamenca&backgroundColor=dc2626','es',
   '@lapasionflamenca','+34 93 8901234','Echter Flamenco in Barcelona'),

  -- 4. Sunset Restaurant Mallorca
  (gen_random_uuid(), NULL,'Es Mirador Restaurant Mallorca',
   'reserva@esmirador.es','aktiv',true,
   NULL,'Das romantischste Restaurant Mallorcas! Auf einem Felsen über dem Mittelmeer gebaut, mit 180°-Panoramablick. Mallorquinische Küche mit modernem Touch. Reservierung empfohlen!',
   'Gastronomie','Alcúdia, Mallorca','Spanien',ARRAY['Spanisch','Deutsch','Englisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=EsMiradorMallorca&backgroundColor=f97316','es',
   '@esmirador_mallorca','+34 971 234567','Mallorquinische Küche mit Meerblick'),

  -- 5. Yoga Retreat Bali
  (gen_random_uuid(), NULL,'Sacred River Yoga Ubud Bali',
   'info@sacredriver.id','aktiv',true,
   NULL,'Yoga-Retreat am Ayung River in Ubud. Tägliche Hatha- und Vinyasa-Klassen, Meditation, Ayurveda-Treatments. Bio-veganes Restaurant, Dschungel-Bungalows. Vollständige Abgeschiedenheit.',
   'Kultur & Kunst','Ubud, Bali','Indonesien',ARRAY['Englisch','Indonesisch','Deutsch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SacredRiverYoga&backgroundColor=84cc16','en',
   '@sacred_river_yoga','+62 361 345678','Yoga & Wellness in Ubud'),

  -- 6. Surf School Fuerteventura
  (gen_random_uuid(), NULL,'Atlantic Surf School Fuerteventura',
   'surf@atlantic-surf.es','aktiv',true,
   NULL,'Surfen lernen an der besten Welle Europas! Corralejo, Fuerteventura. Anfänger bis Fortgeschrittene. ISA-zertifizierte Lehrer, Boards und Neopren inklusive. Wochenkurse buchbar!',
   'Wassersport','Corralejo, Fuerteventura','Spanien',ARRAY['Englisch','Spanisch','Deutsch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AtlanticSurfSchool&backgroundColor=0ea5e9','es',
   '@atlantic_surf_fuerteventura','+34 928 456789','Surfen lernen in Fuerteventura'),

  -- 7. Guide Service Rhodos
  (gen_random_uuid(), NULL,'Rhodos Explorer Guide Service',
   'guide@rhodos-explorer.gr','aktiv',true,
   NULL,'Lizenzierter Reiseführer auf Rhodos mit 15 Jahren Erfahrung! Individuelle Touren: Altstadt UNESCO, Lindos, Prasonisi. Auf Deutsch, mit eigenem Fahrzeug, flexible Zeiten.',
   'Stadtführungen','Rhodos-Stadt','Griechenland',ARRAY['Griechisch','Deutsch','Englisch'],15,
   'https://api.dicebear.com/9.x/shapes/svg?seed=RhodoExplorer&backgroundColor=3b82f6','de',
   '@rhodos_explorer','+30 2241 234567','Rhodos persönlich entdecken'),

  -- 8. Fish Taverna Kreta
  (gen_random_uuid(), NULL,'To Limani Fish Taverna Kreta',
   'opa@tolimani.gr','aktiv',true,
   NULL,'Familiengeführte Fischtaverne am Hafen von Chania seit 1978! Frischer Fang täglich, traditionelle kretische Rezepte, hausgemachter Raki. Keine Touristenfalle – nur ehrliches Essen!',
   'Gastronomie','Chania, Kreta','Griechenland',ARRAY['Griechisch','Deutsch','Englisch'],46,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ToLimaniFishTaverna&backgroundColor=1d4ed8','el',
   '@tolimani_chania','+30 28210 23456','Authentisch griechisch seit 1978'),

  -- 9. Desert Safari Dubai
  (gen_random_uuid(), NULL,'Arabian Nights Desert Safari',
   'desert@arabian-nights.ae','aktiv',true,
   NULL,'Das ultimative Dubai-Erlebnis! Dünensafari im Land Rover, Kamelreiten bei Sonnenuntergang, BBQ unter dem Sternenhimmel, Bauchtanz und Henna. Täglich ab Hotels abholung.',
   'Tagesausflüge','Dubai','VAE',ARRAY['Arabisch','Englisch','Deutsch','Russisch','Hindi'],12,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ArabianNightsDesert&backgroundColor=d97706','ar',
   '@arabian_nights_dubai','+971 4 2345678','Dubai Wüstenabenteuer'),

  -- 10. Cooking Class Roma
  (gen_random_uuid(), NULL,'La Nonna Cucina Romana',
   'ciao@nonnacucina.it','aktiv',true,
   NULL,'Kochen wie eine römische Nonna! 3-stündige Kochkurse in unserer traditionellen römischen Küche. Pasta frisch, Tiramisu, Cacio e Pepe. Einkauf auf dem Campo de Fiori mit eingeschlossen.',
   'Gastronomie','Trastevere, Rom','Italien',ARRAY['Italienisch','Englisch','Deutsch'],20,
   'https://api.dicebear.com/9.x/shapes/svg?seed=LaNonnaCucinaRomana&backgroundColor=dc2626','it',
   '@nonna_cucina_roma','+39 06 12345678','Römisches Kochen lernen'),

  -- 11. Boat Tours Dubrovnik
  (gen_random_uuid(), NULL,'Blue Cave Boat Tours Dubrovnik',
   'ahoy@bluecave-dubrovnik.hr','aktiv',true,
   NULL,'Schnellboote durch die Inselwelt! Elaphiten-Inseln, Blaue Höhle, Lokrum, Game-of-Thrones-Drehorte. Täglich 9 Uhr Abfahrt, max. 12 Personen pro Tour. Sekt und Snacks inklusive!',
   'Wassersport','Dubrovnik','Kroatien',ARRAY['Kroatisch','Englisch','Deutsch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BlueCaveBoatDubrovnik&backgroundColor=0284c7','de',
   '@bluecave_dubrovnik','+385 20 345678','Dubrovnik Boots-Touren'),

  -- 12. Spa & Wellness Teneriffa
  (gen_random_uuid(), NULL,'Volcano Spa & Wellness Teneriffa',
   'relax@volcano-spa.es','aktiv',true,
   NULL,'Exklusives Spa in Puerto de la Cruz mit Blick auf den Teide! Vulkanstein-Massagen, Lava-Shell-Behandlungen, Thalasso-Pool. Tagestickets und Packages für Nicht-Hotelgäste.',
   'Sonstiges','Puerto de la Cruz, Teneriffa','Spanien',ARRAY['Spanisch','Deutsch','Englisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=VolcanoSpaTenerife&backgroundColor=ec4899','de',
   '@volcano_spa_tenerife','+34 922 456789','Vulkan-Wellness auf Teneriffa'),

  -- 13. Night Market Bangkok
  (gen_random_uuid(), NULL,'Bangkok Night Market Food Tour',
   'eat@bangkoknight.th','aktiv',true,
   NULL,'Authentische Bangkok-Streetfood-Tour durch Chinatown und Yaowarat! Mit lokalem Guide, 8-10 verschiedene Gerichte, inkl. Tuk-Tuk-Transfer. Jeden Abend 18 Uhr.',
   'Gastronomie','Chinatown, Bangkok','Thailand',ARRAY['Englisch','Deutsch','Thaiisch'],6,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BangkokNightMarket&backgroundColor=f59e0b','en',
   '@bkk_night_food','+66 2 3456789','Bangkok Streetfood Erlebnisse'),

  -- 14. Wine Tour Santorini
  (gen_random_uuid(), NULL,'Assyrtiko Wine Tours Santorini',
   'wine@assyrtiko.gr','aktiv',true,
   NULL,'Weintour durch Santorinis legendäre Vulkan-Weinberge! Verkostung von Assyrtiko, Vinsanto und Nykteri in 3 Weingütern. Sonnenuntergang in Oia inklusive. Transport ab Hotel.',
   'Gastronomie','Oia, Santorini','Griechenland',ARRAY['Griechisch','Englisch','Deutsch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AssyrtikoWineTours&backgroundColor=7c3aed','el',
   '@assyrtiko_santorini','+30 22860 12345','Santorini Wein-Entdeckungstouren'),

  -- 15. Camel Safari Marrakech
  (gen_random_uuid(), NULL,'Sahara Spirit Kamel-Safari Marrakesch',
   'trek@sahara-spirit.ma','aktiv',true,
   NULL,'Sahara-Erlebnis von Marrakesch aus! Kamel-Trek bei Sonnenuntergang in der Agafay-Wüste, Berberzelt-Dinner, Sternenhimmel-Beobachtung. Transfer im Geländewagen inklusive.',
   'Outdoor & Wandern','Marrakesch','Marokko',ARRAY['Arabisch','Französisch','Deutsch','Englisch'],10,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SaharaSpiritCamel&backgroundColor=d97706','fr',
   '@sahara_spirit_ma','+212 524 234567','Sahara-Erlebnisse Marokko'),

  -- 16. Ski School Innsbruck
  (gen_random_uuid(), NULL,'Alpin Pro Skischule Innsbruck',
   'ski@alpinpro.at','aktiv',true,
   NULL,'Lizenzierte Skischule mit Österreichischem Staatsdiplom! Privatstunden, Gruppenkurse, Kinder-Skischule. Stubaier Gletscher, Nordkette, Axamer Lizum. Ski-Verleih-Partner.',
   'Outdoor & Wandern','Innsbruck','Österreich',ARRAY['Deutsch','Englisch','Italienisch'],18,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlpinProSkiInnsbruck&backgroundColor=3b82f6','de',
   '@alpinpro_innsbruck','+43 512 890123','Skischule Innsbruck'),

  -- 17. Fototouren Venedig
  (gen_random_uuid(), NULL,'Venezia Photo Walks',
   'click@veneziaphoto.it','aktiv',true,
   NULL,'Fotografie-Touren durch das echte Venedig! Frühmorgens durch verlassene Calli, versteckte Kanäle, Rialtomarkt bei Sonnenaufgang. Für Smartphone und Spiegelreflex-Nutzer. Max 6 Personen.',
   'Kultur & Kunst','Castello, Venedig','Italien',ARRAY['Italienisch','Englisch','Deutsch'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=VeneziaPhotoWalks&backgroundColor=f59e0b','it',
   '@venezia_photo','+39 041 2345678','Venedig fotografisch entdecken'),

  -- 18. Kayak Tours Montenegro
  (gen_random_uuid(), NULL,'Adriatic Kayak Tours Montenegro',
   'paddle@adriatic-kayak.me','aktiv',true,
   NULL,'Seekajak-Touren in der Bucht von Kotor! Halbtages- und Ganztagestouren, Höhlenerkundung per Kajak, Abend-Glühwürmchen-Tour. Ausrüstung und Guide inklusive. Alle Niveaus!',
   'Wassersport','Kotor, Montenegro','Montenegro',ARRAY['Englisch','Deutsch','Kroatisch','Montenegrinisch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AdriaticKayakMontenegro&backgroundColor=0ea5e9','de',
   '@adriatic_kayak','+382 32 123456','Kajak-Abenteuer in Montenegro'),

  -- 19. Streetfood Tour Istanbul
  (gen_random_uuid(), NULL,'Istanbul Sokak Food Tour',
   'yemek@istanbul-sokak.tr','aktiv',true,
   NULL,'Istanbuls Streetfood komplett! Gewürzbasar, Balık Ekmek, Simit frisch gebacken, Midye Dolma, Güveci im Hinterhof-Restaurant. 4-stündige Tour durch Beşiktaş und Karaköy.',
   'Gastronomie','Beşiktaş, Istanbul','Türkei',ARRAY['Türkisch','Englisch','Deutsch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=IstanbulSokakFood&backgroundColor=dc2626','tr',
   '@istanbul_sokak_food','+90 212 3456789','Istanbul Streetfood Erlebnis'),

  -- 20. Hammam Experience
  (gen_random_uuid(), NULL,'Tarihi Hamam Erfahrung Antalya',
   'hammam@tarihi-hamam.tr','aktiv',true,
   NULL,'Echtes türkisches Hamam-Erlebnis im 18. Jahrhundert Hamam in der Altstadt von Antalya! Traditionelle Körperpflege, Kese-Scrub, Seifenmassage. Keine Touristenfalle – authentisch!',
   'Sonstiges','Kaleiçi, Antalya','Türkei',ARRAY['Türkisch','Deutsch','Englisch','Russisch'],30,
   'https://api.dicebear.com/9.x/shapes/svg?seed=TarihiHamamAntalya&backgroundColor=92400e','tr',
   '@tarihi_hamam_antalya','+90 242 6789012','Echtes Türkisches Hamam'),

  -- 21. Schnorchel Tour Hurghada
  (gen_random_uuid(), NULL,'Coral Bay Schnorchel-Touren Hurghada',
   'snorkel@coralbay.eg','aktiv',true,
   NULL,'Täglich Schnorchel-Touren zu den schönsten Riffen Hurghadas! Paradise Island, Orange Bay, Mahmya. Glasbodenboot für Nicht-Schwimmer, Ausrüstung inklusive, Mittag an Bord.',
   'Wassersport','Hurghada','Ägypten',ARRAY['Arabisch','Deutsch','Englisch','Russisch'],11,
   'https://api.dicebear.com/9.x/shapes/svg?seed=CoralBaySnorkel&backgroundColor=0891b2','de',
   '@coralbay_hurghada','+20 65 5678901','Hurghada Schnorchel-Touren'),

  -- 22. Bike Tours Amsterdam
  (gen_random_uuid(), NULL,'Amsterdam Cycling Adventure',
   'bike@amsterdam-cycling.nl','aktiv',true,
   NULL,'Radtouren durch Amsterdam und Umland! Stadttouren, Windmühlen-Tour nach Zaanse Schans, Keukenhof-Blumentour. Bikes inklusive, kleine Gruppen, entspannte Atmosphäre!',
   'Outdoor & Wandern','Amsterdam','Niederlande',ARRAY['Niederländisch','Englisch','Deutsch'],6,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AmsterdamCycling&backgroundColor=f97316','de',
   '@amsterdam_cycling','+31 20 3456789','Amsterdam per Fahrrad'),

  -- 23. Museum Tour Athen
  (gen_random_uuid(), NULL,'Athen Acropolis Expert Guides',
   'logos@acropolis-expert.gr','aktiv',true,
   NULL,'Lizenzierte Archäologin führt durch die Akropolis! Kleine Gruppen (max 8), mit Kopfhörern, frühmorgens vor den Massen. Nationalmuseum, Agora, Kerameikos ebenfalls buchbar.',
   'Stadtführungen','Athen','Griechenland',ARRAY['Griechisch','Englisch','Deutsch','Französisch'],22,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AthensAcropolisExpert&backgroundColor=1d4ed8','de',
   '@acropolis_expert','+30 210 2345678','Akropolis mit Expertin'),

  -- 24. Bootsverleih Kroatien
  (gen_random_uuid(), NULL,'Adriatic Boat Rental Split',
   'sail@adriatic-rental.hr','aktiv',true,
   NULL,'Boote ohne Führerschein mieten! Kleine Motorboote und Schlauchboote für 4-8 Personen. Küste und Inseln Dalmatiens selbst erkunden. Ab Split, Trogir und Omiš. Tagesmiete!',
   'Wassersport','Split','Kroatien',ARRAY['Kroatisch','Englisch','Deutsch','Italiano'],9,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AdriaticBoatRentalSplit&backgroundColor=0284c7','de',
   '@adriatic_boat_split','+385 21 234567','Bootsverleih Split Kroatien'),

  -- 25. Tapas Tour Madrid
  (gen_random_uuid(), NULL,'Madrid de Tapas Food Tour',
   'hola@madrid-tapas.es','aktiv',true,
   NULL,'Die authentischste Tapas-Tour Madrids! Durch La Latina und Lavapiés – Geheimrestaurants der Einheimischen. Jamon Iberico, Patatas Bravas, Vermouth. 4h, 8-10 Stops, Guide auf Deutsch.',
   'Gastronomie','La Latina, Madrid','Spanien',ARRAY['Spanisch','Englisch','Deutsch'],7,
   'https://api.dicebear.com/9.x/shapes/svg?seed=MadridTapasTour&backgroundColor=dc2626','es',
   '@madrid_tapas_tour','+34 91 5678901','Tapas & Wein wie ein Madrileño'),

  -- 26. Wassersport Algarve
  (gen_random_uuid(), NULL,'Algarve Adventure Wassersport',
   'surf@algarve-adventure.pt','aktiv',true,
   NULL,'Surfen, Kajak, SUP, Coasteering an der Algarve! Tolle Felsen-Landschaften, Meereshöhlen per Kajak erkunden. Tages- und Halbtagstouren ab Lagos und Sagres.',
   'Wassersport','Lagos, Algarve','Portugal',ARRAY['Portugiesisch','Englisch','Deutsch'],8,
   'https://api.dicebear.com/9.x/shapes/svg?seed=AlgarveAdventure&backgroundColor=0ea5e9','de',
   '@algarve_adventure','+351 282 345678','Algarve Wasser-Abenteuer'),

  -- 27. Paragliding Malediven
  (gen_random_uuid(), NULL,'Sky High Parasailing Malediven',
   'fly@skyhigh-malediven.mv','aktiv',true,
   NULL,'Parasailing über der blauen Lagune der Malediven! Einzigartiger Blick aus 80m Höhe auf Atolle und türkises Wasser. Tandem-Flüge ohne Erfahrung möglich. Ab verschiedenen Resorts buchbar.',
   'Wassersport','North Malé Atoll, Malediven','Malediven',ARRAY['Englisch','Deutsch'],5,
   'https://api.dicebear.com/9.x/shapes/svg?seed=SkyHighParasailing&backgroundColor=0891b2','en',
   '@skyhigh_malediven','+960 1234567','Parasailing über dem Paradies'),

  -- 28. Cocktail Bar Dubrovnik
  (gen_random_uuid(), NULL,'Buza Bar Dubrovnik Felsbar',
   'cheers@buza-bar.hr','aktiv',true,
   NULL,'Die berühmteste Bar Dubrovniks! Direkt in die Stadtmauer gehauen, mit Blick aufs Mittelmeer. Cocktails, Bier und Wein auf Felsen sitzend. Sonnenuntergang hier ist unvergesslich!',
   'Gastronomie','Stare Grad, Dubrovnik','Kroatien',ARRAY['Kroatisch','Englisch','Deutsch'],25,
   'https://api.dicebear.com/9.x/shapes/svg?seed=BuzaBarDubrovnik&backgroundColor=7c3aed','hr',
   '@buza_bar_dubrovnik','+385 20 456789','Dubrovnik Felsbar Ikone'),

  -- 29. Kochkurs Thailand
  (gen_random_uuid(), NULL,'Thai Kitchen Cooking School Chiang Mai',
   'cook@thai-kitchen.th','aktiv',true,
   NULL,'Authentischer Thai-Kochkurs in Chiang Mai! Marktbesuch, 4 Gerichte kochen und essen. Tom Yum, Pad Thai, Green Curry, Mango Sticky Rice. Zertifikat inklusive! Halbtages-Format.',
   'Gastronomie','Nimmanhaemin, Chiang Mai','Thailand',ARRAY['Thaiisch','Englisch','Deutsch'],13,
   'https://api.dicebear.com/9.x/shapes/svg?seed=ThaiKitchenCookingSchool&backgroundColor=84cc16','en',
   '@thai_kitchen_chiangmai','+66 53 234567','Thaiisch kochen lernen'),

  -- 30. Safari Guide Kapstadt
  (gen_random_uuid(), NULL,'Cape Nature Safari Guide',
   'guide@capenature.za','aktiv',true,
   NULL,'Halbtagessafaris ab Kapstadt! Boulders Beach Pinguine, Cape Point, Chapman''s Peak in einem. Privater FGASA-Guide, kleiner Jeep, max 4 Personen. Whale Watching September-November.',
   'Outdoor & Wandern','Kapstadt','Südafrika',ARRAY['Englisch','Afrikaans','Deutsch'],14,
   'https://api.dicebear.com/9.x/shapes/svg?seed=CapeNatureSafariGuide&backgroundColor=16a34a','en',
   '@capenature_guide','+27 21 3456789','Kapstadt Safari-Erlebnisse')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. WERBEPLATZ-BUCHUNGEN (Anbieter & Lokale Partner)
-- ─────────────────────────────────────────────────────────────────────────────
-- Hinweis: anbieter_id referenziert anbieter_profile(id)
-- Da wir gen_random_uuid() verwendet haben, setzen wir via Subquery ein
-- Hier verwenden wir die Email als eindeutigen Identifier

DO $$
DECLARE
  v_anbieter_id uuid;
BEGIN
  -- SunTours GmbH
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'info@suntours.de' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'banner_l','antalya',6,149.00,894.00,'aktiv',
      'Klaus Mayer','SunTours GmbH','info@suntours.de',
      '✈️ Türkei All-Inclusive ab 599€! Bestpreisgarantie & kostenlose Umbuchung.',
      now()-interval '60 days', now()+interval '120 days', now()-interval '59 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- IslandDreams
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'info@islanddreams.de' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'banner_m','kreta',3,89.00,267.00,'aktiv',
      'Sandra Müller','IslandDreams Griechenland','info@islanddreams.de',
      '🇬🇷 Kreta Traumurlaub! Top-Hotels, Deutsche Reiseleitung, Beste Strände.',
      now()-interval '30 days', now()+interval '60 days', now()-interval '29 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Exotik Reisen
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'info@exotik-reisen.de' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'featured','bali',12,299.00,3588.00,'aktiv',
      'Thomas Berg','Exotik Reisen GmbH','info@exotik-reisen.de',
      '🌴 Bali & Asien Traumreisen! Individuelle Fernreisen ab 1299€. 20 Jahre Expertise.',
      now()-interval '90 days', now()+interval '275 days', now()-interval '89 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- MaldivesLux
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'info@maldiveslux.com' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'banner_l','malediven',6,149.00,894.00,'aktiv',
      'Julia Weber','MaldivesLux Premium Travel','info@maldiveslux.com',
      '🏝️ Malediven Exklusiv! Overwater-Bungalows, Privatstrand, All-Inclusive Luxury.',
      now()-interval '20 days', now()+interval '160 days', now()-interval '19 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Reise & Meer Kreuzfahrten
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'info@reise-meer.de' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'banner_m','mallorca',3,89.00,267.00,'aktiv',
      'Peter Schmidt','Reise & Meer','info@reise-meer.de',
      '🚢 Kreuzfahrten ab 499€! MSC, AIDA, Costa. Beste Kabinen, Bestpreisgarantie.',
      now()-interval '45 days', now()+interval '45 days', now()-interval '44 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Antalya Expert Tours
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'tours@antalya-expert.tr' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'banner_s','antalya',3,59.00,177.00,'aktiv',
      'Mehmet Demir','Antalya Expert Tours','tours@antalya-expert.tr',
      '🏛️ Ausflüge ab Antalya! Pamukkale, Kappadokien, Ephesus. Deutsche Reiseleitung.',
      now()-interval '15 days', now()+interval '75 days', now()-interval '14 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- SafariAfrica lokaler Anbieter Werbung
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'safari@safariafrica.ke' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'banner_m','kapstadt',6,89.00,534.00,'aktiv',
      'David Okonkwo','SafariAfrica Tours','safari@safariafrica.ke',
      '🦁 Safari Kenia & Tansania! Masai Mara, kleine Gruppen, ethischer Tourismus.',
      now()-interval '10 days', now()+interval '170 days', now()-interval '9 days')
    ON CONFLICT DO NOTHING;
  END IF;

  -- DiveWorld Hurghada Werbung
  SELECT id INTO v_anbieter_id FROM anbieter_profile WHERE email = 'dive@divepro-hurghada.eg' LIMIT 1;
  IF v_anbieter_id IS NOT NULL THEN
    INSERT INTO werbeplaetze_buchungen (anbieter_id, paket, zielseite, laufzeit_monate, preis_monatlich, preis_gesamt,
      status, kontakt_name, kontakt_firma, kontakt_email, werbeinhalt_text,
      starts_at, ends_at, bezahlt_at)
    VALUES (v_anbieter_id,'banner_s','hurghada',3,59.00,177.00,'aktiv',
      'Ahmed Hassan','DivePro Hurghada','dive@divepro-hurghada.eg',
      '🤿 PADI Tauchkurse ab 89€! Bestes Riff Hurghadas, moderne Ausrüstung, sichere Guides.',
      now()-interval '5 days', now()+interval '85 days', now()-interval '4 days')
    ON CONFLICT DO NOTHING;
  END IF;

END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- ERFOLGSMELDUNG
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM auth.users WHERE email LIKE '%demo.urlaubfinder365.de%') AS demo_user_gesamt,
  (SELECT COUNT(*) FROM public.users WHERE id::text LIKE 'a1%') AS reisende_profile,
  (SELECT COUNT(*) FROM community_profiles) AS community_profile,
  (SELECT COUNT(*) FROM travel_groups) AS gruppen,
  (SELECT COUNT(*) FROM group_posts) AS gruppen_beitraege,
  (SELECT COUNT(*) FROM travel_reports WHERE is_published = true) AS reiseberichte,
  (SELECT COUNT(*) FROM travel_tips WHERE status = 'approved') AS karten_tipps,
  (SELECT COUNT(*) FROM anbieter_profile WHERE status = 'aktiv') AS anbieter_und_partner,
  (SELECT COUNT(*) FROM werbeplaetze_buchungen WHERE status = 'aktiv') AS aktive_werbebuchungen,
  (SELECT COUNT(*) FROM user_streaks) AS streak_profile,
  (SELECT COUNT(*) FROM travel_buddies) AS buddy_profile;
