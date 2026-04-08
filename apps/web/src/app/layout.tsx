// Root-Layout für next-intl App-Router-Setup.
// html/body werden vom [locale]/layout.tsx bzw. admin/anbieter layouts gerendert.
// @ts-expect-error Next.js 16 warnt, aber next-intl mit [locale]-Segment braucht es so.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
