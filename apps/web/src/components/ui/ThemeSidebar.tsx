import RightSidebar from "@/components/layout/RightSidebar";

export default function ThemeSidebar() {
  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24">
        <RightSidebar
          extrasBox={{
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&h=200&q=70",
            eyebrow: "Last-Minute",
            title: "Günstige Reisen jetzt",
            description: "Abreise in 7–14 Tagen – spontan & günstig buchen.",
            href: "/urlaubsarten/last-minute-urlaub/",
            ctaLabel: "Deals ansehen →",
          }}
          seoLinksTitle="🗂️ Urlaubsthemen"
          seoLinks={[
            { href: "/urlaubsthemen/strandurlaub/",  label: "🏖️ Strandurlaub" },
            { href: "/urlaubsthemen/adults-only/",   label: "💑 Adults Only" },
            { href: "/urlaubsthemen/familienurlaub/", label: "👨‍👩‍👧 Familienurlaub" },
            { href: "/urlaubsthemen/wellnessurlaub/", label: "🧖 Wellness" },
            { href: "/urlaubsthemen/luxusurlaub/",   label: "👑 Luxusurlaub" },
            { href: "/urlaubsthemen/",               label: "🗂️ Alle Themen" },
          ]}
        />
      </div>
    </aside>
  );
}
