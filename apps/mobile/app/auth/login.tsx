import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const C = { primary: "#1db682", bg: "#f0fdf9", white: "#fff", dark: "#0f2d25", muted: "#5a9e88", border: "#a7e3cf", error: "#dc2626", errorBg: "#fef2f2" };

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Bitte alle Felder ausfüllen."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)/profile");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("Invalid login credentials")) {
        setError("E-Mail oder Passwort ist falsch.");
      } else {
        setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoUF}>UF</Text>
          <Text style={styles.logo365}>365</Text>
        </View>

        <Text style={styles.title}>Willkommen zurück</Text>
        <Text style={styles.subtitle}>Melde dich an, um Favoriten und Preisalarme zu verwalten.</Text>

        <TextInput
          style={styles.input}
          placeholder="E-Mail-Adresse"
          placeholderTextColor={C.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          placeholderTextColor={C.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Anmelden</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.link}>Noch kein Konto? <Text style={styles.linkBold}>Jetzt registrieren</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 24, paddingTop: 48, justifyContent: "center", flexGrow: 1 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 28 },
  logoUF: { color: "#fff", fontSize: 18, fontWeight: "900", lineHeight: 20 },
  logo365: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "700", lineHeight: 14 },
  title: { fontSize: 28, fontWeight: "800", color: C.dark, marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 15, color: C.muted, marginBottom: 32, lineHeight: 22, textAlign: "center" },
  input: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 14, padding: 16, fontSize: 16, color: C.dark, marginBottom: 14,
  },
  error: { backgroundColor: C.errorBg, color: C.error, padding: 12, borderRadius: 10, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: C.primary, paddingVertical: 16, borderRadius: 28, alignItems: "center", marginTop: 4, marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: C.muted, fontSize: 14, textAlign: "center" },
  linkBold: { color: C.primary, fontWeight: "600" },
});
