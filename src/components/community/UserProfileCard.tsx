"use client";

import { useState } from "react";
import Link from "next/link";
import { CommunityProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { followUser, unfollowUser } from "@/lib/firestore";
import { MapPin, BookOpen, Globe, Users } from "lucide-react";

interface Props {
  profile: CommunityProfile;
  isFollowingInitial?: boolean;
  compact?: boolean;
}

export default function UserProfileCard({ profile, isFollowingInitial = false, compact }: Props) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(isFollowingInitial);
  const [loading, setLoading] = useState(false);

  const initials = profile.displayName.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  const isOwn = user?.uid === profile.uid;

  async function toggleFollow() {
    if (!user || isOwn) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(user.uid, profile.uid);
      } else {
        await followUser(user.uid, profile.uid);
      }
      setFollowing(!following);
    } finally {
      setLoading(false);
    }
  }

  const avatarEl = (size: "sm" | "md" | "lg") => {
    const sizeClass = size === "sm" ? "w-10 h-10 text-sm" : size === "md" ? "w-14 h-14 text-lg" : "w-20 h-20 text-2xl";
    if (profile.photoURL) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.photoURL} alt={profile.displayName}
          className={`${sizeClass} rounded-full object-cover border-4 border-white shadow shrink-0`}
        />
      );
    }
    return (
      <div className={`${sizeClass} rounded-full bg-teal-600 text-white font-bold flex items-center justify-center border-4 border-white shadow shrink-0`}>
        {initials}
      </div>
    );
  };

  if (compact) {
    return (
      <Link href={`/community/profil/${profile.uid}/`}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
      >
        {profile.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photoURL} alt={profile.displayName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
        <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
          {initials}
        </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-800 group-hover:text-teal-700 truncate">{profile.displayName}</p>
          <p className="text-xs text-gray-400">{profile.visitedCountries?.length ?? 0} Länder · {profile.reportsCount ?? 0} Berichte</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-500 h-16" />
      <div className="px-4 pb-4 -mt-7">
        {avatarEl("md")}
        <div className="mt-2">
          <Link href={`/community/profil/${profile.uid}/`}
            className="font-bold text-gray-800 hover:text-teal-700 transition-colors"
          >
            {profile.displayName}
          </Link>
          {profile.location && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {profile.location}
            </p>
          )}
          {profile.bio && (
            <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{profile.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1 mt-3 text-center">
          <div className="bg-gray-50 rounded-lg py-1.5">
            <p className="text-sm font-bold text-teal-600">{profile.visitedCountries?.length ?? 0}</p>
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-0.5"><Globe className="w-2.5 h-2.5" />Länder</p>
          </div>
          <div className="bg-gray-50 rounded-lg py-1.5">
            <p className="text-sm font-bold text-teal-600">{profile.reportsCount ?? 0}</p>
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-0.5"><BookOpen className="w-2.5 h-2.5" />Berichte</p>
          </div>
          <div className="bg-gray-50 rounded-lg py-1.5">
            <p className="text-sm font-bold text-teal-600">{profile.followersCount ?? 0}</p>
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-0.5"><Users className="w-2.5 h-2.5" />Follower</p>
          </div>
        </div>

        {/* Follow-Button */}
        {user && !isOwn && (
          <button onClick={toggleFollow} disabled={loading}
            className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
              following
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            {following ? "Folge ich ✓" : "+ Folgen"}
          </button>
        )}
      </div>
    </div>
  );
}
