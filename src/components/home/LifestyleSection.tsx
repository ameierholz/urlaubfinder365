import Image from "next/image";
import Link from "next/link";

const LIFESTYLE = [
  {
    title: "Perfekt für Familien",
    sub: "Kinderfreundliche Hotels",
    href: "/urlaubsziele/",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75",
    gradient: "from-blue-900/75",
  },
  {
    title: "Erstklassig für Paare",
    sub: "Romantik & Entspannung",
    href: "/urlaubsarten/pauschalreisen/",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=75",
    gradient: "from-pink-900/70",
  },
  {
    title: "Ideal für Singles",
    sub: "Neue Orte, neue Erlebnisse",
    href: "/last-minute/",
    img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=75",
    gradient: "from-sand-900/70",
  },
  {
    title: "Einmalig für Gruppen",
    sub: "Gemeinsam unvergesslich",
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=75",
    gradient: "from-teal-900/70",
  },
  {
    title: "Aktiv & Abenteuer",
    sub: "Sport, Wandern & Wassersport",
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=75",
    gradient: "from-emerald-900/70",
  },
  {
    title: "All Inclusive",
    sub: "Alles inklusive – sorglos genießen",
    href: "/urlaubsarten/pauschalreisen/",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=75",
    gradient: "from-cyan-900/70",
  },
  {
    title: "Strandurlaub",
    sub: "Sonne, Meer & weißer Sand",
    href: "/urlaubsziele/",
    img: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=75",
    gradient: "from-sky-900/70",
  },
  {
    title: "Städtereise",
    sub: "Kultur, Kunst & Stadtleben",
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=75",
    gradient: "from-violet-900/70",
  },
];

export default function LifestyleSection() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {LIFESTYLE.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          style={{ minHeight: "200px" }}
        >
          <Image
            src={item.img}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} to-transparent`} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          <div className="relative flex flex-col h-full min-h-[200px] justify-end p-5 text-white">
            <p className="text-xs text-white/70 mb-1 font-medium truncate">{item.sub}</p>
            <h3 className="font-black text-lg sm:text-xl leading-tight drop-shadow-sm truncate">
              {item.title}
            </h3>
            <div className="mt-2 h-0.5 w-0 bg-white group-hover:w-10 transition-all duration-300 rounded-full" />
          </div>
        </Link>
      ))}
    </div>
  );
}
