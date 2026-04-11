import Link from "next/link";

export interface ThemeDestLink {
  slug: string;
  label: string;
}

interface Props {
  /** Kleine Überschrift über H2, z.B. "Beliebte Strand-Reiseziele" */
  eyebrow: string;
  /** Haupt-H2, z.B. "Strandurlaub Reiseziele im Überblick" */
  heading: string;
  /** Liste der verlinkten Ziele (slug + Anchor-Label) */
  destinations: ThemeDestLink[];
  /** Hex-Akzentfarbe passend zum Seitentheme */
  accentColor: string;
}

/**
 * Hub→Spoke interne Verlinkung auf Urlaubsthemen-Seiten.
 * Leitet Link-Equity an konkrete /urlaubsziele/ Landingpages weiter.
 */
export default function ThemeDestinationLinks({
  eyebrow,
  heading,
  destinations,
  accentColor,
}: Props) {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100"
      style={{ ["--theme-accent" as string]: accentColor } as React.CSSProperties}
    >
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
        {eyebrow}
      </p>
      <h2 className="text-xl font-extrabold text-gray-900 mb-5">{heading}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {destinations.map(({ slug, label }) => (
          <Link
            key={slug + label}
            href={`/urlaubsziele/${slug}/`}
            className="flex items-center justify-between bg-white border border-gray-200 text-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-all group hover:border-(--theme-accent) hover:text-(--theme-accent)"
          >
            <span>{label}</span>
            <span className="text-gray-300 text-xs ml-1 shrink-0 group-hover:text-(--theme-accent)">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
