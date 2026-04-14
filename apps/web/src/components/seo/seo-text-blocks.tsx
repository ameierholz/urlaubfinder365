import { fetchPageSeoMeta } from "@/lib/seo-meta";

export async function SeoTextBlocks({ pagePath }: { pagePath: string }) {
  const seo = await fetchPageSeoMeta(pagePath);
  if (!seo) return null;

  const hasIntro = !!seo.seo_intro;
  const hasMiddle = !!seo.seo_middle;
  const hasBottom = !!seo.seo_bottom;

  if (!hasIntro && !hasMiddle && !hasBottom) return null;

  return (
    <>
      {/* SEO Intro */}
      {hasIntro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600 text-base leading-relaxed">
            {seo.seo_intro}
          </p>
        </div>
      )}

      {/* SEO Middle */}
      {hasMiddle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {seo.seo_h2_middle && (
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{seo.seo_h2_middle}</h2>
          )}
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            {seo.seo_middle!.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((block: string, i: number) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </div>
      )}

      {/* SEO Bottom */}
      {hasBottom && (
        <div className="bg-sand-50 border-t border-sand-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {seo.seo_h2_bottom && (
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{seo.seo_h2_bottom}</h2>
            )}
            <div className="text-gray-600 text-sm leading-relaxed space-y-4">
              {seo.seo_bottom!.replace(/\\n\\n/g, "\n\n").replace(/\\n/g, "\n").split("\n\n").map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
