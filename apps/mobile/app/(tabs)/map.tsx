import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MapScreen() {
  // react-native-maps wird in Phase 3 integriert
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={64} color="#d4c8b5" />
      <Text style={styles.title}>Weltkarte</Text>
      <Text style={styles.subtitle}>
        Die interaktive Weltkarte mit allen Reisezielen wird bald
        verfügbar sein.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#302821",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#8a7560",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
