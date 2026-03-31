import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <Ionicons name="person-outline" size={48} color="#bfad96" />
      </View>
      <Text style={styles.title}>Willkommen</Text>
      <Text style={styles.subtitle}>
        Melde dich an, um alle Features zu nutzen — Favoriten,
        Preisalarme, Achievements und mehr.
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.loginButtonText}>Anmelden</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/auth/register")}
      >
        <Text style={styles.registerButtonText}>
          Kostenloses Konto erstellen
        </Text>
      </TouchableOpacity>
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
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#f3efe8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#302821",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#8a7560",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#f49d1a",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  registerButton: {
    borderWidth: 1.5,
    borderColor: "#d4c8b5",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    width: "100%",
    alignItems: "center",
  },
  registerButtonText: { color: "#302821", fontSize: 16, fontWeight: "600" },
});
