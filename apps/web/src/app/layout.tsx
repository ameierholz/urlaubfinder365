// Root-Layout für next-intl App-Router-Setup.
// html/body werden vom [locale]/layout.tsx gerendert.
// Next.js 16 zeigt eine Warnung, die bei next-intl mit [locale]-Segment erwartet wird.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
