// Root-Layout – Next.js 16 erfordert <html> und <body> im Root.
// [locale]/layout.tsx überschreibt diese Tags für i18n-Seiten.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
