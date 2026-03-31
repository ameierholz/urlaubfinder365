import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const C = { primary: "#1db682", bg: "#f0fdf9", white: "#fff", dark: "#0f2d25", muted: "#5a9e88", border: "#a7e3cf", card: "#e8faf4" };

function MenuItem({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={C.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={C.primary} /></View>;
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person-outline" size={48} color={C.muted} />
        </View>
        <Text style={styles.title}>Willkommen</Text>
        <Text style={styles.subtitle}>
          Melde dich an, um alle Features zu nutzen — Favoriten, Preisalarme, Achievements und mehr.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/auth/login")}>
          <Text style={styles.primaryBtnText}>Anmelden</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/auth/register")}>
          <Text style={styles.secondaryBtnText}>Kostenloses Konto erstellen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Reisender";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    Alert.alert("Abmelden", "Möchtest du dich wirklich abmelden?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Abmelden", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Mein Konto</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="heart-outline" label="Meine Favoriten" onPress={() => router.push("/(tabs)/favorites")} />
          <View style={styles.divider} />
          <MenuItem icon="notifications-outline" label="Preisalarme" />
          <View style={styles.divider} />
          <MenuItem icon="map-outline" label="Meine Reisepläne" />
          <View style={styles.divider} />
          <MenuItem icon="document-text-outline" label="Meine Reiseberichte" />
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Einstellungen</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="settings-outline" label="Konto-Einstellungen" />
          <View style={styles.divider} />
          <MenuItem icon="shield-checkmark-outline" label="Datenschutz" />
          <View style={styles.divider} />
          <MenuItem icon="help-circle-outline" label="Hilfe & Support" />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={styles.logoutText}>Abmelden</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", padding: 24 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.card, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", color: C.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: C.muted, textAlign: "center", lineHeight: 22, marginBottom: 24 },
  primaryBtn: { backgroundColor: C.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28, width: "100%", alignItems: "center", marginBottom: 12 },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryBtn: { borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28, width: "100%", alignItems: "center" },
  secondaryBtnText: { color: C.dark, fontSize: 16, fontWeight: "600" },
  header: { backgroundColor: C.primary, padding: 32, paddingTop: 48, alignItems: "center" },
  initialsCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  initials: { color: "#fff", fontSize: 28, fontWeight: "800" },
  name: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 4 },
  email: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  menuSection: { padding: 16, paddingBottom: 0 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  menuCard: { backgroundColor: C.white, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: C.border },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.card, alignItems: "center", justifyContent: "center", marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 15, color: C.dark, fontWeight: "500" },
  divider: { height: 1, backgroundColor: C.border, marginLeft: 64 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, margin: 16, marginTop: 24, padding: 16, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#fecaca" },
  logoutText: { color: "#dc2626", fontSize: 16, fontWeight: "600" },
});
