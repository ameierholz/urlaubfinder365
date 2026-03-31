import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const C = { primary: "#1db682", bg: "#f0fdf9", white: "#fff", dark: "#0f2d25", muted: "#5a9e88", border: "#a7e3cf", card: "#e8faf4" };

interface Favorite {
  id: string;
  destination_slug: string;
  destination_name: string;
  destination_country: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("favorites")
        .select("id, destination_slug, destination_name, destination_country")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setFavorites(data ?? []);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const removeFavorite = async (id: string) => {
    await supabase.from("favorites").delete().eq("id", id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  if (authLoading) {
    return <View style={styles.center}><ActivityIndicator color={C.primary} /></View>;
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="heart-outline" size={64} color={C.border} />
        <Text style={styles.emptyTitle}>Deine Favoriten</Text>
        <Text style={styles.emptySubtitle}>
          Melde dich an, um Reiseziele zu speichern und Preisalarme zu erhalten.
        </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push("/auth/login")}>
          <Text style={styles.loginBtnText}>Jetzt anmelden</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={C.primary} /></View>;
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="heart-outline" size={64} color={C.border} />
        <Text style={styles.emptyTitle}>Noch keine Favoriten</Text>
        <Text style={styles.emptySubtitle}>Entdecke Reiseziele und speichere deine Traumziele hier.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push("/(tabs)/explore")}>
          <Text style={styles.loginBtnText}>Reiseziele entdecken</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={favorites}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/destination/${item.destination_slug}`)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={20} color={C.primary} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.destination_name}</Text>
            <Text style={styles.cardSubtitle}>{item.destination_country}</Text>
          </View>
          <TouchableOpacity onPress={() => removeFavorite(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="heart" size={22} color="#ef4444" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: C.dark, marginTop: 16 },
  emptySubtitle: { fontSize: 15, color: C.muted, textAlign: "center", marginTop: 8, lineHeight: 22 },
  loginBtn: { marginTop: 24, backgroundColor: C.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 28 },
  loginBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.white,
    padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card, alignItems: "center", justifyContent: "center", marginRight: 12 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: C.dark },
  cardSubtitle: { fontSize: 13, color: C.muted, marginTop: 2 },
});
