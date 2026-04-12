/** Emoji-Flag → flagcdn.com Bild (Windows zeigt keine Emoji-Flaggen). */

/** Emoji → ISO 3166-1 alpha-2 Mapping */
const FLAG_CODES: Record<string, string> = {
  "🇦🇪": "ae", "🇦🇹": "at", "🇧🇪": "be", "🇧🇬": "bg", "🇧🇷": "br",
  "🇨🇾": "cy", "🇨🇿": "cz", "🇩🇪": "de", "🇩🇰": "dk", "🇪🇬": "eg",
  "🇪🇸": "es", "🇫🇷": "fr", "🇬🇧": "gb", "🇬🇷": "gr", "🇭🇷": "hr",
  "🇭🇺": "hu", "🇮🇩": "id", "🇮🇳": "in", "🇮🇹": "it", "🇯🇵": "jp",
  "🇲🇦": "ma", "🇲🇹": "mt", "🇲🇻": "mv", "🇲🇽": "mx", "🇳🇱": "nl",
  "🇵🇱": "pl", "🇵🇹": "pt", "🇷🇴": "ro", "🇷🇺": "ru", "🇸🇬": "sg", "🇸🇮": "si", "🇸🇰": "sk",
  "🇹🇭": "th", "🇹🇳": "tn", "🇹🇷": "tr", "🇺🇸": "us", "🇻🇳": "vn",
  "🇿🇦": "za", "🇨🇺": "cu", "🇯🇲": "jm", "🇩🇴": "do", "🇧🇧": "bb",
};

export function flagEmojiToCode(emoji: string): string | undefined {
  return FLAG_CODES[emoji];
}

export function FlagImage({
  emoji,
  name,
  size = "sm",
}: {
  emoji: string;
  name: string;
  size?: "sm" | "lg";
}) {
  const code = FLAG_CODES[emoji];
  if (!code) {
    return <span className={size === "lg" ? "text-2xl leading-none" : "text-base leading-none"}>{emoji}</span>;
  }
  const w = size === "lg" ? 32 : 24;
  const h = size === "lg" ? 24 : 18;
  const w2 = size === "lg" ? 64 : 48;
  const h2 = size === "lg" ? 48 : 36;
  return (
    <img
      src={`https://flagcdn.com/${w}x${h}/${code}.png`}
      srcSet={`https://flagcdn.com/${w2}x${h2}/${code}.png 2x`}
      width={w}
      height={h}
      alt={name}
      className="rounded-[2px] shadow-sm shrink-0"
    />
  );
}
