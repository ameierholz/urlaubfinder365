import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#faf8f5" },
          headerTintColor: "#302821",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="destination/[slug]"
          options={{ title: "Reiseziel" }}
        />
        <Stack.Screen name="auth/login" options={{ title: "Anmelden" }} />
        <Stack.Screen
          name="auth/register"
          options={{ title: "Registrieren" }}
        />
      </Stack>
    </>
  );
}
