import Link from "next/link";
import { Link2, ChevronRight } from "lucide-react";
import LinkAudit from "@/components/admin/link-audit";

export default function LinkAuditPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <Link href="/admin/dashboard/" className="hover:text-gray-300 transition-colors">Admin</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/seo/" className="hover:text-gray-300 transition-colors">SEO</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">Link-Audit</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900/30 rounded-lg">
            <Link2 className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Link-Audit</h1>
            <p className="text-sm text-gray-500">Interne Verlinkung der wichtigsten Seiten prüfen</p>
          </div>
        </div>
        <Link
          href="/admin/seo/"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Zurück zu SEO
        </Link>
      </div>

      <LinkAudit />
    </div>
  );
}
