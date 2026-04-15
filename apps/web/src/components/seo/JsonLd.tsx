interface Props {
  /** Schema.org Objekt – wird zu JSON serialisiert */
  data: unknown;
}

/**
 * Server-Component für JSON-LD-Scripts.
 * unsafe-inline in CSP erlaubt Inline-Scripts.
 *
 * Nutzung:
 *   <JsonLd data={breadcrumbSchema} />
 */
export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
