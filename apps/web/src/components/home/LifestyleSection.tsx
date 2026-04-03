import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const LIFESTYLE_ITEMS = [
  { img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75",  gradient: "from-blue-900/75",    labelKey: "familien",     href: "/urlaubsthemen/familienurlaub/" },
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=75",  gradient: "from-pink-900/70",    labelKey: "paare",        href: "/urlaubsthemen/wellnessurlaub/" },
  { img: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=75",  gradient: "from-sand-900/70",    labelKey: "singles",      href: "/urlaubsthemen/singlereisen/" },
  { img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=75",  gradient: "from-teal-900/70",    labelKey: "gruppen",      href: "/urlaubsthemen/familienurlaub/" },
  { img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=75",     gradient: "from-emerald-900/70", labelKey: "aktiv",        href: "/urlaubsthemen/aktivurlaub/" },
  { img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=75",  gradient: "from-cyan-900/70",    labelKey: "allInclusive", href: "/urlaubsarten/all-inclusive-urlaub/" },
  { img: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=75",  gradient: "from-sky-900/70",     labelKey: "strand",       href: "/urlaubsthemen/strandurlaub/" },
  { img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=75",  gradient: "from-violet-900/70",  labelKey: "stadt",        href: "/urlaubsthemen/staedtereisen/" },
] as const;

export default async function LifestyleSection() {
  const t = await getTranslations("lifestyle");

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {LIFESTYLE_ITEMS.map(({ img, gradient, labelKey, href }) => (
        <Link
          key={labelKey}
          href={href}
          className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          style={{ minHeight: "200px" }}
        >
          <Image
            src={img}
            alt={t(labelKey)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className={`absolute inset-0 bg-linear-to-t ${gradient} to-transparent`} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          <div className="relative flex flex-col h-full min-h-[200px] justify-end p-5 text-white">
            <h3 className="font-black text-lg sm:text-xl leading-tight drop-shadow-sm truncate">
              {t(labelKey)}
            </h3>
            <div className="mt-2 h-0.5 w-0 bg-white group-hover:w-10 transition-all duration-300 rounded-full" />
          </div>
        </Link>
      ))}
    </div>
  );
}
