export interface HubCategory {
  title: string;
  iconFa: string;
  color: string; // full tailwind bg-class
  planningHtml: string;
  insiderHtml: string;
}

export type HubData = Record<string, HubCategory>;

// ─── TÜRKEI ────────────────────────────────────────────────────────────────
const turkeyHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Die Checkliste</h4>
          <p class="mb-3 text-sm italic">Bevor es zum Flughafen geht, sollten die Formalitäten sitzen. Die Türkei ist gastfreundlich, aber bei Dokumenten verstehen die Grenzbeamten keinen Spaß.</p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Reisedokumente:</strong> Personalausweis oder Reisepass. <span class="text-red-600 font-semibold">Wichtig:</span> Müssen bei Einreise noch mind. 6 Monate gültig sein.</li>
            <li><strong>Visum:</strong> Für touristische Reisen bis zu 90 Tagen (innerhalb von 180 Tagen) kein Visum nötig.</li>
            <li><strong>Krankenversicherung:</strong> Private Auslandskrankenversicherung ist Pflicht. Gesetzliche (EHIC) reicht oft nicht für Privatkliniken.</li>
            <li><strong>Währung:</strong> Türkische Lira (TRY) ist volatil. Euro für Notfall mitnehmen, vor Ort mit Karte oder Lira zahlen.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise: Kultur &amp; Alltag</h4>
          <p class="mb-3 text-sm">In der Türkei ist Gastfreundschaft (Misafirperverlik) heilig. Mit ein paar Kniffen fühlen Sie sich wie Einheimische.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block text-gray-900 mb-1">Geld &amp; Bezahlen</strong>
              Kontaktlos ist Standard. Auf Basaren Bargeld nutzen. <em>Tipp:</em> Am ATM immer "Abrechnung in Lira" wählen!
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block text-gray-900 mb-1">Verhalten &amp; Etikette</strong>
              <strong>Moschee:</strong> Schultern/Knie bedecken, Schuhe aus.<br/>
              <strong>Handeln:</strong> Nur auf Basaren.<br/>
              <strong>Trinkgeld:</strong> ca. 10% sind üblich.
            </div>
          </div>
          <div class="mt-3 text-sm"><strong>Mobilität:</strong> Istanbulkart für Öffis nutzen. "BiTaksi" App für Taxis (Festpreise).</div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nach der Reise: Souvenirs &amp; Zoll</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left text-gray-500 border rounded-lg">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr><th class="px-2 py-2">Kategorie</th><th class="px-2 py-2">Freimenge (DE)</th><th class="px-2 py-2">Hinweis</th></tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Warenwert</td><td class="px-2 py-2">bis 430 €</td><td class="px-2 py-2">Flug/See, ab 15 J.</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Tabak</td><td class="px-2 py-2">200 Zigaretten</td><td class="px-2 py-2">Oder 100 Zigarillos</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Alkohol</td><td class="px-2 py-2">1 Liter (&gt;22%)</td><td class="px-2 py-2">Oder 2 Liter (&lt;22%)</td></tr>
                <tr class="bg-red-50 border-b"><td class="px-2 py-2 font-bold text-red-700">Antiquitäten</td><td class="px-2 py-2 text-red-700 font-bold">VERBOTEN</td><td class="px-2 py-2 text-red-700">Keine Steine/Fossilien!</td></tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm" role="alert">
            <p class="font-bold">Wichtiger Warnhinweis</p>
            <p>Die Türkei versteht unter "Kulturgut" auch scheinbar wertlose Steine oder Tonscherben. Die Mitnahme führt zu hohen Strafen oder Haft!</p>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-lg text-indigo-900 mb-2">Einreise: Profi-Hacks</h4>
          <ul class="space-y-3 text-sm">
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>Der "6-Monate-Joker":</strong> Airlines prüfen streng. Bestehen Sie darauf: 6 Monate Restgültigkeit sind Pflicht. Unter 6 Monaten droht Beförderungsverweigerung.</li>
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>Stempel-Kontrolle (Personalausweis):</strong> Sie erhalten einen kleinen Zettel (Einreise-Papier). <span class="font-bold">Sofort abfotografieren!</span> Ohne diesen Zettel gibt es bei Ausreise massive Probleme.</li>
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>E-Gates in Istanbul (IST):</strong> Mit biometrischem Pass die E-Gates nutzen. Spart oft 30–60 Minuten Wartezeit.</li>
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>Handy (IMEI):</strong> Nach 120 Tagen werden ausländische Handys gesperrt, wenn keine Steuer gezahlt wird. Für Kurzurlaube irrelevant, aber gut zu wissen.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-lg text-amber-900 mb-2">Ausreise &amp; Zoll-Fallen</h4>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h5 class="font-bold text-red-800 text-base mb-1">Die "Stein-Falle" (Extrem wichtig!)</h5>
            <p class="text-sm text-red-700 mb-2">Niemals Steine, Fossilien oder Tonscherben mitnehmen. Auch Kieselsteine vom Strand können als "Kulturgut" gelten.</p>
            <p class="text-xs font-bold text-red-800 uppercase">Folge: Festnahme wegen Schmuggel.</p>
            <p class="text-sm italic mt-2">"Nur Fotos mitnehmen, nur Fußabdrücke hinterlassen."</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="border p-3 rounded"><strong>Tax-Free Shopping:</strong><br/>Beim Kauf "Tax-Free" Formular fordern. Am Flughafen VOR Check-in beim Zoll zeigen (Ware muss bereit sein). Geld gibt es nach Passkontrolle.</div>
            <div class="border p-3 rounded"><strong>Bargeld-Grenzen:</strong><br/>Lira max. 5.000 USD Wert.<br/>Euro/Dollar max. 10.000.<br/>Alles darüber muss bei Einreise deklariert worden sein.</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-lg text-gray-900 mb-2">Zusammenfassung: Do's &amp; Don'ts</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm border">
              <thead class="bg-gray-100"><tr><th class="p-2 text-left">Aktion</th><th class="p-2 text-left">Insider-Tipp</th></tr></thead>
              <tbody>
                <tr class="border-b"><td class="p-2 font-medium">Dokumente</td><td class="p-2">Einreise-Zettel (Perso) nie wegwerfen!</td></tr>
                <tr class="border-b"><td class="p-2 font-medium">Wartezeit</td><td class="p-2">Planen Sie am IST Airport 90 Min Weg zum Gate ein.</td></tr>
                <tr class="border-b"><td class="p-2 font-medium">Souvenirs</td><td class="p-2">Quittungen für Teppiche/Schmuck aufbewahren.</td></tr>
                <tr><td class="p-2 font-medium">Sicherheit</td><td class="p-2">Oft zwei Sicherheitskontrollen am Flughafen.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`,
  },

  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Prävention &amp; Vorbereitung</h4>
          <p class="mb-3 text-sm italic">Gute Planung ist die halbe Miete, um die Reisezeit nicht im Hotelzimmer zu verbringen.</p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Impfschutz prüfen:</strong> Für die Türkei gibt es keine Pflichtimpfungen aus DE. Empfohlen: Tetanus, Diphtherie, Hepatitis A (fast immer ratsam).</li>
            <li><strong>Auslandskrankenversicherung:</strong> Absolutes Muss. Die gesetzliche Karte (EHIC) wird in vielen Privatkliniken nicht akzeptiert.</li>
            <li><strong>Reiseapotheke:</strong> Durchfallmittel, Elektrolytpulver, Schmerzmittel, Desinfektion, hochwertiger Mückenschutz (DEET/Icaridin).</li>
            <li><strong>Zahnarztbesuch:</strong> Kurzer Check-up spart böse Überraschungen bei Hitze.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise: Schutz vor Ort</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block text-gray-900 mb-1">Lebensmittel- &amp; Wasserhygiene</strong>Regel: "Boil it, cook it, peel it or forget it".<br/><strong>Trinkwasser:</strong> Niemals Leitungswasser! Nur Flaschenwasser.<br/><strong>Eiswürfel:</strong> Vorsicht in kleinen Cafés.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block text-gray-900 mb-1">Sonnenschutz</strong>LSF 50+, Kopfbedeckung und mind. 3 Liter Wasser/Tag trinken (Schutz vor Hitzschlag).</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nach der Reise: Beobachtung</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Symptom-Check:</strong> Bei Fieber oder Durchfall Arzt aufsuchen (Hinweis auf Türkeireise geben).</li>
            <li><strong>Darmflora:</strong> Probiotika-Kur kann helfen, das Gleichgewicht wiederherzustellen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Insider-Gesundheitstipps (Speziell Türkei)</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Das "Ayran-Geheimnis":</strong> Bei starker Hitze ist Ayran effektiver als Wasser. Es füllt verlorene Elektrolyte auf und beruhigt den Magen.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Die "Eczane" (Apotheke):</strong> Rotes "E"-Schild. Türkische Apotheker beraten hervorragend und dürfen oft direkt Medikamente ausgeben.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Vorsicht bei Straßenkatzen &amp; -hunden:</strong> Türkei ist kein tollwutfreies Land. Bei Biss/Kratzer sofort zum Arzt.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Hammam-Etikette:</strong> Darauf achten, dass der "Kese" (Peeling-Handschuh) neu und originalverpackt ist.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Klimaanlagen-Falle:</strong> Temperatursturz (40°C auf 18°C) führt zu Sommergrippe. Nie direkt anblasen lassen, im Bus Halstuch tragen.</li>
        </ul>
      </div>`,
  },

  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Planung &amp; Buchung</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Rechtzeitig buchen:</strong> Lizenzierte Anbieter sind schneller ausgebucht. Mind. 2 Wochen im Voraus.</li>
            <li><strong>Preise vergleichen:</strong> Privattransfer Antalya–Side: ca. 60–80 €.</li>
            <li><strong>Flugnummer ist Pflicht:</strong> Professionelle Anbieter tracken Verspätungen und warten kostenlos.</li>
            <li><strong>Kindersitze:</strong> Müssen bei Buchung explizit angefordert werden.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise: Ankunft &amp; Fahrt</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block text-gray-900 mb-1">Der Treffpunkt</strong>An großen Airports (IST, AYT) warten Fahrer an nummerierten Meeting-Points oder Säulen draußen.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block text-gray-900 mb-1">Identifikation &amp; Schlepper</strong>Ein seriöser Fahrer kennt Ihren Namen und das Hotel. Er verhandelt nie vor Ort nach.</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nach der Reise: Der Rücktransfer</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Pufferzeit:</strong> Abholung meist 3,5–4 Std. vor Abflug (wegen 2 Sicherheitskontrollen).</li>
            <li><strong>Erreichbarkeit:</strong> Am Vorabend Nachrichten (WhatsApp/Mail) prüfen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Insider-Tipps: Transfer-Hacks 2026</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Die "IST-Wanderung":</strong> Der Flughafen Istanbul ist riesig. Vom Flieger bis zum Transfer oft 20–30 Min. Fußweg. Bequeme Schuhe ins Handgepäck!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>App-Geheimtipp:</strong> "CipTaxi" oder "BiTaksi" sind 2026 die sicherste Wahl (Festpreise, keine Umwege).</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>VIP-Vans vs. PKW:</strong> Preisunterschied oft minimal (10–15 €). Lohnt sich für Komfort und getrennte Klimaanlage.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Mautgebühren:</strong> Vorab klären, ob Brücken/Tunnel im Preis inklusive sind.</li>
        </ul>
      </div>`,
  },

  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Die richtige Strategie</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Bankkarten prüfen:</strong> Viele Banken nutzen Geo-Blocking – Karte für die Türkei freischalten lassen.</li>
            <li><strong>Reisekreditkarten</strong> (DKB, Barclays, Revolut) sind oft gebührenfrei.</li>
            <li><strong>Bargeld-Mix:</strong> Kleiner Vorrat an Euro-Scheinen als Notfallreserve.</li>
            <li><span class="text-red-600 font-bold">Wichtig:</span> Niemals Lira in Deutschland tauschen! Die Kurse sind extrem schlecht.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise: Bezahlen wie ein Profi</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block text-gray-900 mb-1">Geld wechseln &amp; Abheben</strong>Nutzen Sie "Döviz" (Wechselstuben, gelbe Schilder). Flughafen/Hotel bis zu 20% schlechter.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block text-gray-900 mb-1">Euro vs. Lira</strong>Auch wenn Euro angenommen wird: <strong>Immer in Lira zahlen.</strong> Händler-Wechselkurse sind meist deutlich schlechter.</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nach der Reise: Resteverwertung</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Lira ausgeben:</strong> Am Flughafen (Duty-Free, Snacks) verbrauchen.</li>
            <li><strong>Rücktausch:</strong> In DE oft unmöglich oder mit massiven Verlusten.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Insider-Tipps: Die Finanz-Fallen 2026</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
            <strong class="text-indigo-900 block mb-1">1. Die "DCC-Taste" (Wichtig!)</strong>
            Wenn das Terminal fragt "Euro oder Lira?": <strong>Wählen Sie IMMER Lira (TRY).</strong><br/>
            <em>Warum:</em> Die Umrechnung durch die türkische Bank ist 5–10% schlechter. Ein falscher Klick kostet bei 500€ schnell 40€ extra.
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong class="text-indigo-900 block mb-1">2. Die "Münz-Falle" beim Trinkgeld</strong>Geben Sie keine Euro-Münzen. Trinkgeld (Bahşiş) in Lira-Scheinen oder 5€-Scheinen geben.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong class="text-indigo-900 block mb-1">3. Handeln wie ein Einheimischer</strong>Auf dem Basar ist Feilschen Pflicht. Starten Sie bei 50–60% des geforderten Preises.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong class="text-red-800 block mb-1">4. Das Taxi-Wechselgeld (Trick)</strong>Fahrer tauschen manchmal Scheine aus. Nennen Sie laut den Betrag: "Hier sind 200 Lira."</li>
        </ul>
      </div>`,
  },

  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Die "Digitale Impfung"</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Das Roaming-Problem:</strong> Türkei liegt in der teuren "Zone 2" oder "Zone 3". Empfohlen: eSIM (z. B. Airalo, Holafly) oder lokale SIM-Karte.</li>
            <li><strong>Adapter-Check:</strong> Typen C und F (wie in DE). Kein Adapter nötig.</li>
            <li><strong>VPN installieren:</strong> Manche Webseiten (z.B. Booking.com) sind gesperrt.</li>
            <li><strong>Offline-Karten:</strong> Google Maps Ausschnitt herunterladen spart Datenvolumen.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise: Nutzung &amp; Schutz</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Der "Flugmodus-Trick"</strong>Sofort bei Landung Roaming aus! Erst mit eSIM/WLAN online gehen.</div>
            <div class="bg-red-50 p-3 rounded border border-red-100"><strong class="text-red-800">Hitzeschutz:</strong> Nie in direkter Sonne liegen lassen. Helle Hülle oder Handtuch nutzen.</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nach der Reise: Datensicherheit</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li>Deutsche SIM wieder einlegen / Reiseprofil deaktivieren.</li>
            <li>Ladebuchse von Sand/Salz reinigen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Insider-Tipps: Technik-Hacks für die Türkei</h4>
        <ul class="space-y-4 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
            <strong class="text-indigo-900 block mb-1">1. Das "Booking.com-Paradoxon"</strong>
            Booking.com ist innerhalb der Türkei für türkische Hotels gesperrt.<br/>
            <em>Hack:</em> Vor Einreise buchen oder VPN nutzen (Standort DE). Alternativ: Agoda/Hotels.com.
          </li>
          <li class="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
            <strong class="text-red-900 block mb-1">2. Drohnen sind ein No-Go</strong>
            Ohne komplizierte Genehmigung wird die Drohne am Zoll beschlagnahmt.
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong class="text-indigo-900 block mb-1">3. Powerbanks im Handgepäck</strong>MÜSSEN ins Handgepäck. Im Koffer werden sie entfernt. Limit: meist 100 Wh.</li>
          <li class="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
            <strong class="text-green-900 block mb-1">🔌 Strom: Brauche ich einen Adapter?</strong>
            <strong>Kein Adapter nötig:</strong> Typ F (Schuko) und Typ C (Euro) wie in DE/AT. 220 Volt.
          </li>
        </ul>
      </div>`,
  },

  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Vor der Reise</h4>
          <ul class="list-disc pl-5 space-y-1"><li>In Krisenvorsorgeliste (ELEFAND) eintragen.</li><li>Botschaftsadressen notieren.</li></ul>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Während der Reise</h4>
          <ul class="list-disc pl-5 space-y-1"><li>Menschenmengen meiden bei Veranstaltungen.</li><li>Touristenpolizei spricht oft Englisch/Deutsch.</li></ul>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <strong>Notrufnummern:</strong><br/>112 – Krankenwagen &amp; Feuerwehr<br/>155 – Polizei<br/>156 – Küstenwache
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Notrufnummern &amp; Tipps</strong>
        <ul class="list-disc pl-5 space-y-1">
          <li>112 für Krankenwagen</li>
          <li>155 für Polizei</li>
          <li>Die Touristenpolizei spricht oft Englisch oder Deutsch.</li>
          <li>Dokumente (Pass-Kopie) getrennt aufbewahren.</li>
        </ul>
      </div>`,
  },

  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Wissenswertes</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>Ein "Merhaba" (Hallo) öffnet viele Türen.</li>
            <li><strong>Moschee:</strong> Schultern &amp; Knie bedecken, Schuhe ausziehen.</li>
            <li><strong>Handeln:</strong> Nur auf Basaren und in Souvenirläden üblich.</li>
            <li>Gastfreundschaft (Misafirperverlik) ist ein wichtiger Wert.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Gastfreundschaft auf Türkisch</strong>
        <p>Eine Einladung zum Tee ("Çay") ist eine Geste der Freundschaft. Sie abzulehnen gilt als unhöflich. Ein kleines Glas geht immer!</p>
        <p class="mt-2">Tipp: Lernen Sie "Teşekkür ederim" (Danke schön) – erntet immer ein Lächeln.</p>
      </div>`,
  },

  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Kulinarische Highlights</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Baklava, Meze</strong> und frischen Fisch unbedingt probieren.</li>
            <li><strong>Döner:</strong> Der türkische Döner schmeckt ganz anders – viel besser!</li>
            <li><strong>Frühstück:</strong> Türkisches Frühstück (Kahvaltı) ist ein Erlebnis.</li>
            <li><strong>Tee &amp; Gewürze</strong> als Souvenirs mit nach Hause nehmen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block text-sand-900 mb-2">Essen wie Einheimische</strong>
        <p>Meiden Sie die Touristen-Restaurants mit Fotos auf der Karte. Essen Sie in "Esnaf Lokantası" (Arbeiter-Kantinen). Das ist das beste, authentischste und günstigste Essen.</p>
        <p class="mt-2"><strong>Tipp:</strong> Fragen Sie im Hotel nach einem lokalen Lokal in der Nähe. Das Personal isst dort selbst.</p>
      </div>`,
  },

  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung vor Ort</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>BiTaksi oder Uber App</strong> vor Reiseantritt installieren.</li>
            <li><strong>Dolmuş</strong> (Sammeltaxis) für kurze Strecken – sehr günstig.</li>
            <li><strong>Mietwagen:</strong> Internationaler Führerschein empfohlen. Verkehr in Städten chaotisch.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Dolmuş fahren wie ein Profi</strong>
        <p>Im Sammeltaxi gibt es keine festen Haltestellen. Rufen Sie einfach "İnecek var" (Jemand will aussteigen) laut durch den Bus.</p>
        <p class="mt-2">Preis: Meist 1–3 € pro Strecke. Immer in Lira bezahlen.</p>
      </div>`,
  },

  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Reisezeit &amp; Tipps</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Beste Reisezeit:</strong> Mai–Juni und September–Oktober (angenehme Temperaturen, weniger Trubel).</li>
            <li><strong>Hauptsaison:</strong> Juli–August (heiß, voll, teurer).</li>
            <li><strong>Frühbucher-Rabatte:</strong> 4–6 Monate vorab buchen für beste Preise.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Kultur-Trips: Museums-Pass</strong>
        <p>Wenn Sie Istanbul oder antike Stätten (Ephesus, Troja) besuchen, lohnt sich der "Museums-Pass" schon ab dem dritten Museum – und Sie überspringen die Warteschlange.</p>
        <p class="mt-2"><strong>Tipp:</strong> Ramadan-Zeit meiden, falls Nachtleben und Gastronomie wichtig sind.</p>
      </div>`,
  },
};

// ─── SPANIEN ────────────────────────────────────────────────────────────────
const spainHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Dokumente & Formalitäten</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Reisedokumente:</strong> Als EU-Bürger reicht der Personalausweis. Reisepass ist empfehlenswert für Ausflüge nach Marokko (Fähre von Tarifa/Algeciras).</li>
            <li><strong>Kein Visum:</strong> Spanien ist Schengen-Land – volle EU-Freizügigkeit.</li>
            <li><strong>Krankenversicherung:</strong> EHIC (Europäische Krankenversicherungskarte) gilt in Spanien. Trotzdem: private Auslandskrankenversicherung empfohlen für Rückholflug.</li>
            <li><strong>Mietwagen:</strong> EU-Führerschein wird anerkannt. Internationaler Führerschein ist nicht nötig.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise: Alltag & Kultur</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Siesta-Zeiten</strong>Viele Geschäfte 14–17 Uhr geschlossen. Supermärkte und Malls oft durchgehend geöffnet.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Essenszeiten</strong>Mittagessen: 14–16 Uhr. Abendessen: ab 21 Uhr. Restaurants vorher oft leer.</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Kanaren & Balearen: Besonderheiten</h4>
          <div class="bg-blue-50 p-3 rounded text-sm">
            <strong>Kanaren:</strong> Außerhalb der EU-Zollunion! Zollfreie Einkäufe erlaubt (430 € Grenze gilt). Zigaretten & Alkohol deutlich günstiger.<br/>
            <strong>Balearen (Mallorca, Ibiza):</strong> Normales EU-Zollrecht. Keine Sonderregeln.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Spanien-Insider</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Kanaren-Steuerparadies:</strong> Auf den Kanaren gilt kein europäischer MWST-Satz (7% IGIC statt 21%). Elektronik, Parfüm und Markenklamotten kaufen!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Ibiza-Einreise im Sommer:</strong> Fähren von der Festland (Valencia/Barcelona) im Juli/August Wochen im Voraus ausgebucht. Frühzeitig buchen!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Touristen-Steuer (Mallorca/Ibiza):</strong> Balearen erheben Eco-Tax: 0,25–4 €/Nacht je nach Hotel-Kategorie. Wird vor Ort in bar gezahlt.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Alkohol-Verbote Mallorca:</strong> Im Ballermann-Bereich (Playa de Palma, Magaluf) gilt seit 2020 ein Ballermann-Gesetz: kein Alkohol-Rundum-Service, keine offenen Balkone mit Alkohol.</li>
        </ul>
      </div>`,
  },
  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Vor der Reise</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>EHIC-Karte mitnehmen (Rückseite der Krankenkassenkarte).</li>
            <li>Spanien ist gesundheitlich sicher – keine Impfpflichten.</li>
            <li>Reiseapotheke: Sonnenschutz LSF 50+, Mückenschutz (Abends auf Mallorca/Kanaren), Magentabletten.</li>
          </ul>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Während der Reise</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Hitzschlag:</strong> Im August oft 40°C+ im Inland. Zwischen 12–16 Uhr Schatten suchen.</li>
            <li><strong>Jellyfish (Mallorca/Ibiza):</strong> Im Spätsommer können Quallen auftreten. Bei Strand-Roten-Fahnen-Warnung vorsichtig sein.</li>
            <li><strong>Apotheke (Farmacia):</strong> Grünes Kreuz-Schild. Sehr kompetent, viele Medikamente rezeptfrei.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-green-50 p-4 rounded text-sm">
        <h4 class="font-bold text-green-900 mb-2">Gesundheits-Hacks Spanien</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Urgencias vs. Ambulatorio:</strong> Für echte Notfälle → Urgencias im Krankenhaus. Für leichte Beschwerden → Ambulatorio (deutlich schneller).</li>
          <li><strong>112 = Europäischer Notruf</strong> – auf Spanisch: "Necesito una ambulancia".</li>
          <li><strong>Sonnenbrand-Falle Kanaren:</strong> Der Atlantik-Wind kühlt – man merkt den Sonnenbrand erst abends. LSF auch bei bewölktem Himmel auftragen!</li>
        </ul>
      </div>`,
  },
  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Mallorca (PMI)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Bus EMT Linie 1: Flughafen → Zentrum Palma (ca. 30 Min, 2 €).</li>
            <li>Taxi: Flughafen → Playa de Palma ca. 25–30 €. Festpreis-Taxis am Ausgang.</li>
            <li>Mietwagen: Am Flughafen große Auswahl. Im Sommer: unbedingt vorbuchen!</li>
          </ul>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Teneriffa (TFS/TFN)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>TFS (Süd-Airport) → Playa de las Américas: Taxi ca. 15 €, Bus ca. 1,65 €.</li>
            <li>TFN (Nord-Airport) → Santa Cruz: Bus direkt, ca. 40 Min.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-blue-50 p-4 rounded text-sm">
        <h4 class="font-bold text-blue-900 mb-2">Transfer-Geheimtipps</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Mallorca-Bus-Trick:</strong> TIB-Busse (Inselbusse) sind günstig und pünktlich. App "TIB" lädt Fahrpläne offline.</li>
          <li><strong>Barcelona:</strong> Aerobús vom Flughafen → Plaça Catalunya (ca. 35 Min, 6,75 €) ist schneller als Metro.</li>
          <li><strong>Ibiza im Sommer:</strong> Taxis extrem knapp – Transfer vorbuchen oder App "myTaxi" nutzen.</li>
        </ul>
      </div>`,
  },
  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Bezahlen in Spanien</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Währung:</strong> Euro – kein Wechseln nötig.</li>
            <li><strong>Kartenzahlung:</strong> Fast überall akzeptiert, auch Kleinbeträge. Kontaktlos Standard.</li>
            <li><strong>Bargeld:</strong> Für Märkte, Strandbars und kleine Läden hilfreich. ATMs überall.</li>
            <li><strong>Trinkgeld:</strong> Nicht obligatorisch aber willkommen – ca. 5–10% im Restaurant, Kleingeld bei Tapas-Bar.</li>
          </ul>
        </div>
        <div class="bg-yellow-50 p-3 rounded">
          <strong>Preisniveau:</strong> Barcelona und Ibiza sind teuer (vergleichbar mit deutschen Großstädten). Mallorca Inland und Kanaren günstiger.
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-yellow-50 p-4 rounded text-sm">
        <h4 class="font-bold text-yellow-900 mb-2">Geld sparen in Spanien</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Menú del día:</strong> Mittagsmenü (Vorspeise + Hauptgang + Dessert + Getränk) für 10–15 € – das beste Preis-Leistungs-Verhältnis!</li>
          <li><strong>Supermärkte Mercadona/DIA:</strong> Günstigste Lebensmittel. Für Selbstversorger ideal.</li>
          <li><strong>Ibiza Getränkepreise:</strong> Im Club bis 20 € pro Drink. Vorglühen (Pre-party) im Supermarkt ist üblich.</li>
        </ul>
      </div>`,
  },
  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Konnektivität</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Roaming:</strong> Gilt in Spanien – deutsche SIM ohne Aufpreis nutzbar.</li>
            <li><strong>WLAN:</strong> In Hotels, Restaurants und Bars flächendeckend verfügbar.</li>
            <li><strong>Steckdosen:</strong> Typ C und F (Schuko) wie in Deutschland – kein Adapter nötig. 230 Volt.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <h4 class="font-bold text-indigo-900 mb-2">Tech-Tipps</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Kanaren-Roaming-Falle:</strong> EU-Roaming gilt, aber manche Anbieter berechnen Extra-Gebühren. Vorher beim Provider checken!</li>
          <li><strong>App-Empfehlungen:</strong> "Cabify" (Ridesharing), "TIB" (Mallorca-Busse), "Renfe" (Züge auf dem Festland).</li>
          <li><strong>Offline-Karten:</strong> Maps.me oder Google Maps Bereich herunterladen – spart Roaming-Volumen auf Ausflügen.</li>
        </ul>
      </div>`,
  },
  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Sicherheitslage</h4>
          <p class="mb-2">Spanien ist generell sicher. Hauptproblem: Taschendiebstahl in Touristenzonen.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Barcelona:</strong> Las Ramblas, Metro-Stationen und überfüllte Strände sind Hotspots für Taschendiebe. Wertsachen im Hotel lassen.</li>
            <li><strong>Notruf:</strong> 112 (europaweit), 091 (Nationalpolizei), 062 (Guardia Civil).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Insider</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li>Kreuzgurt-Tasche oder Bauchtasche unter dem Shirt sind die beste Absicherung.</li>
          <li>Auf Mallorca und Kanaren ist die Sicherheitslage deutlich entspannter als in Barcelona.</li>
          <li>Mietwagen NIE mit Wertsachen stehen lassen – Aufbrüche sind häufig.</li>
        </ul>
      </div>`,
  },
  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Spanische Lebensart</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Fiesta-Kalender:</strong> Lokale Feste (Fiestas) fast jedes Wochenende. Oft kostenlos, immer unvergesslich.</li>
            <li><strong>Sprache:</strong> "Gracias" und "Por favor" werden sehr geschätzt. In Katalonien auch Katalanisch gängig.</li>
            <li><strong>Kleidung:</strong> In Kirchen Schultern und Knie bedecken.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how</strong>
        <p>Spanier begrüßen sich mit zwei Wangenküssen (besos) – auch Fremde. Kurze Unsicherheit ist normal!</p>
        <p class="mt-2"><strong>La Tomatina (Buñol, August):</strong> Das weltberühmte Tomatenwurf-Festival. Tickets begrenzt – Monate im Voraus buchen.</p>
      </div>`,
  },
  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Spanische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Tapas:</strong> Kleine Gerichte zum Teilen. In manchen Bars kostenlos zur Bestellung dazu.</li>
            <li><strong>Paella:</strong> Original aus Valencia. Die beste Paella ist nicht am Strand, sondern inland.</li>
            <li><strong>Jamón Ibérico:</strong> Das beste Souvenir – am Markt kaufen, vakuumverpackt problemlos im Handgepäck.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Essen wie Einheimische</strong>
        <p><strong>Bar de Tapas:</strong> Früh morgens einen "Cortado" (kleiner Espresso mit Milch) und eine "Tostada con tomate" (Toast mit Tomaten-Olivenöl) – das echte spanische Frühstück für unter 3 €.</p>
        <p class="mt-2"><strong>Mercado-Geheimtipp:</strong> Lokale Märkte (Mercat de la Boqueria in Barcelona, Mercat de l'Olivar in Palma) für frische Produkte und authentische Atmosphäre.</p>
      </div>`,
  },
  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Mallorca:</strong> Mietwagen ideal für Insel-Erkundung. Straßen gut ausgebaut.</li>
            <li><strong>Barcelona:</strong> Metro ist effizient und günstig (T-Casual 10er-Karte für ca. 12 €).</li>
            <li><strong>Kanaren:</strong> Mietwagen empfohlen, Bus-Netz auf Teneriffa und Gran Canaria gut ausgebaut.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Hacks</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Mallorca-Zug:</strong> Historische Schmalspurbahn Palma → Sóller (1912!) – touristisches Highlight für 30 € Hin/Rück.</li>
          <li><strong>Barcelona Bicing:</strong> Leihräder sind günstig für Kurztrips. App "Bicing" nutzen.</li>
          <li><strong>Fähren Balearen:</strong> Balearia und Trasmediterranea für Fahrten zwischen den Inseln.</li>
        </ul>
      </div>`,
  },
  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Beste Reisezeit</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Mallorca/Ibiza:</strong> Mai–Juni und September–Oktober (angenehm, weniger voll).</li>
            <li><strong>Kanaren (Teneriffa, Gran Canaria):</strong> Ganzjährig reisbar – Frühling und Herbst ideal.</li>
            <li><strong>Barcelona:</strong> April–Juni und September–Oktober (kein extremes Sommerchaos).</li>
            <li><strong>Hauptsaison Juli/August:</strong> Heißer, teurer, voller – aber Strandwetter perfekt.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Tipps</strong>
        <p><strong>Frühbucher Mallorca:</strong> Direktflüge von deutschen Flughäfen bereits ab November buchbar – oft 40–60 % günstiger als Spontankauf.</p>
        <p class="mt-2"><strong>Kanaren im Winter:</strong> Perfektes Winterreiseziel (20–23°C). Günstigste Flugpreise im Januar/Februar.</p>
      </div>`,
  },
};

// ─── GRIECHENLAND ───────────────────────────────────────────────────────────
const greeceHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Dokumente</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>EU-Bürger:</strong> Personalausweis oder Reisepass genügt. Schengen-Land, kein Visum.</li>
            <li><strong>Gültigkeitsdauer:</strong> Griechenland akzeptiert bei den meisten Inseln Personalausweis – Reisepass trotzdem empfohlen.</li>
            <li><strong>Krankenversicherung:</strong> EHIC gilt. Zusätzliche Auslandskrankenversicherung empfohlen (Hubschrauber-Transfer von Inseln ist teuer!).</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Inseln & Fährverkehr</h4>
          <div class="bg-blue-50 p-3 rounded text-sm">
            Griechische Inseln sind teils nur per Fähre oder Inlandsflug erreichbar. Fährtickets im Sommer <strong>Wochen im Voraus</strong> buchen (besonders Santorini, Mykonos, Kreta)!
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-3 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Griechenland-Insider</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Fährbuchung:</strong> ferryscanner.com oder directferries.de für Vergleiche. Tickets mit zugewiesenem Sitz wählen – Deck-Reisen im Sommer bei 40°C kaum auszuhalten.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Kreta-Einreise:</strong> Heraklion (HER) und Chania (CHQ) haben beide internationale Flughäfen. Je nach Hotel günstigen Airport wählen.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Waldbrand-Saison:</strong> Juli–August erhöhtes Waldbrand-Risiko. Reisewarnungen des Auswärtigen Amts vor Reiseantritt checken.</li>
        </ul>
      </div>`,
  },
  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Gesundheitsvorsorge</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>Keine Impfpflichten. Routineimpfungen (Tetanus, Hepatitis A) empfohlen.</li>
            <li><strong>Hitze:</strong> Im Sommer bis 45°C möglich (Rekordwerte Athen). Ausreichend Wasser trinken.</li>
            <li><strong>Mücken:</strong> Abends auf Inseln mit Landwirtschaft (Kreta, Korfu) lästig. DEET-Spray mitnehmen.</li>
          </ul>
        </div>
        <div class="bg-yellow-50 p-3 rounded text-sm">
          <strong>Seeigel-Gefahr:</strong> Auf Felsen an Stränden ohne Sandstrand. Badeschuhe tragen! Bei Verletzung: Nadeln mit Öl und Pinzette entfernen oder zum Arzt.
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-green-50 p-4 rounded text-sm">
        <h4 class="font-bold text-green-900 mb-2">Gesundheits-Insider Griechenland</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Inselkrankenhaus:</strong> Qualität stark variiert. Gute Kliniken auf Kreta (Heraklion) und Rhodos. Auf kleinen Inseln nur Erstversorgung möglich – Evakuierung per Hubschrauber nötig.</li>
          <li><strong>Wasser:</strong> Leitungswasser auf Santorini und Mykonos ist Meerwasser (entsalzt) – <strong>nicht</strong> zum Trinken geeignet. Nur Flaschenwasser!</li>
          <li><strong>Apotheke:</strong> "Φαρμακείο" – grünes Kreuz. In Touristenzentren oft Englisch gesprochen.</li>
        </ul>
      </div>`,
  },
  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Kreta (HER / CHQ)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Heraklion → Zentrum: Bus (Nr. 1) für 1,50 € oder Taxi ca. 15 €.</li>
            <li>Chania → Zentrum: Bus ca. 2,50 €, Taxi ca. 30 €.</li>
            <li>Mietwagen: Unbedingt empfohlen für Kreta-Erkundung!</li>
          </ul>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Santorini (JTR) / Rhodos (RHO)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Santorini: Kein öffentlicher Bus ab Flughafen ins Zentrum. Taxi (teuer!) oder Transfer vorbuchen.</li>
            <li>Rhodos: Bus-Knotenpunkt KTEL im Zentrum. Taxi: Flughafen → Rhodos-Stadt ca. 25 €.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-blue-50 p-4 rounded text-sm">
        <h4 class="font-bold text-blue-900 mb-2">Transfer-Geheimtipps</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Santorini-Taxi-Mangel:</strong> Im Sommer extrem wenige Taxis. Transfer immer vorbuchen oder ATV-Roller mieten (20–30 €/Tag).</li>
          <li><strong>Kreta Bus KTEL:</strong> Günstigstes Transportmittel. Fahrplan auf e-ktel.com einsehen.</li>
          <li><strong>Athen Metro:</strong> Direkte Metro-Linie 3 vom Flughafen ins Zentrum (ca. 40 Min, 9 €). Sehr empfehlenswert.</li>
        </ul>
      </div>`,
  },
  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Geld in Griechenland</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Währung:</strong> Euro. Kein Wechseln nötig.</li>
            <li><strong>Bargeld wichtig:</strong> Kleine Tavernen und Strandbars oft nur Bargeld. Immer Scheine dabeihaben.</li>
            <li><strong>ATMs:</strong> Überall – aber auf Kleininseln begrenzt. Vor Inselfähre genug Bargeld abheben!</li>
            <li><strong>Trinkgeld:</strong> Ca. 10% in Restaurants üblich, Kleingeld aufrunden.</li>
          </ul>
        </div>
        <div class="bg-yellow-50 p-3 rounded text-sm">
          <strong>Preisniveau:</strong> Santorini und Mykonos sind teuer (Paris-Niveau!). Kreta, Rhodos und weniger bekannte Inseln deutlich günstiger.
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-yellow-50 p-4 rounded text-sm">
        <h4 class="font-bold text-yellow-900 mb-2">Sparfuchs-Tipps</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Mykonos/Santorini Restaurants:</strong> Abseits der Hauptgassen bis 50% günstiger. 2–3 Straßen vom Touristenzentrum weg = lokale Preise.</li>
          <li><strong>Gratis Eintritt Museeen:</strong> Erste Sonntage im Monat (Oktober–März) sind viele griechischen Museen kostenlos.</li>
          <li><strong>Wasser kaufen:</strong> 1,5L Flasche im Supermarkt 0,50 €, in Touristenzonen bis 5 €. Vorrat anlegen!</li>
        </ul>
      </div>`,
  },
  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Verbindung auf Inseln</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Roaming gilt</strong> – deutsche SIM funktioniert ohne Aufpreis.</li>
            <li><strong>WLAN:</strong> In Hotels und Restaurants gut. Auf Strand-Bars und Fähren oft langsam oder kostenpflichtig.</li>
            <li><strong>Netzabdeckung Kleininseln:</strong> Auf sehr kleinen Inseln (unter 1000 Einwohner) kann das Mobilnetz dünn sein.</li>
            <li><strong>Steckdosen:</strong> Typ C und F wie in Deutschland – kein Adapter nötig.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <h4 class="font-bold text-indigo-900 mb-2">Tech auf Griechisch</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Offline-Karten Pflicht:</strong> Auf Mietfahrzeugen (ATV/Mopeds) auf Santorini gibt es keine GPS-Geräte. Google Maps Offline vorab laden!</li>
          <li><strong>Fähren-App:</strong> "Ferryscanner" oder "Openseas" App für Echtzeit-Verbindungen und Tickets.</li>
          <li><strong>Powerbank:</strong> Strandurlauber brauchen sie – an Strandliegen gibt es keine Steckdosen.</li>
        </ul>
      </div>`,
  },
  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Sicherheitslage</h4>
          <p class="mb-2">Griechenland ist sehr sicher für Touristen. Gewaltkriminalität extrem selten.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Taschendiebstahl:</strong> Athener Metro und Touristenzonen (Akropolis-Umgebung) sind Hotspots.</li>
            <li><strong>Verkehr:</strong> Griechische Fahrweise ist wild – als Fußgänger und Radfahrer sehr vorsichtig sein.</li>
            <li><strong>Notruf:</strong> 112 / 100 (Polizei) / 166 (Krankenwagen).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Tipps</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Moped/ATV-Unfälle:</strong> Häufigste Touristenunfälle! Nie ohne Helm fahren, Versicherungsschutz prüfen.</li>
          <li><strong>Verlorene Dokumente:</strong> Deutsche Botschaft Athen: +30 210 728 5111. Auf Inseln: nächste Polizeistation (Astynomia).</li>
        </ul>
      </div>`,
  },
  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Griechische Lebensart</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Kafenion:</strong> Traditionelles griechisches Café – Treffpunkt der Einheimischen. Griechischer Kaffee (nicht Espresso!) trinken.</li>
            <li><strong>Orthodoxe Kirchen:</strong> Schultern und Knie bedecken. Stille und Respekt.</li>
            <li><strong>Kefi:</strong> Griechisches Lebensgefühl der Freude. Griechen feiern laut und herzlich – mitmachen!</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how</strong>
        <p><strong>"Opa!"</strong> ist kein Klischee – bei Festen werden echte Teller geworfen (oder heutzutage Blumen). Mitmachen ist ausdrücklich erwünscht!</p>
        <p class="mt-2"><strong>Akropolis früh morgens:</strong> Einlass ab 8 Uhr. Im Sommer schon um 9 Uhr überfüllt und 40°C heiß. Frühaufsteher haben die Stätte fast für sich.</p>
      </div>`,
  },
  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Griechische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Must-Eat:</strong> Moussaka, Souvlaki, Gyros (im Fladenbrot), frischer Fisch am Hafen, Spanakopita (Spinatpie).</li>
            <li><strong>Frühstück:</strong> Griechischer Joghurt mit Honig und Walnüssen – am besten im lokalen Café.</li>
            <li><strong>Ouzo:</strong> Anisschnaps – traditionell mit Mezedes (kleine Gerichte) genießen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Essen wie Einheimische</strong>
        <p><strong>Taverna vs. Restaurant:</strong> "Taverna" (auch: Estiatorio) mit handgeschriebener Tageskarte = frisch und günstig. Gedruckte Hochglanz-Speisekarte mit Fotos = Touristenfalle.</p>
        <p class="mt-2"><strong>Fisch kaufen:</strong> Am Hafen direkt vom Fischer morgens früh. "Psaria" heißt Fisch auf Griechisch.</p>
      </div>`,
  },
  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Kreta:</strong> Mietwagen unbedingt empfohlen. KTEL-Busse für Hauptrouten gut.</li>
            <li><strong>Santorini:</strong> ATV-Roller oder Quad (20–30 €/Tag) für kleine Insel ideal. Bus oft überfüllt.</li>
            <li><strong>Athen:</strong> Metro sehr gut. Tram zum Strand (Glyfada) empfohlen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Hacks</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Esel in Santorini:</strong> Nicht empfohlen aus Tierschutzgründen. Seilbahn (Fira) oder zu Fuß die 588 Stufen hoch.</li>
          <li><strong>Fähren zwischen Inseln:</strong> High-Speed-Fähren (Seajet, Hellenic Seaways) 2× schneller aber 2× teurer.</li>
          <li><strong>Mietwagen Kreta:</strong> Lokale Anbieter (z.B. "Auto Avance") oft günstiger als internationale Ketten.</li>
        </ul>
      </div>`,
  },
  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Beste Reisezeit</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Mai–Juni:</strong> Perfekt. Warm (25–30°C), noch nicht überfüllt.</li>
            <li><strong>September–Oktober:</strong> Top-Zeit! Meerwasser noch warm (24°C), Massen sind weg.</li>
            <li><strong>Juli–August:</strong> Heiß (35–40°C), Meltemi-Wind auf Kykladen-Inseln. Sehr voll.</li>
            <li><strong>Winter:</strong> Nur Kreta ganzjährig angenehm. Inseln schließen November–März weitgehend.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Geheimtipps</strong>
        <p><strong>Santorini Sonnenuntergang:</strong> Der Oia-Sonnenuntergang ist weltberühmt – aber mit 500 anderen Touristen. Alternativ: vom Akrotiri-Leuchtturm aus (fast menschenleer, gleiche Kulisse).</p>
        <p class="mt-2"><strong>Kreta im Oktober:</strong> Olivenernte-Saison. Überall frisches Olivenöl probieren und kaufen!</p>
      </div>`,
  },
};

// ─── ÄGYPTEN ────────────────────────────────────────────────────────────────
const egyptHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Visum & Einreise</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Visum erforderlich!</strong> Deutsche Staatsbürger benötigen ein Visum für Ägypten.</li>
            <li><strong>E-Visa:</strong> Online beantragen auf visa2egypt.gov.eg (25 USD). Empfehlenswert!</li>
            <li><strong>Visum bei Einreise:</strong> Am Flughafen für 25 USD erhältlich. Lange Schlangen – E-Visa ist besser.</li>
            <li><strong>Reisepass:</strong> Mind. 6 Monate gültig ab Einreisedatum. Personalausweis reicht NICHT.</li>
            <li><strong>Sinai-only Stempel:</strong> Wer nur nach Sharm el-Sheikh fliegt, bekommt kostenlosen Sinai-only-Stempel (gilt nur für Sinai-Region).</li>
          </ul>
        </div>
        <div class="bg-yellow-50 p-3 rounded text-sm">
          <strong>Krankenversicherung:</strong> Privatkrankenversicherung absolut notwendig. EHIC gilt in Ägypten NICHT.
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-3 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Ägypten-Einreise Profi-Tipps</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>E-Visa Timing:</strong> Mindestens 3–5 Werktage vor Reise beantragen. Wochenende/Feiertage können Bearbeitung verzögern.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Hurghada-Direktflug:</strong> Am HRG-Flughafen ist das Visum-Counter meist schneller als an anderen ägyptischen Airports. Im Pauschalreise-Check-in-Bereich oft separater Counter.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Alkohol-Einfuhr:</strong> Max. 1 Liter Alkohol einführen. Ägypten ist muslimisches Land – Alkohol nur in Hotels/Touristenlokalen erhältlich.</li>
        </ul>
      </div>`,
  },
  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Gesundheitsvorsorge</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Impfungen:</strong> Hepatitis A (dringend empfohlen), Typhus (bei längerem Aufenthalt).</li>
            <li><strong>Trinkwasser:</strong> Niemals Leitungswasser! Nur Flaschenwasser – auch zum Zähneputzen.</li>
            <li><strong>"Pharaonens Rache":</strong> Magen-Darm-Erkrankungen häufig. Durchfallmittel und Elektrolyte mitnehmen.</li>
            <li><strong>Hitze:</strong> Hurghada im Juli/August bis 42°C. Sonnenschutz LSF 50+, Kopfbedeckung, viel trinken.</li>
          </ul>
        </div>
        <div class="bg-red-50 p-3 rounded text-sm">
          <strong>Privatarzt vs. Staatskrankenhaus:</strong> Im Notfall nur Privatkliniken aufsuchen – staatliche Krankenhäuser in Touristengebieten oft unzureichend ausgestattet.
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-green-50 p-4 rounded text-sm">
        <h4 class="font-bold text-green-900 mb-2">Gesundheits-Insider</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Rotes Meer: Korallenriffe:</strong> Niemals Korallen anfassen. Verletzungen durch Korallen infizieren sich extrem leicht in warmem Wasser.</li>
          <li><strong>Feuerfisch/Steinfisch:</strong> Beim Schnorcheln Badeschuhe tragen. Stich ist extrem schmerzhaft.</li>
          <li><strong>Sonnenbrand Wasser:</strong> Im türkisfarbenen Wasser brennt die Sonne stärker. LSF alle 90 Min neu auftragen.</li>
        </ul>
      </div>`,
  },
  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Hurghada (HRG)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Pauschalreise: Transfer meist inklusive – Bus zum Hotel.</li>
            <li>Individuell: Taxi zum Hotel ca. 10–20 USD. Unbedingt Preis VOR Fahrt festlegen!</li>
            <li>Kein öffentlicher Bus vom Flughafen.</li>
          </ul>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Sharm el-Sheikh (SSH)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Ähnlich wie Hurghada – Taxi unbedingt vorher Preis aushandeln (ca. 10–15 USD).</li>
            <li>Pauschalreise-Transfer inklusive.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-blue-50 p-4 rounded text-sm">
        <h4 class="font-bold text-blue-900 mb-2">Transfer-Profi-Tipps</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Taxi-Feilschen:</strong> Erster genannter Preis ist immer zu hoch. Halbieren und dann handeln. "La, shukran" (Nein, Danke) ist das mächtigste Wort.</li>
          <li><strong>Uber in Ägypten:</strong> Funktioniert in Kairo sehr gut. In Hurghada/Sharm kaum verbreitet.</li>
          <li><strong>App "Careem":</strong> In Ägypten beliebter als Uber. Festpreise, keine Überraschungen.</li>
        </ul>
      </div>`,
  },
  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Währung & Bezahlen</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Währung:</strong> Ägyptisches Pfund (EGP). 1 € ≈ 50–55 EGP (stark schwankend!).</li>
            <li><strong>Wechseln:</strong> Am besten bei autorisierten Wechselstuben oder Bank im Ort. Airport-Kurse oft schlechter.</li>
            <li><strong>USD/EUR:</strong> In Touristenzonen werden US-Dollar und Euro oft akzeptiert.</li>
            <li><strong>Trinkgeld (Baksheesh):</strong> Sehr wichtig! Überall kleine Beträge: 5–20 EGP für Serviceleistungen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-yellow-50 p-4 rounded text-sm">
        <h4 class="font-bold text-yellow-900 mb-2">Finanz-Insider Ägypten</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Kleine Scheine mitführen:</strong> Baksheesh wird immer in kleinen Scheinen gegeben. Große Scheine sind schwer zu wechseln.</li>
          <li><strong>Auslandsgebühren-freie Karte:</strong> ATMs in Touristenzonen vorhanden aber hohe Gebühren. Revolut/DKB-Karte empfohlen.</li>
          <li><strong>Preisverhandlung:</strong> Im Basar alles verhandelbar. Feste Preise gibt es nur in Supermärkten und offiziellen Shops.</li>
        </ul>
      </div>`,
  },
  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Konnektivität</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Roaming gilt NICHT</strong> – Ägypten ist kein EU-Land! Roaming-Gebühren können sehr hoch sein.</li>
            <li><strong>Lokale SIM:</strong> Vodafone Egypt oder Orange Egypt am Flughafen kaufen. Für ca. 5–10 € gibt es 10 GB Daten.</li>
            <li><strong>eSIM:</strong> Airalo-App bietet ägyptische eSIM an (einfachste Lösung).</li>
            <li><strong>Steckdosen:</strong> Typ C und F – kein Adapter für deutsche Stecker nötig. 220 Volt.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <h4 class="font-bold text-indigo-900 mb-2">Tech-Hacks</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>VPN:</strong> WhatsApp-Anrufe und manche Apps können in Ägypten eingeschränkt sein. VPN vorinstallieren!</li>
          <li><strong>Hotel-WLAN:</strong> In Pauschalreise-Hotels oft gut. Am Strand/Pool meist kein Signal.</li>
          <li><strong>Tauchcomputer:</strong> Für Taucher: Garmin/Suunto Geräte brauchen keinen Adapter.</li>
        </ul>
      </div>`,
  },
  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Sicherheitslage</h4>
          <p class="mb-2">Hurghada und Sharm el-Sheikh sind für Touristen überwachte Sicherheitszonen. Außerhalb der Tourismuszonen erhöhte Vorsicht.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Sinai-Halbinsel (außer Sharm): Reisewarnung des Auswärtigen Amts – <strong>nicht bereisen!</strong></li>
            <li><strong>Notrufe:</strong> 122 (Polizei), 123 (Feuerwehr), 100 (Ambulanz).</li>
            <li>Fotos von Polizei, Militär und Regierungsgebäuden: <strong>Streng verboten!</strong></li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Insider</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Reisekrankenversicherung mit Rückholung:</strong> In Ägypten essentiell. Hubschrauber-Evakuierung kostet ohne Versicherung 50.000+ €.</li>
          <li><strong>Belästigung:</strong> Besonders Frauen können auf Märkten aufdringliche Ansprachen erleben. Bestimmtes "La!" (Nein) hilft. In Gruppen reisen.</li>
        </ul>
      </div>`,
  },
  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Ägyptische Kultur</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Islam:</strong> Ägypten ist mehrheitlich muslimisch. Respektvoller Umgang mit Gepflogenheiten erwartet.</li>
            <li><strong>Ramadan:</strong> Öffentliches Essen/Trinken tagsüber ist nicht schicklich. Touristenzonen sind toleranter.</li>
            <li><strong>Kleidung:</strong> Außerhalb von Hotelanlagen bedeckend kleiden – besonders Frauen (Schultern, Knie).</li>
            <li><strong>Moscheen:</strong> Nur mit Erlaubnis betreten. Schuhe ausziehen, Frauen Kopftuch.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how</strong>
        <p><strong>Pyramiden-Geheimtipp:</strong> Die Sakkara-Pyramiden (Stufenpyramide, älteste Ägyptens) haben nur 5% der Besucher von Gizeh – aber gleiches Erlebnis für den Bruchteil des Preises.</p>
        <p class="mt-2"><strong>Empfang:</strong> Ägypter sind extrem gastfreundlich. Eine Einladung zum Tee annehmen ist ein schönes kulturelles Erlebnis.</p>
      </div>`,
  },
  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Ägyptische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Kushari:</strong> Nationales Gericht – Linsen, Nudeln, Reis, scharfe Tomatensauce. Sehr günstig, sehr lecker.</li>
            <li><strong>Ful medames:</strong> Bohnen-Frühstück – das günstigste und authentischste Frühstück.</li>
            <li><strong>Frischer Fisch:</strong> Direkt am Roten Meer natürlich frisch. Auf Preis vorher einigen.</li>
            <li><strong>Alkohol:</strong> Nur in Hotels und lizenzierten Restaurants erhältlich. "Stella"-Bier ist das lokale Bier.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Kulinarik-Insider</strong>
        <p><strong>All-Inclusive-Falle:</strong> Im Resort-Restaurant ist alles verfügbar, aber authentische Küche gibt es nur außerhalb. Einmal Abendessen im lokalen Restaurant ist Pflicht!</p>
        <p class="mt-2"><strong>Gewürz-Souvenir:</strong> Dukkah (Gewürzmischung) und getrocknete Hibiskusblüten (für Hibiskustee = Karkadeh) kaufen – günstig und haltbar.</p>
      </div>`,
  },
  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Taxi:</strong> Hauptverkehrsmittel in Hurghada/Sharm. Preis IMMER vorher festlegen!</li>
            <li><strong>Minibus:</strong> Günstig, aber chaotisch. Nicht für Erstbesucher empfohlen.</li>
            <li><strong>Mietwagen:</strong> Möglich, aber ägyptische Fahrweise ist extrem. Nur für erfahrene Fahrer.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Insider</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Hurghada Marina:</strong> Wassertaxis zu den Korallenriffen (Giftun Island) starten von hier. Morgens früh buchen.</li>
          <li><strong>Feluke:</strong> Traditionelle Segelboote auf dem Nil in Luxor/Aswan. Romantischste Fortbewegung Ägyptens.</li>
          <li><strong>Kutsche (Karosse):</strong> In Luxor beliebt aber stark gefeilscht werden muss. Alternativ: E-Tuk-Tuks.</li>
        </ul>
      </div>`,
  },
  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Beste Reisezeit Ägypten</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Oktober–April:</strong> Beste Reisezeit. Angenehme 25–30°C. Perfekt zum Tauchen und Besichtigen.</li>
            <li><strong>Mai–September:</strong> Extrem heiß (35–45°C). Nur für Strandurlaub geeignet, keine Sightseeing-Touren.</li>
            <li><strong>Ramadan:</strong> Datum wechselt jährlich. Servicequalität in Restaurants variiert stark.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Geheimtipps</strong>
        <p><strong>Kombinationsreise:</strong> Strand + Nilkreuzfahrt ist das klassische Ägypten-Erlebnis. Nilkreuzfahrt Luxor–Aswan (4 Nächte) + Hurghada (1 Woche) = perfekte Reise.</p>
        <p class="mt-2"><strong>Tauchen Beste Zeit:</strong> Oktober–Mai ist Topzeit. Wasser ca. 22–26°C, beste Sicht.</p>
      </div>`,
  },
};

// ─── ITALIEN ────────────────────────────────────────────────────────────────
const italyHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Einreise & Dokumente</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Bürger:</strong> Personalausweis oder Reisepass. Kein Visum. Schengen-Land.</li>
            <li><strong>EHIC:</strong> Gilt vollständig in Italien – öffentliche Krankenhäuser (Pronto Soccorso).</li>
            <li><strong>Meldepflicht Hotels:</strong> Hotels melden Gäste automatisch an die Polizei. Bei Privatunterkunft muss der Gastgeber die Meldung vornehmen.</li>
          </ul>
        </div>
        <div class="bg-blue-50 p-3 rounded text-sm">
          <strong>Sardinien & Sizilien:</strong> Inseln über Fähre oder Flug erreichbar. Fährtickets im Sommer (Juli/Aug) Wochen voraus buchen!
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <h4 class="font-bold text-indigo-900 mb-2">Italien-Insider</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>ZTL-Zonen:</strong> Historische Innenstädte haben Fahrverbotszonen (ZTL). Wer mit Mietwagen hineinfährt, bekommt Wochen später eine Strafe nach Hause! GPS-Warnung beachten.</li>
          <li><strong>Kopfgeld Müll:</strong> Einige Touristenstädte (Positano, Venedig) haben strenge Müllregeln. Falsch entsorgen kostet bis zu 200 €.</li>
        </ul>
      </div>`,
  },
  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Gesundheit in Italien</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>Keine Impfpflichten. Standardreiseschutz ausreichend.</li>
            <li><strong>Hitze:</strong> Sizilien/Sardinien im August bis 40°C. Hitzschlag-Risiko an Sehenswürdigkeiten.</li>
            <li><strong>Pharmacia:</strong> Grünes Kreuz. Kompetent, viele OTC-Medikamente.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-green-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Pronto Soccorso:</strong> Notaufnahme in öffentlichen Krankenhäusern – mit EHIC kostenlos. Wartezeiten können lang sein.</li>
          <li><strong>Wasserqualität:</strong> Leitungswasser in Italien ist trinkbar und von guter Qualität. Öffentliche Trinkbrunnen (Nasoni) in Rom kostenfrei nutzen.</li>
        </ul>
      </div>`,
  },
  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Wichtigste Airports</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Rom Fiumicino (FCO):</strong> Leonardo Express Zug → Roma Termini (35 Min, 14 €). Schnellste Option.</li>
            <li><strong>Mailand Malpensa (MXP):</strong> Malpensa Express → Zentrum (ca. 50 Min, 13 €).</li>
            <li><strong>Catania (CTA) für Sizilien:</strong> Bus Alibus → Zentrum (ca. 30 Min, 4 €).</li>
            <li><strong>Cagliari (CAG) für Sardinien:</strong> Bus Nr. 4 oder Taxi ins Zentrum.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-blue-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Flughafen-Taxi Rom:</strong> Festpreis ins Stadtzentrum gesetzlich geregelt: 50 € (FCO) bzw. 30 € (Ciampino). Darauf bestehen!</li>
          <li><strong>Trenitalia vs. Italo:</strong> Für Strecken wie Rom–Florenz–Mailand den Hochgeschwindigkeitszug buchen. Günstig und schnell.</li>
        </ul>
      </div>`,
  },
  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Geld in Italien</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Währung:</strong> Euro. Kein Wechseln nötig.</li>
            <li><strong>Coperto:</strong> Gedeck-Gebühr in Restaurants (1–4 € pro Person) ist legal und überall üblich.</li>
            <li><strong>Trinkgeld:</strong> Nicht obligatorisch aber willkommen. Ca. 5–10%.</li>
          </ul>
        </div>
        <div class="bg-yellow-50 p-3 rounded text-sm"><strong>Preisgefälle:</strong> Venedig und Positano sind sehr teuer (Touristenfalle). Sizilien und Kalabrien günstig wie vor 20 Jahren.</div>
      </div>`,
    insiderHtml: `
      <div class="bg-yellow-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Bar vs. Restaurantkaffee:</strong> Espresso an der Theke (al banco) kostet 1–1,50 €. Am Tisch sitzen kann das Doppelte kosten.</li>
          <li><strong>Supermarkt Conad/Esselunga:</strong> Preiswert für Picknick-Einkäufe. Deutlich günstiger als Touristenrestaurants.</li>
        </ul>
      </div>`,
  },
  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Roaming gilt</strong> – deutsche SIM problemlos nutzbar.</li>
            <li><strong>Steckdosen:</strong> Typ C und F/L. Deutsche Typ-F-Stecker passen meist, aber Typ L (3 runde Stifte in einer Reihe) ist speziell. Universaladapter empfehlenswert.</li>
            <li><strong>WLAN:</strong> Gut in Hotels. Öffentliches WLAN oft mit Registrierung (Telefonnummer nötig).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Steckdosen-Adapter:</strong> Typ-L hat 3 runde Pins in einer Reihe. Deutscher Schuko-Stecker passt in viele, aber nicht alle Steckdosen. Kleinen Universal-Adapter mitbringen!</li>
          <li><strong>Trenitalia-App:</strong> Günstige Last-Minute-Zugtickets und Sitzplatz-Reservierung – immer mehr als 1 Stunde vorher buchen.</li>
        </ul>
      </div>`,
  },
  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li>Italien ist sicher. Hauptproblem: Taschendiebstahl in Touristenzonen (Rom Trevi-Brunnen, Colosseum; Florenz Dom; Venedig Markusplatz).</li>
            <li><strong>Trickbetrüger:</strong> "Freundschaftsarmbänder" aufdrängen und dann Geld fordern – einfach weglaufen!</li>
            <li><strong>Notruf:</strong> 112 / 113 (Polizei) / 118 (Ambulanz).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Neapel Vorsicht:</strong> Taschendiebstahl und Vespa-Raub häufiger als in Norditalien. Handy nicht offen tragen.</li>
          <li><strong>Strandliegen-Betrug:</strong> Manche Strände (Sizilien) haben "Abgesperrte" Strandabschnitte die als öffentlich vermarktet werden. Öffentliche Strände (spiaggia libera) sind kostenlos.</li>
        </ul>
      </div>`,
  },
  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Bella Italia</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Kirchen:</strong> In Kirchen immer Schultern/Knie bedecken. Sonst Einlass verweigert.</li>
            <li><strong>Ferragosto (15. Aug):</strong> Nationaler Feiertag. Viele Geschäfte und Restaurants geschlossen. Italien macht Urlaub!</li>
            <li><strong>Sprache:</strong> "Grazie" (Danke), "Per favore" (Bitte), "Scusi" (Entschuldigung) werden sehr geschätzt.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <p><strong>Aperitivo-Kultur:</strong> Ab 18 Uhr zum Aperitivo in eine Bar – für den Preis eines Getränks (6–10 €) gibt es oft ein kleines Büffet dazu. Nord-Italiens beste Tradition!</p>
        <p class="mt-2"><strong>Kaffee-Etikette:</strong> Cappuccino nach 11 Uhr zu trinken gilt als touristisch. Aber: niemand wird Sie deswegen rauswerfen – enjoy!</p>
      </div>`,
  },
  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Cucina Italiana</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Pasta:</strong> Jede Region hat ihr eigenes Pastagericht. Rom: Cacio e Pepe. Bologna: Ragù. Sizilien: alla Norma.</li>
            <li><strong>Pizza:</strong> Die original Neapolitanische Pizza (Forno a legna) probieren – nur in Neapel!</li>
            <li><strong>Gelato:</strong> Echter artisanaler Gelato hat matte Farben und ist nicht aufgeschäumt. Aufgeturmter Gelato = Touristenfalle.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <p><strong>Trattoria vs. Ristorante:</strong> Trattoria = familiär, authentisch, günstiger. Ristorante = formeller, teurer. Für das echte Erlebnis: Trattoria wählen!</p>
        <p class="mt-2"><strong>Markt-Geheimtipp:</strong> Lokale Märkte (Mercato) früh morgens besuchen. Beste Käse, Oliven und Aufschnitt direkt vom Erzeuger.</p>
      </div>`,
  },
  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Hochgeschwindigkeitszug:</strong> Rom–Florenz 1,5 Std, Rom–Mailand 3 Std. Frühbuchertickets ab 19 €!</li>
            <li><strong>Sardinien/Sizilien Mietwagen:</strong> Unbedingt empfohlen. Bus-Netz auf Inseln dünn.</li>
            <li><strong>Venedig:</strong> Kein Auto! Vaporetto (Wasserbus) oder zu Fuß. Gondel nur für romantische Ausnahmen (80–120 €).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Trenitalia Frühbucher:</strong> Tickets bis zu 70% günstiger wenn 3+ Monate vorher gebucht.</li>
          <li><strong>Vespa mieten:</strong> In Rom, Florenz und auf Sizilien authentisch und praktisch. Internationale Fahrzeugklasse AM ab 16 Jahren ausreichend.</li>
          <li><strong>ZTL-Maut:</strong> Mietwagen GPS hat ZTL-Warnungen. Diese IMMER ernst nehmen – Strafe folgt.</li>
        </ul>
      </div>`,
  },
  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Beste Reisezeit</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>April–Juni:</strong> Perfekt für Städte und Kulturreisen. Angenehme Temperaturen, keine Hitzeschlange.</li>
            <li><strong>September–Oktober:</strong> Top für Strand + Kultur. Sizilien/Sardinien noch warm (27°C).</li>
            <li><strong>Juli–August:</strong> Heiß (35–40°C), sehr voll, Ferragosto-Schließungen. Für reine Strandurlauber OK.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <p><strong>Colosseum/Vatikan:</strong> Online vorbuchen ist Pflicht (Wartezeiten bis 3 Stunden ohne Ticket!). Zeitfenster morgens 8–9 Uhr buchen.</p>
        <p class="mt-2"><strong>Sardinien-Geheimstrand:</strong> Cala Goloritzé (Nuoro) gilt als schönster Strand Italiens – nur per Boot oder 2h Wanderung erreichbar.</p>
      </div>`,
  },
};

// ─── PORTUGAL ───────────────────────────────────────────────────────────────
const portugalHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Einreise</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>EU-Bürger: Personalausweis genügt. Schengen-Land, kein Visum.</li>
            <li>EHIC gilt vollständig.</li>
            <li><strong>Madeira & Azoren:</strong> Autonome Regionen, aber EU-Territorium. Deutsche SIM (EU-Roaming) gilt.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Madeira Einreise-Formular:</strong> Bis vor kurzem war ein Einreise-Formular für Madeira Pflicht. Stand 2026 aufgehoben – aber vor Reise checken!</li>
          <li><strong>Lissabon-Günstig:</strong> Viva Viagem-Karte für Öffis kaufen – deutlich günstiger als Einzeltickets.</li>
        </ul>
      </div>`,
  },
  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li>Keine Impfpflichten. Standardreiseschutz.</li>
            <li><strong>Atlantik-Strömung:</strong> Atlantikwasser an der Westküste ist kalt (16–18°C). Starke Strömungen! Rote Flagge an Stränden immer respektieren.</li>
            <li><strong>Algarve-Strömung:</strong> Südküste (Algarve) ist wärmer, aber Unterströmungen möglich.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-green-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Portugiesische Quallen:</strong> Im Herbst häufig. Bei Kontakt: mit Salzwasser (nicht Süßwasser!) abspülen.</li>
          <li><strong>Farmácia:</strong> Gut ausgestattet, oft Englisch gesprochen.</li>
        </ul>
      </div>`,
  },
  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Lissabon (LIS):</strong> Metro-Linie Rot → Zentrum (ca. 20 Min, 2 €). Taxi: ca. 15–20 €.</li>
            <li><strong>Faro (FAO, Algarve):</strong> Bus Nr. 16 → Zentrum. Taxi ca. 12 €.</li>
            <li><strong>Funchal (FNC, Madeira):</strong> Taxi ins Zentrum ca. 20–25 €. Bus-Verbindung vorhanden aber langsam.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-blue-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Bolt in Portugal:</strong> Uber-Alternative Bolt ist günstiger und sehr verbreitet in Lissabon/Porto.</li>
          <li><strong>Algarve-Mietwagen:</strong> Unbedingt notwendig. Öffentliche Busse an der Algarve sehr selten.</li>
        </ul>
      </div>`,
  },
  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Währung:</strong> Euro. Günstigstes Westeuropa-Land nach Slowenien.</li>
            <li><strong>Trinkgeld:</strong> Nicht obligatorisch. Kleingeld aufrunden oder ca. 5–10%.</li>
            <li><strong>Preisniveau Lissabon:</strong> In den letzten Jahren stark gestiegen (Tourismus-Boom). Außerhalb günstiger.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-yellow-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Pastel de Nata:</strong> Original im Café "Pastéis de Belém" (Lissabon) – 1,30 € pro Stück. Warteschlange lohnt sich!</li>
          <li><strong>Supermercado Pingo Doce/Continente:</strong> Günstigste Supermärkte. Mittagessen-Box für 3–4 €.</li>
        </ul>
      </div>`,
  },
  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Roaming gilt</strong> – auch auf Madeira und Azoren.</li>
            <li><strong>Steckdosen:</strong> Typ F (Schuko) – kein Adapter nötig.</li>
            <li><strong>WLAN:</strong> Sehr gut in ganz Portugal, auch kostenlos in vielen Cafés.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Via Verde (Mautchip):</strong> Wer mit Mietwagen viel Autobahn fährt: Mautstationen sind automatisch. Mietwagen-Firmen bieten Via Verde-Chip an – lohnt sich auf längeren Strecken.</li>
          <li><strong>NOS/MEO SIM:</strong> Lokale SIM für Nicht-EU-Reisende günstig verfügbar.</li>
        </ul>
      </div>`,
  },
  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li>Portugal ist eines der sichersten Länder Europas (Global Peace Index Top 10).</li>
            <li><strong>Taschendiebstahl:</strong> In Lissabon touristischen Linien (Tram 28!) aufpassen.</li>
            <li><strong>Ertrinken-Risiko:</strong> Atlantik-Strömungen sind gefährlich. Strandflaggen immer beachten!</li>
            <li><strong>Notruf:</strong> 112.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Waldbrand-Saison:</strong> August–September im Inland risikoreich. Naturparks meiden, Reisewarnungen checken.</li>
          <li><strong>Atlantik-Wellen Nazaré:</strong> Weltrekord-Wellen von bis zu 30 Metern. Auch an ruhigen Tagen Vorsicht beim Näherkommen ans Wasser!</li>
        </ul>
      </div>`,
  },
  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Fado:</strong> Portugiesische Seele in Musik. Authentischer Fado in kleinen Casas de Fado (Lissabon/Alfama-Viertel).</li>
            <li><strong>Saudade:</strong> Typisch portugiesisches Gefühl der melancholischen Sehnsucht. Das Herz des Landes.</li>
            <li><strong>Sprache:</strong> "Obrigado/Obrigada" (Danke), "Por favor" (Bitte).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <p><strong>Fado-Geheimtipp:</strong> Touristisches Fado-Restaurant vs. Adega (kleines Weinkeller-Restaurant mit Fado) – im Adega sitzen Einheimische und die Musik ist von Herzen.</p>
        <p class="mt-2"><strong>Azulejos:</strong> Bemalte Fliesen-Kunst überall. São Bento Bahnhof in Porto hat 20.000 historische Azulejos – kostenloser Kunstgenuss!</p>
      </div>`,
  },
  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Bacalhau (Stockfisch):</strong> 365 Rezepte – für jeden Tag des Jahres. Bestes traditionelles Gericht.</li>
            <li><strong>Polvo à Lagareiro:</strong> Octopus mit Olivenöl. Spezialität der Atlantikküste.</li>
            <li><strong>Wein:</strong> Vinho Verde (junger Weißwein), Douro Rotwein und Port-Wein (Porto) probieren.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <p><strong>Tasca:</strong> Kleines lokales Restaurant mit Tagesgerichten (Pratos do dia). 2-Gänge-Menü inklusive Wein für 8–12 €. Bestes Preis-Leistungs-Verhältnis Europas!</p>
        <p class="mt-2"><strong>Mercado da Ribeira (Lissabon):</strong> Der modernste Foodcourt Europas. Alle portugiesischen Küchen-Highlights unter einem Dach.</p>
      </div>`,
  },
  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Lissabon:</strong> Metro sehr gut. Trams historisch (Linie 28 – muss man gefahren sein!). App "Carris Metropolitana".</li>
            <li><strong>Algarve:</strong> Mietwagen absolut notwendig.</li>
            <li><strong>Porto:</strong> Metro und Tuk-Tuks für Altstadt. Zug nach Lissabon: Alfa Pendular (ca. 3 Std).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Tuk-Tuk Lissabon:</strong> Fun für eine Runde durch Alfama. Preis vorher aushandeln (ca. 15–25 € für 30 Min).</li>
          <li><strong>Elétrico Nr. 28:</strong> Historische Straßenbahn – aber voller Touristen und Taschendiebe. Morgens früh fahren für echtes Erlebnis.</li>
        </ul>
      </div>`,
  },
  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Beste Reisezeit</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Mai–Juni & September–Oktober:</strong> Ideal. Warm, nicht überhitzt, günstigere Preise.</li>
            <li><strong>Algarve Strand:</strong> Juli–September für Badeurlaub perfekt (28°C).</li>
            <li><strong>Madeira:</strong> Ganzjährig angenehm. "Insel des ewigen Frühlings" (18–24°C).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <p><strong>Cabo da Roca:</strong> Der westlichste Punkt des europäischen Festlandes. Atemberaubend – und fast keine Touristen! 45 Min von Lissabon.</p>
        <p class="mt-2"><strong>Douro-Tal im September:</strong> Weinlese-Saison. Weingüter (Quintas) bieten Touren mit Verkostung an.</p>
      </div>`,
  },
};

// ─── THAILAND ───────────────────────────────────────────────────────────────
const thailandHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Visum & Einreise</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Visum-Frei bis 60 Tage</strong> (seit 2024) für deutsche Staatsbürger bei touristischem Aufenthalt.</li>
            <li><strong>Reisepass:</strong> Mind. 6 Monate gültig und mindestens 2 freie Seiten.</li>
            <li><strong>Rückflug-Nachweis:</strong> Grenzbeamte können Rückflugticket verlangen. Buchungsbestätigung ausdrucken!</li>
            <li><strong>EHIC gilt nicht</strong> – private Auslandskrankenversicherung mit Notfall-Rückholung ist Pflicht!</li>
          </ul>
        </div>
        <div class="bg-yellow-50 p-3 rounded text-sm">
          <strong>Thailand Pass:</strong> Früher war ein Online-Registrierungssystem nötig – seit 2022 abgeschafft. Direkte Einreise möglich.
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-3 text-sm">
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Grenzübergang früh morgens:</strong> Suvarnabhumi Airport (BKK) Grenzschlangen können am Nachmittag 1–2 Std betragen. Morgenflüge haben kürzere Wartezeiten.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Thailand Elite Visum:</strong> Für mehrmonatige Aufenthalte gibt es ein kostenpflichtiges Elite-Visum – für Urlauber irrelevant.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Drogenstrafe:</strong> In Thailand drohen für Drogenbesitz extrem harte Strafen bis hin zur Todesstrafe. Keine Ausnahmen, keine Milde für Touristen.</li>
        </ul>
      </div>`,
  },
  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Gesundheitsvorsorge</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Impfungen:</strong> Hepatitis A+B (dringend empfohlen), Typhus, Tetanus. Für längere Aufenthalte: Tollwut-Impfung erwägen.</li>
            <li><strong>Malaria:</strong> In normalen Touristengebieten (Bangkok, Phuket, Chiang Mai) kein Risiko. Im tiefen Dschungel/Grenzgebieten: Rücksprache mit Tropenmediziner.</li>
            <li><strong>Dengue-Fieber:</strong> Reales Risiko. Guten Mückenschutz (DEET 30%+) nutzen – auch tagsüber!</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-green-50 p-4 rounded text-sm">
        <h4 class="font-bold text-green-900 mb-2">Gesundheits-Insider Thailand</h4>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Bumrungrad Hospital (Bangkok):</strong> Eines der besten Krankenhäuser Asiens. Internationaler Standard, Englisch gesprochen, faire Preise mit Versicherung.</li>
          <li><strong>Street Food:</strong> Frisch zubereitetes Street Food ist oft sicherer als Restaurantküche! Sieht man zu, wie es gegart wird → OK.</li>
          <li><strong>Hundebisse:</strong> Thailand ist nicht tollwutfrei. Bei Biss sofort zum Arzt (innerhalb von 24 Stunden Impfung beginnen!).</li>
        </ul>
      </div>`,
  },
  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Bangkok (BKK Suvarnabhumi / DMK Don Mueang)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>BKK Airport → Zentrum: Airport Rail Link (30 Min, 45 THB) oder Taxi mit Taxameter (ca. 300–500 THB).</li>
            <li>Taxi-Tipp: Unbedingt auf "Meter" (Taxameter) bestehen und "Expressway toll" selbst zahlen.</li>
          </ul>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Phuket (HKT)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Kein öffentlicher Bus. Taxi/Minibus fix: ca. 600–800 THB zum Patong-Strand.</li>
            <li>Transfer vorbuchen über Hotel oder Booking-Platform empfohlen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-blue-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Grab-App:</strong> Das Uber Südostasiens – in Bangkok, Phuket, Chiang Mai. Festpreise, keine Verhandlung nötig. Unbedingt installieren!</li>
          <li><strong>Tuk-Tuk:</strong> Fun aber nie für längere Strecken – Preis wird überhöht. Nur für kurze Fahrten in Touristenzonen.</li>
          <li><strong>Fähren zwischen Inseln:</strong> Ko Samui–Ko Phangan–Ko Tao: Fähren mehrmals täglich, günstig (ca. 250–400 THB).</li>
        </ul>
      </div>`,
  },
  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Baht & Bezahlen</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Währung:</strong> Thailändischer Baht (THB). 1 € ≈ 37–40 THB.</li>
            <li><strong>Bargeld wichtig:</strong> Viele Street-Food-Stände, Märkte und Tempel nur Bargeld.</li>
            <li><strong>ATMs:</strong> Überall, aber hohe Gebühren (ca. 220 THB ≈ 6 € pro Abhebung). Großbeträge auf einmal abheben.</li>
            <li><strong>Kreditkarte:</strong> In größeren Restaurants, Hotels und Malls akzeptiert.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-yellow-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Superrich Money Exchange:</strong> Beste offiziell Wechselkurse in Bangkok (besser als alle ATMs und Hotels). Filialen in Touristenzonen.</li>
          <li><strong>Wise-Karte:</strong> Beste Möglichkeit in Thailand zu bezahlen ohne Gebühren. Im Vorfeld in Deutschland beantragen!</li>
          <li><strong>Tipping:</strong> Trinkgeld nicht obligatorisch, aber sehr willkommen. Im Restaurant ca. 20–50 THB Kleingeld lassen.</li>
        </ul>
      </div>`,
  },
  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Roaming gilt NICHT</strong> – Gebühren können extrem hoch sein!</li>
            <li><strong>Lokale SIM:</strong> Am Flughafen kaufen (AIS, DTAC, TrueMove). 15 GB für 7 Tage ca. 300 THB (8 €). Empfohlen!</li>
            <li><strong>eSIM:</strong> Airalo-App bietet Thailand-eSIM an (bequemste Lösung).</li>
            <li><strong>Steckdosen:</strong> Typ A, B und C. Europäische Stecker (Typ C) passen meist. Adapter für Typ-A empfohlen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>VPN:</strong> Manche Webseiten in Thailand eingeschränkt. VPN vorinstallieren (ExpressVPN/NordVPN).</li>
          <li><strong>7-Eleven SIM:</strong> In fast jedem 7-Eleven-Store gibt es SIM-Karten – einfachste Lösung für Daten.</li>
          <li><strong>Powerbank am Strand:</strong> Unbedingt mitnehmen. Steckdosen am Strand gibt es nicht.</li>
        </ul>
      </div>`,
  },
  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li>Thailand ist für Touristen überwiegend sicher. Gewalt gegen Touristen selten.</li>
            <li><strong>Hauptgefahren:</strong> Verkehrsunfälle (häufigste Todesursache bei Touristen!), Drogenkonsum, Betrug.</li>
            <li><strong>Lèse-majesté (Majestätsbeleidigung):</strong> Keine negativen Aussagen über die Königsfamilie. Gilt als schweres Verbrechen (bis 15 Jahre Haft)!</li>
            <li><strong>Notruf:</strong> 191 (Polizei), 1669 (Ambulanz), 1155 (Touristenpolizei mit Englisch).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Roller-Unfälle:</strong> Häufigste Urlauber-Verletzung. Nie ohne Helm fahren. Versicherung für Roller/Motorrad gesondert prüfen.</li>
          <li><strong>Gem-Scam:</strong> "Freundlicher Einheimischer" empfiehlt günstigen Edelstein-Shop → alles gefälscht. Classic Bangkok-Betrug.</li>
          <li><strong>Tempel-Betrug:</strong> "Heute geschlossen" sagen Unbekannte vor Tempeln – stimmt nie. Eigene Recherche machen.</li>
        </ul>
      </div>`,
  },
  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Tempel-Besuch:</strong> Schultern und Knie bedecken (Sarong wird oft geliehen). Schuhe ausziehen. Laut oder respektlos = kulturelle Sünde.</li>
            <li><strong>Kopf:</strong> Höchster Körperteil = heilig. Nie jemandem über den Kopf streicheln.</li>
            <li><strong>Füße:</strong> Niedrigster Körperteil = unrein. Nie auf Bilder des Königs oder Buddhas zeigen.</li>
            <li><strong>Smile-Kultur:</strong> Thais lächeln viel. Lächeln zurück ist immer richtig.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <p><strong>Wai-Gruß:</strong> Hände falten vor der Brust und leicht verneigen. Thais freuen sich wenn Touristen dies versuchen – ist aber nicht erwartet.</p>
        <p class="mt-2"><strong>Songkran (Thai Neujahr, April):</strong> Weltgrößtes Wasserfest – 3 Tage Wasserschlacht. Unvergesslich, aber alle Elektronik wasserdicht verpacken!</p>
      </div>`,
  },
  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Must-Eat:</strong> Pad Thai, Som Tam (grüner Papaya-Salat), Tom Yum Goong (Garnelensuppe), Mango Sticky Rice.</li>
            <li><strong>Schärfe:</strong> "Mai phet" = nicht scharf. "Phet nit noi" = ein bisschen scharf. Thais mögen es sehr scharf – immer spezifizieren!</li>
            <li><strong>Street Food Bangkok:</strong> Bestes Street Food der Welt. Yaowarat (Chinatown) und Khao San Road für Vielfalt.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <p><strong>Markt-Geheimtipp:</strong> Or Tor Kor Market in Bangkok – wo Thais selbst einkaufen. Frischeste Früchte und beste Qualität, moderate Preise.</p>
        <p class="mt-2"><strong>Singha vs. Chang:</strong> Die zwei großen Biermarken Thailands. Chang gilt als stärker, Singha als milder. Leo ist die Geheimwaffe der Einheimischen.</p>
      </div>`,
  },
  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Bangkok BTS Skytrain:</strong> Sauber, pünktlich, günstig. Beste Verbindung in Bangkok. Rabbit Card kaufen.</li>
            <li><strong>MRT (U-Bahn Bangkok):</strong> Ergänzt BTS. Zusammen decken sie Haupttouristenrouten ab.</li>
            <li><strong>Fernreisen:</strong> Overnight-Zug Bangkok–Chiang Mai (12 Std) ist ein Erlebnis. Günstig und bequem im Schlafwagen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Songthaew (roter Minibus Chiang Mai):</strong> Günstigstes Verkehrsmittel in Chiang Mai. Einfach winken, einsteigen, Ziel nennen. 30–50 THB.</li>
          <li><strong>Long-Tail-Boot Bangkok:</strong> Auf dem Chao Phraya Fluss – schnellste Alternative zum Stau. Khlong (Kanal) Boote noch günstiger!</li>
        </ul>
      </div>`,
  },
  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Beste Reisezeit</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>November–Februar (Hochsaison):</strong> Trocken, kühl (25–32°C), bestes Wetter. Teuer und voll.</li>
            <li><strong>März–Mai:</strong> Heiß (35–40°C), Trockenzeit endet. Günstigere Preise.</li>
            <li><strong>Juni–Oktober (Monsun):</strong> Regenzeit, aber nicht täglich. Günstigste Preise, weniger Touristen. Inseln (Ko Samui, Koh Chang) haben versetzten Monsun.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <p><strong>Phuket vs. Ko Samui Monsun:</strong> Beide Inseln haben unterschiedliche Regenzeiten! Wenn Phuket Monsun hat (Mai–Okt) ist Ko Samui trocken (Jan–Sept). Perfekte Kombination.</p>
        <p class="mt-2"><strong>Full Moon Party Ko Phangan:</strong> Jeden Monat – Datum mit Mondkalender prüfen. Hotel Wochen vorher buchen!</p>
      </div>`,
  },
};

// ─── VAE (DUBAI) ─────────────────────────────────────────────────────────────
const uaeHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Visum & Einreise</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Visum-Frei für Deutsche!</strong> Aufenthalt bis 90 Tage ohne Visum. Reisepass mind. 6 Monate gültig.</li>
            <li><strong>Keine EHIC:</strong> VAE sind kein EU-Land. Private Auslandskrankenversicherung Pflicht!</li>
            <li><strong>Alkohol-Einfuhr:</strong> 4 Liter Wein oder Bier erlaubt. Über 21 Jahre. Nur für nichtmuslimische Reisende.</li>
          </ul>
        </div>
        <div class="bg-yellow-50 p-3 rounded text-sm">
          <strong>Frauen:</strong> Keine Pflicht für Kopftuch oder besondere Kleidung in Dubai. Aber öffentliches Küssen oder zu freizügige Kleidung außerhalb von Hotels/Stränden ist unangemessen.
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-3 text-sm">
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>DXB Terminal-Check:</strong> Dubai hat 3 Terminals – unbedingt prüfen in welchem Terminal der Flug landet! T1, T2 und T3 sind weit voneinander entfernt.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Medikamente:</strong> Manche in Deutschland erlaubten Medikamente (z.B. Schlaf-/Schmerzmittel mit Codein) sind in den VAE verboten. Medikamentenliste vorab beim UAE-Gesundheitsministerium prüfen!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Ramadan-Einreise:</strong> Öffentliches Essen, Trinken, Rauchen tagsüber verboten (auch für Touristen!). Verstöße können zu Geldstrafen führen.</li>
        </ul>
      </div>`,
  },
  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li>Keine Impfpflichten. Standard-Schutzimpfungen ausreichend.</li>
            <li><strong>Extreme Hitze:</strong> Dubai im Sommer 45–50°C. Zwischen 12–16 Uhr: draußen meiden, ausreichend trinken (mind. 3–4 Liter/Tag).</li>
            <li><strong>AC-Kälte:</strong> Überall 20°C Klimaanlage. Übergangsjacke für Malls und Restaurant ist nützlich.</li>
            <li><strong>Trinkwasser:</strong> Leitungswasser ist trinkbar aber salzig (entsalzt). Flaschenwasser empfohlen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-green-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Krankenhaus Dubai:</strong> Medizinische Versorgung auf Weltklasse-Niveau. American Hospital, Mediclinic – exzellent aber sehr teuer ohne Versicherung.</li>
          <li><strong>Sonnenbrand im Pool:</strong> Trotz Hitze verbrennt man schnell. LSF 50+ und Schirm nutzen.</li>
        </ul>
      </div>`,
  },
  transfer: {
    title: "Transfer",
    iconFa: "fa-plane-arrival",
    color: "bg-blue-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Dubai International (DXB)</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Metro Linie Rot (ab Terminal 1+3): → Dubai Mall/Burj Khalifa ca. 35 Min, 8–10 AED. Günstigste Option!</li>
            <li>Taxi: Festpreis-Zähler. DXB → Downtown ca. 50–80 AED (12–20 €). Sehr günstig für Dubai.</li>
            <li>Hotel-Transfer: Von Hotels oft als Service angeboten (teurer).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-blue-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Dubai Metro:</strong> Weltklasse-System, vollautomatisch. Nol-Karte am Airport kaufen. Gilt für Metro + Bus.</li>
          <li><strong>Careem App:</strong> Dubai's Uber (gehört Uber). Immer Festpreis anzeigen lassen. Günstiger als Taxi für Touristen.</li>
          <li><strong>Water Taxi (Abra):</strong> Überfahrt am Dubai Creek für 1 AED – günstigstes und authentischstes Erlebnis Dubais!</li>
        </ul>
      </div>`,
  },
  finanzen: {
    title: "Finanzen",
    iconFa: "fa-wallet",
    color: "bg-yellow-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Währung:</strong> Dirham (AED). 1 € ≈ 3,90–4,00 AED. Kurs ist an USD gekoppelt (sehr stabil).</li>
            <li><strong>Bargeld:</strong> ATMs überall. Kreditkarte fast überall akzeptiert (Visa/Mastercard).</li>
            <li><strong>Keine Steuern:</strong> Dubai hat keine Einkommens- oder Mehrwertsteuer (außer 5% VAT seit 2018). Shopping ist günstiger als in Deutschland.</li>
            <li><strong>Trinkgeld:</strong> Nicht obligatorisch – ca. 10–15% sind willkommen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-yellow-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Dubai Shopping Festival (Jan/Feb):</strong> Weltgrößtes Shopping-Event mit Rabatten bis 75%. Ideal für Elektronikeinkäufe.</li>
          <li><strong>Gold Souk:</strong> Goldschmuck im traditionellen Basar – Preise sind Weltmarktpreis + geringe Arbeitsgebühr. Deutlich günstiger als in Deutschland!</li>
          <li><strong>Restaurant-Tipp:</strong> "Happy Hour" (oft 17–20 Uhr) für Cocktails und Drinks in Dubai Bars: bis 50% günstiger.</li>
        </ul>
      </div>`,
  },
  technik: {
    title: "Technik",
    iconFa: "fa-wifi",
    color: "bg-indigo-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>EU-Roaming gilt NICHT</strong> – VAE sind kein EU-Land!</li>
            <li><strong>Lokale SIM:</strong> Du oder Etisalat am Flughafen kaufen. 5 GB für 5 Tage ca. 50 AED (12 €).</li>
            <li><strong>eSIM:</strong> Airalo-App bietet UAE-eSIM bequem vorab an.</li>
            <li><strong>Steckdosen:</strong> Typ G (britische 3-eckige Stifte). Adapter mitbringen! In Hotels oft auch Typ F verfügbar.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-indigo-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>VoIP gesperrt:</strong> WhatsApp-Anrufe, FaceTime und Skype sind in den VAE offiziell gesperrt! VPN vorab installieren oder lokale SIM für normale Anrufe nutzen.</li>
          <li><strong>Steckdosen-Adapter Typ G:</strong> Britischer Stecker unbedingt kaufen. In deutschen Drogerien/Amazon erhältlich. Ohne Adapter kein Laden!</li>
        </ul>
      </div>`,
  },
  sicherheit: {
    title: "Sicherheit",
    iconFa: "fa-shield-alt",
    color: "bg-gray-700",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li>Dubai gilt als eine der sichersten Städte der Welt. Kriminalitätsrate extrem niedrig.</li>
            <li><strong>Gesetze sind streng:</strong> Was in Deutschland legal ist, kann in UAE strafbar sein (Alkohol in der Öffentlichkeit, Cannabis, Homosexualität).</li>
            <li><strong>Fotos:</strong> Keine Fotos von Regierungsgebäuden, Militär oder Personen ohne Erlaubnis!</li>
            <li><strong>Notruf:</strong> 999 (Polizei), 998 (Ambulanz), 997 (Feuerwehr).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Social-Media:</strong> Negative Posts über die UAE oder Mitbürger können zu Abschiebung oder Strafe führen. Auch aus Deutschland!</li>
          <li><strong>Schuldner-Haftung:</strong> Wer in UAE Schulden hat, darf nicht ausreisen. Kreditkartenschulden im Urlaub vollständig begleichen!</li>
          <li><strong>Dress Code Malls:</strong> Schultern und Knie bedecken – auch in Einkaufszentren. Schilder am Eingang beachten.</li>
        </ul>
      </div>`,
  },
  kultur: {
    title: "Kultur",
    iconFa: "fa-landmark",
    color: "bg-purple-600",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Freitagsgebet:</strong> Freitags 12–14 Uhr sind Moscheen geschlossen für Nicht-Muslime. Manche Geschäfte verkürzt geöffnet.</li>
            <li><strong>Moschee-Besuch:</strong> Grand Mosque Abu Dhabi für Besucher offen (außer Gebetszeiten). Schultern/Knie bedecken, Frauen: Kopftuch (wird geliehen).</li>
            <li><strong>Arabische Begrüßung:</strong> "As-salamu alaykum" (Friede sei mit dir) – herzlich beantwortet mit "Wa alaykum as-salam".</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <p><strong>Dubai vs. Abu Dhabi:</strong> Dubai ist modern, kosmopolitisch, extrem. Abu Dhabi (1 Std entfernt) ist traditioneller, weniger touristisch. Tagesausflug sehr empfehlenswert (Sheikh Zayed Grand Mosque!).</p>
        <p class="mt-2"><strong>Al Fahidi Historisches Viertel (Dubai):</strong> Das einzige wirklich historische Viertel Dubais. Kostenlos, authentisch, 1 Stunde entfernt von allen Mega-Malls.</p>
      </div>`,
  },
  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Internationales Angebot:</strong> Dubai hat buchstäblich jede Küche der Welt. Authentische Restaurants in den verschiedenen Expat-Vierteln.</li>
            <li><strong>Arabisches Frühstück:</strong> Hummus, Falafel, Foul Medames – günstig und lecker in lokalen Restaurants.</li>
            <li><strong>Alkohol:</strong> Nur in lizenzierten Hotels und Restaurants erhältlich. Nicht in öffentlichen Geschäften!</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <p><strong>Deira Spice Souk:</strong> Authentischer Gewürzmarkt – Safran, Za'atar, Dukhba-Mischungen kaufen. Qualität besser und günstiger als im Supermarkt.</p>
        <p class="mt-2"><strong>Brunch in Dubai:</strong> Freitag-Brunch (12–16 Uhr) in Dubai-Hotels ist eine Institution. All-you-can-eat + Drinks für 150–400 AED. Beliebtes Einheimischen-Erlebnis!</p>
      </div>`,
  },
  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Dubai Metro:</strong> 2 Linien (Rot + Grün). Sauber, pünktlich, günstig. Nol-Karte für alle Fahrten.</li>
            <li><strong>Taxi:</strong> Günstig (für Dubai-Verhältnisse). Zähler Pflicht. Careem-App für komfortables Buchen.</li>
            <li><strong>Mietwagen:</strong> Möglich – Verkehr in Dubai ist moderat und geordnet. Parkplätze an Malls immer kostenlos.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Metro-Timing:</strong> Freitags läuft die Metro ab 10 Uhr (statt 6 Uhr) – Planänderungen am Freitagmorgen beachten!</li>
          <li><strong>Gold Souk per Abra:</strong> Vom Bur Dubai-Ufer mit der traditionellen Holzboot-Fähre (Abra) für 1 AED ans Deira-Ufer zum Gold Souk – schönste Überfahrt der Stadt.</li>
          <li><strong>Bus Dubai:</strong> AC-Busse sind günstig (2–3 AED) aber Fahrpläne komplex. App "S'hail" hilft.</li>
        </ul>
      </div>`,
  },
  planung: {
    title: "Planung",
    iconFa: "fa-calendar-alt",
    color: "bg-pink-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Beste Reisezeit</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>November–März:</strong> Perfekt! 22–30°C, angenehm für Outdoor-Aktivitäten.</li>
            <li><strong>April–Oktober:</strong> 35–50°C. Sehr heiß aber Pools und Malls sind perfekt klimatisiert. Günstigste Preise!</li>
            <li><strong>Ramadan:</strong> Ruhigere Stimmung, eingeschränkte Gastronomie tagsüber, aber einzigartige Atmosphäre abends beim Iftar-Brechen des Fastens.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <p><strong>Dubai Frame:</strong> Das "Bilderrahmen"-Gebäude bietet den besten Blick auf Alt- und Neu-Dubai gleichzeitig. Weniger bekannt als Burj Khalifa, günstiger und faszinierend.</p>
        <p class="mt-2"><strong>Burj Khalifa Tickets:</strong> Level 124 Ticket online WEIT im Voraus buchen (besonders Sunset-Zeiten ausgebucht). Level 148 (teurer) hat meist freie Slots.</p>
      </div>`,
  },
};

// ─── REGISTRY ──────────────────────────────────────────────────────────────
const hubRegistry: Record<string, HubData> = {
  Türkei: turkeyHubData,
  Spanien: spainHubData,
  Griechenland: greeceHubData,
  Ägypten: egyptHubData,
  Italien: italyHubData,
  Portugal: portugalHubData,
  Thailand: thailandHubData,
  VAE: uaeHubData,
};

export function getHubDataByCountry(country: string): HubData | null {
  return hubRegistry[country] ?? null;
}
