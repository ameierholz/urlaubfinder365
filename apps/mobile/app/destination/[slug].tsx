import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const DESTINATIONS: Record<
  string,
  { name: string; country: string; description: string; climate: string; tags: string[] }
> = {
  mallorca: {
    name: "Mallorca",
    country: "Spanien",
    description: "Die beliebteste Urlaubsinsel der Deutschen bietet traumhafte Strände, malerische Buchten und das pulsierende Palma de Mallorca.",
    climate: "Mediterran",
    tags: ["Strand", "Familie", "Kultur", "Nachtleben"],
  },
  antalya: {
    name: "Antalya",
    country: "Türkei",
    description: "Die türkische Riviera begeistert mit All-Inclusive-Resorts, antiken Ruinen und der spektakulären Küstenlandschaft.",
    climate: "Mediterran",
    tags: ["Strand", "All-Inclusive", "Kultur", "Familie"],
  },
  kreta: {
    name: "Kreta",
    country: "Griechenland",
    description: "Griechenlands größte Insel vereint mythische Geschichte, wilde Schluchten und kristallklares Wasser.",
    climate: "Mediterran",
    tags: ["Strand", "Kultur", "Wandern", "Natur"],
  },
  hurghada: {
    name: "Hurghada",
    country: "Ägypten",
    description: "Am Roten Meer gelegen, ist Hurghada ein Paradies für Taucher und Schnorchler mit ganzjährig warmem Wetter.",
    climate: "Wüste",
    tags: ["Strand", "Tauchen", "All-Inclusive", "Schnorcheln"],
  },
};

export default function DestinationScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const dest = DESTINATIONS[slug || ""];

  if (!dest) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Reiseziel nicht gefunden</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{dest.name}</Text>
        <View style={styles.countryRow}>
          <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.heroCountry}>{dest.country}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.content}>
        <Text style={styles.description}>{dest.description}</Text>

        {/* Facts */}
        <View style={styles.factsRow}>
          <View style={styles.factCard}>
            <Ionicons name="sunny-outline" size={22} color="#f49d1a" />
            <Text style={styles.factLabel}>Klima</Text>
            <Text style={styles.factValue}>{dest.climate}</Text>
          </View>
          <View style={styles.factCard}>
            <Ionicons name="pricetag-outline" size={22} color="#f49d1a" />
            <Text style={styles.factLabel}>Highlights</Text>
            <Text style={styles.factValue}>{dest.tags.slice(0, 2).join(", ")}</Text>
          </View>
        </View>

        {/* Placeholder */}
        <View style={styles.placeholder}>
          <Ionicons name="airplane-outline" size={32} color="#d4c8b5" />
          <Text style={styles.placeholderText}>
            Angebote werden geladen, sobald die API verbunden ist.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf8f5" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, color: "#8a7560" },
  hero: {
    backgroundColor: "#f49d1a",
    padding: 24,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: { fontSize: 32, fontWeight: "800", color: "#fff" },
  countryRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 },
  heroCountry: { fontSize: 16, color: "rgba(255,255,255,0.85)" },
  content: { padding: 16, paddingTop: 20 },
  description: { fontSize: 16, lineHeight: 24, color: "#4d4035", marginBottom: 20 },
  factsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  factCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8e0d4",
    alignItems: "center",
  },
  factLabel: { fontSize: 12, color: "#8a7560", marginTop: 6 },
  factValue: { fontSize: 14, fontWeight: "600", color: "#302821", marginTop: 2 },
  placeholder: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8e0d4",
    alignItems: "center",
  },
  placeholderText: { fontSize: 14, color: "#8a7560", textAlign: "center", marginTop: 8 },
});
