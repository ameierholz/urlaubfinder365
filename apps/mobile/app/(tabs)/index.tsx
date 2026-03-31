import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const C = { primary: "#1db682", bg: "#f0fdf9", white: "#fff", dark: "#0f2d25", muted: "#5a9e88", border: "#a7e3cf", card: "#e8faf4", amber: "#f59e0b" };

const HIGHLIGHTS = [
  { slug: "mallorca", name: "Mallorca", country: "Spanien", emoji: "🏝" },
  { slug: "antalya", name: "Antalya", country: "Türkei", emoji: "☀" },
  { slug: "kreta", name: "Kreta", country: "Griechenland", emoji: "🌊" },
  { slug: "hurghada", name: "Hurghada", country: "Ägypten", emoji: "🤿" },
  { slug: "barcelona", name: "Barcelona", country: "Spanien", emoji: "🎨" },
  { slug: "dubai", name: "Dubai", country: "VAE", emoji: "🌆" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [deal, setDeal] = useState<Record<string, unknown> | null>(null);
  const [dealLoading, setDealLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("daily_deals")
      .select("*")
      .gte("valid_until", new Date().toISOString())
      .order("discount_percent", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => { setDeal(data); setDealLoading(false); })
      .catch(() => setDealLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Guten Morgen";
    if (h < 18) return "Guten Tag";
    return "Guten Abend";
  };

  const displayName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroGreeting}>{greeting()}{displayName ? ", " + displayName : ""}!</Text>
            <Text style={styles.heroTitle}>Finde deinen Traumurlaub</Text>
            <Text style={styles.heroSubtitle}>250+ Reiseziele · Beste Preise</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => router.push("/(tabs)/profile")}>
            <Ionicons name={user ? "person" : "person-outline"} size={22} color={C.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push("/(tabs)/explore")}>
          <Ionicons name="search-outline" size={18} color={C.muted} />
          <Text style={styles.searchPlaceholder}>Wohin soll die Reise gehen?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flash" size={18} color={C.amber} />
          <Text style={styles.sectionTitle}>Deal des Tages</Text>
        </View>
        {dealLoading ? (
          <View style={[styles.dealCard, { justifyContent: "center", alignItems: "center", height: 100 }]}>
            <ActivityIndicator color={C.primary} />
          </View>
        ) : deal ? (
          <TouchableOpacity style={styles.dealCard} onPress={() => router.push("/destination/" + String(deal.destination_slug))}>
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>{"-" + String(deal.discount_percent) + "%"}</Text>
            </View>
            <Text style={styles.dealDestination}>{String(deal.destination_name)}</Text>
            <View style={styles.dealPriceRow}>
              <Text style={styles.dealPriceOriginal}>{"ab " + String(deal.original_price) + "€"}</Text>
              <Text style={styles.dealPrice}>{"nur " + String(deal.deal_price) + "€"}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.dealCard, { alignItems: "center", paddingVertical: 28 }]}>
            <Ionicons name="pricetag-outline" size={32} color={C.border} />
            <Text style={{ color: C.muted, marginTop: 8, textAlign: "center" }}>Neue Deals täglich — schau morgen wieder!</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="star" size={18} color={C.amber} />
          <Text style={styles.sectionTitle}>Beliebte Reiseziele</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")} style={styles.seeAll}>
            <Text style={styles.seeAllText}>Alle</Text>
            <Ionicons name="chevron-forward" size={14} color={C.primary} />
          </TouchableOpacity>
        </View>
        {HIGHLIGHTS.map((dest) => (
          <TouchableOpacity key={dest.slug} style={styles.destinationCard} onPress={() => router.push("/destination/" + dest.slug)}>
            <View style={styles.destEmoji}>
              <Text style={{ fontSize: 22 }}>{dest.emoji}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{dest.name}</Text>
              <Text style={styles.cardSubtitle}>{dest.country}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </TouchableOpacity>
        ))}
      </View>

      {!user && (
        <TouchableOpacity style={styles.ctaBanner} onPress={() => router.push("/auth/register")}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Preisalarme aktivieren</Text>
            <Text style={styles.ctaSubtitle}>Kostenlos registrieren und nie einen Deal verpassen.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      )}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  hero: { backgroundColor: C.primary, padding: 20, paddingTop: 56, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  heroGreeting: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 4 },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: "800", lineHeight: 32 },
  heroSubtitle: { color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.white, borderRadius: 16, padding: 14 },
  searchPlaceholder: { color: C.muted, fontSize: 15 },
  section: { paddingHorizontal: 16, marginBottom: 8, marginTop: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: C.dark, flex: 1 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { color: C.primary, fontSize: 13, fontWeight: "600" },
  dealCard: { backgroundColor: C.white, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: C.border, position: "relative" },
  dealBadge: { position: "absolute", top: 14, right: 14, backgroundColor: "#ef4444", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  dealBadgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  dealDestination: { fontSize: 20, fontWeight: "800", color: C.dark, marginBottom: 8, marginRight: 60 },
  dealPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 10 },
  dealPriceOriginal: { fontSize: 14, color: C.muted, textDecorationLine: "line-through" },
  dealPrice: { fontSize: 22, fontWeight: "800", color: C.primary },
  destinationCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.white, padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  destEmoji: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.card, alignItems: "center", justifyContent: "center", marginRight: 12 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: C.dark },
  cardSubtitle: { fontSize: 13, color: C.muted, marginTop: 2 },
  ctaBanner: { margin: 16, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: C.primary, borderRadius: 18, padding: 18 },
  ctaTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  ctaSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 },
});
