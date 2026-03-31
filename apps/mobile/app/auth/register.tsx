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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) { setError("Bitte gib deinen Namen ein."); return; }
    if (!email) { setError("Bitte gib deine E-Mail ein."); return; }
    if (password.length < 6) { setError("Das Passwort muss mindestens 6 Zeichen lang sein."); return; }
    setError("");
    setLoading(true);
    try {
      await register(email.trim(), password, name.trim());
      setSuccess(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("already registered") || msg.includes("email-already-in-use")) {
        setError("Diese E-Mail-Adresse ist bereits registriert.");
      } else {
        setError("Registrierung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 48 }}>✉️</Text>
        <Text style={[styles.title, { marginTop: 16 }]}>Fast geschafft!</Text>
        <Text style={[styles.subtitle, { textAlign: "center" }]}>
          Wir haben dir eine Bestätigungs-E-Mail geschickt. Bitte überprüfe dein Postfach und bestätige deine E-Mail-Adresse.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/auth/login")}>
          <Text style={styles.buttonText}>Zur Anmeldung</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoCircle}>
          <Text style={styles.logoUF}>UF</Text>
          <Text style={styles.logo365}>365</Text>
        </View>

        <Text style={styles.title}>Konto erstellen</Text>
        <Text style={styles.subtitle}>Kostenlos registrieren und alle Features nutzen.</Text>

        <TextInput
          style={styles.input}
          placeholder="Dein Name"
          placeholderTextColor={C.muted}
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Passwort (min. 6 Zeichen)"
          placeholderTextColor={C.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Jetzt kostenlos registrieren</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.link}>Schon ein Konto? <Text style={styles.linkBold}>Anmelden</Text></Text>
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
