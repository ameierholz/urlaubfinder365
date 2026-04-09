"use client";

import Link from "next/link";

export interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string | null;
  category_name: string;
}

export default function ArtikelCard({
  title,
  slug,
  excerpt,
  cover_image,
  published_at,
  category_name,
}: ArticleCardProps) {
  return (
    <Link
      href={`/magazin/${slug}/`}
      className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-shadow duration-300"
    >
      {/* Cover */}
      {cover_image && (
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover_image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="absolute top-3 left-3 bg-[#1db682] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {category_name}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <h2 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#1db682] transition-colors line-clamp-2">
          {title}
        </h2>
        {excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-400">
          {published_at ? (
            <time dateTime={published_at}>
              {new Date(published_at).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          ) : (
            <span>–</span>
          )}
          <span className="text-[#1db682] font-semibold group-hover:underline">Lesen →</span>
        </div>
      </div>
    </Link>
  );
}
