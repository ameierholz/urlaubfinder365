import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HIGHLIGHTS = [
  { slug: "mallorca", name: "Mallorca", country: "Spanien" },
  { slug: "antalya", name: "Antalya", country: "Türkei" },
  { slug: "kreta", name: "Kreta", country: "Griechenland" },
  { slug: "hurghada", name: "Hurghada", country: "Ägypten" },
  { slug: "barcelona", name: "Barcelona", country: "Spanien" },
  { slug: "dubai", name: "Dubai", country: "VAE" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Finde deinen{"\n"}Traumurlaub</Text>
        <Text style={styles.heroSubtitle}>
          250+ Reiseziele weltweit zum besten Preis
        </Text>
      </View>

      {/* Beliebte Reiseziele */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beliebte Reiseziele</Text>
        {HIGHLIGHTS.map((dest) => (
          <TouchableOpacity
            key={dest.slug}
            style={styles.destinationCard}
            onPress={() => router.push(`/destination/${dest.slug}`)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={20} color="#f49d1a" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{dest.name}</Text>
              <Text style={styles.cardSubtitle}>{dest.country}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bfad96" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf8f5" },
  hero: {
    backgroundColor: "#f49d1a",
    padding: 24,
    paddingTop: 40,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  heroSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.85)" },
  section: { padding: 16, paddingTop: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#302821",
    marginBottom: 12,
  },
  destinationCard: {
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
