"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { appendIbeLang } from "@/lib/ibe-locale";

const SCRIPT_SRC = "https://webmedia.ypsilon.net/spl_js/ypsnet-ibe.js";
const BASE_SRC =
  "https://api.specials.de/component/searchBoxMix.html?access=7bb55d1b6095e63fb7c09e46579c4120";

export default function YpsnetSearchBox() {
  const locale = useLocale();
  const src = appendIbeLang(BASE_SRC, locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Alle vorhandenen Instanzen entfernen
    document.querySelectorAll(`script[data-ypsnet]`).forEach((s) => s.remove());

    // Cache-Buster erzwingt erneute Ausführung durch den Browser
    const script = document.createElement("script");
    script.src = `${SCRIPT_SRC}?v=${Date.now()}`;
    script.setAttribute("data-ypsnet", "1");
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [mounted, src]);

  if (!mounted) return <div style={{ minHeight: 480 }} />;

  return (
    <div className="w-full">
      <div id="ypsnet-ibe" data-src={src} />
    </div>
  );
}
