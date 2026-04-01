-- ══════════════════════════════════════════════════════════════════════════════
-- SCHRITT 2 von 2: DEMO-DATEN EINFÜGEN
-- Voraussetzung: seed_demo_community.sql wurde bereits ausgeführt!
-- ══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. DEMO-USER in auth.users
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
VALUES
  ('a1000000-0000-0000-0000-000000000001'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'sophie.mueller@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Sophie Müller"}'::jsonb, now(), now(), '','','',''),
  ('a1000000-0000-0000-0000-000000000002'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'max.reisender@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Max Reisender"}'::jsonb, now(), now(), '','','',''),
  ('a1000000-0000-0000-0000-000000000003'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'lena.wanderlust@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Lena Wanderlust"}'::jsonb, now(), now(), '','','',''),
  ('a1000000-0000-0000-0000-000000000004'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'thomas.globetrotter@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Thomas Globetrotter"}'::jsonb, now(), now(), '','','',''),
  ('a1000000-0000-0000-0000-000000000005'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'anna.fernweh@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Anna Fernweh"}'::jsonb, now(), now(), '','','',''),
  ('a1000000-0000-0000-0000-000000000006'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'kai.adventure@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Kai Adventure"}'::jsonb, now(), now(), '','','',''),
  ('a1000000-0000-0000-0000-000000000007'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'mia.weltreisend@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Mia Weltreisend"}'::jsonb, now(), now(), '','','',''),
  ('a1000000-0000-0000-0000-000000000008'::uuid,'00000000-0000-0000-0000-000000000000'::uuid,'authenticated','authenticated',
   'felix.strandurlaub@demo.urlaubfinder365.de', crypt('DemoPass123!', gen_salt('bf')), now(),
   '{"full_name":"Felix Strandurlaub"}'::jsonb, now(), now(), '','','','')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PUBLIC.USERS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.users (id, display_name, avatar_url, bio, visited_countries, xp, level, is_public,
  favorite_destinations, preferences)
VALUES
  ('a1000000-0000-0000-0000-000000000001','Sophie Müller','https://i.pravatar.cc/150?img=47',
   'Strandliebhaberin aus Hamburg. Mallorca ist mein zweites Zuhause. 🌴',
   ARRAY['ES','GR','TR','IT','PT'], 1250, 5, true,
   ARRAY['mallorca','kreta','antalya'],
   '{"budget":"mittel","adults":2,"children":0,"preferredMonths":["Jun","Jul","Aug"],"preferredTypes":["strand","familie"]}'::jsonb),
  ('a1000000-0000-0000-0000-000000000002','Max Reisender','https://i.pravatar.cc/150?img=11',
   'Backpacker mit 40+ Ländern. Immer auf der Suche nach dem nächsten Abenteuer.',
   ARRAY['TH','ID','VN','KH','MM','JP','KR','IN','NP'], 3200, 9, true,
   ARRAY['bali','phuket','kappadokien'],
   '{"budget":"budget","adults":1,"children":0,"preferredMonths":["Apr","Mai","Sep","Okt"],"preferredTypes":["abenteuer","kultur","natur"]}'::jsonb),
  ('a1000000-0000-0000-0000-000000000003','Lena Wanderlust','https://i.pravatar.cc/150?img=23',
   'Kulturreisende & Foodie. Städtetrips und lokale Küche sind meine Leidenschaft. 🏛️',
   ARRAY['IT','FR','ES','GR','HR','AT','CH'], 980, 4, true, ARRAY['rom','barcelona'], NULL),
  ('a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','https://i.pravatar.cc/150?img=57',
   'Seit 15 Jahren auf Weltreise. Über 70 Länder, kein Ende in Sicht. ✈️',
   ARRAY['US','CA','MX','BR','AR','AU','NZ','ZA','EG','MA','KE','TZ'], 5800, 14, true, ARRAY['malediven','dubai'], NULL),
  ('a1000000-0000-0000-0000-000000000005','Anna Fernweh','https://i.pravatar.cc/150?img=32',
   'Familienreisende mit zwei Kindern. Tipps für Urlaub mit Kids! 👨‍👩‍👧‍👦',
   ARRAY['ES','GR','HR','TR','PT'], 720, 3, true, ARRAY['kreta','mallorca'], NULL),
  ('a1000000-0000-0000-0000-000000000006','Kai Adventure','https://i.pravatar.cc/150?img=69',
   'Abenteurer, Kletterer, Taucher. Je wilder, desto besser. 🧗',
   ARRAY['NO','IS','NZ','PE','BO','NP','PK'], 2100, 7, true, ARRAY['kappadokien'], NULL),
  ('a1000000-0000-0000-0000-000000000007','Mia Weltreisend','https://i.pravatar.cc/150?img=44',
   'Solo-Reisende & Bloggerin. Die Welt ist zu groß um zuhause zu bleiben. 🌍',
   ARRAY['MV','AE','QA','TH','JP','AU','PF'], 1680, 6, true, ARRAY['malediven','dubai','bali'], NULL),
  ('a1000000-0000-0000-0000-000000000008','Felix Strandurlaub','https://i.pravatar.cc/150?img=15',
   'Strand, Sonne, Meer – mehr brauche ich nicht. 🏖️ Fan von Kanaren und Kreta.',
   ARRAY['ES','GR','CY','TR'], 450, 2, true, ARRAY['teneriffa','gran-canaria','kreta'], NULL)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. COMMUNITY PROFILES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO community_profiles (uid, display_name, photo_url, bio, location, nationality,
  visited_countries, followers_count, following_count, reports_count, tips_count,
  travel_frequency, traveler_type, languages, travel_interests)
VALUES
  ('a1000000-0000-0000-0000-000000000001','Sophie Müller','https://i.pravatar.cc/150?img=47',
   'Strandliebhaberin aus Hamburg 🌴 Mallorca-Expertin | 5 Länder bereist',
   'Hamburg','Deutschland',ARRAY['ES','GR','TR','IT','PT'],142,87,4,12,
   '2-3x pro Jahr','Strand & Entspannung',ARRAY['Deutsch','Englisch'],ARRAY['strand','familie','all-inclusive']),
  ('a1000000-0000-0000-0000-000000000002','Max Reisender','https://i.pravatar.cc/150?img=11',
   'Backpacker mit 40+ Ländern ✈️ Immer unterwegs | Budget-Reise-Spezialist',
   'München','Deutschland',ARRAY['TH','ID','VN','KH','MM','JP','KR','IN','NP'],389,201,12,47,
   'Mehrmals im Monat','Backpacker & Abenteurer',ARRAY['Deutsch','Englisch','Thai'],ARRAY['abenteuer','natur','kultur','backpacker']),
  ('a1000000-0000-0000-0000-000000000003','Lena Wanderlust','https://i.pravatar.cc/150?img=23',
   'Kulturreisende & Foodie 🏛️ Städtetrips | Lokale Küche',
   'Berlin','Deutschland',ARRAY['IT','FR','ES','GR','HR','AT','CH'],215,163,7,23,
   '1x pro Monat','Kulturreisende',ARRAY['Deutsch','Englisch','Italienisch'],ARRAY['kultur','essen','stadt']),
  ('a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','https://i.pravatar.cc/150?img=57',
   '70+ Länder bereist 🌍 Weltreisender seit 2008 | Reiseblogger',
   'Frankfurt','Deutschland',ARRAY['US','CA','MX','BR','AR','AU','NZ','ZA','EG','MA','KE','TZ'],1247,432,28,89,
   'Dauerhaft unterwegs','Globetrotter',ARRAY['Deutsch','Englisch','Spanisch','Französisch'],ARRAY['abenteuer','kultur','natur','luxus']),
  ('a1000000-0000-0000-0000-000000000005','Anna Fernweh','https://i.pravatar.cc/150?img=32',
   'Familienurlaub-Expertin 👨‍👩‍👧‍👦 Tipps für Reisen mit Kindern',
   'Köln','Deutschland',ARRAY['ES','GR','HR','TR','PT'],98,54,3,8,
   '1-2x pro Jahr','Familienreisende',ARRAY['Deutsch','Englisch'],ARRAY['familie','strand','all-inclusive']),
  ('a1000000-0000-0000-0000-000000000006','Kai Adventure','https://i.pravatar.cc/150?img=69',
   'Kletterer & Taucher 🧗 Je wilder, desto besser | Extremsport-Reisen',
   'Stuttgart','Deutschland',ARRAY['NO','IS','NZ','PE','BO','NP','PK'],567,298,9,34,
   '3-4x pro Jahr','Abenteurer',ARRAY['Deutsch','Englisch'],ARRAY['abenteuer','natur','sport','wandern']),
  ('a1000000-0000-0000-0000-000000000007','Mia Weltreisend','https://i.pravatar.cc/150?img=44',
   'Solo-Reisende & Bloggerin 🌍 Die Welt ist zu groß um zuhause zu bleiben',
   'Düsseldorf','Deutschland',ARRAY['MV','AE','QA','TH','JP','AU','PF'],734,389,11,29,
   '2-3x pro Jahr','Solo-Reisende',ARRAY['Deutsch','Englisch','Japanisch'],ARRAY['luxus','kultur','strand']),
  ('a1000000-0000-0000-0000-000000000008','Felix Strandurlaub','https://i.pravatar.cc/150?img=15',
   'Strand, Sonne, Meer 🏖️ Kanaren & Kreta-Fan',
   'Leipzig','Deutschland',ARRAY['ES','GR','CY','TR'],67,41,2,5,
   '1x pro Jahr','Strandliebhaber',ARRAY['Deutsch'],ARRAY['strand','all-inclusive','familie'])
ON CONFLICT (uid) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. REISEBERICHTE
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO travel_reports (user_id, display_name, destination, country, title,
  highlights, lowlights, tips, price_range, rating, recommendation,
  cover_image_url, visited_at, is_published, likes_count, comments_count)
VALUES
  ('a1000000-0000-0000-0000-000000000001','Sophie Müller','Mallorca','Spanien',
   'Mallorca im September – der perfekte Urlaub für Familien',
   'Die Strände im September sind deutlich ruhiger. Playa de Muro – traumhaft, weißer Sand, türkisblaues Wasser. Altstadt Alcúdia ist ein Muss! Port de Pollença abends: Sonnenuntergang unvergesslich.',
   'Preise in der Strandbar astronomisch – 7€ für ein Wasser. Mietauto absolut nötig, ÖPNV kaum vorhanden.',
   'Mietauto im Voraus buchen – am Flughafen doppelt so teuer! Cala Millor als Alternative zu Playa de Palma – weniger touristisch.',
   'mittel',5,true,'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80','2024-09',true,47,8),
  ('a1000000-0000-0000-0000-000000000002','Max Reisender','Thailand','Thailand',
   '6 Wochen Backpacking durch Thailand – alles was du wissen musst',
   'Nordregion Chiang Mai phänomenal – Elefantenreservate, Dschungelwanderungen, Night Bazaar. Koh Lanta ist das bessere Koh Samui – weniger Touristenmassen, günstigere Preise.',
   'Touristenfallen auf Koh Phi Phi massiv. Longtail-Boote verlangen absurde Preise. Regenzeit Oktober: tägliche Kurzregenfälle.',
   'Nachtzug Bangkok–Chiang Mai (500 Baht) statt Inlandsflug. Lokale SIM am Flughafen (300 Baht/30 Tage). Street Food am Nachtmarkt ist die beste Küche.',
   'budget',5,true,'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80','2024-10',true,124,23),
  ('a1000000-0000-0000-0000-000000000003','Lena Wanderlust','Rom','Italien',
   'Roma in 4 Tagen – mein Kultur-Highlights-Guide',
   'Kolosseum bei Sonnenaufgang (7 Uhr, kaum Touristen!) – intensivste Erfahrung meines Lebens. Trastevere abends: authentisches Flair, günstige Restaurants.',
   'Schlangen am Vatikan ohne Reservierung bis 3 Stunden! Trevi-Brunnen überfüllt – nur sehr früh morgens.',
   'Vatikan & Kolosseum 2 Monate vorher online buchen! Restaurants in Seitenstraßen besser und günstiger.',
   'mittel',5,true,'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80','2024-04',true,89,14),
  ('a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','Marrakesch','Marokko',
   'Marrakesch & Atlas-Gebirge: 10 Tage Abenteuer',
   'Die Medina – Labyrinth voller Leben. Djemaa el-Fna bei Nacht mit Schlangenbeschwörern, Gnawa-Musik unvergesslich. Sahara-Tour: einmalig.',
   'Aggressives Feilschen ermüdet. Ohne Führer verliert man sich in der Medina. Vorsicht bei "freundlichen Helfern".',
   'Arabisch/Darija lernen – öffnet Türen. Taxipreis vorher aushandeln. Riad statt Hotel – intimer und günstiger.',
   'mittel',4,true,'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&q=80','2024-03',true,67,11),
  ('a1000000-0000-0000-0000-000000000005','Anna Fernweh','Kreta','Griechenland',
   'Kreta mit Kindern – unser bisher schönster Familienurlaub',
   'Strand Rethymno ideal für Kinder: flach, sicheres Wasser. Venetianische Altstadt auch für Kinder spannend. Aqua Plus Wasserpark: Höhepunkt für unsere Tochter (7).',
   'Manche Strandabschnitte felsig – Badesandalen empfehlenswert. Hotelfrühstück teuer.',
   'Pauschalreise All-Inclusive lohnt sich für Familien enorm. Frühzeitig buchen für beste Familienzimmer!',
   'mittel',5,true,'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80','2024-07',true,43,9),
  ('a1000000-0000-0000-0000-000000000006','Kai Adventure','Island','Island',
   'Island im Winter: Nordlichter, Gletscher und pure Wildheit',
   'Nordlichter im Þingvellir – unvergesslich. Schnorcheln in der Silfra-Spalte: klarste Wasser der Welt. Gletscherwanderung Vatnajökull mit Eishöhle.',
   'Wetter im Winter unberechenbar – Touren werden kurzfristig abgesagt. Benzinpreise extrem hoch.',
   'Alle Touren früh buchen (Silfra & Eishöhle ausgebucht). Layered Clothing essentiell. Außerhalb Reykjaviks übernachten für bessere Nordlicht-Chancen.',
   'premium',5,true,'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80','2024-01',true,156,19),
  ('a1000000-0000-0000-0000-000000000007','Mia Weltreisend','Malediven','Malediven',
   'Malediven – ist der Luxus wirklich seinen Preis wert?',
   'Overwater-Bungalow: aus dem Bett ins Meer gleiten. Sonnenuntergang vom Steg unbeschreiblich. Schnorcheln: Riffhaie, Schildkröten, Mantarochen.',
   'Speisen und Getränke auf Resort-Inseln extrem teuer. Transport zu lokalen Inseln umständlich.',
   'Guesthouse auf Maafushi kostet 80% weniger. Kombiniere Guesthouse mit 2-3 Nächten Luxusresort.',
   'luxus',5,true,'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80','2024-02',true,201,31),
  ('a1000000-0000-0000-0000-000000000008','Felix Strandurlaub','Teneriffa','Spanien',
   'Teneriffa im Januar – die Winterflucht die sich lohnt',
   'Playa de las Américas: 22 Grad auch im Januar! Teide-Nationalpark atemberaubend. Siam Park: bester Wasserpark Europas!',
   'Der Süden sehr touristisch – Massentourismus pur.',
   'Mietauto & Norden erkunden: La Orotava, Puerto de la Cruz authentisch. Teide-Permit im Voraus buchen!',
   'mittel',4,true,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','2024-01',true,38,6)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. KOMMENTARE
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE r1 uuid; r2 uuid; r3 uuid; r4 uuid;
BEGIN
  SELECT id INTO r1 FROM travel_reports WHERE user_id='a1000000-0000-0000-0000-000000000001' LIMIT 1;
  SELECT id INTO r2 FROM travel_reports WHERE user_id='a1000000-0000-0000-0000-000000000002' LIMIT 1;
  SELECT id INTO r3 FROM travel_reports WHERE user_id='a1000000-0000-0000-0000-000000000006' LIMIT 1;
  SELECT id INTO r4 FROM travel_reports WHERE user_id='a1000000-0000-0000-0000-000000000007' LIMIT 1;
  IF r1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM travel_report_comments WHERE report_id=r1) THEN
    INSERT INTO travel_report_comments (report_id,user_id,display_name,text) VALUES
      (r1,'a1000000-0000-0000-0000-000000000002','Max Reisender','Mallorca im September klingt perfekt! Der Mietauto-Tipp ist Gold wert 😄'),
      (r1,'a1000000-0000-0000-0000-000000000005','Anna Fernweh','Genau unsere Erfahrung! Alcúdia mit Kindern sehr empfehlenswert.'),
      (r1,'a1000000-0000-0000-0000-000000000003','Lena Wanderlust','Toller Bericht! Welches Hotel habt ihr? Wir suchen noch was für Familie +2 Kinder.');
  END IF;
  IF r2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM travel_report_comments WHERE report_id=r2) THEN
    INSERT INTO travel_report_comments (report_id,user_id,display_name,text) VALUES
      (r2,'a1000000-0000-0000-0000-000000000006','Kai Adventure','Mega Bericht! Warst du am Mu Ko Lanta Nationalpark?'),
      (r2,'a1000000-0000-0000-0000-000000000007','Mia Weltreisend','Chiang Mai ist wunderschön. Nachtzug-Tipp super – habe ich auch so gemacht!'),
      (r2,'a1000000-0000-0000-0000-000000000001','Sophie Müller','Wow, 6 Wochen! Das wäre mein Traumurlaub. Wie viel Budget braucht man?');
  END IF;
  IF r3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM travel_report_comments WHERE report_id=r3) THEN
    INSERT INTO travel_report_comments (report_id,user_id,display_name,text) VALUES
      (r3,'a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','Island im Winter ist brutal schön. Silfra ist wirklich einmalig auf der Welt!'),
      (r3,'a1000000-0000-0000-0000-000000000002','Max Reisender','Eishöhle + Nordlichter in einer Reise – Bucket-List par excellence! Sommer oder Winter Island besser?');
  END IF;
  IF r4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM travel_report_comments WHERE report_id=r4) THEN
    INSERT INTO travel_report_comments (report_id,user_id,display_name,text) VALUES
      (r4,'a1000000-0000-0000-0000-000000000001','Sophie Müller','Wow Malediven! Der Guesthouse-Tipp ist super! Spart das wirklich so viel?'),
      (r4,'a1000000-0000-0000-0000-000000000003','Lena Wanderlust','Maafushi kenne ich – super Basis für Tagesausflüge!');
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. REISE-GRUPPEN + POSTS
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE g1 uuid; g2 uuid; g3 uuid; g4 uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM travel_groups WHERE creator_id='a1000000-0000-0000-0000-000000000001') THEN
    INSERT INTO travel_groups (creator_id,creator_name,name,description,destination,tags,is_public,members_count,member_ids)
    VALUES ('a1000000-0000-0000-0000-000000000001','Sophie Müller',
      '🌴 Mallorca-Liebhaber','Die Community für alle Mallorca-Fans. Tipps, Berichte und Reiseplanung.',
      'Mallorca',ARRAY['mallorca','spanien','strand','familie'],true,3,
      ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000008'])
    RETURNING id INTO g1;
    INSERT INTO group_posts (group_id,user_id,display_name,text,likes_count) VALUES
      (g1,'a1000000-0000-0000-0000-000000000001','Sophie Müller','Hat jemand Tipps für Restaurants in Alcúdia die kinderfreundlich UND lecker sind? 🍕',8),
      (g1,'a1000000-0000-0000-0000-000000000005','Anna Fernweh','Cala Millor sehr empfehlenswert für Familien! Strand flach und sicher für Kinder 🏖️',12),
      (g1,'a1000000-0000-0000-0000-000000000008','Felix Strandurlaub','Playa de Muro vs. Playa de Palma – welcher ist euer Favorit?',6);
    UPDATE travel_groups SET posts_count=3 WHERE id=g1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM travel_groups WHERE creator_id='a1000000-0000-0000-0000-000000000002') THEN
    INSERT INTO travel_groups (creator_id,creator_name,name,description,destination,tags,is_public,members_count,member_ids)
    VALUES ('a1000000-0000-0000-0000-000000000002','Max Reisender',
      '🎒 Backpacker Asien','Für alle die Asien auf eigene Faust entdecken. Budget-Tipps, Routen, Unterkünfte.',
      'Asien',ARRAY['backpacker','asien','budget','abenteuer'],true,4,
      ARRAY['a1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000007','a1000000-0000-0000-0000-000000000004'])
    RETURNING id INTO g2;
    INSERT INTO group_posts (group_id,user_id,display_name,text,likes_count) VALUES
      (g2,'a1000000-0000-0000-0000-000000000002','Max Reisender','Koh Lanta-Tipp: Kantiang Bay im Süden. Kaum Touristen, traumhafter Sonnenuntergang 🏝️',19),
      (g2,'a1000000-0000-0000-0000-000000000006','Kai Adventure','Trekking im Doi Inthanon NP bei Chiang Mai. 2 Tage, Dschungel, Wasserfälle – absolute Empfehlung!',14),
      (g2,'a1000000-0000-0000-0000-000000000007','Mia Weltreisend','Bangkok Rooftop Bar Octave im Marriott – bester Panoramablick, Happy Hour 17-19 Uhr!',22),
      (g2,'a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','Thailand Visum: 30 Tage on Arrival für Deutsche. Verlängerung in Chiang Mai 1900 Baht.',31);
    UPDATE travel_groups SET posts_count=4 WHERE id=g2;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM travel_groups WHERE creator_id='a1000000-0000-0000-0000-000000000005') THEN
    INSERT INTO travel_groups (creator_id,creator_name,name,description,destination,tags,is_public,members_count,member_ids)
    VALUES ('a1000000-0000-0000-0000-000000000005','Anna Fernweh',
      '👨‍👩‍👧 Familienurlaub-Tipps','Reisen mit Kindern – von Eltern für Eltern. Sichere Strände, kinderfreundliche Hotels.',
      'Europa',ARRAY['familie','kinder','strand','all-inclusive'],true,3,
      ARRAY['a1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000008'])
    RETURNING id INTO g3;
    INSERT INTO group_posts (group_id,user_id,display_name,text,likes_count) VALUES
      (g3,'a1000000-0000-0000-0000-000000000005','Anna Fernweh','Packliste mit Kindern (3-8 J.): Badesandalen, LSF 50+, Kinder-Schnorchelset. Was fehlt bei euch nie? 🧴',27),
      (g3,'a1000000-0000-0000-0000-000000000001','Sophie Müller','All-Inclusive mit Kindern ist die entspannteste Art zu reisen. Keine Gedanken ums Geld!',18);
    UPDATE travel_groups SET posts_count=2 WHERE id=g3;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM travel_groups WHERE creator_id='a1000000-0000-0000-0000-000000000004') THEN
    INSERT INTO travel_groups (creator_id,creator_name,name,description,destination,tags,is_public,members_count,member_ids)
    VALUES ('a1000000-0000-0000-0000-000000000004','Thomas Globetrotter',
      '🌍 Weltreisende & Globetrotter','Für Langzeitreisende und alle die es werden wollen. Visa, Arbeiten auf Reisen, Langzeitrouten.',
      'Weltweit',ARRAY['weltreise','langzeitreise','globetrotter','nomaden'],true,4,
      ARRAY['a1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000007'])
    RETURNING id INTO g4;
    INSERT INTO group_posts (group_id,user_id,display_name,text,likes_count) VALUES
      (g4,'a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','WHV Australien: Bewerbung jetzt für 2025! Nur 5000 Plätze/Jahr für Deutsche.',43),
      (g4,'a1000000-0000-0000-0000-000000000002','Max Reisender','Digital Nomad Chiang Mai: CAMP Co-Working im Maya Mall – kostenlos mit Kaffee, schnelles WLAN.',38),
      (g4,'a1000000-0000-0000-0000-000000000006','Kai Adventure','Reisekrankenversicherung: HANSE MERKUR Langzeit – Kletterunfall Peru problemlos abgerechnet.',29),
      (g4,'a1000000-0000-0000-0000-000000000007','Mia Weltreisend','Solo als Frau in Dubai: sicherer als viele denken – 2 Wochen alleine, keine unangenehmen Situationen.',52);
    UPDATE travel_groups SET posts_count=4 WHERE id=g4;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. MEDIA FEED
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO media_feed (user_id,display_name,destination,destination_slug,media_url,caption,tags,likes_count,liked_by)
VALUES
  ('a1000000-0000-0000-0000-000000000001','Sophie Müller','Mallorca, Spanien','mallorca',
   'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
   'Goldene Stunde am Playa de Muro 🌅 Im September gehört der Strand fast uns alleine!',
   ARRAY['mallorca','strand','september'],34,ARRAY['a1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000003']),
  ('a1000000-0000-0000-0000-000000000002','Max Reisender','Chiang Mai, Thailand','chiang-mai',
   'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
   'Wat Phrathat Doi Suthep bei Sonnenaufgang ✨ Um 6 Uhr morgens – keine Touristen, pure Magie!',
   ARRAY['thailand','chiangmai','tempel'],89,ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000006']),
  ('a1000000-0000-0000-0000-000000000003','Lena Wanderlust','Rom, Italien','rom',
   'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
   'Das Kolosseum um 7 Uhr morgens 🏛️ Kein einziger Tourist – so stelle ich mir Rom vor!',
   ARRAY['rom','italien','kolosseum'],67,ARRAY['a1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000005']),
  ('a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','Marrakesch, Marokko','marrakesch',
   'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&q=80',
   'Djemaa el-Fna bei Nacht 🎭 Dieser Ort ist ein eigenes Universum!',
   ARRAY['marokko','marrakesch','nacht'],112,ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002']),
  ('a1000000-0000-0000-0000-000000000005','Anna Fernweh','Kreta, Griechenland','kreta',
   'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80',
   'Kinder + Kreta = perfekte Kombination 👨‍👩‍👧 Flaches Wasser, feiner Sand!',
   ARRAY['kreta','griechenland','familie'],45,ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000008']),
  ('a1000000-0000-0000-0000-000000000006','Kai Adventure','Island','island',
   'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
   'Nordlichter über Island 🌌 -10°C, 2 Uhr nachts – und dann das! Unbeschreiblich!',
   ARRAY['island','nordlichter','abenteuer'],203,ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000004']),
  ('a1000000-0000-0000-0000-000000000007','Mia Weltreisend','Malediven','malediven',
   'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
   'Morgen-Kaffee vom Steg meines Overwater-Bungalows ☕ Das Meer ist glasklar!',
   ARRAY['malediven','luxus','meer'],178,ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000005']),
  ('a1000000-0000-0000-0000-000000000008','Felix Strandurlaub','Teneriffa, Spanien','teneriffa',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
   'Teneriffa im Januar: 22 Grad ☀️ Während zuhause Schnee liegt!',
   ARRAY['teneriffa','kanaren','winter'],56,ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000005']),
  ('a1000000-0000-0000-0000-000000000002','Max Reisender','Bali, Indonesien','bali',
   'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
   'Tegallalang Reisterrassen bei Sonnenaufgang 🌿 Bali ist unbeschreiblich schön!',
   ARRAY['bali','indonesien','natur'],143,ARRAY['a1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000007']),
  ('a1000000-0000-0000-0000-000000000004','Thomas Globetrotter','Kappadokien, Türkei','kappadokien',
   'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
   '200 Heißluftballons in der Luft 🎈 Das Kappadokien-Erlebnis IS die Bucket-List!',
   ARRAY['tuerkei','kappadokien','heissluftballon'],267,ARRAY['a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000007'])
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. TRAVEL BUDDIES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO travel_buddies (user_id,display_name,photo_url,age_range,gender,languages,destinations,travel_style,bio,departure_from,travel_months,is_active)
VALUES
  ('a1000000-0000-0000-0000-000000000001','Sophie Müller','https://i.pravatar.cc/150?img=47',
   '25-35','Weiblich',ARRAY['Deutsch','Englisch'],ARRAY['Mallorca','Kreta','Teneriffa'],ARRAY['strand','familie','all-inclusive'],
   'Suche Reisepartnerin für Mallorca oder Kreta im September 2025. Bin entspannt, mag gutes Essen und schöne Strände. Keine Partytouristin!',
   'Hamburg',ARRAY['Jun','Jul','Aug','Sep'],true),
  ('a1000000-0000-0000-0000-000000000002','Max Reisender','https://i.pravatar.cc/150?img=11',
   '25-35','Männlich',ARRAY['Deutsch','Englisch','Thai'],ARRAY['Thailand','Vietnam','Indonesien'],ARRAY['backpacker','abenteuer','kultur'],
   'Backpacking-Buddy für Südostasien gesucht. Plane flexibel, Hostels & Guesthouses, liebe Street Food. Budget ca. 50€/Tag.',
   'München',ARRAY['Apr','Mai','Sep','Okt','Nov'],true),
  ('a1000000-0000-0000-0000-000000000003','Lena Wanderlust','https://i.pravatar.cc/150?img=23',
   '25-35','Weiblich',ARRAY['Deutsch','Englisch','Italienisch'],ARRAY['Rom','Florenz','Barcelona','Paris'],ARRAY['kultur','essen','stadt'],
   'Kulturreisepartnerin gesucht! Museen, gute Restaurants, Altstädte. Städtetrips 3-5 Tage mit viel Programm.',
   'Berlin',ARRAY['Mär','Apr','Mai','Sep','Okt','Nov'],true),
  ('a1000000-0000-0000-0000-000000000006','Kai Adventure','https://i.pravatar.cc/150?img=69',
   '25-35','Männlich',ARRAY['Deutsch','Englisch'],ARRAY['Island','Norwegen','Neuseeland','Peru'],ARRAY['abenteuer','natur','wandern'],
   'Kletterpartner/in für Island-Trekking 2025 gesucht. Kondition & Erfahrung nötig. Keine Pauschalrundreise!',
   'Stuttgart',ARRAY['Jun','Jul','Aug'],true),
  ('a1000000-0000-0000-0000-000000000007','Mia Weltreisend','https://i.pravatar.cc/150?img=44',
   '25-35','Weiblich',ARRAY['Deutsch','Englisch','Japanisch'],ARRAY['Japan','Dubai','Malediven','Australien'],ARRAY['luxus','kultur','strand'],
   'Premium-Reisepartnerin für Japan 2025 (Kirschblüte) gesucht. 4-5 Sterne, detaillierte Planung, Kulturliebe. Kein Backpacking.',
   'Düsseldorf',ARRAY['Mär','Apr'],true),
  ('a1000000-0000-0000-0000-000000000008','Felix Strandurlaub','https://i.pravatar.cc/150?img=15',
   '36-45','Männlich',ARRAY['Deutsch'],ARRAY['Teneriffa','Gran Canaria','Kreta','Mallorca'],ARRAY['strand','all-inclusive','wellness'],
   'All-Inclusive-Buddy für Kanaren oder Kreta gesucht. Strand, Pool, gutes Essen. Keine Bergwanderungen. Einfach abschalten!',
   'Leipzig',ARRAY['Jan','Feb','Nov','Dez'],true)
ON CONFLICT (user_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. ÖFFENTLICHE REISEROUTEN
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO trip_plans (user_id,title,destination,destination_name,start_date,end_date,adults,children,budget,notes,status,linked_trip_ids,linked_activity_ids,is_public,clone_count,cover_image_url)
VALUES
  ('a1000000-0000-0000-0000-000000000002','Backpacker Thailand – 4 Wochen Klassik-Route',
   'thailand','Thailand','2025-10-01','2025-10-28',1,0,1400.00,
   'Route: Bangkok (3N) → Chiang Mai (5N) → Pai (3N) → Koh Lanta (7N) → Koh Tao Tauchen (4N) → Bangkok (1N). Nachtzug Bangkok–Chiang Mai. Hostels & Street Food.',
   'planning','{}','{}',true,12,'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000003','Kulturelles Italien – Rom, Florenz & Cinque Terre',
   'rom','Italien','2025-04-15','2025-04-25',2,0,2800.00,
   'Tag 1-4: Rom (Kolosseum, Vatikan, Trastevere). Tag 5-7: Florenz (Uffizien, Ponte Vecchio). Tag 8-10: Cinque Terre (Wanderweg). Zug zwischen Städten, Hotels 3*.',
   'planning','{}','{}',true,8,'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000001','Mallorca Familienurlaub – 2 Wochen September',
   'mallorca','Mallorca','2025-09-06','2025-09-20',2,2,3200.00,
   'Finca im Norden (Pollença). Mietauto ab Tag 1. Alcúdia → Formentor → Palma Altstadt → Drachenhöhlen → Cala Millor.',
   'planning','{}','{}',true,5,'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000006','Island Winter-Abenteuer – Nordlichter & Eiswelt',
   'island','Island','2026-01-10','2026-01-17',2,0,3500.00,
   'Reykjavik → Golden Circle → Silfra Schnorcheln → Gletscherwanderung → Eishöhle Vatnajökull → Nordlichter Jagd → Heimflug.',
   'planning','{}','{}',true,19,'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000007','Japan Kirschblüte – Tokyo, Kyoto & Osaka',
   'japan','Japan','2026-03-25','2026-04-08',2,0,5200.00,
   'Tokyo (4N) → Shinkansen → Kyoto (4N, Fushimi Inari, Arashiyama) → Nara (1N) → Osaka (4N). JR-Pass kaufen!',
   'planning','{}','{}',true,27,'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'),
  ('a1000000-0000-0000-0000-000000000004','Marokko Rundreise – Sahara, Berge & Meer',
   'marrakesch','Marokko','2025-03-15','2025-03-25',2,0,1800.00,
   'Marrakesch (2N) → Atlasgebirge → Dades-Schlucht → Sahara Merzouga (Kamelritt, Berberzelt) → Fès → Essaouira am Atlantik.',
   'confirmed','{}','{}',true,14,'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&q=80')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. TRAVEL TIPS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO travel_tips (user_id,display_name,title,description,category,location_name,lat,lng)
VALUES
  ('a1000000-0000-0000-0000-000000000001','Sophie Müller',
   'Playa de Muro – ruhigster Nordstrand Mallorcas',
   'Weitaus weniger überlaufen als der Süden. Weiße Sanddünen, türkisblaues Wasser. Am besten früh morgens oder September!',
   'geheimtipp','Playa de Muro, Mallorca',39.8013,3.0940),
  ('a1000000-0000-0000-0000-000000000002','Max Reisender',
   'Kantiang Bay – verstecktes Paradies auf Koh Lanta',
   'Südlichste Bucht Koh Lantas, weit weg von Touristenmassen. Perfekter Sonnenuntergang. Longtail ab Saladan ca. 500 Baht.',
   'geheimtipp','Kantiang Bay, Koh Lanta, Thailand',7.4536,99.0520),
  ('a1000000-0000-0000-0000-000000000003','Lena Wanderlust',
   'Da Enzo al 29 – authentisches Trastevere-Restaurant',
   'Nur Einheimische, kein Touristenmenü. Cacio e Pepe zum Weinen gut. Reservierung empfohlen.',
   'gastronomie','Via dei Vascellari 29, Trastevere, Rom',41.8884,12.4717),
  ('a1000000-0000-0000-0000-000000000004','Thomas Globetrotter',
   'Erg Chebbi – Sanddünen der Sahara',
   'Kamelritt zum Dünencamp, Übernachtung im Berberzelt, Sonnenaufgang über den Dünen. Unvergesslich!',
   'geheimtipp','Merzouga, Marokko',31.0977,-3.9611),
  ('a1000000-0000-0000-0000-000000000006','Kai Adventure',
   'Silfra-Spalte – Schnorcheln zwischen zwei Kontinenten',
   'Klarste Wasser der Welt (100m+ Sicht) im Þingvellir-Nationalpark. Wassertemperatur 2-4°C.',
   'sehenswuerdigkeit','Silfra, Þingvellir, Island',64.2553,-20.9258),
  ('a1000000-0000-0000-0000-000000000007','Mia Weltreisend',
   'Arashiyama Bambushain – vor 7 Uhr morgens',
   'Um 6:30 Uhr ist man alleine! Das Licht durch den Bambus magisch, Fotos unwirklich schön.',
   'geheimtipp','Arashiyama, Kyoto, Japan',35.0168,135.6720),
  ('a1000000-0000-0000-0000-000000000005','Anna Fernweh',
   'Elafonisi – pinker Strand Kretas für Kinder',
   'Seichtes rosafarbenes Wasser, perfekt für Kleinkinder. Mietauto nötig, früh hinfahren!',
   'geheimtipp','Elafonisi, Kreta, Griechenland',35.2678,23.5352)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. DAILY STREAKS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO user_streaks (user_id,current_streak,longest_streak,total_coins,last_checkin_date,checkin_history)
VALUES
  ('a1000000-0000-0000-0000-000000000001',7,14,340,CURRENT_DATE,
   ARRAY[CURRENT_DATE-27,CURRENT_DATE-26,CURRENT_DATE-24,CURRENT_DATE-20,CURRENT_DATE-19,CURRENT_DATE-18,CURRENT_DATE-14,CURRENT_DATE-13,CURRENT_DATE-12,CURRENT_DATE-11,CURRENT_DATE-10,CURRENT_DATE-9,CURRENT_DATE-6,CURRENT_DATE-5,CURRENT_DATE-4,CURRENT_DATE-3,CURRENT_DATE-2,CURRENT_DATE-1,CURRENT_DATE]::date[]),
  ('a1000000-0000-0000-0000-000000000002',21,21,810,CURRENT_DATE,
   ARRAY[CURRENT_DATE-20,CURRENT_DATE-19,CURRENT_DATE-18,CURRENT_DATE-17,CURRENT_DATE-16,CURRENT_DATE-15,CURRENT_DATE-14,CURRENT_DATE-13,CURRENT_DATE-12,CURRENT_DATE-11,CURRENT_DATE-10,CURRENT_DATE-9,CURRENT_DATE-8,CURRENT_DATE-7,CURRENT_DATE-6,CURRENT_DATE-5,CURRENT_DATE-4,CURRENT_DATE-3,CURRENT_DATE-2,CURRENT_DATE-1,CURRENT_DATE]::date[]),
  ('a1000000-0000-0000-0000-000000000004',3,42,1650,(CURRENT_DATE-1),
   ARRAY[CURRENT_DATE-27,CURRENT_DATE-14,CURRENT_DATE-5,CURRENT_DATE-4,CURRENT_DATE-3,CURRENT_DATE-2,CURRENT_DATE-1]::date[]),
  ('a1000000-0000-0000-0000-000000000007',14,14,630,CURRENT_DATE,
   ARRAY[CURRENT_DATE-13,CURRENT_DATE-12,CURRENT_DATE-11,CURRENT_DATE-10,CURRENT_DATE-9,CURRENT_DATE-8,CURRENT_DATE-7,CURRENT_DATE-6,CURRENT_DATE-5,CURRENT_DATE-4,CURRENT_DATE-3,CURRENT_DATE-2,CURRENT_DATE-1,CURRENT_DATE]::date[])
ON CONFLICT (user_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. QUIZ SCORES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO trivia_scores (user_id,quiz_date,score,max_score) VALUES
  ('a1000000-0000-0000-0000-000000000001',CURRENT_DATE-1,4,5),
  ('a1000000-0000-0000-0000-000000000002',CURRENT_DATE-1,5,5),
  ('a1000000-0000-0000-0000-000000000003',CURRENT_DATE-1,3,5),
  ('a1000000-0000-0000-0000-000000000004',CURRENT_DATE-1,5,5),
  ('a1000000-0000-0000-0000-000000000006',CURRENT_DATE-1,4,5),
  ('a1000000-0000-0000-0000-000000000007',CURRENT_DATE-1,5,5),
  ('a1000000-0000-0000-0000-000000000002',CURRENT_DATE-2,5,5),
  ('a1000000-0000-0000-0000-000000000004',CURRENT_DATE-2,4,5),
  ('a1000000-0000-0000-0000-000000000007',CURRENT_DATE-2,5,5)
ON CONFLICT (user_id,quiz_date) DO NOTHING;

SELECT 'Demo-Daten erfolgreich eingefügt ✓' AS status;

-- ══════════════════════════════════════════════════════════════════════════════
-- Demo-Zugangsdaten (alle Passwort: DemoPass123!)
-- sophie.mueller@demo.urlaubfinder365.de
-- max.reisender@demo.urlaubfinder365.de
-- lena.wanderlust@demo.urlaubfinder365.de
-- thomas.globetrotter@demo.urlaubfinder365.de
-- anna.fernweh@demo.urlaubfinder365.de
-- kai.adventure@demo.urlaubfinder365.de
-- mia.weltreisend@demo.urlaubfinder365.de
-- felix.strandurlaub@demo.urlaubfinder365.de
-- ══════════════════════════════════════════════════════════════════════════════
