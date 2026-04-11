// Bulk SEO Text Generator
// Generiert SEO-Texte für alle Destinations ohne Einträge und speichert sie direkt in Supabase

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL      || process.env.SUPABASE_URL;
const SUPABASE_SERVICE  = process.env.SUPABASE_SERVICE_ROLE_KEY      || process.env.SUPABASE_SERVICE;
const ANTHROPIC_KEY     = process.env.ANTHROPIC_API_KEY;

const DESTINATIONS = [{"slug":"afrika","name":"Afrika","country":"Afrika"},{"slug":"afrika-sued","name":"Afrika Süd","country":"Afrika"},{"slug":"afrika-west","name":"Afrika West","country":"Afrika"},{"slug":"alentejo","name":"Alentejo","country":"Portugal"},{"slug":"algarve","name":"Algarve","country":"Portugal"},{"slug":"allgaeu","name":"Allgäu","country":"Deutschland"},{"slug":"amalfikusste","name":"Amalfiküste Kampanien","country":"Italien"},{"slug":"andalusien","name":"Andalusien","country":"Spanien"},{"slug":"antalya-stadt","name":"Antalya Stadt","country":"Türkei"},{"slug":"apulien","name":"Apulien","country":"Italien"},{"slug":"aragonien","name":"Aragonien","country":"Spanien"},{"slug":"aruba","name":"Aruba","country":"Aruba"},{"slug":"asien","name":"Asien","country":"Asien"},{"slug":"athen","name":"Athen & Umgebung","country":"Griechenland"},{"slug":"azoren","name":"Azoren","country":"Portugal"},{"slug":"bali","name":"Bali","country":"Indonesien"},{"slug":"baltikum","name":"Baltikum","country":"Baltikum"},{"slug":"bangkok","name":"Bangkok & Umgebung","country":"Thailand"},{"slug":"barbados","name":"Barbados","country":"Barbados"},{"slug":"bayern","name":"Bayern","country":"Deutschland"},{"slug":"belek","name":"Belek","country":"Türkei"},{"slug":"benelux","name":"BeNeLux","country":"BeNeLux"},{"slug":"benidorm","name":"Benidorm","country":"Spanien"},{"slug":"berlin","name":"Berlin Brandenburg","country":"Deutschland"},{"slug":"bretagne","name":"Bretagne","country":"Frankreich"},{"slug":"british-columbia","name":"British Columbia","country":"Kanada"},{"slug":"bruessel","name":"Brüssel & Umgebung","country":"Belgien"},{"slug":"buenos-aires","name":"Buenos Aires","country":"Argentinien"},{"slug":"cancun","name":"Cancun","country":"Mexiko"},{"slug":"capri","name":"Capri","country":"Italien"},{"slug":"cascais","name":"Cascais & Estoril","country":"Portugal"},{"slug":"cesme","name":"Çeşme","country":"Türkei"},{"slug":"chalkidiki","name":"Chalkidiki","country":"Griechenland"},{"slug":"chiang-mai","name":"Chiang Mai","country":"Thailand"},{"slug":"costa-blanca","name":"Costa Blanca","country":"Spanien"},{"slug":"costa-brava","name":"Costa Brava","country":"Spanien"},{"slug":"costa-da-caparica","name":"Costa da Caparica","country":"Portugal"},{"slug":"costa-de-almeria","name":"Costa de Almería","country":"Spanien"},{"slug":"costa-de-la-luz","name":"Costa de la Luz","country":"Spanien"},{"slug":"costa-de-prata","name":"Costa de Prata","country":"Portugal"},{"slug":"costa-del-azahar","name":"Costa del Azahar","country":"Spanien"},{"slug":"costa-del-sol","name":"Costa del Sol","country":"Spanien"},{"slug":"costa-do-estoril","name":"Costa do Estoril","country":"Portugal"},{"slug":"costa-dorada","name":"Costa Dorada","country":"Spanien"},{"slug":"costa-verde-portugal","name":"Costa Verde","country":"Portugal"},{"slug":"cote-dazur","name":"Côte d'Azur","country":"Frankreich"},{"slug":"curacao","name":"Curacao","country":"Curacao"},{"slug":"daenemark","name":"Dänemark","country":"Dänemark"},{"slug":"dalyan","name":"Dalyan & Dalaman","country":"Türkei"},{"slug":"delhi","name":"Delhi","country":"Indien"},{"slug":"deutschland-ost","name":"Deutschland Ost","country":"Deutschland"},{"slug":"deutschland-west","name":"Deutschland West","country":"Deutschland"},{"slug":"dominikanische-republik","name":"Dominikanische Republik","country":"Dominikanische Republik"},{"slug":"dublin","name":"Dublin & Umgebung","country":"Großbritannien"},{"slug":"el-gouna","name":"El Gouna","country":"Ägypten"},{"slug":"el-hierro","name":"El Hierro","country":"Spanien"},{"slug":"europa-ost","name":"Europa-Ost","country":"Europa"},{"slug":"europa-sued-ost","name":"Europa-Süd-Ost","country":"Europa"},{"slug":"europaeische-zwergstaaten","name":"Europäische Zwergstaaten","country":"Europa"},{"slug":"fethiye","name":"Fethiye & Ölüdeniz","country":"Türkei"},{"slug":"finnland-lappland","name":"Finnland Lappland","country":"Finnland"},{"slug":"florida-orlando","name":"Florida Orlando","country":"USA"},{"slug":"florida-ostkueste","name":"Florida Ostküste","country":"USA"},{"slug":"formentera","name":"Formentera","country":"Spanien"},{"slug":"gardasee","name":"Gardasee & Oberitalienische Seen","country":"Italien"},{"slug":"genf","name":"Genf Stadt & Kanton","country":"Schweiz"},{"slug":"georgien","name":"Georgien","country":"Georgien"},{"slug":"goa","name":"Goa","country":"Indien"},{"slug":"goldstrand","name":"Goldstrand Riviera Nord","country":"Bulgarien"},{"slug":"gozo","name":"Gozo","country":"Malta"},{"slug":"granada","name":"Granada","country":"Spanien"},{"slug":"grossbritannien","name":"Großbritannien & Irland","country":"Großbritannien"},{"slug":"guadeloupe","name":"Guadeloupe","country":"Frankreich"},{"slug":"hammamet","name":"Hammamet","country":"Tunesien"},{"slug":"havanna","name":"Havanna & Umgebung","country":"Kuba"},{"slug":"helsinki","name":"Helsinki & Umgebung","country":"Finnland"},{"slug":"hua-hin","name":"Hua Hin","country":"Thailand"},{"slug":"indien","name":"Indien & Sri Lanka","country":"Indien"},{"slug":"indischer-ozean","name":"Indischer Ozean","country":"Indischer Ozean"},{"slug":"insel-hvar","name":"Insel Hvar","country":"Kroatien"},{"slug":"ios","name":"Ios","country":"Griechenland"},{"slug":"ischia","name":"Ischia","country":"Italien"},{"slug":"island","name":"Island","country":"Island"},{"slug":"island-nordatlantik","name":"Island Nord-Atlantik","country":"Island"},{"slug":"istanbul","name":"Istanbul & Umgebung","country":"Türkei"},{"slug":"istrien","name":"Istrien","country":"Kroatien"},{"slug":"italienische-adria","name":"Italienische Adria","country":"Italien"},{"slug":"jamaika","name":"Jamaika","country":"Jamaika"},{"slug":"japan","name":"Japan","country":"Japan"},{"slug":"johannesburg","name":"Johannesburg & Umgebung","country":"Südafrika"},{"slug":"jordanien","name":"Jordanien Amman","country":"Jordanien"},{"slug":"kairo","name":"Kairo Gizeh","country":"Ägypten"},{"slug":"kalabrien","name":"Kalabrien","country":"Italien"},{"slug":"kalifornien","name":"Kalifornien","country":"USA"},{"slug":"kalymnos","name":"Kalymnos","country":"Griechenland"},{"slug":"kanada","name":"Kanada","country":"Kanada"},{"slug":"kappadokien","name":"Kappadokien","country":"Türkei"},{"slug":"kapstadt","name":"Kapstadt & Umgebung","country":"Südafrika"},{"slug":"kapverden","name":"Kapverden","country":"Kapverden"},{"slug":"karibik","name":"Karibik","country":"Karibik"},{"slug":"katalonien","name":"Katalonien","country":"Spanien"},{"slug":"katar","name":"Katar","country":"Katar"},{"slug":"kefalonia","name":"Kefalonia","country":"Griechenland"},{"slug":"kenia-kueste","name":"Kenia Küste","country":"Kenia"},{"slug":"khao-lak","name":"Khao Lak","country":"Thailand"},{"slug":"ko-samui","name":"Ko Samui","country":"Thailand"},{"slug":"kopenhagen","name":"Kopenhagen & Umgebung","country":"Dänemark"},{"slug":"korcula","name":"Korčula","country":"Kroatien"},{"slug":"korsika","name":"Korsika","country":"Frankreich"},{"slug":"krabi","name":"Krabi & Ao Nang","country":"Thailand"},{"slug":"kuba","name":"Kuba","country":"Kuba"},{"slug":"kusadasi","name":"Kuşadası","country":"Türkei"},{"slug":"kyoto","name":"Kyoto","country":"Japan"},{"slug":"la-gomera","name":"La Gomera","country":"Spanien"},{"slug":"la-palma","name":"La Palma","country":"Spanien"},{"slug":"lefkas","name":"Lefkas","country":"Griechenland"},{"slug":"lesbos","name":"Lesbos (Mytilini)","country":"Griechenland"},{"slug":"ligurien","name":"Ligurien & Cinque Terre","country":"Italien"},{"slug":"lombok","name":"Lombok","country":"Indonesien"},{"slug":"london","name":"London & Umgebung","country":"Großbritannien"},{"slug":"luxor","name":"Luxor & Nilkreuzfahrten","country":"Ägypten"},{"slug":"madeira","name":"Madeira","country":"Portugal"},{"slug":"madrid","name":"Madrid & Umgebung","country":"Spanien"},{"slug":"makarska","name":"Makarska Riviera","country":"Kroatien"},{"slug":"malaysia","name":"Malaysia & Kuala Lumpur","country":"Malaysia"},{"slug":"malediven","name":"Malediven","country":"Malediven"},{"slug":"malta-insel","name":"Malta","country":"Malta"},{"slug":"marbella","name":"Marbella & Puerto Banús","country":"Spanien"},{"slug":"marmara-meer","name":"Marmara-Meer","country":"Türkei"},{"slug":"marsa-alam","name":"Marsa Alam","country":"Ägypten"},{"slug":"mauritius","name":"Mauritius","country":"Mauritius"},{"slug":"menorca","name":"Menorca","country":"Spanien"},{"slug":"mexiko","name":"Mexiko","country":"Mexiko"},{"slug":"milos","name":"Milos","country":"Griechenland"},{"slug":"mittelamerika","name":"Mittelamerika","country":"Mittelamerika"},{"slug":"monastir","name":"Monastir & Umgebung","country":"Tunesien"},{"slug":"murcia","name":"Murcia","country":"Spanien"},{"slug":"myanmar","name":"Myanmar (Birma)","country":"Myanmar"},{"slug":"navarra-la-rioja","name":"Navarra & La Rioja","country":"Spanien"},{"slug":"naxos","name":"Naxos","country":"Griechenland"},{"slug":"neapel","name":"Neapel & Kampanien","country":"Italien"},{"slug":"nevada","name":"Nevada","country":"USA"},{"slug":"new-york","name":"New York & New Jersey","country":"USA"},{"slug":"nord-portugal","name":"Nord-Portugal","country":"Portugal"},{"slug":"nordrhein-westfalen","name":"Nordrhein-Westfalen","country":"Deutschland"},{"slug":"nordseekueste","name":"Nordseeküste","country":"Deutschland"},{"slug":"olympische-riviera","name":"Olympische Riviera","country":"Griechenland"},{"slug":"oman","name":"Oman","country":"Oman"},{"slug":"ontario-toronto","name":"Ontario Toronto","country":"Kanada"},{"slug":"oslo","name":"Oslo & Umgebung","country":"Norwegen"},{"slug":"ostseekueste","name":"Ostseeküste","country":"Deutschland"},{"slug":"palma-de-mallorca","name":"Palma de Mallorca","country":"Spanien"},{"slug":"paros","name":"Paros","country":"Griechenland"},{"slug":"pattaya","name":"Pattaya","country":"Thailand"},{"slug":"peloponnes","name":"Peloponnes","country":"Griechenland"},{"slug":"philippinen","name":"Philippinen","country":"Philippinen"},{"slug":"porto","name":"Porto & Umgebung","country":"Portugal"},{"slug":"porto-santo","name":"Porto Santo","country":"Portugal"},{"slug":"provence","name":"Provence","country":"Frankreich"},{"slug":"puerto-plata","name":"Puerto Plata Nordküste","country":"Dominikanische Republik"},{"slug":"pula","name":"Pula & Süd-Istrien","country":"Kroatien"},{"slug":"punta-cana","name":"Punta Cana Ostküste","country":"Dominikanische Republik"},{"slug":"pyrenäen","name":"Pyrenäen","country":"Spanien"},{"slug":"ras-al-khaimah","name":"Ras al-Khaimah","country":"VAE"},{"slug":"riviera-di-romagna","name":"Riviera di Romagna","country":"Italien"},{"slug":"riviera-maya","name":"Riviera Maya & Cozumel","country":"Mexiko"},{"slug":"rovinj","name":"Rovinj","country":"Kroatien"},{"slug":"ruegen","name":"Rügen Ostsee","country":"Deutschland"},{"slug":"salzburger-land","name":"Salzburger Land","country":"Österreich"},{"slug":"samos","name":"Samos","country":"Griechenland"},{"slug":"sansibar","name":"Sansibar","country":"Tansania"},{"slug":"santorin","name":"Santorin","country":"Griechenland"},{"slug":"schottland","name":"Schottland","country":"Großbritannien"},{"slug":"schwarzwald","name":"Schwarzwald","country":"Deutschland"},{"slug":"setubal-kueste","name":"Setúbal & Troia","country":"Portugal"},{"slug":"sevilla","name":"Sevilla","country":"Spanien"},{"slug":"seychellen","name":"Seychellen","country":"Seychellen"},{"slug":"singapur","name":"Singapur","country":"Singapur"},{"slug":"sizilien","name":"Sizilien","country":"Italien"},{"slug":"skandinavien","name":"Skandinavien","country":"Skandinavien"},{"slug":"skiathos","name":"Skiathos","country":"Griechenland"},{"slug":"sofia","name":"Sofia & Umgebung","country":"Bulgarien"},{"slug":"spanische-atlantikkueste","name":"Spanische Atlantikküste","country":"Spanien"},{"slug":"sri-lanka","name":"Sri Lanka","country":"Sri Lanka"},{"slug":"st-lucia","name":"St. Lucia","country":"St. Lucia"},{"slug":"stockholm","name":"Stockholm & Umgebung","country":"Schweden"},{"slug":"suedamerika","name":"Südamerika","country":"Südamerika"},{"slug":"tessin","name":"Tessin","country":"Schweiz"},{"slug":"thailand","name":"Thailand","country":"Thailand"},{"slug":"thassos","name":"Thassos","country":"Griechenland"},{"slug":"tirol","name":"Tirol","country":"Österreich"},{"slug":"tokyo","name":"Tokyo","country":"Japan"},{"slug":"toskana","name":"Toskana Toskanische Küste","country":"Italien"},{"slug":"trogir","name":"Trogir","country":"Kroatien"},{"slug":"tuerkei-inland","name":"Türkei Inland","country":"Türkei"},{"slug":"tuerkische-aegaeis","name":"Türkische Ägäis","country":"Türkei"},{"slug":"tuerkische-riviera","name":"Türkische Riviera","country":"Türkei"},{"slug":"tuerkische-schwarzmeerkueste","name":"Türkische Schwarzmeerküste","country":"Türkei"},{"slug":"umbrien","name":"Umbrien","country":"Italien"},{"slug":"usa-golf-mexiko","name":"USA Golf von Mexiko","country":"USA"},{"slug":"usa-ostkueste","name":"USA Ostküsten-Staaten","country":"USA"},{"slug":"usa-westkueste","name":"USA Westküsten-Staaten","country":"USA"},{"slug":"usa-zentral","name":"USA Zentralstaaten","country":"USA"},{"slug":"usedom","name":"Usedom Ostsee","country":"Deutschland"},{"slug":"vae","name":"Vereinigte Arabische Emirate","country":"VAE"},{"slug":"valencia","name":"Valencia & Umgebung","country":"Spanien"},{"slug":"vietnam","name":"Vietnam","country":"Vietnam"},{"slug":"vorderer-orient","name":"Vorderer Orient","country":"Naher Osten"},{"slug":"yucatan","name":"Yucatán","country":"Mexiko"},{"slug":"zadar","name":"Zadar Nord-Dalmatien","country":"Zadar"},{"slug":"zagreb","name":"Zagreb & Umgebung","country":"Kroatien"},{"slug":"zakynthos","name":"Zakynthos","country":"Griechenland"},{"slug":"zentral-portugal","name":"Zentral-Portugal","country":"Portugal"},{"slug":"zentral-spanien","name":"Zentral-Spanien","country":"Spanien"},{"slug":"zuerich","name":"Zürich Stadt & Kanton","country":"Schweiz"},{"slug":"zypern-nord","name":"Zypern Nord","country":"Zypern"},{"slug":"zypern-sued","name":"Zypern Süd","country":"Zypern"}];

async function generateForDestination(slug, name, country) {
  const prompt = `Du bist ein erfahrener Reise-SEO-Texter für urlaubfinder365.de.

Erstelle SEO-Textblöcke für die Destination-Seite /urlaubsziele/${slug}/:
- Destination: ${name}
${country ? `- Land: ${country}` : ""}

SEITENAUFBAU (von oben nach unten):
1. seo_intro → direkt unter dem Hero-Bild
2. seo_h2_middle + seo_middle → kurzer Infoblock VOR dem Aktivitäten-Bereich
3. [Aktivitäten & Tickets Sektion]
4. seo_h2_bottom + seo_bottom → langer Reiseführer-Text GANZ UNTEN

Antworte AUSSCHLIESSLICH mit folgendem JSON:
{
  "meta_title": "Max. 58 Zeichen. KEINE Jahreszahl. Keyword '${name} Urlaub' am Anfang.",
  "meta_description": "Max. 150 Zeichen. Natürliche Sprache, destination-fokussiert. Keine Sonderzeichen wie ✓.",
  "focus_keyword": "Das meistgesuchte Keyword für dieses Ziel.",
  "keywords": "6-8 weitere Keywords nach Suchvolumen, kommagetrennt.",
  "seo_intro": "2-3 emotionale Sätze. Echte Highlights, keine Floskeln. Max. 60 Wörter.",
  "seo_h2_middle": "Kurze H2 mit Keyword, z.B. '${name} – Was dich erwartet'",
  "seo_middle": "1-2 Absätze (durch \\n\\n getrennt). Klima, beste Reisezeit, 1-2 Top-Highlights. Max. 80 Wörter.",
  "seo_h2_bottom": "H2 mit Reiseführer-Charakter.",
  "seo_bottom": "4-5 Absätze (durch \\n\\n getrennt): 1. Reisezeit & Klima, 2. Top-Sehenswürdigkeiten, 3. Aktivitäten, 4. Kulinarik, 5. Buchungstipp. 250-350 Wörter."
}

WICHTIG: Deutsch, natürlicher Lesefluss, echte Fakten, Keywords natürlich einbauen.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Kein JSON in Antwort");
  return JSON.parse(match[0]);
}

async function saveToSupabase(slug, name, country, fields) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/destination_seo_texts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE,
      "Authorization": `Bearer ${SUPABASE_SERVICE}`,
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      slug,
      name,
      country:          country ?? null,
      meta_title:       fields.meta_title       ?? null,
      meta_description: fields.meta_description ?? null,
      focus_keyword:    fields.focus_keyword    ?? null,
      keywords:         fields.keywords         ?? null,
      seo_intro:        fields.seo_intro        ?? null,
      seo_h2_middle:    fields.seo_h2_middle    ?? null,
      seo_middle:       fields.seo_middle       ?? null,
      seo_h2_bottom:    fields.seo_h2_bottom    ?? null,
      seo_bottom:       fields.seo_bottom       ?? null,
      updated_at:       new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${res.status}: ${err}`);
  }
}

async function main() {
  const total = DESTINATIONS.length;
  console.log(`\n🚀 Starte Bulk-Generierung für ${total} Destinations (claude-haiku-4-5-20251001)\n`);

  let done = 0;
  let errors = [];

  for (const dest of DESTINATIONS) {
    const { slug, name, country } = dest;
    process.stdout.write(`[${done + 1}/${total}] ${name.padEnd(35)} `);

    try {
      const fields = await generateForDestination(slug, name, country);
      await saveToSupabase(slug, name, country, fields);
      process.stdout.write(`✓\n`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stdout.write(`✗ ${msg}\n`);
      errors.push(`${name}: ${msg}`);
    }

    done++;

    // Kurze Pause (Haiku hat höhere Rate-Limits, 500ms reicht)
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✅ Fertig: ${done - errors.length}/${total} erfolgreich`);
  if (errors.length > 0) {
    console.log(`\n❌ Fehler (${errors.length}):`);
    errors.forEach(e => console.log(`  - ${e}`));
  }
}

main().catch(console.error);
