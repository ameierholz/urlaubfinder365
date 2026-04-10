"use client";

/**
 * useWeather — Live-Wetter via Open-Meteo API.
 *
 * Open-Meteo ist kostenlos, kein API-Key, hohe Rate-Limits.
 * Docs: https://open-meteo.com/en/docs
 *
 * Wir zeigen: aktuelle Temperatur + Wettercode-Icon + min/max heute.
 */

import { useEffect, useState } from "react";

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  tempMin:     number;
  tempMax:     number;
  isDay:       boolean;
}

interface CacheEntry {
  data:    WeatherData;
  fetched: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 Min
const cache = new Map<string, CacheEntry>();

export function useWeather(lat: number | null, lng: number | null) {
  const [data, setData]       = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) return;
    const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.fetched < CACHE_TTL_MS) {
      setData(cached.data);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;

    fetch(url)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error("Wetter-API nicht erreichbar")))
      .then((json) => {
        if (cancelled) return;
        const w: WeatherData = {
          temperature: Math.round(json.current?.temperature_2m ?? 0),
          weatherCode: Number(json.current?.weather_code ?? 0),
          tempMin:     Math.round(json.daily?.temperature_2m_min?.[0] ?? 0),
          tempMax:     Math.round(json.daily?.temperature_2m_max?.[0] ?? 0),
          isDay:       json.current?.is_day === 1,
        };
        cache.set(key, { data: w, fetched: Date.now() });
        setData(w);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lng]);

  return { data, loading, error };
}

/**
 * Open-Meteo WMO Wettercode → Emoji + Label
 * https://open-meteo.com/en/docs#weathervariables
 */
export function weatherCodeToInfo(code: number, isDay: boolean): { emoji: string; label: string } {
  if (code === 0)  return { emoji: isDay ? "☀️" : "🌙", label: "Klar" };
  if (code === 1)  return { emoji: isDay ? "🌤️" : "🌙", label: "Überwiegend klar" };
  if (code === 2)  return { emoji: "⛅",                label: "Teilweise bewölkt" };
  if (code === 3)  return { emoji: "☁️",                label: "Bedeckt" };
  if (code <= 48)  return { emoji: "🌫️",                label: "Nebel" };
  if (code <= 57)  return { emoji: "🌦️",                label: "Nieselregen" };
  if (code <= 67)  return { emoji: "🌧️",                label: "Regen" };
  if (code <= 77)  return { emoji: "🌨️",                label: "Schnee" };
  if (code <= 82)  return { emoji: "🌧️",                label: "Regenschauer" };
  if (code <= 86)  return { emoji: "🌨️",                label: "Schneeschauer" };
  if (code <= 99)  return { emoji: "⛈️",                label: "Gewitter" };
  return { emoji: "🌍", label: "Unbekannt" };
}
