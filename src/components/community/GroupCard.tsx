"use client";

import Link from "next/link";
import { TravelGroup, GroupCategory } from "@/types";
import { Users, MapPin, Calendar, Tag } from "lucide-react";

const CAT_LABELS: Record<GroupCategory, { label: string; emoji: string; color: string }> = {
  destination: { label: "Destination",    emoji: "🗺️", color: "bg-blue-100 text-blue-700" },
  style:       { label: "Reisestil",      emoji: "🎒", color: "bg-purple-100 text-purple-700" },
  date:        { label: "Reisezeitraum",  emoji: "📅", color: "bg-orange-100 text-orange-700" },
  interest:    { label: "Interesse",      emoji: "💡", color: "bg-teal-100 text-teal-700" },
};

function formatMonth(ym?: string) {
  if (!ym) return null;
  const [y, m] = ym.split("-");
  const months = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

export default function GroupCard({ group, isMember }: { group: TravelGroup; isMember?: boolean }) {
  const cat = CAT_LABELS[group.category];

  return (
    <Link
      href={`/community/gruppen/${group.id}/`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Cover */}
      <div className="relative h-32 bg-gradient-to-br from-cyan-400 to-teal-500 overflow-hidden">
        {group.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={group.coverImageUrl} alt={group.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.color}`}>
            {cat.emoji} {cat.label}
          </span>
        </div>
        {isMember && (
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Mitglied</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 text-white text-xs font-bold flex items-center gap-1">
          <Users className="w-3 h-3" /> {group.membersCount}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
          {group.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{group.description}</p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {group.destination && (
            <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              <MapPin className="w-2.5 h-2.5" />{group.destination}
            </span>
          )}
          {group.travelMonth && (
            <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              <Calendar className="w-2.5 h-2.5" />{formatMonth(group.travelMonth)}
            </span>
          )}
          {group.tags?.slice(0, 2).map((t) => (
            <span key={t} className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              <Tag className="w-2.5 h-2.5" />{t}
            </span>
          ))}
        </div>

        <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1">
          <span>von {group.creatorName}</span>
          <span>{group.postsCount} Beiträge</span>
        </div>
      </div>
    </Link>
  );
}
