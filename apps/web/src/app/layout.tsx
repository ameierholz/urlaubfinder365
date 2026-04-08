import "./globals.css";

// Root-Layout – stellt Tailwind CSS für alle Routen bereit.
// [locale]/layout.tsx rendert <html>/<body> für öffentliche Seiten.
// Admin/Anbieter nutzen eigene Layouts ohne <html>/<body>.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
