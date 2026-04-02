import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import AdminNav from "@/components/admin/AdminNav";

// WICHTIG: Admin-E-Mails hier eintragen
const ADMIN_EMAILS = ["admin@urlaubfinder365.de", "a.meierholz@urlaubfinder365.de"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/admin/dashboard/");
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/");

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminNav userEmail={user.email!} />
      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
