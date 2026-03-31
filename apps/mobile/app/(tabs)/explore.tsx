import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CONTINENTS } from "@urlaubfinder/shared";

const DESTINATIONS = [
  { slug: "mallorca", name: "Mallorca", country: "Spanien", continent: "Europa" },
  { slug: "antalya", name: "Antalya", country: "Türkei", continent: "Europa" },
  { slug: "kreta", name: "Kreta", country: "Griechenland", continent: "Europa" },
  { slug: "hurghada", name: "Hurghada", country: "Ägypten", continent: "Afrika" },
  { slug: "barcelona", name: "Barcelona", country: "Spanien", continent: "Europa" },
  { slug: "fuerteventura", name: "Fuerteventura", country: "Spanien", continent: "Europa" },
  { slug: "teneriffa", name: "Teneriffa", country: "Spanien", continent: "Europa" },
  { slug: "rhodos", name: "Rhodos", country: "Griechenland", continent: "Europa" },
  { slug: "malediven", name: "Malediven", country: "Malediven", continent: "Asien" },
  { slug: "dubai", name: "Dubai", country: "VAE", continent: "Asien" },
  { slug: "phuket", name: "Phuket", country: "Thailand", continent: "Asien" },
  { slug: "bali", name: "Bali", country: "Indonesien", continent: "Asien" },
  { slug: "kapstadt", name: "Kapstadt", country: "Südafrika", continent: "Afrika" },
  { slug: "new-york", name: "New York", country: "USA", continent: "Nordamerika" },
  { slug: "cancun", name: "Cancún", country: "Mexiko", continent: "Nordamerika" },
  { slug: "sansibar", name: "Sansibar", country: "Tansania", continent: "Afrika" },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <FlatList
      style={styles.container}
      data={DESTINATIONS}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/destination/${item.slug}`)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={20} color="#f49d1a" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              {item.country} · {item.continent}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bfad96" />
        </TouchableOpacity>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf8f5" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e8e0d4",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fef3e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#302821" },
  cardSubtitle: { fontSize: 13, color: "#8a7560", marginTop: 2 },
});
