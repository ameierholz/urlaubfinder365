import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f0fdf9" },
          headerTintColor: "#0d9268",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="destination/[slug]" options={{ title: "Reiseziel" }} />
        <Stack.Screen name="auth/login" options={{ title: "Anmelden" }} />
        <Stack.Screen name="auth/register" options={{ title: "Registrieren" }} />
      </Stack>
    </AuthProvider>
  );
}
