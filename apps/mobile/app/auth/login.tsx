import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen zurück</Text>
      <Text style={styles.subtitle}>
        Melde dich an, um deine Favoriten und Preisalarme zu sehen.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-Mail-Adresse"
        placeholderTextColor="#bfad96"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        placeholderTextColor="#bfad96"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Anmelden</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.link}>
          Noch kein Konto? Jetzt registrieren
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf8f5", padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "#302821", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#8a7560", marginBottom: 32, lineHeight: 22 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e0d4",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: "#302821",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#f49d1a",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#f49d1a", fontSize: 14, textAlign: "center", fontWeight: "500" },
});
