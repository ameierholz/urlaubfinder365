import Link from "next/link";

const CARDS = [
  {
    title: "Strand & Meer",
    subtitle: "Entspannung pur",
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    color: "from-cyan-600/70",
  },
  {
    title: "Familie & Kinder",
    subtitle: "Unvergessliche Momente",
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    color: "from-sand-600/70",
  },
  {
    title: "Kultur & Städte",
    subtitle: "Geschichte erleben",
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    color: "from-purple-700/70",
  },
  {
    title: "Abenteuer & Natur",
    subtitle: "Die Welt entdecken",
    href: "/urlaubsarten/",
    img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80",
    color: "from-green-700/70",
  },
];

export default function LifestyleCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="group relative rounded-2xl overflow-hidden h-52 sm:h-64 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.img}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${card.color} to-transparent`}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="text-xs font-medium text-white/75 uppercase tracking-widest mb-1">
              {card.subtitle}
            </p>
            <h3 className="text-xl font-bold leading-tight drop-shadow-sm">
              {card.title}
            </h3>
            <div className="mt-2 h-0.5 w-0 bg-white group-hover:w-12 transition-all duration-300 rounded-full" />
          </div>
        </Link>
      ))}
    </div>
  );
}
