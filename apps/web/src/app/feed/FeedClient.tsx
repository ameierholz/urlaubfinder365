"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Heart, MapPin, Share2, ChevronUp, ChevronDown, Palmtree } from "lucide-react";
import Link from "next/link";

interface FeedPost {
  id: string;
  displayName: string;
  destination: string;
  destinationSlug: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  tags: string[];
  likesCount: number;
  likedBy: string[];
  createdAt: string;
}

function db() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function loadPosts(offset = 0): Promise<FeedPost[]> {
  const { data } = await db()
    .from("media_feed")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + 9);

  return (data ?? []).map((r) => ({
    id: r.id,
    displayName: r.display_name,
    destination: r.destination,
    destinationSlug: r.destination_slug,
    mediaUrl: r.media_url,
    mediaType: r.media_type,
    caption: r.caption,
    tags: r.tags ?? [],
    likesCount: r.likes_count,
    likedBy: (r.liked_by as string[]) ?? [],
    createdAt: r.created_at,
  }));
}

export default function FeedClient() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    db().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    loadPosts().then((p) => { setPosts(p); setLoading(false); });
  }, []);

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= posts.length) return;
    setCurrent(idx);
    // load more when near end
    if (idx >= posts.length - 3) {
      loadPosts(posts.length).then((more) => {
        if (more.length) setPosts((prev) => [...prev, ...more]);
      });
    }
  }, [posts.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) goTo(current + 1);
      else if (e.deltaY < -30) goTo(current - 1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [current, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (dy > 40) goTo(current + 1);
    else if (dy < -40) goTo(current - 1);
  };

  const handleLike = async (post: FeedPost) => {
    if (!userId) return;
    const liked = likedMap[post.id] ?? post.likedBy.includes(userId);
    const newCount = liked ? post.likesCount - 1 : post.likesCount + 1;
    const newLikedBy = liked
      ? post.likedBy.filter((id) => id !== userId)
      : [...post.likedBy, userId];

    setLikedMap((prev) => ({ ...prev, [post.id]: !liked }));
    setPosts((prev) =>
      prev.map((p) => p.id === post.id ? { ...p, likesCount: newCount, likedBy: newLikedBy } : p)
    );

    await db().from("media_feed").update({
      likes_count: newCount,
      liked_by: newLikedBy,
    }).eq("id", post.id);
  };

  const handleShare = async (post: FeedPost) => {
    const url = `${window.location.origin}/feed#${post.id}`;
    if (navigator.share) {
      await navigator.share({ title: post.destination, text: post.caption, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white text-center p-8">
        <div>
          <Palmtree className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-bold mb-2">Noch keine Beiträge</p>
          <p className="text-sm opacity-60">Die Community fängt gerade erst an. Sei der Erste!</p>
        </div>
      </div>
    );
  }

  const post = posts[current];
  const isLiked = likedMap[post.id] ?? post.likedBy.includes(userId ?? "");

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-hidden bg-black relative select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Media */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={post.id}
        src={post.mediaUrl}
        alt={post.caption}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-6 pb-2">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-sm drop-shadow">
          <Palmtree className="w-5 h-5" />
          Urlaubfinder365
        </Link>
        <span className="text-white/60 text-xs">{current + 1} / {posts.length}</span>
      </div>

      {/* Right action buttons */}
      <div className="absolute right-4 bottom-40 flex flex-col items-center gap-5">
        <button
          onClick={() => handleLike(post)}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            isLiked ? "bg-red-500" : "bg-white/20 backdrop-blur-sm"
          }`}>
            <Heart className={`w-5 h-5 ${isLiked ? "text-white fill-white" : "text-white"}`} />
          </div>
          <span className="text-white text-xs font-bold drop-shadow">{post.likesCount}</span>
        </button>

        <button
          onClick={() => handleShare(post)}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow">Teilen</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-16 p-5 pb-8">
        <Link
          href={`/urlaubsziele/${post.destinationSlug}/`}
          className="inline-flex items-center gap-1.5 text-white/80 text-xs font-semibold mb-2 hover:text-white transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          {post.destination}
        </Link>
        <p className="text-white font-semibold text-sm leading-snug mb-3 drop-shadow">{post.caption}</p>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-white/50 text-[10px] mt-2">von {post.displayName}</p>
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center disabled:opacity-20 hover:bg-white/30 transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === posts.length - 1}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center disabled:opacity-20 hover:bg-white/30 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Scroll hint (first visit) */}
      {current === 0 && posts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
          <ChevronDown className="w-5 h-5 text-white/60" />
          <span className="text-white/40 text-[10px]">Scrollen für mehr</span>
        </div>
      )}
    </div>
  );
}
