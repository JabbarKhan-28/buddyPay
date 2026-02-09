import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { TransactionProvider } from "../context/TransactionContext";

function RootLayoutNav() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <ActivityIndicator size="large" color="#8ac751" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Frontscreen" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="AddTransaction" options={{ headerShown: false }} />
      <Stack.Screen name="AllTransactions" options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }} />
      <Stack.Screen name="Analytics" options={{ headerShown: false }} />
      <Stack.Screen name="Budgeting" options={{ headerShown: false }} />
      <Stack.Screen name="Settings" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <RootLayoutNav />
      </TransactionProvider>
    </AuthProvider>
  );
}
