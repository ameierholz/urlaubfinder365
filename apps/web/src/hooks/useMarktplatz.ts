"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

// ─── Favorites ───────────────────────────────────────────────────────────────

export function useFavorit(slug: string) {
  const supabase = createSupabaseBrowser();
  const [isFavorit, setIsFavorit] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [userId, setUserId]       = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) { setLoading(false); return; }

      supabase
        .from("marktplatz_favorites" as never)
        .select("id")
        .eq("user_id", uid)
        .eq("aktivitaet_slug", slug)
        .maybeSingle()
        .then(({ data: row }) => {
          if (mounted) {
            setIsFavorit(!!row);
            setLoading(false);
          }
        });
    });
    return () => { mounted = false; };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(async () => {
    if (!userId) return false; // not logged in
    if (isFavorit) {
      await supabase
        .from("marktplatz_favorites" as never)
        .delete()
        .eq("user_id", userId)
        .eq("aktivitaet_slug", slug);
      setIsFavorit(false);
    } else {
      await supabase
        .from("marktplatz_favorites" as never)
        .insert({ user_id: userId, aktivitaet_slug: slug } as never);
      setIsFavorit(true);
    }
    return true;
  }, [userId, isFavorit, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isFavorit, loading, isLoggedIn: !!userId, toggle };
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  user_id: string;
  aktivitaet_slug: string;
  bewertung: number;
  titel: string | null;
  inhalt: string | null;
  created_at: string;
}

export function useReviews(slug: string) {
  const supabase = createSupabaseBrowser();
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [ownReview, setOwnReview]   = useState<Review | null>(null);
  const [userId, setUserId]         = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async (uid: string | null) => {
    const { data } = await supabase
      .from("marktplatz_reviews" as never)
      .select("*")
      .eq("aktivitaet_slug", slug)
      .order("created_at", { ascending: false });

    const rows = (data ?? []) as Review[];
    setReviews(rows);
    if (uid) setOwnReview(rows.find((r) => r.user_id === uid) ?? null);
    setLoading(false);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);
      fetchReviews(uid);
    });
    return () => { mounted = false; };
  }, [fetchReviews]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitReview = useCallback(
    async (bewertung: number, titel: string, inhalt: string) => {
      if (!userId) return false;
      setSubmitting(true);
      if (ownReview) {
        await supabase
          .from("marktplatz_reviews" as never)
          .update({ bewertung, titel, inhalt } as never)
          .eq("id", ownReview.id);
      } else {
        await supabase
          .from("marktplatz_reviews" as never)
          .insert({ user_id: userId, aktivitaet_slug: slug, bewertung, titel, inhalt } as never);
      }
      await fetchReviews(userId);
      setSubmitting(false);
      return true;
    },
    [userId, ownReview, slug, fetchReviews] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const avgBewertung =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.bewertung, 0) / reviews.length
      : null;

  return { reviews, ownReview, loading, submitting, isLoggedIn: !!userId, submitReview, avgBewertung };
}
