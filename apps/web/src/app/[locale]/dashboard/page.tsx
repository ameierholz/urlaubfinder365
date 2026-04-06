"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Heart, MapPin, CheckSquare,
  User, Settings, LogOut, Menu, X, Palmtree, Ticket,
  Map, FileText, Bell, Globe, BookOpen, Users2, Flame, ShieldCheck, Navigation,
} from "lucide-react";

// Tabs
import OverviewTab           from "@/components/dashboard/OverviewTab";
import SavedTripsTab         from "@/components/dashboard/SavedTripsTab";
import SavedActivitiesTab    from "@/components/dashboard/SavedActivitiesTab";
import WishlistTab           from "@/components/dashboard/WishlistTab";
import ChecklistTab          from "@/components/dashboard/ChecklistTab";
import ProfileTab            from "@/components/dashboard/ProfileTab";
import SettingsTab           from "@/components/dashboard/SettingsTab";
import PriceAlertsTab        from "@/components/dashboard/PriceAlertsTab";
import TripPlannerTab        from "@/components/dashboard/TripPlannerTab";
import TravelDocumentsTab    from "@/components/dashboard/TravelDocumentsTab";
import LaenderKarteTab       from "@/components/dashboard/LaenderKarteTab";
import MeineBerichteTab      from "@/components/dashboard/MeineBerichteTab";
import MeineGruppenTab       from "@/components/dashboard/MeineGruppenTab";
import CheckInTab            from "@/components/dashboard/CheckInTab";
import AdminTravelTipsTab    from "@/components/dashboard/AdminTravelTipsTab";
import MeineKartenTippsTab  from "@/components/dashboard/MeineKartenTippsTab";

type Tab = "overview" | "trips" | "activities" | "wishlist" | "checklist" | "pricealerts" | "tripplanner" | "documents" | "laender" | "berichte" | "gruppen" | "checkin" | "profile" | "settings" | "admin-traveltips" | "kartentipps";

const NAV_ITEMS: { id: Tab; labelKey: string; icon: React.ElementType; badge?: number }[] = [
  // Übersicht
  { id: "overview",     labelKey: "overview",        icon: LayoutDashboard },
  // Planung
  { id: "tripplanner",  labelKey: "tripPlanner",     icon: Map },
  { id: "checklist",    labelKey: "checklist",       icon: CheckSquare },
  { id: "documents",    labelKey: "documents",       icon: FileText },
  // Gespeichertes
  { id: "trips",        labelKey: "myHotels",        icon: Heart },
  { id: "activities",   labelKey: "myActivities",    icon: Ticket },
  { id: "wishlist",     labelKey: "wishlist",        icon: MapPin },
  { id: "pricealerts",  labelKey: "priceAlerts",     icon: Bell },
  // Community
  { id: "laender",      labelKey: "myCountries",     icon: Globe },
  { id: "berichte",     labelKey: "myReports",       icon: BookOpen },
  { id: "gruppen",      labelKey: "myGroups",        icon: Users2 },
  { id: "kartentipps",  labelKey: "myMapTips",       icon: Navigation },
  // Engagement
  { id: "checkin",           labelKey: "dailyCheckIn",     icon: Flame },
  // Account
  { id: "profile",           labelKey: "myProfile",        icon: User },
  { id: "settings",          labelKey: "settings",         icon: Settings },
  // Admin (wird per Rolle gefiltert)
  { id: "admin-traveltips",  labelKey: "moderateTips",     icon: ShieldCheck },
];

export default function DashboardPage() {
  const { user, userProfile, logout, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const t = useTranslations("dashboardPage");
  const [tab, setTab]             = useState<Tab>("overview");
  const [sidebarOpen, setSidebar] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Profil beim Öffnen des Dashboards frisch laden (z.B. wenn Reisen auf Startseite gespeichert wurden)
  useEffect(() => {
    if (user) refreshProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [logout, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00838F] border-t-transparent" />
      </div>
    );
  }

  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "moderator";
  const visibleNav = NAV_ITEMS.filter((n) => n.id !== "admin-traveltips" || isAdmin);

  const initials = (user.displayName || user.email || "U")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Mobile Overlay ───────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl flex flex-col transition-transform duration-300
        lg:sticky lg:top-24 lg:h-[calc(100vh-96px)] lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-100 lg:z-10
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* User-Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#00838F] to-[#005F6A] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 truncate">
                {user.displayName || t("traveler")}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
              onClick={() => setSidebar(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNav.map(({ id, labelKey, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === id
                  ? "bg-[#00838F] text-white shadow-md shadow-[#00838F]/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{t(labelKey)}</span>
              {badge !== undefined && badge > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  tab === id ? "bg-white/20 text-white" : "bg-[#00838F]/10 text-[#00838F]"
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Abmelden */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {t("signOut")}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Mobile Topbar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebar(true)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Palmtree className="w-5 h-5 text-[#00838F]" />
            <span className="font-bold text-gray-900 text-sm">
              {t(NAV_ITEMS.find((n) => n.id === tab)?.labelKey ?? "overview")}
            </span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {tab === "overview"     && <OverviewTab         user={user} userProfile={userProfile} setTab={setTab} />}
          {tab === "trips"        && <SavedTripsTab       user={user} />}
          {tab === "activities"   && <SavedActivitiesTab  user={user} />}
          {tab === "wishlist"     && <WishlistTab         user={user} userProfile={userProfile} />}
          {tab === "checklist"    && <ChecklistTab        user={user} userProfile={userProfile} />}
          {tab === "pricealerts"  && <PriceAlertsTab      user={user} />}
          {tab === "tripplanner"  && <TripPlannerTab      user={user} />}
          {tab === "documents"    && <TravelDocumentsTab  user={user} />}
          {tab === "laender"      && <LaenderKarteTab />}
          {tab === "berichte"     && <MeineBerichteTab    user={user} />}
          {tab === "gruppen"      && <MeineGruppenTab     user={user} />}
          {tab === "checkin"           && <CheckInTab          user={user} />}
          {tab === "profile"           && <ProfileTab          user={user} />}
          {tab === "settings"          && <SettingsTab         user={user} userProfile={userProfile} />}
          {tab === "kartentipps"       && <MeineKartenTippsTab  user={user} />}
          {tab === "admin-traveltips"  && isAdmin && <AdminTravelTipsTab />}
        </div>
      </div>
    </div>
  );
}
