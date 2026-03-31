interface FeatureItem {
  emoji: string;
  title: string;
  desc: string;
}

interface Props {
  heading: string;
  items: FeatureItem[];
  accentColor?: string;
}

export default function ThemeFeatureGrid({
  heading,
  items,
  accentColor = "#00838F",
}: Props) {
  return (
    <div className="py-14" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <h2 className="text-2xl font-extrabold text-gray-900 text-center whitespace-nowrap px-2">
            {heading}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((f, i) => (
            <div
              key={f.title}
              className="group relative bg-white rounded-2xl p-5 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Accent strip top */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: accentColor }}
              />

              {/* Number badge */}
              <div
                className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black opacity-20"
                style={{ background: accentColor, color: "white" }}
              >
                {i + 1}
              </div>

              {/* Icon circle */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm"
                style={{ background: `${accentColor}12` }}
              >
                {f.emoji}
              </div>

              <h3 className="font-bold text-gray-900 text-sm mb-1.5 leading-tight">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
