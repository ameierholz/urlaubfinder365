"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { AppUser } from "@/context/AuthContext";
import type { UserProfile, TravelReport, TravelGroup, CommunityProfile } from "@/types";
import type { UserStreak } from "@/lib/supabase-db";
import {
  getUserSavedActivities, getCommunityProfile,
  getTravelReportsByUser, getUserGroups, getUserStreak,
} from "@/lib/supabase-db";
import Link from "next/link";
import {
  Heart, MapPin, CheckSquare, BookOpen, Ticket,
  Plane, Compass, Zap, ArrowRight,
  Globe, Trophy, Users2,
  FileText, Sparkles, Flame,
  ThumbsUp, MessageCircle,
} from "lucide-react";
import { CATALOG } from "@/data/catalog-regions";
import { generateHeroFallback } from "@/lib/catalog-helpers";

type Tab = "overview"|"trips"|"activities"|"wishlist"|"checklist"|"pricealerts"|"tripplanner"|"documents"|"laender"|"berichte"|"gruppen"|"checkin"|"profile"|"settings";

interface Props {
  user: AppUser;
  userProfile: UserProfile | null;
  setTab: (tab: Tab) => void;
}

// ── Achievement-Milestones ────────────────────────────────────────────────────
type MilestoneKey = "first"|"globetrotter"|"traveler"|"explorer"|"frequent"|"heavy"|"continental"|"world";

const MILESTONES: { count: number; key: MilestoneKey; emoji: string }[] = [
  { count: 1,   key: "first",         emoji: "🌱" },
  { count: 5,   key: "globetrotter",  emoji: "🌍" },
  { count: 10,  key: "traveler",      emoji: "✈️" },
  { count: 20,  key: "explorer",      emoji: "🧭" },
  { count: 30,  key: "frequent",      emoji: "🌎" },
  { count: 50,  key: "heavy",         emoji: "🏆" },
  { count: 75,  key: "continental",   emoji: "🌐" },
  { count: 100, key: "world",         emoji: "👑" },
];

function nextMilestone(visited: number) {
  return MILESTONES.find(m => m.count > visited) ?? null;
}
function prevMilestone(visited: number) {
  return [...MILESTONES].reverse().find(m => m.count <= visited) ?? null;
}

// ── Urlaubsziel des Tages ────────────────────────────────────────────────────
function getDailyDest() {
  const pool = CATALOG.filter(e => e.unsplashKeyword && e.ibeRegionId);
  if (pool.length === 0) return null;
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return pool[day % pool.length];
}

// ── Personalisierte Empfehlung ────────────────────────────────────────────────
interface NextStep { emoji: string; titleKey: string; titleParams?: Record<string, string | number>; subKey: string; subParams?: Record<string, string | number>; tab?: Tab; href?: string; ctaKey: string }

function buildNextStep(opts: {
  wishlistCount: number;
  savedCount: number;
  totalItems: number;
  checkedItems: number;
  reportCount: number;
  laenderCount: number;
  streak: number;
  checkedInToday: boolean;
}): NextStep {
  if (!opts.checkedInToday && opts.streak === 0)
    return { emoji:"🔥", titleKey:"nextSteps.startStreak", subKey:"nextSteps.startStreakDesc", tab:"checkin", ctaKey:"nextSteps.startStreakCta" };
  if (!opts.checkedInToday)
    return { emoji:"🔥", titleKey:"nextSteps.streakRunning", titleParams:{ days: opts.streak }, subKey:"nextSteps.streakRunningDesc", tab:"checkin", ctaKey:"nextSteps.streakRunningCta" };
  if (opts.wishlistCount === 0)
    return { emoji:"❤️", titleKey:"nextSteps.addWishlist", subKey:"nextSteps.addWishlistDesc", tab:"wishlist", ctaKey:"nextSteps.addWishlistCta" };
  if (opts.savedCount === 0)
    return { emoji:"🏨", titleKey:"nextSteps.saveHotel", subKey:"nextSteps.saveHotelDesc", href:"/urlaubsziele/", ctaKey:"nextSteps.saveHotelCta" };
  if (opts.laenderCount === 0)
    return { emoji:"🌍", titleKey:"nextSteps.addCountries", subKey:"nextSteps.addCountriesDesc", tab:"laender", ctaKey:"nextSteps.addCountriesCta" };
  if (opts.totalItems > 0 && opts.checkedItems < opts.totalItems)
    return { emoji:"✅", titleKey:"nextSteps.checklistRemaining", titleParams:{ count: opts.totalItems - opts.checkedItems }, subKey:"nextSteps.checklistRemainingDesc", tab:"checklist", ctaKey:"nextSteps.checklistRemainingCta" };
  if (opts.reportCount === 0)
    return { emoji:"📖", titleKey:"nextSteps.shareExperience", subKey:"nextSteps.shareExperienceDesc", tab:"berichte", ctaKey:"nextSteps.shareExperienceCta" };
  return { emoji:"🧭", titleKey:"nextSteps.exploreDestinations", subKey:"nextSteps.exploreDestinationsDesc", href:"/urlaubsziele/", ctaKey:"nextSteps.exploreDestinationsCta" };
}

// ── Seasonal Recommendations ─────────────────────────────────────────────────
interface Rec { emoji: string; title: string; reasonKey: string; href: string; badgeKey: string; color: string }

function buildRecs(month: number, budget: string | undefined, types: string[]): Rec[] {
  const recs: Rec[] = [];
  if ([5,6,7].includes(month)) {
    recs.push({ emoji:"☀️", title:"Mallorca", reasonKey:"recommendations.mallorca", href:"/urlaubsziele/mallorca/", badgeKey:"recommendations.mallorcaBadge", color:"bg-amber-50 border-amber-100" });
    recs.push({ emoji:"🏖️", title:"Antalya", reasonKey:"recommendations.antalya", href:"/urlaubsziele/antalya/", badgeKey:"recommendations.antalyaBadge", color:"bg-orange-50 border-orange-100" });
  } else if ([11,0,1].includes(month)) {
    recs.push({ emoji:"🌴", title:"Teneriffa", reasonKey:"recommendations.teneriffa", href:"/urlaubsziele/teneriffa/", badgeKey:"recommendations.teneriffaBadge", color:"bg-yellow-50 border-yellow-100" });
    recs.push({ emoji:"🇦🇪", title:"Dubai", reasonKey:"recommendations.dubai", href:"/urlaubsziele/dubai/", badgeKey:"recommendations.dubaiBadge", color:"bg-sky-50 border-sky-100" });
  } else {
    recs.push({ emoji:"🌸", title:"Griechenland", reasonKey:"recommendations.griechenland", href:"/urlaubsziele/kreta/", badgeKey:"recommendations.griechenlandBadge", color:"bg-blue-50 border-blue-100" });
    recs.push({ emoji:"🍂", title:"Marrakesch", reasonKey:"recommendations.marrakesch", href:"/urlaubsziele/marrakesch/", badgeKey:"recommendations.marrakeschBadge", color:"bg-rose-50 border-rose-100" });
  }
  if (budget === "budget") {
    recs.push({ emoji:"💰", title:"lastMinute", reasonKey:"recommendations.lastMinuteDesc", href:"/last-minute/", badgeKey:"recommendations.lastMinuteBadge", color:"bg-emerald-50 border-emerald-100" });
  } else {
    recs.push({ emoji:"🏝️", title:"Malediven", reasonKey:"recommendations.malediven", href:"/urlaubsziele/malediven/", badgeKey:"recommendations.maledivenBadge", color:"bg-teal-50 border-teal-100" });
  }
  if (types.includes("familie")) {
    recs.push({ emoji:"👨‍👩‍👧", title:"Kreta", reasonKey:"recommendations.side", href:"/urlaubsziele/kreta/", badgeKey:"recommendations.sideBadge", color:"bg-violet-50 border-violet-100" });
  } else {
    recs.push({ emoji:"🎭", title:"Barcelona", reasonKey:"recommendations.barcelona", href:"/urlaubsziele/barcelona/", badgeKey:"recommendations.barcelonaBadge", color:"bg-indigo-50 border-indigo-100" });
  }
  return recs.slice(0, 4);
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OverviewTab({ user, userProfile, setTab }: Props) {
  const t = useTranslations("dashboardOverview");
  const [activityCount, setActivityCount]       = useState(0);
  const [communityProfile, setCommunityProfile] = useState<CommunityProfile | null>(null);
  const [ownReports, setOwnReports]             = useState<TravelReport[]>([]);
  const [groups, setGroups]                     = useState<TravelGroup[]>([]);
  const [streak, setStreak]                     = useState<UserStreak | null>(null);

  useEffect(() => {
    Promise.all([
      getUserSavedActivities(user.uid).then(a => setActivityCount(a.length)).catch(() => {}),
      getCommunityProfile(user.uid).then(p => setCommunityProfile(p)).catch(() => {}),
      getTravelReportsByUser(user.uid).then(r => setOwnReports(r)).catch(() => {}),
      getUserGroups(user.uid).then(g => setGroups(g)).catch(() => {}),
      getUserStreak(user.uid).then(s => setStreak(s)).catch(() => {}),
    ]);
  }, [user.uid]);

  const firstName   = user.displayName?.split(" ")[0] || "Urlauber";
  const savedCount  = userProfile?.savedTrips.length ?? 0;
  const wishlistCount = userProfile?.favoriteDestinations.length ?? 0;
  const checkedItems  = userProfile?.checklist?.filter(c => c.checked).length ?? 0;
  const totalItems    = userProfile?.checklist?.length ?? 0;
  const checkPercent  = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const visitedCountries = communityProfile?.visitedCountries ?? [];
  const laenderCount     = visitedCountries.length;
  const publishedReports = ownReports.filter(r => r.isPublished);
  const draftReports     = ownReports.filter(r => !r.isPublished);
  const totalLikes       = ownReports.reduce((s, r) => s + (r.likesCount ?? 0), 0);
  const totalComments    = ownReports.reduce((s, r) => s + (r.commentsCount ?? 0), 0);

  const today          = new Date().toISOString().slice(0, 10);
  const checkedInToday = streak?.lastCheckinDate === today;
  const currentStreak  = streak?.currentStreak ?? 0;
  const totalCoins     = streak?.totalCoins ?? 0;

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? t("goodMorning") : hour < 18 ? t("hello") : t("goodEvening");

  const nextM = nextMilestone(laenderCount);
  const prevM = prevMilestone(laenderCount);
  const milestonePct = nextM && prevM
    ? Math.round(((laenderCount - prevM.count) / (nextM.count - prevM.count)) * 100)
    : nextM ? Math.round((laenderCount / nextM.count) * 100) : 100;

  const dailyDest = getDailyDest();

  const nextStep = buildNextStep({
    wishlistCount, savedCount, totalItems, checkedItems,
    reportCount: publishedReports.length,
    laenderCount, streak: currentStreak, checkedInToday,
  });

  const month = new Date().getMonth();
  const recs  = buildRecs(month, userProfile?.preferences?.budget, userProfile?.preferences?.preferredTypes ?? []);

  return (
    <div className="space-y-6">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl overflow-hidden bg-linear-to-br from-[#00838F] via-[#00707A] to-[#00565F] p-5 text-white relative">
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-2 top-10 w-20 h-20 rounded-full bg-white/5" />

        <div className="flex items-start gap-4 relative">
          {/* Avatar */}
          {(communityProfile?.photoURL || user.photoURL) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={communityProfile?.photoURL || user.photoURL!}
              alt={user.displayName ?? "Avatar"}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center font-black text-xl shrink-0">
              {(user.displayName || user.email || "U").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-white/60 text-xs font-medium">{greeting},</p>
            <h1 className="text-xl font-bold leading-tight">{firstName}! 🌴</h1>

            {/* Streak + Coins Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-xs font-bold">
                  🔥 {t("streakDays", { count: currentStreak })}
                </span>
              )}
              {totalCoins > 0 && (
                <span className="inline-flex items-center gap-1 bg-amber-400/30 rounded-full px-2.5 py-1 text-xs font-bold text-amber-200">
                  🪙 {t("coins", { count: totalCoins })}
                </span>
              )}
              {laenderCount > 0 && (
                <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1 text-xs font-medium text-white/80">
                  🌍 {t("countriesCount", { count: laenderCount })}
                </span>
              )}
            </div>
          </div>

          {/* Check-in CTA */}
          {!checkedInToday && (
            <button
              onClick={() => setTab("checkin")}
              className="shrink-0 flex flex-col items-center gap-0.5 bg-amber-400 hover:bg-amber-300 text-amber-900 rounded-2xl px-3 py-2.5 transition-all shadow-lg font-bold text-xs animate-pulse hover:animate-none"
            >
              <Flame className="w-4 h-4" />
              +10
              <span className="font-semibold text-[10px] leading-none">Coins</span>
            </button>
          )}
        </div>

        {/* Fortschritts-Leiste: Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 flex-wrap">
          {[
            { val: savedCount,        label: t("statsHotels"),      icon: "🏨" },
            { val: activityCount,     label: t("statsActivities"), icon: "🎫" },
            { val: wishlistCount,     label: t("statsWishlist"),   icon: "❤️" },
            { val: publishedReports.length, label: t("statsReports"), icon: "📖" },
          ].map(({ val, label, icon }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-base leading-none">{icon}</span>
              <div>
                <div className="text-base font-black leading-none">{val}</div>
                <div className="text-[10px] text-white/60 leading-none mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Urlaubsziel des Tages ─────────────────────────────────────────── */}
      {dailyDest && (
        <div className="relative rounded-2xl overflow-hidden h-44 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={generateHeroFallback(dailyDest.unsplashKeyword).replace("w=1600","w=900")}
            alt={dailyDest.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
              ✨ {t("destinationOfDay")}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-white font-black text-2xl leading-tight drop-shadow">{dailyDest.name}</h2>
            <p className="text-white/80 text-sm mt-0.5">{dailyDest.country}</p>
          </div>
          <Link
            href={`/urlaubsziele/${dailyDest.slug}/`}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-amber-400 hover:text-amber-900 transition-colors shadow-lg"
          >
            {t("discover")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Dein nächster Schritt ─────────────────────────────────────────── */}
      <div
        className="bg-linear-to-r from-[#1db682]/10 to-[#6991d8]/10 border border-[#1db682]/20 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:from-[#1db682]/15 hover:to-[#6991d8]/15 transition-all group"
        onClick={() => nextStep.tab ? setTab(nextStep.tab) : undefined}
      >
        <span className="text-3xl shrink-0">{nextStep.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{t(nextStep.titleKey, nextStep.titleParams)}</h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t(nextStep.subKey, nextStep.subParams)}</p>
        </div>
        {nextStep.tab ? (
          <button
            onClick={() => setTab(nextStep.tab!)}
            className="shrink-0 flex items-center gap-1.5 bg-[#1db682] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#19a374] transition-colors whitespace-nowrap"
          >
            {t(nextStep.ctaKey)} <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <Link
            href={nextStep.href!}
            className="shrink-0 flex items-center gap-1.5 bg-[#1db682] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#19a374] transition-colors whitespace-nowrap"
          >
            {t(nextStep.ctaKey)} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* ── Achievement-Fortschritt (wenn Länder vorhanden) ───────────────── */}
      {nextM && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-sm text-gray-800">{t("nextAchievement")}</span>
            </div>
            <button onClick={() => setTab("laender")} className="text-xs text-[#00838F] font-medium hover:underline flex items-center gap-1">
              {t("all")} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{nextM.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">{t(`milestones.${nextM.key}`)}</span>
                <span className="text-xs text-gray-400">{laenderCount} / {nextM.count} {t("countriesLabel")}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${milestonePct}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {laenderCount === 0
                  ? t("addCountriesHint")
                  : t("countriesUntil", { count: nextM.count - laenderCount, label: t(`milestones.${nextM.key}`), emoji: nextM.emoji })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Urlaubs-Checkliste ────────────────────────────────────────────── */}
      {totalItems > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              {t("checklist")}
              {checkPercent === 100 && <span className="text-emerald-500 text-base">🎉</span>}
            </h2>
            <button onClick={() => setTab("checklist")} className="text-xs text-[#00838F] font-medium hover:underline flex items-center gap-1">
              {t("open")} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${checkPercent === 100 ? "bg-emerald-500" : "bg-linear-to-r from-emerald-400 to-teal-400"}`}
                style={{ width: `${checkPercent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700 shrink-0 w-12 text-right">{checkedItems}/{totalItems}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {checkPercent === 100
              ? t("checklistDone")
              : checkPercent >= 80
                ? t("checklistAlmost", { remaining: totalItems - checkedItems })
                : t("checklistProgress", { remaining: totalItems - checkedItems, percent: checkPercent })}
          </p>
        </div>
      )}

      {/* ── Community Highlights ──────────────────────────────────────────── */}
      {(totalLikes > 0 || totalComments > 0 || draftReports.length > 0) && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-3">
            <span className="text-base">🎉</span> {t("activity")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {totalLikes > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                <ThumbsUp className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-black text-blue-700 text-base leading-none">{totalLikes}</div>
                  <div className="text-[10px] text-blue-400">{t("likesReceived")}</div>
                </div>
              </div>
            )}
            {totalComments > 0 && (
              <div className="flex items-center gap-2 bg-teal-50 rounded-xl px-3 py-2">
                <MessageCircle className="w-4 h-4 text-teal-500" />
                <div>
                  <div className="font-black text-teal-700 text-base leading-none">{totalComments}</div>
                  <div className="text-[10px] text-teal-400">{t("comments")}</div>
                </div>
              </div>
            )}
            {draftReports.length > 0 && (
              <button onClick={() => setTab("berichte")} className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 hover:bg-amber-100 transition-colors">
                <FileText className="w-4 h-4 text-amber-500" />
                <div className="text-left">
                  <div className="font-black text-amber-700 text-base leading-none">{draftReports.length}</div>
                  <div className="text-[10px] text-amber-400">{t("draftsReady", { plural: draftReports.length !== 1 ? "e" : "" })}</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Meine Gruppen ─────────────────────────────────────────────────── */}
      {groups.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Users2 className="w-4 h-4 text-teal-600" /> {t("myGroups")}
            </h2>
            <button onClick={() => setTab("gruppen")} className="text-xs text-[#00838F] font-medium hover:underline flex items-center gap-1">
              {t("all")} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {groups.slice(0, 3).map((g) => (
              <Link key={g.id} href={`/community/gruppen/${g.id}/`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-teal-400 to-cyan-500 shrink-0 overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                  {g.coverImageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={g.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    : g.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-teal-700 line-clamp-1">{g.name}</div>
                  <div className="text-xs text-gray-400">{g.membersCount} {t("members")} · {g.postsCount ?? 0} {t("posts")}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Meine Berichte ────────────────────────────────────────────────── */}
      {publishedReports.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-600" /> {t("myReports")}
            </h2>
            <button onClick={() => setTab("berichte")} className="text-xs text-[#00838F] font-medium hover:underline flex items-center gap-1">
              {t("all")} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {publishedReports.slice(0, 3).map((r) => (
              <Link key={r.id} href={`/community/reiseberichte/${r.id}/`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-400 to-purple-500 shrink-0 overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                  {r.coverImageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={r.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    : "📖"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-teal-700 line-clamp-1">{r.title}</div>
                  <div className="text-xs text-gray-400">{r.destination} · 👍 {r.likesCount ?? 0} · 💬 {r.commentsCount ?? 0}</div>
                </div>
                <div className="text-sm shrink-0">{"⭐".repeat(Math.min(r.rating, 5))}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Empfehlungen ──────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className="font-bold text-gray-800 text-sm">{t("seasonal")}</h2>
          <span className="ml-auto text-[10px] bg-amber-50 text-amber-600 border border-amber-100 font-semibold px-2 py-0.5 rounded-full">{t("seasonalBadge")}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {recs.map((rec) => (
            <Link
              key={rec.href + rec.title}
              href={rec.href}
              className={`flex items-center gap-3 p-3 rounded-2xl border ${rec.color} hover:shadow-md transition-all group`}
            >
              <span className="text-2xl shrink-0">{rec.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-gray-800 group-hover:text-[#00838F] transition-colors">
                    {rec.title === "lastMinute" ? t("recommendations.lastMinute") : rec.title}
                  </span>
                  <span className="text-[10px] bg-white/80 text-gray-500 border border-gray-200 font-semibold px-1.5 py-0.5 rounded-full shrink-0">{t(rec.badgeKey)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t(rec.reasonKey)}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#00838F] shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Schnellzugriff ────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3">{t("quickAccess")}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { href:"/urlaubsziele/",           label:t("quickDestinations"),    icon:Compass,  color:"bg-teal-50 text-teal-600" },
            { href:"/last-minute/",            label:t("quickLastMinute"),      icon:Zap,      color:"bg-amber-50 text-amber-600" },
            { href:"/flugsuche/",              label:t("quickFlights"),         icon:Plane,    color:"bg-sky-50 text-sky-600" },
            { href:"/community/reiseberichte/",label:t("quickReports"),         icon:BookOpen, color:"bg-violet-50 text-violet-600" },
            { href:"/community/gruppen/",      label:t("quickGroups"),          icon:Users2,   color:"bg-blue-50 text-blue-600" },
            { href:"/weltkarte/",              label:t("quickMap"),             icon:Globe,    color:"bg-emerald-50 text-emerald-600" },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center gap-2 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-600 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Wunschliste ───────────────────────────────────────────────────── */}
      {wishlistCount > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> {t("myWishlist")}
            </h2>
            <button onClick={() => setTab("wishlist")} className="text-xs text-[#00838F] font-medium hover:underline flex items-center gap-1">
              {t("manage")} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(userProfile?.favoriteDestinations ?? []).slice(0, 8).map((slug) => (
              <Link key={slug} href={`/urlaubsziele/${slug}/`}
                className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-full hover:bg-rose-100 transition-colors capitalize border border-rose-100"
              >
                {slug.replace(/-/g, " ")}
              </Link>
            ))}
            {wishlistCount > 8 && (
              <button onClick={() => setTab("wishlist")} className="px-3 py-1.5 bg-gray-50 text-gray-400 text-xs font-semibold rounded-full hover:bg-gray-100 transition-colors border border-gray-100">
                {t("moreCount", { count: wishlistCount - 8 })}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Neu hier? Onboarding-Nudge ────────────────────────────────────── */}
      {savedCount === 0 && wishlistCount === 0 && laenderCount === 0 && publishedReports.length === 0 && (
        <div className="bg-linear-to-br from-[#1db682]/10 to-[#6991d8]/10 border border-[#1db682]/20 rounded-2xl p-5 text-center">
          <div className="text-4xl mb-3">🌏</div>
          <h3 className="font-bold text-gray-800 mb-1">{t("welcomeTitle")}</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
            {t("welcomeDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/urlaubsziele/" className="inline-flex items-center gap-1.5 bg-[#1db682] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#19a374] transition-colors">
              <Compass className="w-4 h-4" /> {t("welcomeCtaDestinations")}
            </Link>
            <button onClick={() => setTab("checkin")} className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-amber-300 transition-colors">
              <Flame className="w-4 h-4" /> {t("welcomeCtaCheckin")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
