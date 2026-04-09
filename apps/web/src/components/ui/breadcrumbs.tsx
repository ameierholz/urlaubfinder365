import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  const allItems: BreadcrumbItem[] = [{ label: "Startseite", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://www.urlaubfinder365.de${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="overflow-x-auto whitespace-nowrap"
      >
        <ol className="inline-flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={index} className="inline-flex items-center gap-1.5 shrink-0">
                {index > 0 && (
                  <span className="text-gray-400 select-none" aria-hidden="true">
                    ›
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    className={isLast ? "font-semibold text-gray-800" : "text-gray-500"}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-gray-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
