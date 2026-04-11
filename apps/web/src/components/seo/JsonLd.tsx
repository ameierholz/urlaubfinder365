import { headers } from "next/headers";

interface Props {
  /** Schema.org Objekt – wird zu JSON serialisiert */
  data: unknown;
}

/**
 * Server-Component für JSON-LD-Scripts mit CSP-Nonce.
 * Liest das `x-nonce` Header aus middleware.ts und setzt es als
 * `nonce` Attribut auf dem <script>-Tag, sodass strikte CSP
 * (ohne `unsafe-inline`) das Script erlaubt.
 *
 * Nutzung:
 *   <JsonLd data={breadcrumbSchema} />
 */
export default async function JsonLd({ data }: Props) {
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
