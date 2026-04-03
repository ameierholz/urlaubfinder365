// Minimales Root-Layout — html/body kommen vom [locale]/layout.tsx.
// Next.js 16 erfordert trotzdem html+body im Root-Layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
