# claude.md – urlaubfinder365.de

## projekt-kontext
Alle Base365-Standards gelten (Design, SEO, DSGVO, Sicherheit, Performance).
Dateinamen sind im gesamten Projekt konsequent klein zu schreiben.
Während der Entwicklung ist ausschließlich mit Demo-Daten zu arbeiten.

## projekt-info
- Domain: urlaubfinder365.de
- Typ: Web-App + Mobile App (iOS & Android)
- Stack: Next.js 16, TypeScript, Tailwind CSS 4, Supabase, Vercel, Expo
- Monorepo: Turborepo mit pnpm (apps/web, apps/mobile, packages/shared, packages/supabase)
- Status: In Entwicklung — Phase 1 (Grundgerüst)
- Backend-Split: Supabase (Auth, DB, Storage) + Firebase (nur Push/FCM)

## zielgruppe
Reisende jeden Alters weltweit – Familien, Paare, Alleinreisende.
Breite Altersgruppe → intuitive Bedienung, barrierefreie UX, klare Sprache.

## internationalisierung (i18n)
Ausgelegt auf maximale Reichweite und globale Skalierung. Die Basisdatei `de.ts` dient als Ausgangspunkt für die spätere Übersetzung in folgende Sprachen:
Deutsch, Englisch, Spanisch, Französisch, Italienisch, Türkisch, Polnisch, Russisch, Arabisch, Chinesisch, Hindi, Koreanisch, Thai, Vietnamesisch.

## kern-funktion
Preisvergleich, Angebotsaggregation und ganzheitliche Reisebegleitung:
- Pauschalreisen, Last-Minute, All-Inclusive
- Aktivitäten zu 250+ Reisezielen weltweit
- Historische Preisverläufe & Trend-Prognosen (Wann ist die beste Zeit zum Buchen?)
- Umfassender Urlaubsguide für die einzelnen Urlaubsziele
- Urlaubs-Hub mit sämtlichen länderspezifischen Informationen, die man vor, während und nach einem Urlaub benötigt

## features (fokus: community & daily engagement)
- **Preisverlauf & Trend-Analyse:** Interaktive Charts pro Reiseziel, die historische Preisdaten visualisieren und Kaufempfehlungen geben (starker Vertrauens- und SEO-Hebel).
- **Täglicher Reise-Feed (Shorts/Reels-Format):** Endloser, swipe-barer Feed mit kurzen Reisevideos und Fotos der Community für die tägliche Dosis Inspiration.
- **Daily Check-ins & Streaks:** Nutzer sammeln täglich "Travel Coins" allein durch das Öffnen der App. Einlösbar für Premium-Features oder Partner-Rabatte.
- **Deal des Tages (Flash-Sale):** Ein stark rabattiertes, exklusives 24-Stunden-Angebot direkt auf der Startseite (FOMO-Effekt).
- **Daily Travel Quiz & Trivia:** Tägliche Geografie-Rätsel ("Wo bin ich?"), Flaggen-Raten oder Kultur-Quizzes. Highscores und direkte Duelle mit Freunden.
- **Reise-Countdown & Daily To-Dos:** Ein interaktiver Begleiter für bevorstehende Reisen (z.B. "Noch 14 Tage: Hast du schon online eingecheckt?").
- **Live-Webcams & Aktuelles Wetter:** Echtzeit-Fenster in die 250+ Reiseziele – ideal für Tagträumer im Büro.
- **Urlaubsführer / Reiseführer:** Pro Ziel aufbereitet (SEO-Hauptasset).
- **Travel-Buddies (Matchmaking):** Finde Gleichgesinnte für gemeinsame Reisen.
- **Reiserouten teilen & klonen:** Detailplanungen veröffentlichen und die Routen anderer mit einem Klick übernehmen.
- **Lokale Experten & Q&A:** Einheimische beantworten Fragen der Community.
- **Globale interaktive Weltkarte:** Mit Erlebnispins, Medien-Uploads und Filterung nach Freunden.
- **Direktnachrichten & Gruppen-Chats:** Vernetzung vor, während und nach der Reise.
- **Preisalarm:** Für Wunschziele (Push via Expo).
- **Favoriten / Merkliste:** Für die Reiseplanung.
- **Gamification:** Achievements, Badges und Level.
- **KI-Empfehlungen:** Gestützt auf Echtzeit-Community-Trends.

## supabase tabellen
`users`, `user_profiles`, `destinations`, `offers`, `reports`, `itineraries`, `travel_buddies`, `forums`, `messages`, `achievements`, `favorites`, `price_alerts`, `price_history`, `user_achievements`, `community_posts`, `translations`, `daily_deals`, `trivia_scores`, `user_streaks`, `media_feed`

## design-richtung
Warm, inspirierend, reisefreudig. Hochwertige Reisefotografie als visueller Kern.
Die Farbpalette basiert primär auf den Tönen #1db682 und #6991d8.
Keine generischen Reiseportal-Klischees. Klar, schnell, vertrauenswürdig.

## seo-priorität
Sehr hoch. Jedes Reiseziel = eigene optimierte, extrem performante Seite.
JSON-LD: TouristDestination, TravelAction, BreadcrumbList, Review (für User Generated Content), FAQPage (für Q&A-Bereiche).

## monetarisierung
- Google Adsense (Web)
- AdMob (App) – während der Entwicklung NUR Test-IDs verwenden!
- Affiliate-Links zu Reiseanbietern (Traveltainment, CHECK24 etc.)
- Premium-Features für Community-Mitglieder (z. B. werbefreies Erlebnis, exklusive Badges, unlimitierte Routen-Klone)
- Sponsored "Deal des Tages" Platzierungen für Partner