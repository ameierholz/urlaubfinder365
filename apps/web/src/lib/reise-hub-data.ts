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
            <li>Deutsche SIM wieder einlegen / Urlaubsprofil deaktivieren.</li>
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

// ─── KROATIEN ───────────────────────────────────────────────────────────────
const croatiaHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Dokumente &amp; Formalitäten</h4>
          <p class="mb-3 text-sm italic">Kroatien ist seit Januar 2023 Schengen-Mitglied und seit Januar 2023 auch im Euro-Raum. Das erleichtert die Reise erheblich.</p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Reisedokumente:</strong> Als EU-Bürger reicht der gültige Personalausweis. Reisepass ebenfalls akzeptiert.</li>
            <li><strong>Kein Visum:</strong> Kroatien ist Schengen-Land – volle EU-Freizügigkeit, keine Grenzkontrollen.</li>
            <li><strong>Währung:</strong> Seit 1. Januar 2023 ist der Euro (EUR) offizielles Zahlungsmittel. Kein Wechseln nötig.</li>
            <li><strong>Krankenversicherung:</strong> EHIC (Europäische Krankenversicherungskarte) ist gültig. Zusätzliche Auslandskrankenversicherung empfohlen.</li>
            <li><strong>Einreise per Fähre/Schiff:</strong> Reisepass oder Personalausweis wird bei Ticketkauf und Einschiffung kontrolliert.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise: Alltag &amp; Besonderheiten</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block text-gray-900 mb-1">Inseln &amp; Fährverkehr</strong>
              Viele Top-Ziele (Hvar, Brač, Korčula) nur per Fähre erreichbar. Tickets über <em>Jadrolinija.hr</em> buchen. Im Sommer Wochen im Voraus!
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block text-gray-900 mb-1">Bezahlen</strong>
              Euro überall akzeptiert. Kartenzahlung weit verbreitet. Auf kleinen Inseln und Märkten Bargeld sinnvoll.
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nach der Reise: Zoll &amp; Mitnahme</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left text-gray-500 border rounded-lg">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr><th class="px-2 py-2">Kategorie</th><th class="px-2 py-2">Freimenge (DE)</th><th class="px-2 py-2">Hinweis</th></tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Warenwert</td><td class="px-2 py-2">EU-unbegrenzt</td><td class="px-2 py-2">Keine Zollgrenzen innerhalb EU</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Olivenöl</td><td class="px-2 py-2">unbegrenzt</td><td class="px-2 py-2">Top-Qualität aus Istrien mitbringen!</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Wein/Spirituosen</td><td class="px-2 py-2">unbegrenzt (privat)</td><td class="px-2 py-2">Nur keine kommerzielle Menge</td></tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 text-sm">
            <p class="font-bold">Euro-Hinweis</p>
            <p>Seit dem 1. Januar 2023 gilt der Euro in Kroatien. Kuna ist nicht mehr gültig. Restbestände können bei der Kroatischen Nationalbank in Zagreb noch eingetauscht werden.</p>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-lg text-indigo-900 mb-2">Einreise &amp; Fähren: Profi-Tipps</h4>
          <ul class="space-y-3 text-sm">
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>Jadrolinija-Ticket-Hack:</strong> Für die beliebten Routen (Split–Hvar, Split–Brač) immer das Ticket mit Fahrzeug vorbuchen. Ohne Buchung droht stundenlange Wartezeit im Sommer.</li>
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>Schnellfähren vs. Ro-Ro-Fähren:</strong> Schnellfähren (Katamaran) sind 2–3x teurer aber deutlich schneller. Für Tagesausflüge ideal. Auto nur auf Ro-Ro-Fähren möglich.</li>
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>Schengen-Eintritt 2023:</strong> Keine Grenzkontrollen mehr an den Landgrenzen zu Slowenien und Ungarn. Autobahnvignette für Slowenien (falls Transitstrecke) nicht vergessen!</li>
            <li class="bg-indigo-50 p-3 rounded-lg"><strong>Dubrovnik-Ausnahme:</strong> Für die Einreise nach Dubrovnik über Bosnien (Neum-Korridor) brauchen Non-EU-Bürger besondere Aufmerksamkeit. EU-Bürger: kein Problem.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-lg text-amber-900 mb-2">Kroatische Vignetten &amp; Maut</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="border p-3 rounded"><strong>Mautstraßen:</strong><br/>Kroatische Autobahnen (HAC) sind mautpflichtig. Bezahlung per Bargeld, Karte oder ETC-System. Keine Vignette wie in Slowenien/Österreich.</div>
            <div class="border p-3 rounded"><strong>Küstenstraße D8:</strong><br/>Die Magistrale entlang der Küste ist mautfrei und malerisch schön. Deutlich langsamer, aber unvergesslich.</div>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Prävention</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Impfschutz:</strong> Keine Pflichtimpfungen. Empfohlen: Tetanus, Hepatitis A. Bei Naturaufenthalten: FSME (Frühsommer-Meningoenzephalitis) in manchen Regionen relevant.</li>
            <li><strong>EHIC-Karte:</strong> Kroatien ist EU-Mitglied – EHIC wird anerkannt.</li>
            <li><strong>Reiseapotheke:</strong> Sonnenschutz LSF 50+, Meerwasser-Nasenspray, Desinfektionsgel, Schmerzmittel, Pflaster.</li>
            <li><strong>Seegeln/Tauchen:</strong> Wer segelt oder taucht: Dekompressionstabellen und Notfallnummer der Tauchrettung (Hyperbarische Kammer in Split und Rijeka) notieren.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Seeigel &amp; Quallen</strong>An felsigen Stränden Badeschuhe tragen. Im Spätsommer können Quallen (Meduse) auftreten. Ammoniak-Spray hilft bei Stichen.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Hitze &amp; Sonne</strong>Im Juli/August bis 38°C an der Küste. Zwischen 12–16 Uhr Schatten suchen, min. 2–3 Liter Wasser trinken.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Trinkwasser</strong>Leitungswasser in Kroatien ist trinkbar und von guter Qualität – eine der positiven Überraschungen!</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nach der Reise</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li>Bei Zeckenbiss nach Waldwanderungen Arzt aufsuchen (FSME-Risiko in Kontinentalkroatien).</li>
            <li>Auf Hautreizungen durch Quallen oder Korallen achten.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Gesundheits-Insider Kroatien</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Tauch-Notfall Split:</strong> Die Hyperbarische Kammer (Dekompressionskammer) befindet sich in der Klinik in Split. Notruf für Taucher: +385 21 340 323.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Seeigel-Notfallbehandlung:</strong> Kroatische Apotheker (Ljekarna) empfehlen: Wunde mit Öl tränken und Stacheln mit feiner Pinzette entfernen. Bei Entzündung zum Arzt.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Naturkosmetik:</strong> Lavendelöl von der Insel Hvar ist weltberühmt und hervorragend für Sonnenbrand geeignet. Als Souvenir mitbringen!</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Wasserqualität Kroatien:</strong> Kroatische Badeseen und Meeresküste haben EU-Blue-Flag-Standard. Das Adriatische Meer ist eines der saubersten Europas.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Flughäfen &amp; Anreise</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Dubrovnik (DBV)</strong>
              Taxi → Altstadt: ca. 25–35 €, 20 Min.<br/>
              Bus Atlas: ca. 5 €, Haltestelle direkt am Airport.<br/>
              Achtung: Im Sommer extrem hohe Touristendichte in der Altstadt.
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Split (SPU)</strong>
              Taxi → Zentrum: ca. 15–20 €, 10 Min.<br/>
              Bus Linie 37: ca. 2 €, Fahrt ca. 30 Min.<br/>
              Fähren nach Hvar, Brač, Korčula direkt vom Fährhafen Split.
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Zagreb (ZAG)</strong>
              Bus Airport Shuttle → Zentrum: ca. 4 €, 30 Min.<br/>
              Taxi: ca. 20–30 €.<br/>
              Für Küstenorte: Weiterreise per Bus (FlixBus/AutoTrans) oder Mietwagen.
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Fähren: Das wichtigste Transportmittel</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Jadrolinija:</strong> Staatliche Fährgesellschaft, zuverlässig, günstig. App verfügbar.</li>
            <li><strong>Krilo/Kapetan Luka:</strong> Private Schnellfähren (Katamarane) zwischen Split, Hvar, Korčula, Dubrovnik.</li>
            <li><strong>Buchung:</strong> Im Sommer (Juli/August) unbedingt mindestens 2–3 Wochen im Voraus buchen!</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Transfer-Hacks Kroatien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Hvar ohne Auto:</strong> Hvar ist autofrei (Hauptort). Moped oder E-Bike mieten. Gepäck per Gepäcktransport-Service ins Hotel schicken lassen – dieser Service wird am Fährhafen angeboten.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Küstenstraße Tipp:</strong> Die Fahrt von Split nach Dubrovnik entlang der Magistrale (D8) dauert 4–5 Stunden (vs. 2,5 Std. Autobahn). Lohnt sich für den Panoramablick!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Taxi-App:</strong> "Bolt" ist in Kroatien aktiv (auch in Split und Dubrovnik). Deutlich günstiger als normale Taxis.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Dubrovnik-Kreuzfahrtfalle:</strong> Im Sommer dringen täglich bis zu 10.000 Kreuzfahrtpassagiere in die Altstadt. Altstadt früh morgens (vor 9 Uhr) oder abends besuchen.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Geld in Kroatien</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Währung:</strong> Euro (EUR) seit Januar 2023 – kein Wechseln nötig!</li>
            <li><strong>Kartenzahlung:</strong> Weit verbreitet, auch in kleinen Restaurants. Kontaktlos Standard.</li>
            <li><strong>Bargeld:</strong> Für Märkte, kleine Inseln und Fähranbieter empfohlen.</li>
            <li><strong>ATMs:</strong> In Städten und auf den großen Inseln (Hvar, Brač, Korčula) ausreichend vorhanden. Auf sehr kleinen Inseln begrenzt.</li>
            <li><strong>Trinkgeld:</strong> 10% sind üblich in Restaurants. Kleingeld aufrunden bei Cafés und Bars.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Preisniveau</h4>
          <div class="bg-yellow-50 p-3 rounded text-sm">
            Kroatien ist nach der Euro-Einführung teurer geworden. Dubrovnik und Hvar sind sehr teuer (ähnlich Westeuropa). Split und die Inseln der Mittelküste günstiger. Kontinentalkroatien (Zagreb) günstigstes Preisniveau.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Spar-Tipps Kroatien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Konoba statt Touristenrestaurant:</strong> Eine "Konoba" (traditionelle Taverne) ist der authentischste und günstigste Weg zu essen. Frischer Fisch, Grillgerichte, Hauswein direkt vom Erzeuger.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Dubrovnik Stadtmauer-Hack:</strong> Eintritt 35 € (2026). Frühmorgens (9 Uhr) ist es noch kühl und weniger voll. Die gleichen Postkarten-Fotos für viel weniger Stress.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Lokaler Wein (Plavac Mali):</strong> Kroatischer Wein direkt vom Winzer kaufen – Stari Grad auf Hvar oder Pelješac-Halbinsel. 1/4 des Restaurant-Preises.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Nationalpark-Tickets online:</strong> Plitvicer Seen und Krka: Online-Tickets sind PFLICHT und 10–20 % günstiger als an der Kasse. Im Sommer täglich ausgebucht!</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Konnektivität</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>EU-Roaming:</strong> Gilt vollständig in Kroatien – deutsche SIM ohne Aufpreis nutzbar.</li>
            <li><strong>WLAN:</strong> In Hotels, Restaurants und Cafés flächendeckend. Fähren und Boote oft ohne WLAN.</li>
            <li><strong>Netzabdeckung:</strong> Auf kleinen Inseln und in Buchten kann das Netz schwach sein.</li>
            <li><strong>Steckdosen:</strong> Typ C und F (Schuko) wie in Deutschland – kein Adapter nötig. 230 Volt.</li>
            <li><strong>Offline-Karten:</strong> Für Inseltouren (Moped, Wandern) unbedingt Google Maps offline laden.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nützliche Apps</h4>
          <div class="bg-gray-50 p-3 rounded text-sm">
            <ul class="space-y-1">
              <li><strong>Jadrolinija:</strong> Offizielle Fähr-App (Fahrpläne, Tickets).</li>
              <li><strong>Bolt:</strong> Ride-Sharing, günstiger als Taxis.</li>
              <li><strong>Croatia Maps (Maps.me):</strong> Offline-Karten für Wanderwege.</li>
              <li><strong>Parkmate / EasyPark:</strong> Parken in Städten (Zagreb, Split, Dubrovnik).</li>
            </ul>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Tech-Hacks für Kroatien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Fähre-App Trick:</strong> Jadrolinija-App zeigt Echtzeit-Auslastung. Grün = Platz frei, Gelb = fast voll. So spontan die richtige Fähre wählen.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Drohnen-Regelung:</strong> In Kroatien gelten EU-Drohnenregeln (EASA). In Nationalparks (Plitvicer Seen, Krka) ist Fliegen verboten. Registrierung in DE reicht für EU-Länder.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Kein Adapter nötig:</strong> Typ F (Schuko) wie in Deutschland. 230 Volt, 50 Hz. Alle deutschen Geräte funktionieren direkt.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Maut-App HAC-ENC:</strong> Für häufige Autobahnnutzer lohnt sich das ENC-System (elektronische Mautzahlung). Geräte an Mautstationen ausleihbar.</li>
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
          <p class="mb-2">Kroatien ist eines der sichersten Reiseziele Europas. Gewaltkriminalität gegenüber Touristen ist extrem selten.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Hauptrisiko:</strong> Taschendiebstahl in Dubrovniks Altstadt und auf Fähren in der Hauptsaison.</li>
            <li><strong>Verkehrssicherheit:</strong> Küstenstraßen (Magistrale) sind kurvenreich und steil. Vorsichtig fahren, keine Ablenkung.</li>
            <li><strong>Badeunfälle:</strong> FKK-Strände und felsige Buchten ohne Rettungsschwimmer. Vorsicht bei Strömungen.</li>
          </ul>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <strong>Notrufnummern Kroatien:</strong><br/>
          112 – Europäischer Notruf<br/>
          192 – Polizei (Policija)<br/>
          193 – Feuerwehr (Vatrogasci)<br/>
          194 – Krankenwagen (Hitna pomoć)<br/>
          195 – Seenotrettung (MRCC Split)
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Insider</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li>In Dubrovnik Wertsachen im Hotel lassen – in der Altstadt herrscht gedrängte Enge ideal für Taschendiebe.</li>
          <li><strong>Seenotrettung MRCC Split:</strong> +385 51 195. Wer segelt oder mit einem kleinen Boot unterwegs ist, sollte diese Nummer kennen.</li>
          <li><strong>Bergrettung:</strong> Bei Wanderunfällen im Velebit oder Biokovo-Gebirge: 112. Kroatische Bergrettung (HGSS) ist sehr professionell.</li>
          <li><strong>Deutsche Botschaft Zagreb:</strong> +385 1 630 0100. Für Passverlust, Haftfälle und Notfälle.</li>
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
          <h4 class="font-bold text-gray-900 mb-2">Kroatische Lebensart</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Fjaka:</strong> Das kroatische Lebensgefühl – Genuss der Ruhe, der Langsamkeit und des Moments. Nicht hetzen!</li>
            <li><strong>Sprache:</strong> Kroatisch (Hrvatska). "Hvala" (Danke) und "Molim" (Bitte) werden sehr geschätzt. Englisch wird in Touristengebieten gut gesprochen.</li>
            <li><strong>Kirchen &amp; Klöster:</strong> Schultern und Knie bedecken. Besonders auf den Inseln gibt es wunderschöne Klöster (Hvar, Korčula).</li>
            <li><strong>UNESCO-Welterbe:</strong> Dubrovnik (Altstadt), Split (Diokletianspalast), Plitvicer Seen, Stari Grad (Hvar) – alle einzigartig.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how</strong>
        <p><strong>Klapa-Gesang:</strong> Der mehrstimmige, unbegleitete Männergesang der Dalmatiner-Küste steht auf der UNESCO-Immateriellen-Kulturerbe-Liste. Im Sommer gibt es überall Konzerte – oft kostenlos auf Dorfplätzen.</p>
        <p class="mt-2"><strong>Game of Thrones Drehorte:</strong> Dubrovnik = "King's Landing". Geführte Touren sehr populär – eigene Erkundung mit dem Buch/der Serie als Karte ist günstiger und persönlicher.</p>
        <p class="mt-2"><strong>Krawatte:</strong> Die Krawatte wurde in Kroatien erfunden (von kroatischen Soldaten im 30-jährigen Krieg). Das Wort kommt von "Kroate" (franz. Cravate).</p>
      </div>`,
  },

  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Kroatische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Frischer Fisch &amp; Meeresfrüchte:</strong> Tintenfisch (Hobotnica), Garnelen, frisch gegrillter Branzino. Auf Inseln direkt vom Fischer.</li>
            <li><strong>Peka:</strong> Fleisch oder Oktopus unter der Peka-Glocke mit Glut gegart – das beste Gericht der dalmatinischen Küche. Muss 2–3 Stunden im Voraus bestellt werden.</li>
            <li><strong>Istrien:</strong> Trüffel (Tartufi), Olive und Wein. Istrischer Weißwein (Malvazija) und Rotein (Teran) weltweit exportiert.</li>
            <li><strong>Schwarzrisotto (Crni rižot):</strong> Mit Tintenfischtinte – sieht dramatisch aus, schmeckt sensationell.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Essen wie Einheimische</strong>
        <p><strong>Konoba-Regel:</strong> Meidet Restaurants mit Speisekarte auf Englisch an der Tür und Plastikschildern mit Fotos. Die besten Konoben haben handgeschriebene Menüs auf Kroatisch und sind für Einheimische gemacht.</p>
        <p class="mt-2"><strong>Peka-Geheimtipp:</strong> Peka mindestens 2 Stunden vor Besuch telefonisch bestellen. Das Restaurant bereitet es frisch vor und es ist die authentischste Erfahrung der dalmatinischen Küche.</p>
        <p class="mt-2"><strong>Maraschino-Likör:</strong> Der kroatische Kirschlikör aus Zadar ist weltberühmt. Direkt in der Destillerie Luxardo in Zadar kaufen.</p>
      </div>`,
  },

  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung in Kroatien</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Mietwagen:</strong> Ideal für die Küste und Inseln. EU-Führerschein ausreichend. Im Sommer unbedingt vorbuchen.</li>
            <li><strong>Fähren:</strong> Zentrales Verkehrsmittel. Jadrolinija und private Anbieter. App oder jadrolinija.hr für Buchungen.</li>
            <li><strong>Busse:</strong> FlixBus und AutoTrans verbinden Küstenstädte. Split–Dubrovnik: ca. 4 Stunden, 15–25 €.</li>
            <li><strong>Moped/E-Bike:</strong> Auf autofreien Inseln (Hvar, Vis) perfektes Fortbewegungsmittel.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Hacks</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Insel Vis ohne Massen:</strong> Vis hat keine eigene Fähre von Dubrovnik – das hält Massen fern. Über Split anreisen für authentischstes Inselerlebnis Dalmatiens.</li>
          <li><strong>Bolt Taxi:</strong> In Split und Dubrovnik verfügbar. Spart oft 30–50% gegenüber regulären Taxis.</li>
          <li><strong>Plitvicer Seen ohne Auto:</strong> FlixBus hält auf Anfrage direkt vor dem Nationalpark-Eingang (Route Zagreb–Split). Günstigste und stressfreiste Option.</li>
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
            <li><strong>Mai–Juni:</strong> Ideal! Warm (25–28°C), weniger Touristen, alles geöffnet. Günstigste Preise der Saison.</li>
            <li><strong>September–Oktober:</strong> Wasser noch warm (23–25°C), Trauben-Ernte, Herbststimmung, Preise sinken.</li>
            <li><strong>Juli–August:</strong> Hauptsaison. Heiß, voll, teuer. Dubrovnik und Hvar besonders überlaufen.</li>
            <li><strong>Winter:</strong> Küste ruhig und günstig. Zagreb mit Weihnachtsmarkt (einer der schönsten Europas!).</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Geheimtipps</strong>
        <p><strong>Juni ist das neue August:</strong> Kroatien-Kenner reisen im Juni. 27°C, Meer perfekt zum Baden (22°C), keine Schlangen vor Sehenswürdigkeiten, 20–40% günstigere Unterkunftspreise.</p>
        <p class="mt-2"><strong>Nationalpark-Tickets Pflicht:</strong> Plitvicer Seen und Krka NUR online buchbar (auf der offiziellen Website). Im Sommer täglich ausverkauft – mindestens 2 Wochen im Voraus buchen!</p>
        <p class="mt-2"><strong>Dubrovnik-Tipp:</strong> Wer nur Dubrovnik besucht, kommt mit 4–5 Tagen aus. Mit Ausflügen zu Inseln (Lokrum, Kotor/Montenegro) mind. 7 Tage einplanen.</p>
      </div>`,
  },
};

// ─── MAROKKO ────────────────────────────────────────────────────────────────
const moroccoHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Dokumente &amp; Einreise</h4>
          <p class="mb-3 text-sm italic">Marokko liegt außerhalb der EU – ein paar Formalitäten sollten vorab geklärt werden.</p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Reisedokumente:</strong> Gültiger Reisepass erforderlich. Personalausweis reicht NICHT aus. Reisepass muss noch mindestens 6 Monate gültig sein.</li>
            <li><strong>Visum:</strong> Deutsche Staatsbürger benötigen kein Visum für touristische Aufenthalte bis 90 Tage.</li>
            <li><strong>Einreisekarte:</strong> An Bord des Flugzeugs oder am Flughafen wird eine Einreisekarte ausgefüllt. Aufbewahren bis zur Ausreise!</li>
            <li><strong>Krankenversicherung:</strong> EHIC gilt NICHT. Private Auslandskrankenversicherung mit Rücktransport-Deckung ist Pflicht.</li>
            <li><strong>Impfungen:</strong> Keine Pflichtimpfungen. Empfohlen: Hepatitis A und B, Tetanus, Typhus bei Individualreise.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Zoll: Mitnahme &amp; Verbote</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left text-gray-500 border rounded-lg">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr><th class="px-2 py-2">Kategorie</th><th class="px-2 py-2">Regelung</th><th class="px-2 py-2">Hinweis</th></tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Bargeld Einreise</td><td class="px-2 py-2">bis 10.000 MAD</td><td class="px-2 py-2">Darüber hinaus deklarieren</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Alkohol</td><td class="px-2 py-2">1 Flasche</td><td class="px-2 py-2">Für persönlichen Gebrauch</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Tabak</td><td class="px-2 py-2">200 Zigaretten</td><td class="px-2 py-2">Standard</td></tr>
                <tr class="bg-red-50 border-b"><td class="px-2 py-2 font-bold text-red-700">Drogen</td><td class="px-2 py-2 text-red-700 font-bold">VERBOTEN</td><td class="px-2 py-2 text-red-700">Auch Cannabis – schwere Strafen!</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Dirham (MAD)</td><td class="px-2 py-2">max. 2.000 MAD</td><td class="px-2 py-2">Nicht ausführbar</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Einreise-Insider Marokko</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Einreisekarte nicht verlieren:</strong> Die Einreisekarte (Fiche d'entrée) wird bei der Ausreise eingezogen. Ohne sie kann es Probleme geben. Direkt im Pass aufbewahren.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Dirham NICHT vorab kaufen:</strong> In Deutschland kaum erhältlich und schlechter Kurs. Direkt am Flughafen-ATM oder in Wechselstuben in Marokko tauschen.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Cannabis-Warnung:</strong> Trotz weit verbreiteter Verfügbarkeit im Land (Rif-Gebirge) ist Cannabis in Marokko illegal. Bei Festnahme drohen Gefängnisstrafen. Finger weg!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Fähre Spanien–Marokko:</strong> Von Algeciras/Tarifa nach Tanger: Reisepass obligatorisch (kein Personalausweis!). Fähre nimmt ca. 35–60 Min.</li>
        </ul>
      </div>`,
  },

  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Vorsorge</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Impfungen:</strong> Hepatitis A dringend empfohlen, Typhus bei Individualreise. Tollwut bei Tierkontakt oder Abenteuerreisen.</li>
            <li><strong>Reiseapotheke Marokko:</strong> Imodium (Durchfall), Elektrolytpulver, Antibiotika auf Reiserezept, Sonnenschutz LSF 50+, Mückenschutz, Desinfektion.</li>
            <li><strong>Auslandskrankenversicherung:</strong> Mit Rücktransport-Klausel – medizinische Versorgung in ländlichen Regionen sehr begrenzt.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-red-50 p-3 rounded border border-red-100"><strong class="text-red-800 block mb-1">Montezumas Rache (Traveller's Diarrhea)</strong>Sehr häufig bei Ersttouristen. Niemals Leitungswasser trinken, Salate mit rohem Wasser waschen, ungeschältes Obst meiden. Nur Flaschenwasser!</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Hitze &amp; Wüste</strong>In der Sahara bis 50°C möglich. Mind. 4–5 Liter Wasser pro Tag. Heller, loser Kleidung tragen. Niemals allein ohne Führer in die Wüste!</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Sonnenbrand Atlantikküste</strong>Der Atlantikwind kühlt täuschend – Sonnenbrand merkt man erst abends. LSF 50+ auch bei bewölktem Himmel!</div>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Gesundheits-Tipps Marokko</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Arganöl als Erste Hilfe:</strong> Das marokkanische Arganöl ist ein bewährtes Hausmittel bei Sonnenbrand und Hautreizungen. In jedem Souk erhältlich – aber auf echter Herkunft achten!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Magen eingewöhnen:</strong> Die ersten 2 Tage sehr vorsichtig essen. Dann schrittweise Straßenessen probieren. Körper braucht Zeit sich einzugewöhnen.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Tierarzt oder Krankenhaus bei Tierbiss:</strong> Marokko ist NICHT tollwutfrei. Bei Biss durch Hund, Katze oder Affe sofort Krankenhaus aufsuchen für Impf-Serie.</li>
          <li class="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><strong>Clinique du Coeur Marrakesch:</strong> Beste Privatklinik für Touristen. Für schwere Fälle: Casablanca hat die modernsten Krankenhäuser des Landes.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Flughäfen &amp; Hauptziele</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Marrakesch (RAK)</strong>
              Taxi → Medina: ca. 10–20 €, 15 Min. (Preis vorab vereinbaren!)<br/>
              Bus Linie 19: ca. 0,70 €, 45 Min.<br/>
              Achtung: Taxi-Fahrer am Flughafen sind berühmt für Übervorteilung. Vorab vereinbaren!
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Agadir (AGA)</strong>
              Taxi → Strand/Zentrum: ca. 10–15 €, 20 Min.<br/>
              Resorthotels oft mit eigenem Transfer-Service.
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Fes (FEZ) / Marrakesch ↔ Fes</strong>
              Zug (ONCF): Marrakesch–Casablanca–Fes. Ca. 8 Stunden, komfortabel, ca. 15–20 €. Tickets online auf oncf.ma.
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Innertransport</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Zug (ONCF):</strong> Modernes Netz zwischen Tanger, Rabat, Casablanca, Fes und Marrakesch. Empfohlen für Städtereisen.</li>
            <li><strong>CTM-Busse:</strong> Komfortable Überlandbusse zwischen allen Städten. Buchen auf ctm.ma.</li>
            <li><strong>Grands Taxis:</strong> Kollektiv-Taxis zwischen Städten. Sehr günstig, man wartet bis alle 6 Plätze belegt sind.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Transfer-Geheimtipps Marokko</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Taxi-Preis immer VOR der Fahrt:</strong> Marokkaner Taxis haben oft kein Taxameter oder es "funktioniert". IMMER vor der Fahrt einen Festpreis verhandeln!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Petit Taxi vs. Grand Taxi:</strong> Petit Taxi (Stadtfahrten, meistens rot/blau): Kurze Strecken, günstig. Grand Taxi (Überlandfahrten): Bis 6 Personen geteilt, sehr günstig.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Al Boraq Hochgeschwindigkeitszug:</strong> Tanger–Casablanca in 2,1 Stunden (320 km/h!). Modernster Zug Afrikas. Tickets: oncf.ma.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>"Falscher Guide"-Falle:</strong> Am Flughafen und in Medinas sprechen oft "Freundliche" an, die als inoffizielle Führer wirken. Nur offizielle, lizenzierte Guides (ONMT) engagieren.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Währung &amp; Bezahlen</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Währung:</strong> Marokkanischer Dirham (MAD). 1 € ≈ 10,8–11 MAD (2026).</li>
            <li><strong>Dirham ist nicht konvertibel:</strong> Nur in Marokko tauschen, nicht im Ausland. Restbestände im Land ausgeben oder zurücktauschen (mit Quittung).</li>
            <li><strong>Bargeld ist König:</strong> Auf Märkten (Souks), in kleinen Restaurants und Riad's fast immer Bargeld nötig.</li>
            <li><strong>Kartenzahlung:</strong> In Hotels und größeren Restaurants akzeptiert. Weniger verbreitet als in Europa.</li>
            <li><strong>ATMs:</strong> In Städten ausreichend vorhanden. Auf dem Land und in der Sahara vorher Bargeld abheben!</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Preise &amp; Trinkgeld</h4>
          <div class="bg-yellow-50 p-3 rounded text-sm">
            <strong>Trinkgeld-Kultur:</strong> 10% im Restaurant, 5–10 MAD für Gepäckträger, 20–50 MAD für Stadtführer pro Stunde.<br/>
            <strong>Handeln auf Souks:</strong> Pflicht und Spaß zugleich! Erster Preis: immer zu hoch. Mit 30–50% des Startpreises beginnen.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Finanz-Hacks Marokko</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
            <strong class="text-indigo-900 block mb-1">Der beste Wechselkurs:</strong>
            Geldwechsel in offiziellen Wechselstuben (Bureau de Change) in der Medina. Niemals am Flughafen oder im Hotel – oft 10–15% schlechterer Kurs.
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Handeln richtig gemacht:</strong> Preisverhandlung ist ein gesellschaftliches Ritual. Mit Humor und Respekt handeln. Niemals einen Preis nennen, den man nicht zahlen will. "Inshallah" bedeutet "mal sehen" – das Gespräch läuft noch.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Mitnahme Dirham:</strong> Maximal 2.000 MAD dürfen bei Ausreise mitgenommen werden. Überschuss am Flughafen in Euro zurücktauschen (offizielle Quittung mitbringen!).</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Schwarzmarkt-Wechsel:</strong> Wird angeboten – nie annehmen! Falsches Geld oder Betrug sind häufige Folgen.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Konnektivität</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Roaming:</strong> EU-Roaming gilt NICHT in Marokko! Teures Roaming mit deutschem Anbieter. eSIM (Airalo, Holafly) oder lokale SIM empfohlen.</li>
            <li><strong>Lokale SIM:</strong> Maroc Telecom, inwi, Orange Maroc. An Flughäfen und überall in Städten erhältlich. Reisepass mitbringen.</li>
            <li><strong>WLAN:</strong> In Riads und Hotels gut. In Cafés und Restaurants oft verfügbar. In der Sahara und auf dem Land sehr begrenzt.</li>
            <li><strong>Steckdosen:</strong> Typ C und Typ E. Typ C (wie in DE) funktioniert. 220 Volt. Kein Adapter nötig für deutsche Geräte mit Euro-Stecker.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nützliche Apps</h4>
          <div class="bg-gray-50 p-3 rounded text-sm">
            <ul class="space-y-1">
              <li><strong>Google Maps Offline:</strong> Karte vor Reise herunterladen (Marrakesch Medina ist ein Labyrinth!).</li>
              <li><strong>oncf.ma App:</strong> Zugtickets online kaufen (ONCF Bahn).</li>
              <li><strong>Careem:</strong> Ride-Hailing App in Marokko (wie Uber). Festpreise, keine Verhandlung.</li>
            </ul>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Tech-Tipps Marokko</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>eSIM Empfehlung:</strong> Airalo "Marokko Discover"-Paket: 10 GB für ca. 12 €. Vor Abflug aktivieren – spart lästige SIM-Suche am Flughafen.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Offline-Karten Pflicht:</strong> Die Medinas von Fes und Marrakesch sind historische Labyrinthe ohne Straßenschilder. Google Maps Offline vorab laden!</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>VPN:</strong> Manche VoIP-Dienste (WhatsApp-Anrufe) können in Marokko gedrosselt sein. VPN vorab installieren.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Stecker-Info:</strong> Typ C (Euro-Stecker) funktioniert direkt. Nur UK-Stecker und US-Stecker brauchen Adapter.</li>
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
          <p class="mb-2">Marokko ist für nordafrikanische Verhältnisse sehr sicher. Das Tourismusministerium investiert stark in Sicherheit.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Hauptrisiko:</strong> Trickbetrug, falsche Guides, Übervorteilung bei Taxipreisen – kein physisches Sicherheitsrisiko.</li>
            <li><strong>Frauen allein:</strong> Belästigung (verbale) kann in Medinas vorkommen. Souks tagsüber sicher, abends mit Gruppe.</li>
            <li><strong>Atlantikküste:</strong> Starke Strömungen und Wellen. Nie an unmarkierten Stränden ohne Sicherheitshinweise schwimmen.</li>
          </ul>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <strong>Notrufnummern Marokko:</strong><br/>
          19 – Polizei (Police)<br/>
          15 – Krankenwagen (SAMU)<br/>
          150 – Gendarmerie (ländliche Gebiete)<br/>
          177 – Küstenwache (Protection Civile)
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Insider Marokko</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Deutsche Botschaft Rabat:</strong> +212 537 21 0 900. Bei Passverlust, Notfall oder Inhaftierung.</li>
          <li><strong>Brigade Touristique:</strong> Touristenpolizei gibt es in allen größeren Städten. Erkennbar an "Police Touristique"-Weste. Ansprechbar auf Französisch.</li>
          <li><strong>Nacht-Medina:</strong> In der Nacht die engen Gassen der Fes-Medina nur mit ortskundiger Begleitung.</li>
          <li><strong>Rucksack vorne tragen</strong> in Medinas und überfüllten Souks. Wertsachen am Körper, nicht im Rucksack.</li>
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
          <h4 class="font-bold text-gray-900 mb-2">Islamische Kultur &amp; Respekt</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Kleidung:</strong> Schultern und Knie bedecken (besonders Frauen). In Moscheen: Kopftuch für Frauen, Schuhe ausziehen. Nicht-Muslime dürfen die meisten Moscheen NICHT betreten (Ausnahme: Hassan-II.-Moschee Casablanca).</li>
            <li><strong>Ramadan:</strong> Kein Essen, Trinken oder Rauchen in der Öffentlichkeit tagsüber. Restaurants sind tagsüber geschlossen, abends (nach Iftar) lebhaft.</li>
            <li><strong>Fotografieren:</strong> Immer vorher fragen! Frauen und Ältere mögen oft nicht fotografiert werden. Kleines Trinkgeld bei Portraitfotografie üblich.</li>
            <li><strong>Sprachen:</strong> Arabisch (Darija-Dialekt), Tamazight (Berber), Französisch. "Shukran" (Danke) und "La Bès" (Wie geht's? / Alles gut) kommen sehr gut an.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how Marokko</strong>
        <p><strong>Hammam-Erlebnis:</strong> Ein echtes marokkanisches Bad ist ein Muss. Öffentliche Hammams (in jedem Viertel) sind für 5–10 MAD zugänglich – ein authentisches Erlebnis, das Touristenhammams nicht bieten können.</p>
        <p class="mt-2"><strong>Minaret-Ruf (Adhan):</strong> Der Gebetsruf fünfmal täglich ist Teil des marokkanischen Alltags. In der Medina von Fes kann man ihn von Dutzenden Minaretten gleichzeitig hören – unvergesslich.</p>
        <p class="mt-2"><strong>Gastfreundschaft:</strong> Einladung zum Minztee (Atay) niemals ablehnen! Das drei-fache Einschenken hat eine Bedeutung: 1. mild wie Leben, 2. stark wie Liebe, 3. bitter wie Tod.</p>
      </div>`,
  },

  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Marokkanische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Tajine:</strong> Das Nationalgericht – langsam geschmortes Fleisch/Gemüse in einem Tonkegel. Lamm mit Pflaumen und Mandeln ist Klassiker.</li>
            <li><strong>Couscous:</strong> Freitags traditionell nach dem Gebet (Freitagscouscous). In Familien, nicht im Restaurant, am authentischsten.</li>
            <li><strong>Pastilla:</strong> Süß-salzige Blätterteig-Pastete mit Tauben und Mandeln – kulinarisches Meisterwerk aus Fes.</li>
            <li><strong>Straßenessen:</strong> Kefta-Spieße, Harira-Suppe, frische Orangen-Presssäfte auf dem Djemaa el-Fna in Marrakesch.</li>
            <li><strong>Alkohol:</strong> Im islamischen Land eingeschränkt verfügbar. In lizenzierten Hotels und Restaurants erhältlich.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Essen wie Einheimische</strong>
        <p><strong>Djemaa el-Fna Abend-Geheimnis:</strong> Der berühmte Platz in Marrakesch verwandelt sich abends in einen riesigen Freiluft-Markt mit Essensständen. Frische Meeresfrüchte, Tajines, Schneckensuppe (Ghoubouba). Preis vorab vereinbaren!</p>
        <p class="mt-2"><strong>Frühstück wie Marokkaner:</strong> Msemen (gefüllte Pfannkuchen) mit Arganöl und Honig, dazu Atay (Minztee). In einer lokalen Boulangerie für unter 2 € – das beste Frühstück der Reise.</p>
        <p class="mt-2"><strong>Ras el Hanout als Mitbringsel:</strong> Die Gewürzmischung (bis zu 30 Gewürze) direkt auf dem Gewürzmarkt kaufen. Vakuumverpackt problemlos im Handgepäck.</p>
      </div>`,
  },

  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung in Marokko</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Zug (ONCF):</strong> Modernes, pünktliches Netz. Hauptstrecken: Tanger–Casablanca–Marrakesch–Fes. Tickets auf oncf.ma oder App.</li>
            <li><strong>CTM-Busse:</strong> Komfortabel, günstig, klimatisiert. Bestes Mittel für Strecken ohne Zugverbindung (Agadir, Sahara).</li>
            <li><strong>Grands Taxis:</strong> Kollektiv-Taxis zwischen Städten. Wartet bis 6 Plätze besetzt sind. Sehr günstig.</li>
            <li><strong>Mietwagen:</strong> Für Südmarokko und Atlasgebirge empfohlen. Linkverkehr gilt nicht – Rechtsverkehr wie in DE.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Hacks Marokko</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Al Boraq TGV:</strong> Tanger–Casablanca in 2 Stunden. Das schnellste und komfortabelste Verkehrsmittel. Vorab buchen!</li>
          <li><strong>Careem App:</strong> Marokkos Uber-Alternative. Festpreise, keine Verhandlung mit Taxifahrern. In Marrakesch, Casablanca und Rabat verfügbar.</li>
          <li><strong>Sahara-Expedition:</strong> Niemals alleine! Nur mit offiziellem Reiseveranstalter oder erfahrenem Beduinen-Guide. Kamel-Trekking über Nacht für 50–80 € inklusive Zelt.</li>
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
            <li><strong>März–Mai:</strong> Ideal! 20–28°C, Frühlingsblüte im Atlas, Rosenerntefest in Kelaât M'Gouna.</li>
            <li><strong>September–November:</strong> Sehr schön. Sahara-Temperaturen angenehm für Expeditionen. Dattelernte.</li>
            <li><strong>Dezember–Februar:</strong> Küste mild (18–22°C). Schnee im Atlasgebirge (Skifahren möglich!). Günstigste Preise.</li>
            <li><strong>Ramadan:</strong> Familienreisen und Gastronomie eingeschränkt tagsüber. Abends besondere Atmosphäre.</li>
            <li><strong>Juli–August:</strong> Küste und Sahara sehr heiß (40–50°C). Atlantikstädte (Essaouira, Agadir) durch Wind angenehmer.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Geheimtipps Marokko</strong>
        <p><strong>Die magische Sahara-Route:</strong> Marrakesch → Draa-Tal → Zagora → Merzouga (Erg Chebbi). 4 Tage, 3 Nächte mit Kamel und Wüstenzelt. Die Erfahrung des Lebens – muss vorgeplant werden.</p>
        <p class="mt-2"><strong>Fes Medina Tipp:</strong> Die Medina von Fes (Fes el-Bali) ist das größte autofreie Stadtgebiet der Welt. 2 Tage einplanen. Lieber ein Riad in der Medina buchen als von außen zu pendeln.</p>
        <p class="mt-2"><strong>Essaouira als Geheimtipp:</strong> Küstenstadt mit Atlantikwind, Kitesurf-Paradies und entspannter Hippie-Atmosphäre. Weit weniger touristisch als Marrakesch, aber genauso wunderschön.</p>
      </div>`,
  },
};

// ─── TUNESIEN ───────────────────────────────────────────────────────────────
const tunisiaHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Einreisebestimmungen</h4>
          <p class="mb-3 text-sm italic">Tunesien ist beliebt und unkompliziert einzureisen – aber ein paar Punkte sollten bekannt sein.</p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Reisedokumente:</strong> Gültiger Reisepass erforderlich. Personalausweis reicht NICHT aus. Mindestgültigkeit: 6 Monate über das Reiseende hinaus.</li>
            <li><strong>Visum:</strong> Deutsche Staatsbürger benötigen kein Visum für Aufenthalte bis 90 Tage.</li>
            <li><strong>Einreisekarte:</strong> An Bord oder bei Einreise ausfüllen. Unbedingt aufbewahren – wird bei Ausreise kontrolliert!</li>
            <li><strong>Krankenversicherung:</strong> EHIC gilt NICHT. Private Auslandskrankenversicherung mit Rücktransport ist Pflicht.</li>
            <li><strong>Sicherheitshinweise:</strong> Auswärtiges Amt empfiehlt erhöhte Vorsicht in Grenzregionen zu Libyen und Algerien sowie im Landesinneren (Tataouine, Kasserine). Touristenzonen (Hammamet, Sousse, Djerba) sind sicher.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Zollvorschriften</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left text-gray-500 border rounded-lg">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr><th class="px-2 py-2">Kategorie</th><th class="px-2 py-2">Freimenge</th><th class="px-2 py-2">Hinweis</th></tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Alkohol</td><td class="px-2 py-2">1 Liter</td><td class="px-2 py-2">Für Nicht-Muslime erlaubt</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Tabak</td><td class="px-2 py-2">200 Zigaretten</td><td class="px-2 py-2">Standard</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Bargeld</td><td class="px-2 py-2">Ab 10.000 TND deklarieren</td><td class="px-2 py-2">Oder €-Äquivalent</td></tr>
                <tr class="bg-red-50 border-b"><td class="px-2 py-2 font-bold text-red-700">Dinar (TND)</td><td class="px-2 py-2 text-red-700 font-bold">Nicht ausführbar</td><td class="px-2 py-2 text-red-700">Vor Ausreise verbrauchen!</td></tr>
                <tr class="bg-red-50 border-b"><td class="px-2 py-2 font-bold text-red-700">Drogen</td><td class="px-2 py-2 text-red-700 font-bold">STRENG VERBOTEN</td><td class="px-2 py-2 text-red-700">Gefängnisstrafen</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Einreise-Insider Tunesien</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Einreisekarte in Reisetasche:</strong> Klingt banal, aber sehr wichtig. Aufbewahren im Pass oder Reisemappe. Fehlt sie bei Ausreise, gibt es lange Erklärungen am Schalter.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Tunesischen Dinar NICHT vorab kaufen:</strong> In Deutschland kaum erhältlich. Direkt am Flughafen-ATM oder lizenzierter Wechselstube in Tunesien tauschen. Kurs oft 5–10% besser.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Drogenpolitik:</strong> Tunesisches Drogengesetz (Art. 52) sieht selbst für geringe Mengen Cannabis Haftstrafen vor. Kein Risiko eingehen!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Touristenzonen Sicherheit:</strong> Die bekannten Tourismusregionen (Hammamet, Sousse, Monastir, Djerba) gelten als sicher mit starker Polizeipräsenz.</li>
        </ul>
      </div>`,
  },

  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Vorsorge</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Impfungen:</strong> Hepatitis A empfohlen. Typhus bei Individualreise. Standardimpfungen (Tetanus, Diphtherie) auffrischen.</li>
            <li><strong>Reiseapotheke:</strong> Durchfallmittel, Elektrolyte, Antibiotika (Reiserezept), Sonnenschutz LSF 50+, Mückenschutz, Desinfektionsgel.</li>
            <li><strong>Auslandskrankenversicherung:</strong> Pflicht! EHIC gilt nicht. Ärzte in Privatkliniken arbeiten meist gegen Barzahlung – dann Rückerstattung von Versicherung.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-red-50 p-3 rounded border border-red-100"><strong class="text-red-800 block mb-1">Tunesische Diarrhée (Durchfall)</strong>Sehr häufig! Kein Leitungswasser trinken, kein Eis in kleinen Cafés, frisches Obst schälen. Nur Flaschenwasser!</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Hitze</strong>Im Juli/August bis 40–45°C im Landesinneren. An der Küste durch Meerwind angenehmer. Mindestens 3 Liter Wasser täglich.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Skorpione</strong>Im Süden (Sahara, Tataouine) kommen Skorpione vor. Schuhe vor dem Anziehen ausschütteln! Nachts Sandalen tragen in Zelten/einfachen Unterkünften.</div>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Gesundheits-Insider Tunesien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Apotheke (Pharmacie):</strong> Erkennbar am grünen Kreuz. Gut ausgestattet, oft Französisch gesprochen. Viele Medikamente ohne Rezept erhältlich. Öffnungszeiten: meist 8–20 Uhr, Nacht-Apotheken in Städten.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Clinique Hannibal Tunis:</strong> Beste Privatklinik des Landes. Für ernstere Fälle nach Tunis reisen oder direkten Rücktransport in Erwägung ziehen.</li>
          <li class="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><strong>Strandquallen:</strong> Im Spätsommer (August/September) können Quallen (Méduse) an der Küste auftreten. Badewarnungen beachten. Rote Flagge = Badeverboten.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Magen eingewöhnen:</strong> Gewürzte tunesische Küche (Harissa!) kann den europäischen Magen überraschen. Erste Tage vorsichtig essen. Joghurt hilft.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Flughäfen &amp; Transfers</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Hammamet / Enfidha (NBE)</strong>
              Direktflüge aus Deutschland nach Enfidha (nahe Hammamet/Sousse).<br/>
              Taxi → Hammamet: ca. 30–40 TND, 45 Min. Hotel-Shuttle oft günstiger.
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Djerba (DJE)</strong>
              Viele Direktflüge aus deutschen Städten. Insel, aber Flughafen direkt auf der Insel.<br/>
              Taxi → Houmt Souk: ca. 10–15 TND, 10 Min.
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Tunis-Carthage (TUN)</strong>
              Taxi → Stadtzentrum: ca. 10–15 TND.<br/>
              Metro Léger (Stadtbahn): ab Nordbahnhof, ca. 0,80 TND.
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Innertransport</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Louage (Sammeltaxis):</strong> Günstigste und schnellste Option zwischen Städten. Wartet nicht auf volle Besetzung.</li>
            <li><strong>SNCFT Bahn:</strong> Tunis–Sousse–Sfax. Günstig aber langsam. Für Städtereisen ausreichend.</li>
            <li><strong>Mietwagen:</strong> Für Wüste (Tozeur, Douz) und Süden empfohlen. 4WD für Pisten nötig.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Transfer-Hacks Tunesien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Taxi-Preis vorab:</strong> Tunesische Taxis haben oft manipulierte Taxameter oder "kaputte" Anzeige. Immer VOR Fahrtantritt Preis vereinbaren oder auf Einschalten des Meters bestehen.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Louage-Geheimtipp:</strong> Die weißen Sammeltaxis (Louage) sind das schnellste und günstigste Transportmittel zwischen Städten. Einfach auf den Louage-Bahnhof (Gare de Louage) gehen und nach dem Zielort fragen.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Djerba-Fähre:</strong> Die kürzeste Überfahrt nach Djerba ist die Fähre El Jorf–Ajim (20 Minuten). Günstig und malerisch. Deutlich schneller als der Landweg über den Damm.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Pauschalreise-Shuttles:</strong> Wer über Reiseveranstalter gebucht hat, nutzt den organisierten Hotel-Transfer. Unabhängige Reisende: Preise für Taxis am Flughafen sind HÖHER als in der Stadt – normal.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Währung &amp; Bezahlen</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Währung:</strong> Tunesischer Dinar (TND). 1 € ≈ 3,3–3,5 TND (2026).</li>
            <li><strong>Dinar nicht konvertibel:</strong> Ausschließlich in Tunesien tauschen. Nicht ausführbar – Restbestände vor Abreise ausgeben!</li>
            <li><strong>Bargeld Pflicht:</strong> Souks, kleine Restaurants, Taxis, Märkte nur Bargeld. Karte kaum akzeptiert außerhalb von Hotels.</li>
            <li><strong>ATMs:</strong> In Städten und Touristenzentren ausreichend. In Wüstenregionen (Douz, Tozeur) vorher genug Bargeld abheben!</li>
            <li><strong>Trinkgeld:</strong> 5–10% im Restaurant, 0,50–1 TND pro Gepäckstück, 5–10 TND für einen guten Stadtführer/Stunde.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Preisniveau</h4>
          <div class="bg-yellow-50 p-3 rounded text-sm">
            Tunesien ist eines der günstigsten Reiseziele im Mittelmeerraum. Vollpension in gutem Hotel: 40–70 €/Nacht. Straßenessen: 1–3 TND. Taxi-Kurzfahrt: 2–5 TND.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Finanz-Hacks Tunesien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
            <strong class="text-indigo-900 block mb-1">Bester Wechselkurs:</strong>
            Offizielle Wechselstuben in Banken oder Post (La Poste) bieten gesetzlich festgelegten Kurs. Immer Quittung verlangen – nötig für eventuelle Rücktausch.
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Handeln auf Souks:</strong> In tunesischen Souks gilt dasselbe wie in Marokko: Erster Preis ist Verhandlungsstart. Mit 40–50% beginnen und auf maximal 60–70% des Anfangspreises einigen.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Dinar-Notversorgung:</strong> Keine Dinar vor Ort? Am Flughafen Hammamet/Enfidha und Djerba gibt es ATMs direkt nach der Einreise. Meist Visa und Mastercard akzeptiert.</li>
          <li class="bg-red-50 p-3 rounded-lg border border-red-100"><strong>Dinar-Ausfuhr verboten:</strong> Das ist ernst gemeint. Bei Ausreise werden Taschen teils kontrolliert. Übrige Dinar am Flughafen in Euro zurücktauschen (Quittung des Hintausches mitbringen!).</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Konnektivität</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Roaming:</strong> EU-Roaming gilt NICHT. Teures Drittland-Roaming mit deutschem Anbieter. eSIM oder lokale SIM empfohlen.</li>
            <li><strong>Lokale SIM:</strong> Tunisie Telecom, Ooredoo oder Orange Tunisie. An Flughäfen erhältlich. Reisepass mitbringen. Günstige Datenpakete (10 GB = ca. 5–8 €).</li>
            <li><strong>WLAN:</strong> In Hotels und Resorts gut. In einfachen Restaurants und Cafés begrenzt.</li>
            <li><strong>Steckdosen:</strong> Typ C und E. Europäische Stecker passen direkt. 220 Volt – kein Adapter für deutsche Geräte nötig.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Tech-Hacks Tunesien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>eSIM Empfehlung:</strong> Airalo "Tunesien" Paket: 5 GB für ca. 8 €. Vor Abflug aktivieren für problemlosen Empfang ab Landung.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Offline-Karten:</strong> Maps.me für Tunesien vorab laden. Besonders für Wüstenausflüge (Tozeur, Douz, Matmata) ohne Netzempfang wichtig.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Kein Adapter:</strong> Typ C (Euro-Stecker) passt überall. 220 Volt wie in DE. Britische Stecker brauchen Adapter.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>WhatsApp zuverlässig:</strong> Anders als in manchen arabischen Ländern funktioniert WhatsApp in Tunesien problemlos. Kein VPN nötig.</li>
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
          <p class="mb-2">Touristenzonen in Tunesien sind mit erhöhter Polizei- und Militärpräsenz gut gesichert. Größte Risiken: Kleinkriminalität und Betrug.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Touristenzonen (Hammamet, Sousse, Djerba):</strong> Sicher, starke Polizeipräsenz.</li>
            <li><strong>Grenzregionen:</strong> Zu Libyen und Algerien sowie südwestliche Wüstengebiete meiden (Terrorismusgefahr).</li>
            <li><strong>Attentate 2015:</strong> Seit verstärkten Sicherheitsmaßnahmen keine Anschläge auf Touristen mehr. Vorsicht bleibt angebracht.</li>
          </ul>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <strong>Notrufnummern Tunesien:</strong><br/>
          197 – Polizei (Police Nationale)<br/>
          198 – Krankenwagen / Zivilschutz<br/>
          190 – Feuerwehr<br/>
          1491 – Gendarmerie Nationale (ländliche Gebiete)
        </div>
        <div class="mt-3 bg-orange-50 border-l-4 border-orange-400 text-orange-800 p-3 text-sm">
          <p class="font-bold">Reisewarnung Auswärtiges Amt</p>
          <p>Erhöhte Vorsicht im gesamten Land. Konkrete Reisewarnung für Grenzregionen zu Libyen und Algerien. Aktuelle Hinweise vor Reiseantritt prüfen: auswaertiges-amt.de</p>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Insider Tunesien</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Deutsche Botschaft Tunis:</strong> +216 71 786 166. Für Notfälle, Passverlust und konsularische Hilfe.</li>
          <li><strong>Touristenpolizei:</strong> In großen Touristenzentren präsent. Erkennbar an Uniform mit "Police Touristique". Auf Französisch oder Englisch ansprechen.</li>
          <li>Abseits der bekannten Touristenzonen erhöhte Aufmerksamkeit walten lassen. Reiserouten im Süden vorab beim Reiseveranstalter absichern.</li>
          <li>Rucksack mit Wertsachen niemals unbeaufsichtigt am Strand lassen. Diebstahl in belebten Strandabschnitten möglich.</li>
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
          <h4 class="font-bold text-gray-900 mb-2">Arabisch-Berberische Kultur</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Islam:</strong> Mehrheitlich muslimisch. Kleidungsvorschriften beachten (Schultern und Knie bedecken). In Moscheen: nur mit ausdrücklicher Erlaubnis eintreten.</li>
            <li><strong>Ramadan:</strong> Kein Essen/Trinken/Rauchen öffentlich tagsüber. Respektvolles Verhalten gegenüber Fastenden.</li>
            <li><strong>Sprachen:</strong> Arabisch (Tunesischer Dialekt/Darija), Französisch als Zweitsprache. "Merci" und "Choukran" (Danke) gut ankommen. Englisch in Touristenzonen.</li>
            <li><strong>Medina-Etikette:</strong> In den historischen Medinas (Tunis, Sousse, Sfax) ist Bescheidenheit in Kleidung ein Zeichen von Respekt.</li>
            <li><strong>UNESCO-Welterbe:</strong> Amphitheater El Djem, Medina von Tunis, Karthago, Kerkouane – antike Geschichte hautnah.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how Tunesien</strong>
        <p><strong>Sidi Bou Saïd:</strong> Das blau-weiße Künstlerdorf nahe Tunis ist eines der schönsten Dörfer der Welt. Früh morgens oder bei Sonnenuntergang besuchen – ohne die Touristenmassen.</p>
        <p class="mt-2"><strong>Berber-Kultur im Süden:</strong> Im Matmata-Gebirge leben Berber noch in traditionellen Troglodyten-Häusern (Felshöhlen). Hier wurde Star Wars (Tatooine) gedreht. Echter kultureller Einblick – kein Themenpark.</p>
        <p class="mt-2"><strong>Tunesischer Tee:</strong> Grüner Tee mit Pinienkernen und Minze. Die Einladung zum Tee ist eine Geste des Willkommens – nie ablehnen. In einem "Café Arabe" sitzen und das Leben beobachten.</p>
      </div>`,
  },

  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Tunesische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Harissa:</strong> Die scharfe rote Chili-Paste ist die Seele der tunesischen Küche. In Deutschland kaum in dieser Originalqualität erhältlich – unbedingt mitbringen!</li>
            <li><strong>Brik:</strong> Knuspriger Blätterteig gefüllt mit Ei, Thunfisch, Kapern. Das beliebteste Streetfood Tunesiens.</li>
            <li><strong>Couscous:</strong> Das Nationalgericht, freitags traditionell zubereitet.</li>
            <li><strong>Merguez:</strong> Würzige Lammwurst vom Grill – überall auf Souks und Straßenmärkten.</li>
            <li><strong>Lablabi:</strong> Kichererbsensuppe mit Brot, Harissa und Ei. Frühstück der Arbeiter – günstig und sättigend.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Essen wie Einheimische</strong>
        <p><strong>Brik am Strand:</strong> Am besten direkt am Strand in einem einfachen Straßenrestaurant. Frisch gemacht, mit Zitrone beträufeln – perfektes Mittelmeer-Erlebnis für 1–2 TND.</p>
        <p class="mt-2"><strong>Loukma (tunesische Krapfen):</strong> Kleine frittierte Teigkugeln mit Honig oder Dattelsirup. Frühstück oder Snack am Marktstand für wenige Millimes.</p>
        <p class="mt-2"><strong>Harissa als Mitbringsel:</strong> Originale tunesische Harissa (in Dosen oder Tuben) im Supermarkt kaufen – deutlich authentischer als im Deutschen Supermarkt. Vakuumverpackt problemlos im Koffer.</p>
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
            <li><strong>Mietwagen:</strong> Empfohlen für Unabhängigkeit. EU-Führerschein ausreichend. Fahren im Stadtverkehr abenteuerlich – für Wüstentouren 4WD mieten.</li>
            <li><strong>Louage (Sammeltaxis):</strong> Schnellstes und günstigstes Transportmittel zwischen Städten. Keine festen Abfahrtszeiten – fährt ab wenn voll.</li>
            <li><strong>SNCFT Bahn:</strong> Tunis–Sousse–Sfax. Günstig, eher langsam. Klimatisiert auf modernen Strecken.</li>
            <li><strong>Kleine Taxis (Taxi ville):</strong> Mit Taxameter. Im Stadtverkehr günstig.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Hacks Tunesien</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Louage-System meistern:</strong> Louage-Stationen (Gare de Louage) sind in jeder Stadt. Zum Zielort fragen – sofort wird man zum richtigen Fahrzeug geführt. Preis ist fest (non-negotiable).</li>
          <li><strong>TGM-Vorortbahn Tunis:</strong> Die Vorortbahn Tunis–La Marsa–Sidi Bou Saïd für ca. 0,70 TND. Beste und günstigste Verbindung von Tunis an die Nordküste.</li>
          <li><strong>Kamelreiten Sahara:</strong> In Douz oder Tozeur. Stundenpreise: ca. 15–25 TND. Ganztags-Karawane mit Übernachtung: ab 60–80 TND. Nur seriöse Anbieter über Hotel buchen.</li>
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
            <li><strong>März–Mai:</strong> Ideal! Küste 20–25°C, Wüste angenehm, Frühlingsblüte. Günstige Preise.</li>
            <li><strong>September–November:</strong> Perfektes Badewetter (Meer noch warm), weniger voll, Herbststimmung.</li>
            <li><strong>Dezember–Februar:</strong> Küste kühl aber mild (15–18°C). Wüste kalt nachts. Günstigstes Preisniveau. Wenige Touristen.</li>
            <li><strong>Juni–August:</strong> Hauptsaison. Heiß (35–42°C im Inland), teurer und voller in Touristenzentren. Für Strandulaub trotzdem beliebt.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Geheimtipps Tunesien</strong>
        <p><strong>Klassikreise in 8 Tagen:</strong> Tunis (2 Tage: Medina, Karthago, Sidi Bou Saïd) → Hammamet (2 Tage: Strand) → El Djem (1 Tag: Amphitheater) → Tozeur/Douz (2 Tage: Sahara und Kamel) → Djerba (1 Tag). Perfekte Mischung aus Kultur, Strand und Wüste.</p>
        <p class="mt-2"><strong>Star Wars Drehorte:</strong> Matmata (Luke Skywalkers Heimat) und Tozeur/Chott el-Djerid sind für Fans ein Pflichtprogramm. Mit dem Mietwagen in 1–2 Tagen erreichbar.</p>
        <p class="mt-2"><strong>Frühbucher Djerba:</strong> Direktflüge nach Djerba (DJE) ab deutschen Städten besonders günstig in der Vor- und Nachsaison (März/April und Oktober/November).</p>
      </div>`,
  },
};

// ─── ZYPERN ─────────────────────────────────────────────────────────────────
const cyprusHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Dokumente &amp; Besonderheiten</h4>
          <p class="mb-3 text-sm italic">Zypern ist EU-Mitglied, aber kein Schengen-Staat. Das hat einige praktische Auswirkungen.</p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Reisedokumente:</strong> Als EU-Bürger reicht der gültige Personalausweis. Reisepass ebenfalls akzeptiert.</li>
            <li><strong>Kein Schengen:</strong> Zypern ist EU-Mitglied aber KEIN Schengen-Staat. Beim Flug nach Zypern gibt es Grenzkontrollen. EU-Roaming gilt trotzdem.</li>
            <li><strong>Währung:</strong> Euro (EUR) – kein Wechseln nötig.</li>
            <li><strong>Krankenversicherung:</strong> EHIC (Europäische Krankenversicherungskarte) gilt in der Republik Zypern. Private Auslandskrankenversicherung trotzdem empfohlen.</li>
            <li><strong>Nordteil (Türkisch-Zypern):</strong> Völkerrechtlich komplizierte Situation. Der Nordteil ist von der Türkei anerkannt aber von der EU nicht. Grenzübergang nach Norden möglich (mit Ausweis), zurück ohne Probleme.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Grenzübergang Nord-/Südzypern</h4>
          <div class="bg-blue-50 p-3 rounded text-sm">
            <strong>Grüne Linie (Green Line):</strong> EU-Bürger können über mehrere Checkpoints in den türkischen Norden einreisen. Bei Rückkehr: Keine Probleme mit zypriotischen oder EU-Behörden. Souvenirs aus dem Norden: legal mitbringen.
            <br/><strong>Hinweis:</strong> Im Norden wird türkische Lira (TRY) verwendet. Euro wird vielerorts akzeptiert, zu schlechterem Kurs.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Einreise-Insider Zypern</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>EHIC-Karte mitnehmen:</strong> Zypern ist EU-Mitglied – staatliche Krankenhäuser akzeptieren EHIC. Trotzdem: Private Kliniken (oft besser ausgestattet) verlangen Barzahlung, dann Erstattung durch Versicherung.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Linksverkehr!</strong> Zypern ist Linksverkehrsland (britisches Erbe). Mietwagenfahrer: Erste Stunden besondere Aufmerksamkeit. Im Kreisverkehr: Von rechts hat Vorfahrt.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Nord-Zypern-Ausflug:</strong> Nikosia ist die letzte geteilte Hauptstadt Europas. Ein Grenzübergang in der Altstadt führt in den türkischen Teil. Kostenloses, einzigartiges Erlebnis.</li>
          <li class="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><strong>Keine Stempelprobleme:</strong> Anders als bei der Türkei: Ein Nord-Zypern-Stempel im Pass bereitet keine Probleme bei Einreise in andere EU-Länder.</li>
        </ul>
      </div>`,
  },

  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Impfschutz:</strong> Keine Pflichtimpfungen. Zypern ist EU-Standard. Routineimpfungen auffrischen.</li>
            <li><strong>EHIC-Karte:</strong> Gilt in staatlichen Krankenhäusern des Südens.</li>
            <li><strong>Reiseapotheke:</strong> Sonnenschutz LSF 50+, Insektenschutz (Mücken abends im Troodos-Gebirge), Hitzepflaster.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Hitze</strong>Im Juli/August bis 40°C an der Küste, im Troodos-Gebirge angenehmer (20–25°C). Mittagspause einhalten.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Trinkwasser</strong>Leitungswasser auf Zypern ist trinkbar aber hartes Wasser. Abgepacktes Wasser bevorzugt.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Seeigel &amp; Quallen</strong>An felsigen Küstenabschnitten Badeschuhe tragen. Im Hochsommer gelegentlich Quallenwarnung.</div>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Gesundheits-Insider Zypern</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Apothekar als Arzt:</strong> Zypriotische Apotheker (Farmakeío) sind sehr gut ausgebildet und beraten umfassend. Viele Medikamente rezeptfrei erhältlich, die in DE Rezept erfordern.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Limassol Privatspital:</strong> Bestes Privatspital für Touristen. Ärzte meist auf Englisch kommunizierend. Für ernstere Fälle deutlich besser als staatliche Krankenhäuser.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Sauberkeit Strände:</strong> Zypern hat viele EU-Blue-Flag-Strände – kristallklares Mittelmeer. Eines der saubersten Badegewässer Europas.</li>
          <li class="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><strong>Schlangen:</strong> Zypern hat Felsnatter und Blunt-nosed Viper (giftig). In Bergregionen Troodos nicht in Gebüsche greifen. Bei Schlangenbiss sofort Krankenhaus!</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Flughäfen</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Larnaka (LCA) – Hauptflughafen</strong>
              Taxi → Larnaka Zentrum: ca. 20 € (Festpreis-Taxis am Ausgang).<br/>
              Bus 417: Flughafen → Larnaka Busbahnhof → weiter nach Limassol (ca. 1,50 €).<br/>
              Mietwagen: Direkt am Flughafen, im Sommer vorbuchen!
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Paphos (PFO)</strong>
              Taxi → Paphos Zentrum: ca. 15–20 €, 20 Min.<br/>
              Bus 612: Paphos Flughafen → Stadtzentrum (ca. 1,50 €).<br/>
              Limassol: Mit Bus ca. 2 Stunden, 10 €.
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Mobilität auf der Insel</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Mietwagen ist Pflicht!</strong> Öffentlicher Transport sehr begrenzt. Ohne Auto ist die Insel nicht erkundbar.</li>
            <li><strong>Linksverkehr:</strong> Fahren auf der linken Seite (britisches Erbe). Ungewohnt aber schnell adaptiert.</li>
            <li><strong>Intercity-Busse:</strong> INTERCITY BUSES verbinden Larnaka, Limassol, Paphos, Nikosia. Ca. 3–7 € je Strecke.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Transfer-Hacks Zypern</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Mietwagen-Linksverkehr Trick:</strong> Die erste Stunde nach Abholung auf ruhigen Straßen üben. Im Kreisverkehr: rechts bleibt innen. Nach 30 Minuten ist der Linksverkehr meist verinnerlicht.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Taxi-Festpreise:</strong> Taxis in Zypern sind reguliert mit Festpreisen pro Zone. Am Flughafen immer das Taxi-Preisschild studieren – kein Taxameter nötig, Preis steht auf Liste.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Troodos-Gebirge mit Mietwagen:</strong> Serpentinenstraßen sind abenteuerlich aber perfekt asphaltiert. Kühlwasser-Check vor Bergfahrt empfohlen (hohe Temperaturen im Sommer).</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Bolt und Uber:</strong> In Larnaka und Limassol verfügbar. Deutlich günstiger als reguläre Taxis für Stadtfahrten.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Geld auf Zypern</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Währung:</strong> Euro (EUR) in der Republik Zypern. Kein Wechseln nötig.</li>
            <li><strong>Nordteil:</strong> Türkische Lira (TRY). Euro oft akzeptiert zu schlechtem Kurs. ATMs im Norden vorhanden.</li>
            <li><strong>Kartenzahlung:</strong> Weit verbreitet, überall akzeptiert inkl. kleiner Restaurants.</li>
            <li><strong>Bargeld:</strong> Für ländliche Gebiete, Dorfrestaurants und Wochenmärkte hilfreich.</li>
            <li><strong>Trinkgeld:</strong> 10% im Restaurant üblich. Service Charge oft bereits auf Rechnung enthalten – prüfen!</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Preisniveau</h4>
          <div class="bg-yellow-50 p-3 rounded text-sm">
            Zypern ist günstiger als Westeuropa, teurer als Griechenland. Limassol ist am teuersten (Finanzmetropole). Paphos und Larnaka günstiger. Troodos-Dörfer sehr preiswert.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Finanz-Tipps Zypern</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Meze-Abend als Spar-Tipp:</strong> Ein traditionelles Meze (10–15 kleine Gerichte) kostet in normalen Tavernen 18–25 € pro Person. Günstiger, mehr und authentischer als à-la-carte.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Lokaler Wein direkt vom Winzer:</strong> Zypern hat ausgezeichnete Weintraditionen (Commandaria ist der älteste Dessertwein der Welt). In Winzerdörfern rund um Limassol direktes Kaufen spart 50%.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Supermarkt-Tipp:</strong> Kiosks und lokale Supermärkte (Alphamega, Sklavenitis) sind 30–50% günstiger als Minimarkets in Strandnähe.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Freier Strand-Zugang:</strong> Zypern garantiert per Gesetz öffentlichen Zugang zu allen Stränden. Für Liegen etc. an privaten Strandabschnitten zahlen – der Strand selbst ist immer kostenlos.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Konnektivität</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>EU-Roaming:</strong> Gilt in Zypern (Republik) vollständig. Deutsche SIM ohne Aufpreis nutzbar.</li>
            <li><strong>Nordteil:</strong> EU-Roaming gilt NICHT im türkisch kontrollierten Norden. Dort Roaming deaktivieren!</li>
            <li><strong>WLAN:</strong> In Hotels und Resorts ausgezeichnet. In Restaurants und Cafés weit verbreitet.</li>
            <li><strong>Steckdosen:</strong> Typ G (britischer 3-Pol-Stecker)! Adapter erforderlich für deutsche Geräte. 230 Volt.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Wichtig: Adapter!</h4>
          <div class="bg-orange-50 border-l-4 border-orange-400 p-3 text-sm">
            <strong class="text-orange-800">Britischer Stecker Typ G:</strong> Zypern hat britische Steckdosen (3-poliger quadratischer Stecker). Deutsche Geräte mit Typ C/F (Schuko) benötigen einen UK-Adapter! Im Urlaub oft im Hotel erhältlich, aber lieber vorab kaufen.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Tech-Hacks Zypern</h4>
        <ul class="space-y-3">
          <li class="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
            <strong class="text-red-900 block mb-1">Adapter nicht vergessen!</strong>
            Typ-G-Adapter (UK) ist Pflicht. In Deutschland vor Abreise kaufen (2–5 €). Hotels haben oft Leih-Adapter, aber verlassen Sie sich nicht darauf.
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Nord-Zypern Roaming-Falle:</strong> Wer die Grüne Linie überquert, ist im Norden auf türkischem Netz. EU-Roaming gilt nicht – deutschen Anbieter vorab informieren oder Roaming dort ausschalten.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>GPS auf Zypern:</strong> Google Maps funktioniert gut. Für Troodos-Wanderwege: AllTrails App vorab laden. Offline-Karten für Bergregionen sinnvoll.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>EU-Roaming im Süden:</strong> Volle EU-Roaming-Abdeckung. Datensurfen, telefonieren und SMS wie in Deutschland – kein Aufpreis.</li>
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
          <p class="mb-2">Zypern gilt als eines der sichersten Reiseziele im Mittelmeer. Kriminalität gegenüber Touristen extrem selten.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Gewaltkriminalität:</strong> Nahezu nicht existent. Sicherheitslage sehr gut.</li>
            <li><strong>Verkehr:</strong> Linksverkehr – größtes Unfallrisiko für unerfahrene Fahrer. Erste Stunden besonders vorsichtig.</li>
            <li><strong>Pufferzone:</strong> Die UN-Pufferzone (Grüne Linie) zwischen Nord und Süd nicht ohne Grenzübergang betreten.</li>
            <li><strong>Badeunfälle:</strong> Starke Strömungen an Westküste (Paphos). Fahnen beachten: Rot = Badeverboten.</li>
          </ul>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <strong>Notrufnummern Zypern:</strong><br/>
          112 – Europäischer Notruf (Englisch möglich)<br/>
          199 – Feuerwehr &amp; Krankenwagen<br/>
          1460 – Polizei<br/>
          1411 – Touristeninformation
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Insider Zypern</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Deutsche Botschaft Nikosia:</strong> +357 22 45 1145. Für Notfälle, Passverlust und konsularische Hilfe.</li>
          <li>Zypriotische Polizei (CYPOL) spricht ausgezeichnet Englisch. Sehr hilfsbereit gegenüber Touristen.</li>
          <li><strong>Mietwagenunfälle:</strong> Im Linksverkehr häufigste Schadensursache. Vollkaskoversicherung beim Mietwagen empfohlen!</li>
          <li>Zypern ist eine der wenigen Touristendestinationen, wo alleinreisende Frauen sich nachts in Städten sicher fühlen können.</li>
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
          <h4 class="font-bold text-gray-900 mb-2">Zypriotische Kultur</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Griechisch-zypriotische Kultur:</strong> Südteil ist griechisch geprägt. Sprache: Griechisch. "Efcharistó" (Danke) wird sehr geschätzt.</li>
            <li><strong>Orthodoxe Kirchen:</strong> Sehr präsent – Schultern und Knie bedecken. Schleier für Frauen in manchen Klöstern nötig.</li>
            <li><strong>Aphrodite-Kult:</strong> Zypern gilt als Geburtsort der Göttin Aphrodite. Fels der Aphrodite (Petra tou Romiou) bei Paphos ist ein UNESCO-Welterbe.</li>
            <li><strong>UNESCO-Welterbe:</strong> Paphos (Archäologischer Park), Choirokoitia (neolithische Siedlung), Bemalte Kirchen im Troodos-Gebirge.</li>
            <li><strong>Britisches Erbe:</strong> Englisch als de-facto-Zweitsprache. Linksverkehr, britische Steckdosen, englische Ortsnamen und Menüs.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how Zypern</strong>
        <p><strong>Panayia-Feste:</strong> Am 15. August (Mariä Himmelfahrt) feiern zypriotische Dörfer mit Prozessionen, Musik und Festmählern. Kostenlos, unvergesslich und touristisch noch wenig bekannt.</p>
        <p class="mt-2"><strong>Geteilte Hauptstadt Nikosia:</strong> Die UN-Pufferzone mitten durch die Hauptstadt ist ein einzigartiges politisches und kulturelles Phänomen Europas. Der Grenzübergang Ledra Street ist fußläufig und kostenlos.</p>
        <p class="mt-2"><strong>Commandaria-Wein:</strong> Der älteste Dessertwein der Welt (erwähnt seit 800 v. Chr.) kommt aus dem Troodos-Gebirge. In lokalen Tavernen immer probieren – süß, komplex, einzigartig.</p>
      </div>`,
  },

  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Zypriotische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Meze:</strong> Das ultimative kulinarische Erlebnis – 15–20 kleine Gerichte, endlos nachgefüllt. Dips, Salate, Gegrilltes, Meeresfrüchte. Muss man erlebt haben!</li>
            <li><strong>Halloumi:</strong> Der berühmte zypriotische Grillkäse, der nicht schmilzt. Frisch gegrillt oder in Salaten. Qualitativ besser als der exportierte Halloumi in deutschen Supermärkten.</li>
            <li><strong>Souvlaki:</strong> Gegrillte Fleischspieße mit Pitabrot und Tzatziki. Das Fast Food Zyperns.</li>
            <li><strong>Kleftiko:</strong> Im Lehmofen langsam gegartes Lammfleisch – zart, würzig, unvergesslich.</li>
            <li><strong>Loukoumades:</strong> Kleine frittierte Honigkrapfen – perfektes Dessert oder Frühstück.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Essen wie Einheimische</strong>
        <p><strong>Dorf-Taverne (Meze) Geheimtipp:</strong> In Troodos-Dörfern (Omodos, Lofou, Kakopetria) gibt es Tavernen mit hausgemachtem Meze für 18–22 € – frischer, günstiger und authentischer als in Touristenorten an der Küste.</p>
        <p class="mt-2"><strong>Halloumi direkt vom Hersteller:</strong> Auf Wochenmärkten (z.B. Larnaka Markt samstags) kauft man frischen Halloumi direkt vom Produzenten. Der Unterschied zum Supermarkt-Halloumi ist dramatisch.</p>
        <p class="mt-2"><strong>Kaffé Kypriakon (Zypriotischer Mokka):</strong> Kleiner, starker Kaffee in einem Kupferkännchen. Ungesüßt (skétos), mittelsüß (métrios) oder süß (glykos) bestellen. In einem traditionellen Kafenion (Dorfcafé) trinken.</p>
      </div>`,
  },

  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung auf Zypern</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Mietwagen ist unverzichtbar:</strong> Öffentliche Busse sehr begrenzt. Ohne Auto bleiben viele Top-Spots unerreichbar (Troodos, Akamas, abgelegene Strände).</li>
            <li><strong>Linksverkehr:</strong> Britisches Erbe. EU-Führerschein ausreichend. Schnell adaptiert.</li>
            <li><strong>Intercity Buses (INTERCITY):</strong> Larnaka ↔ Limassol ↔ Paphos ↔ Nikosia. Bequem, klimatisiert, ca. 5–8 € pro Strecke.</li>
            <li><strong>Stadtbusse (OSYPA/EMEL):</strong> In Nikosia, Limassol und Larnaka – günstig aber langsam.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Hacks Zypern</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Mietwagen-Trick:</strong> Bei lokalen Anbietern (nicht Hertz/Avis) bis zu 40% günstiger. Vollkasko trotzdem nehmen – Linksverkehr-Unfälle häufig.</li>
          <li><strong>Akamas-Halbinsel:</strong> Für das Naturschutzgebiet (wildeste Landschaft Zyperns) ein 4WD mieten. Normale PKW kommen auf den Schotterpisten nicht weiter.</li>
          <li><strong>Bolt App:</strong> In Larnaka und Limassol verfügbar. Für Stadtfahrten deutlich günstiger als reguläre Taxis.</li>
          <li><strong>Fahrrad:</strong> Küstenpromenaden (Limassol, Paphos) haben gute Radwege. Leihräder für 10–15 € pro Tag.</li>
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
            <li><strong>April–Juni:</strong> Ideal! 25–30°C, Meer wird warm (ab Mai), Frühlingsblüte, niedrige Preise.</li>
            <li><strong>September–Oktober:</strong> Perfekt! 28–32°C, Meer noch warm (28°C!), viel weniger Touristen als im August.</li>
            <li><strong>November–März:</strong> Mild (15–18°C an Küste), günstig, Troodos mit Schnee (Skifahren möglich!). Gut für Wandern und Kultur.</li>
            <li><strong>Juli–August:</strong> Hauptsaison. 35–40°C, sehr heiß aber Badewetter perfekt. Teurer und voller.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Geheimtipps Zypern</strong>
        <p><strong>Oktober ist das beste Geheimnis:</strong> 30°C Luft, 28°C Meer, keine Überfüllung, günstigste Herbstpreise. Zypern-Kenner reisen im Oktober.</p>
        <p class="mt-2"><strong>Ski auf Zypern:</strong> Das klingt verrückt, aber im Troodos-Gebirge gibt es im Winter Skigebiete (Mount Olympos, 1.952 m). Morgens Skifahren, nachmittags an den Strand nach Limassol (1 Stunde Fahrt).</p>
        <p class="mt-2"><strong>7-Tage-Klassiker:</strong> Tag 1–2 Larnaka (Hala Sultan Tekke Moschee, Salzsee mit Flamingos im Winter). Tag 3–4 Paphos (Aphrodite-Felsen, archäologischer Park). Tag 5 Troodos (Klöster, Wandern). Tag 6 Nikosia (Grüne Linie). Tag 7 Limassol (Hafen, Wein).</p>
      </div>`,
  },
};

// ─── BULGARIEN ──────────────────────────────────────────────────────────────
const bulgariaHubData: HubData = {
  einreise: {
    title: "Einreise",
    iconFa: "fa-passport",
    color: "bg-red-600",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise: Aktuelle Situation 2026</h4>
          <p class="mb-3 text-sm italic">Bulgarien ist seit März 2024 vollständiges Schengen-Mitglied (Luft- und Seegrenzen). Landgrenzen folgen voraussichtlich bis Ende 2025.</p>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Reisedokumente:</strong> Als EU-Bürger reicht der gültige Personalausweis. Reisepass ebenfalls akzeptiert.</li>
            <li><strong>Schengen:</strong> Seit März 2024 Schengen-Mitglied für Luft/Seewege. Keine Grenzkontrollen bei Flugreise aus Schengen-Land.</li>
            <li><strong>Währung:</strong> Bulgarischer Lev (BGN). 1 € = 1,9558 BGN (fester Wechselkurs – Bulgarien in ERM II). Euro wird in touristischen Bereichen oft akzeptiert, aber Lev gibt besseren Kurs.</li>
            <li><strong>Krankenversicherung:</strong> EHIC gilt in Bulgarien. Trotzdem: Private Auslandskrankenversicherung empfohlen für Rücktransport.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Zoll &amp; Mitnahme</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left text-gray-500 border rounded-lg">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                <tr><th class="px-2 py-2">Kategorie</th><th class="px-2 py-2">Freimenge</th><th class="px-2 py-2">Hinweis</th></tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Zigaretten</td><td class="px-2 py-2">200 Stück</td><td class="px-2 py-2">In BG deutlich günstiger als in DE</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Alkohol</td><td class="px-2 py-2">EU-Mengen</td><td class="px-2 py-2">Für Eigengebrauch unbegrenzt</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Bargeld</td><td class="px-2 py-2">Ab 10.000 € deklarieren</td><td class="px-2 py-2">EU-Standard</td></tr>
                <tr class="bg-white border-b"><td class="px-2 py-2 font-medium">Kosmetika/Souvenirs</td><td class="px-2 py-2">Unbegrenzt (EU)</td><td class="px-2 py-2">Keine Zollgrenzen innerhalb EU</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-6">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Einreise-Insider Bulgarien</h4>
        <ul class="space-y-3 text-sm">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Schengen seit 2024:</strong> Seit März 2024 gilt Schengen für Flug- und Seewege. Direktflüge aus Deutschland landen ohne Grenzkontrolle. Landgrenze (Rumänien, Griechenland, Türkei): noch mit Kontrolle bis vollständige Integration.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Lev-Kurs ist fest:</strong> Der bulgarische Lev ist seit 1997 mit festem Kurs an den Euro gekoppelt (1 € = 1,9558 BGN). Kein Währungsrisiko. Euro wird akzeptiert, aber Lev gibt immer korrekten Kurs.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Vignettenpflicht:</strong> Wer mit dem Auto nach Bulgarien fährt, braucht eine elektronische Vignette (e-Vignette). Online unter bgtoll.bg kaufen. Wochenvignette: ca. 15 €.</li>
          <li class="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><strong>EHIC nutzen:</strong> Bulgarien akzeptiert EHIC in staatlichen Krankenhäusern. Für Qualitätsversorgung trotzdem private Auslandskrankenversicherung empfohlen.</li>
        </ul>
      </div>`,
  },

  gesundheit: {
    title: "Gesundheit",
    iconFa: "fa-briefcase-medical",
    color: "bg-green-500",
    planningHtml: `
      <div class="space-y-6">
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Vor der Reise</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Impfschutz:</strong> Keine Pflichtimpfungen. FSME-Impfung bei Wanderungen/Natur empfohlen (Zecken in Bergregionen). Routineimpfungen auffrischen.</li>
            <li><strong>EHIC-Karte:</strong> Gilt in staatlichen Krankenhäusern. Qualität variiert stark.</li>
            <li><strong>Reiseapotheke:</strong> Sonnenschutz, Insektenschutz (Zecken und Mücken in Bergregionen!), Durchfallmittel, Schmerzmittel.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Während der Reise</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Trinkwasser</strong>In Sofia und größeren Städten ist Leitungswasser trinkbar. In ländlichen Regionen und Schwarzmeerküste Flaschenwasser bevorzugen.</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Zecken</strong>Im Gebirge (Vitosha, Rila, Pirin, Rhodopen) ist FSME-Risiko real. Langen Hosen tragen, nach Wanderungen auf Zecken absuchen. FSME-Impfung vorab!</div>
            <div class="bg-gray-50 p-3 rounded"><strong class="block mb-1">Schwarzes Meer</strong>Sauber und sicher. Gelegentlich Quallen (Mlecznica). Rote Flagge = Badeverboten bei starken Strömungen.</div>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Gesundheits-Insider Bulgarien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Private Kliniken Varna/Sofia:</strong> "Acibadem City Clinic" oder "Medika" bieten westeuropäischen Standard. Für ernstere Fälle deutlich besser als staatliche Krankenhäuser. Zahlung per Karte oder Bar.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Apotheke (Apteka):</strong> Erkennbar am grünen Kreuz. Sehr gut ausgestattet, viele Medikamente ohne Rezept günstiger als in DE.</li>
          <li class="bg-yellow-50 p-3 rounded-lg border border-yellow-200"><strong>FSME-Impfung Empfehlung:</strong> Bei Wanderungen im Rila oder Pirin Gebirge: FSME-Impfung mindestens 4 Wochen vor Reisebeginn abschließen. Zecken sind in diesen Regionen häufig.</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Bulgarischer Joghurt:</strong> Das Original Kiselo Mlyako (saures Milch-Bakterium Lactobacillus bulgaricus) ist weltweit einzigartig und gut für die Darmgesundheit. Im Supermarkt für 1–2 BGN kaufen.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Flughäfen</h4>
          <div class="space-y-3 text-sm">
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Sofia (SOF)</strong>
              Metro Linie 1: Direktverbindung Flughafen → Stadtzentrum, ca. 45 Min., 1,60 BGN (ca. 0,82 €).<br/>
              Taxi: 15–25 BGN zum Zentrum. Nur offizielle Taxis (OK SuperTrans, Yellow Cab) nehmen.<br/>
              Beware: Inoffizielle Taxis am Flughafen verlangen teils 10x den normalen Preis!
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Varna (VAR) – Schwarzmeerküste</strong>
              Taxi → Goldener Sand / Albena: ca. 20–30 BGN, 30 Min.<br/>
              Bus: Stadtbus nach Varna für ca. 2 BGN. Für Ferienorte: Transfer vorbuchen.
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <strong class="block mb-1">Burgas (BOJ) – Schwarzmeerküste Süd</strong>
              Taxi → Sonnenstrand: ca. 40–50 BGN, 30 Min.<br/>
              Bus 15: Flughafen → Busbahnhof Burgas für ca. 2 BGN.
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Innertransport</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Bahn (BDŽ):</strong> Günstig aber langsam und veraltet. Sofia–Plovdiv: 2 Stunden, ca. 4–6 BGN.</li>
            <li><strong>Fernbusse:</strong> Bester Komfort für Überlandfahrten. Biomet, Union Ivkoni, FlixBus. Sofia–Varna: ca. 30–40 BGN, 6–7 Stunden.</li>
            <li><strong>Mietwagen:</strong> Für Gebirgsausflüge (Rila, Pirin) empfohlen. Gute Straßen zu den Hauptattraktionen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Transfer-Hacks Bulgarien</h4>
        <ul class="space-y-3">
          <li class="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
            <strong class="text-red-900 block mb-1">Sofia-Flughafen Taxi-Falle</strong>
            Inoffizielle Taxifahrer verlangen 50–100 € für eine 15 €-Fahrt. IMMER nur bei offiziellen Taxi-Schaltern im Ankunftsbereich (OK SuperTrans, Yellow Cab) buchen. Oder direkt Metro nehmen!
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Yandex.Taxi / Bolt:</strong> In Sofia und Varna verfügbar. Festpreise, seriös, deutlich günstiger als Straßentaxis. App vor Reise installieren!</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Sofia Metro:</strong> Direkte Verbindung Flughafen Terminal 2 → Stadtzentrum (Serdika). Schnell, günstig, klimatisiert. Beste Option für Individualreisende.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Pauschalreise Sonnenstrand/Albena:</strong> Transferbus vom Veranstalter nutzen – meist im Pauschalpreis inklusive. Günstiger und stressfreier als eigenständige Taxibuchung.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Währung &amp; Bezahlen</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Währung:</strong> Bulgarischer Lev (BGN). 1 € = 1,9558 BGN (fester Kurs, kaum Schwankung).</li>
            <li><strong>Euro:</strong> Wird in Touristenzentren und größeren Restaurants oft akzeptiert. Wechselkurs der Händler meist schlechter – in Lev zahlen ist besser.</li>
            <li><strong>Bargeld:</strong> Sehr wichtig. Lokale Märkte, Taxis, kleine Restaurants und ländliche Gebiete oft nur Bargeld.</li>
            <li><strong>ATMs:</strong> In Städten und Touristenzentren ausreichend. Im Gebirge (Rila-Kloster, Bansko) vorab Bargeld abheben!</li>
            <li><strong>Trinkgeld:</strong> 10% im Restaurant üblich. Für guten Service wird Trinkgeld in Lev sehr geschätzt.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Preisniveau</h4>
          <div class="bg-yellow-50 p-3 rounded text-sm">
            Bulgarien ist eines der günstigsten EU-Reiseziele. Mahlzeit in gutem Restaurant: 15–25 BGN (7–12 €). Bier: 3–5 BGN. Taxi-Kurzfahrt: 5–10 BGN. Im Vergleich zu Westeuropa 40–60% günstiger.
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Spar-Tipps Bulgarien</h4>
        <ul class="space-y-3">
          <li class="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
            <strong class="text-indigo-900 block mb-1">Günstiger als Sie denken:</strong>
            Bulgarien ist EU-Mitglied mit EU-Qualitätsstandards aber Preisen wie vor 20 Jahren in Deutschland. Ein 3-Gänge-Menü im guten Restaurant für 25–30 BGN (13–15 €) ist normal.
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Sonnenstrand Preis-Tipp:</strong> Außerhalb des Hauptstrands (Fußweg nördlich oder südlich) sind Restaurant- und Barpreise 30–50% günstiger als direkt am Hauptstrand.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Lokaler Wein:</strong> Bulgarischer Wein (Mavrud, Melnik) ist weltweit unterschätzt aber exzellent. Im Supermarkt: guter Wein ab 5–8 BGN (2,50–4 €).</li>
          <li class="bg-green-50 p-3 rounded-lg border border-green-200"><strong>Geldwechsel:</strong> Immer bei offiziellen Wechselstuben (Обмяна/Obmenya) tauschen – nicht am Flughafen oder Hotel. Kurs online vorab prüfen.</li>
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
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Konnektivität</h4>
          <ul class="list-disc pl-5 space-y-2 text-sm">
            <li><strong>EU-Roaming:</strong> Gilt vollständig in Bulgarien. Deutsche SIM ohne Aufpreis nutzbar.</li>
            <li><strong>WLAN:</strong> In Hotels und Resorts ausgezeichnet. Bulgarien hat eines der schnellsten Breitband-Netzwerke der EU!</li>
            <li><strong>Mobilfunk:</strong> Sehr gute Abdeckung. 4G/5G in Städten, 4G in Touristenzentren. Im Gebirge kann es dünn werden.</li>
            <li><strong>Steckdosen:</strong> Typ C und F (Schuko) wie in Deutschland – kein Adapter nötig. 220–230 Volt.</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-xl text-gray-900 mb-2 border-b pb-1">Nützliche Apps</h4>
          <div class="bg-gray-50 p-3 rounded text-sm">
            <ul class="space-y-1">
              <li><strong>Yandex.Taxi / Bolt:</strong> Ride-Hailing in Sofia, Varna, Burgas, Plovdiv.</li>
              <li><strong>bgtoll.bg:</strong> E-Vignette online kaufen für Autoreisende.</li>
              <li><strong>Sofia Metro App:</strong> Fahrpläne und Netzplan der Sofioter Metro.</li>
              <li><strong>Google Maps:</strong> Bulgarische Karten sehr detailliert, offline laden empfohlen.</li>
            </ul>
          </div>
        </div>
      </div>`,
    insiderHtml: `
      <div class="space-y-4 text-sm">
        <h4 class="font-bold text-lg text-indigo-900 mb-2">Tech-Hacks Bulgarien</h4>
        <ul class="space-y-3">
          <li class="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
            <strong class="text-green-900 block mb-1">Internet-Geheimtipp Bulgarien:</strong>
            Bulgarien hat eine der schnellsten Internetinfrastrukturen Europas. In Hotels und Cafés ist WLAN mit 100+ MBit/s keine Seltenheit – ideal für digitale Nomaden.
          </li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>EU-Roaming ohne Bedenken:</strong> Volles EU-Roaming – telefonieren, surfen, SMS wie in Deutschland ohne Aufpreis. Seit Schengen-Beitritt 2024 noch reibungsloser.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Kein Adapter nötig:</strong> Typ C und F (Schuko) wie in DE/AT. 220–230 Volt. Alle deutschen Geräte funktionieren direkt ohne Adapter.</li>
          <li class="bg-indigo-50 p-3 rounded-lg"><strong>Gebirge Offline-Karten:</strong> Im Rila- und Pirin-Gebirge kann Mobilempfang schwach sein. Wanderrouten (Maps.me oder AllTrails) offline vorab laden!</li>
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
          <p class="mb-2">Bulgarien ist grundsätzlich sicher für Touristen. Risiken sind hauptsächlich Kleinkriminalität und Verkehrsunfälle.</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Taschendiebstahl:</strong> In Sofia (Nationalmuseum-Umgebung, Öffis), auf überfüllten Stränden. Wachsamkeit angebracht.</li>
            <li><strong>Verkehr:</strong> Bulgarien hat höhere Unfallrate als Westeuropa. Vorsicht auf Landstraßen (Schlaglöcher, schlechte Beleuchtung).</li>
            <li><strong>Betrüger:</strong> Falsche Taxifahrer (Sofia), Kettenglücksspiel (illegal aber vorkommend). Nur seriöse Taxi-Apps nutzen.</li>
            <li><strong>Wandern Gebirge:</strong> Im Rila und Pirin bei Wetterumschwung Vorsicht – Gewitter entstehen schnell. Auf markierten Wegen bleiben.</li>
          </ul>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <strong>Notrufnummern Bulgarien:</strong><br/>
          112 – Europäischer Notruf<br/>
          166 – Polizei (Politsiya)<br/>
          150 – Krankenwagen<br/>
          160 – Feuerwehr
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-gray-100 p-4 rounded text-sm">
        <strong class="block text-gray-900 mb-2">Sicherheits-Insider Bulgarien</strong>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Deutsche Botschaft Sofia:</strong> +359 2 918 38 10. Für Notfälle, Passverlust und konsularische Hilfe.</li>
          <li><strong>Sonnenstrand Nachtleben:</strong> Der Sonnenstrand ist für ausgedehntes Nachtleben bekannt. Übermäßiger Alkohol und unbekannte Getränke (Drugging) meiden. In Gruppen unterwegs sein.</li>
          <li>Bergwanderungen im Rila/Pirin: Wettervorhersage prüfen, Bergrettung-Nummer notieren: 1410 (Berg- und Höhlenrettung).</li>
          <li><strong>Korrektes Taxameter:</strong> Offizielle Taxis in Bulgarien haben Taxameter. Auf Tarif A1 (Tag) und A2 (Nacht) achten. Preis pro km sollte 0,80–1,20 BGN sein.</li>
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
          <h4 class="font-bold text-gray-900 mb-2">Bulgarische Kultur &amp; Besonderheiten</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Kopfbewegungen!</strong> In Bulgarien bedeutet Kopfnicken "NEIN" und Kopfschütteln "JA" – das Gegenteil zu Deutschland! Wichtige Info für Kommunikation.</li>
            <li><strong>Kyrillische Schrift:</strong> Schilda und Speisekarten auf Kyrillisch. Die Bulgaren haben das Kyrillische Alphabet im 9. Jahrhundert erfunden.</li>
            <li><strong>Orthodoxe Kirche:</strong> Sehr wichtig im Alltag. In Kirchen angemessene Kleidung (Schultern, Knie bedecken). Fotografieren oft erlaubt.</li>
            <li><strong>Sprache:</strong> Bulgarisch (Слатев). "Бlagodarya" (Благодаря – Danke) und "Zdravei" (Здравей – Hallo) kommen sehr gut an. Russisch-Kenntnisse helfen oft.</li>
            <li><strong>UNESCO-Welterbe:</strong> Rila-Kloster, Thrakisches Grabmal Kasanlak, Felsgrabmäler Ivanovo, historische Stadt Nessebar.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-purple-50 p-4 rounded text-sm">
        <strong class="block text-purple-900 mb-2">Kulturelles Know-how Bulgarien</strong>
        <p><strong>Das Kopfnicken-Paradox:</strong> Das wichtigste Kulturwissen für Bulgarien-Reisende: Kopf NICKEN = "Nein". Kopf SCHÜTTELN = "Ja". Bei Verwirrung einfach verbal auf Englisch bestätigen!</p>
        <p class="mt-2"><strong>Rila-Kloster:</strong> Das bedeutendste orthodoxe Kloster Bulgariens liegt in atemberaubender Berglandschaft. Übernachtung im Kloster möglich – einzigartiges Erlebnis für 25–30 BGN pro Nacht.</p>
        <p class="mt-2"><strong>Rose Valley (Rozova Dolina):</strong> Bulgarien produziert 70% des weltweiten Rosenöls. Im Mai/Juni Rosenernte – Festivals in Kazanlak mit traditionellen Trachten und Rosenpflückungen. Unvergesslich!</p>
      </div>`,
  },

  kulinarik: {
    title: "Kulinarik",
    iconFa: "fa-utensils",
    color: "bg-sand-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Bulgarische Küche</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Shopska Salata:</strong> Der Klassiker – Tomaten, Gurken, Paprika, Zwiebeln mit geriebenem Sirene-Käse (bulgarischer Feta). Zu jeder Mahlzeit dabei.</li>
            <li><strong>Banitsa:</strong> Blätterteig mit Feta-Käse oder Spinat. Das klassische Frühstück – morgens noch warm aus der Bäckerei.</li>
            <li><strong>Tarator:</strong> Kalte Joghurtsuppe mit Gurken, Dill und Walnüssen – perfekte Sommersuppe.</li>
            <li><strong>Kavarma:</strong> Langsam geschmortes Fleisch (Schwein oder Huhn) mit Gemüse im Tontopf gegart.</li>
            <li><strong>Ayran:</strong> Dünnes Joghurtgetränk – erfrischend im Sommer und besser gegen Hitze als Wasser.</li>
            <li><strong>Mastika (Rakia):</strong> Bulgarischer Obstbrand – wichtiger Bestandteil bulgarischer Geselligkeit.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-sand-50 p-4 rounded text-sm">
        <strong class="block mb-2">Essen wie Einheimische</strong>
        <p><strong>Mekhana (Механа) – die bulgarische Taverne:</strong> Traditionelles Restaurant mit Holzdekoration, Live-Folkloremusik und rustikaler Küche. Preise 30–50% günstiger als auf Touristenmeile. In jeder Kleinstadt zu finden.</p>
        <p class="mt-2"><strong>Pazar (Markt):</strong> Auf dem lokalen Wochenmarkt frisches Gemüse, Honig, hausgemachter Joghurt und lokaler Käse kaufen. Preis: Bruchteil des Supermarkts. Sprachkenntnisse: Finger zeigen funktioniert immer!</p>
        <p class="mt-2"><strong>Bulgarischer Joghurt als Reise-Souvenir:</strong> Den echten Lactobacillus bulgaricus Joghurt-Starter als Pulver kaufen (in Apotheken) und Zuhause selbst ansetzen. Das einzige Souvenir, das sich vermehrt!</p>
      </div>`,
  },

  mobilitaet: {
    title: "Mobilität",
    iconFa: "fa-bus",
    color: "bg-teal-500",
    planningHtml: `
      <div class="space-y-4 text-sm">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-2">Fortbewegung in Bulgarien</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Mietwagen:</strong> Für Gebirgsausflüge (Rila, Pirin, Rhodopen) und Erkundung des Landesinneren empfohlen. EU-Führerschein ausreichend.</li>
            <li><strong>Fernbusse:</strong> Bequemster und schnellster Innertransport. Biomet, Union Ivkoni und FlixBus verbinden alle wichtigen Städte.</li>
            <li><strong>Bahn (BDŽ):</strong> Günstig (2–5 €) aber langsam und Züge oft veraltet. Für Kurzstrecken und Gebirgsrouten (Rila) romantisch.</li>
            <li><strong>Taxis/Apps:</strong> Bolt und Yandex.Taxi in allen größeren Städten. Günstig und sicher.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-teal-50 p-4 rounded text-sm">
        <strong class="block text-teal-900 mb-2">Mobilitäts-Hacks Bulgarien</strong>
        <ul class="space-y-2 list-disc pl-5">
          <li><strong>Sofia Metro:</strong> Schnell, günstig, sicher. Einzelticket: 1,60 BGN. Tageskarte: 8 BGN. Direkte Verbindung Flughafen–Zentrum.</li>
          <li><strong>Rila-Kloster per Bus:</strong> Von Sofia mehrere tägliche Busverbindungen. Rückfahrt nachmittags. Günstigste Option – kein Mietwagen nötig.</li>
          <li><strong>Sonnenstrand-Shuttle:</strong> Im Sommer fahren Minibusse zwischen Sonnenstrand, Nessebar (UNESCO) und Burgas im 20-Minuten-Takt. Ca. 5–8 BGN – bequemer als Taxi.</li>
          <li><strong>E-Vignette:</strong> Bei Anreise per Auto: e-Vignette vorab online kaufen (bgtoll.bg). Wochenvignette: ca. 15 €. Ohne Vignette droht Strafe von 300 BGN!</li>
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
            <li><strong>Mai–Juni:</strong> Ideal für Wandern (Rila, Pirin) und Kultur. Rosenfest in Kazanlak (Mai). Mild, 22–26°C, wenige Touristen.</li>
            <li><strong>Juli–August:</strong> Hauptsaison Schwarzmeer. 28–32°C, Sonnenstrand und Albena sehr voll. Günstige Pauschalreisen.</li>
            <li><strong>September–Oktober:</strong> Angenehme Herbsttemperaturen, Meer noch warm (24°C), Weinlese-Saison. Viel weniger Touristen.</li>
            <li><strong>Dezember–März:</strong> Ski in Bansko, Borovets oder Pamporovo. Günstiger Wintersport mit EU-Standard zu halben Preisen.</li>
          </ul>
        </div>
      </div>`,
    insiderHtml: `
      <div class="bg-pink-50 p-4 rounded text-sm">
        <strong class="block text-pink-900 mb-2">Planungs-Geheimtipps Bulgarien</strong>
        <p><strong>Bansko als Ski-Geheimtipp:</strong> Modernes Skigebiet im Pirin-Gebirge mit Gondelbahn. Skipässe 30–40 € pro Tag (Hälfte der Alpenpreise). Après-Ski in Bansko-Altstadt für 3–5 € pro Bier. Direktflüge nach Sofia, 2 Stunden Transfer.</p>
        <p class="mt-2"><strong>Nessebar UNESCO-Trick:</strong> Die Altstadt Nessebar (UNESCO-Welterbe) auf der Halbinsel ist tagsüber voller Touristen vom Sonnenstrand. Früh morgens (vor 9 Uhr) oder beim Sonnenuntergang besuchen – dann gehört die Altstadt fast einem alleine.</p>
        <p class="mt-2"><strong>Budget-Champion EU:</strong> Bulgarien ist das günstigste EU-Reiseziel. 2 Wochen mit gutem Hotel, gutes Essen und Ausflügen für 800–1.200 € pro Person (All Inclusive Pauschalreise bereits ab 400 € buchbar).</p>
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
  Kroatien: croatiaHubData,
  Marokko: moroccoHubData,
  Tunesien: tunisiaHubData,
  Zypern: cyprusHubData,
  Bulgarien: bulgariaHubData,
};

export function getHubDataByCountry(country: string): HubData | null {
  return hubRegistry[country] ?? null;
}
