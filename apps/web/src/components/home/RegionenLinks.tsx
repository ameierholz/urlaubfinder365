import Link from "next/link";
import { ArrowRight } from "lucide-react";

const REGIONS = [
  { region: "Mittelmeer", links: [
    { flag: "tr", name: "Tuerkei", slug: "tuerkei" },
    { flag: "gr", name: "Griechenland", slug: "griechenland" },
    { flag: "es", name: "Spanien", slug: "spanien" },
    { flag: "it", name: "Italien", slug: "italien" },
    { flag: "hr", name: "Kroatien", slug: "kroatien" },
    { flag: "cy", name: "Zypern", slug: "zypern" },
  ]},
  { region: "Atlantik & Inseln", links: [
    { flag: "pt", name: "Portugal", slug: "portugal" },
    { flag: "es", name: "Fuerteventura", slug: "fuerteventura" },
    { flag: "es", name: "Teneriffa", slug: "teneriffa" },
    { flag: "es", name: "Gran Canaria", slug: "gran-canaria" },
    { flag: "es", name: "Lanzarote", slug: "lanzarote" },
    { flag: "es", name: "Mallorca", slug: "mallorca" },
  ]},
  { region: "Europa", links: [
    { flag: "de", name: "Deutschland", slug: "deutschland-nord" },
    { flag: "at", name: "Oesterreich", slug: "oesterreich" },
    { flag: "fr", name: "Frankreich", slug: "cote-dazur" },
    { flag: "gb", name: "London", slug: "london" },
    { flag: "bg", name: "Bulgarien", slug: "bulgarien" },
    { flag: "mt", name: "Malta", slug: "malta" },
  ]},
  { region: "Afrika & Orient", links: [
    { flag: "eg", name: "Aegypten", slug: "aegypten" },
    { flag: "eg", name: "Hurghada", slug: "hurghada" },
    { flag: "ma", name: "Marokko", slug: "marokko" },
    { flag: "tn", name: "Tunesien", slug: "tunesien" },
    { flag: "cv", name: "Kap Verde", slug: "kapverden" },
    { flag: "za", name: "Suedafrika", slug: "afrika-sued" },
  ]},
  { region: "Asien & Indischer Ozean", links: [
    { flag: "ae", name: "Dubai", slug: "dubai" },
    { flag: "th", name: "Thailand", slug: "thailand" },
    { flag: "id", name: "Bali", slug: "bali" },
    { flag: "mv", name: "Malediven", slug: "malediven" },
    { flag: "lk", name: "Sri Lanka", slug: "sri-lanka" },
    { flag: "om", name: "Oman", slug: "oman" },
  ]},
  { region: "Amerika & Karibik", links: [
    { flag: "us", name: "USA", slug: "usa-ostkueste" },
    { flag: "mx", name: "Mexiko", slug: "mexiko" },
    { flag: "do", name: "Dom. Republik", slug: "dominikanische-republik" },
    { flag: "cu", name: "Kuba", slug: "kuba" },
    { flag: "jm", name: "Jamaika", slug: "jamaika" },
    { flag: "br", name: "Brasilien", slug: "brasilien" },
  ]},
];

export default function RegionenLinks() {
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-black text-gray-900 mb-6">Beliebte Urlaubsregionen</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-1">
          {REGIONS.map(({ region, links }) => (
            <div key={region}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">{region}</p>
              <ul className="space-y-0.5 mb-4">
                {links.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/urlaubsziele/${l.slug}/`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1db682] transition-colors py-0.5">
                      <img src={`https://flagcdn.com/16x12/${l.flag}.png`} alt="" width={16} height={12} className="rounded-sm" loading="lazy" />
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/urlaubsziele/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1db682] hover:text-[#18a070] transition-colors">
            Zu allen Urlaubsregionen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
