import { Stack, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      router.replace("/Home");
    } else {
      router.replace("/Login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.squircle}>
            <Text style={styles.squircleText}>B</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>BuddyPay<Text style={{ color: '#8ac751' }}>.</Text></Text>
          <Text style={styles.subtitle}>Smart expense management for your wallet</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{user ? "Go to Dashboard" : "Get Started"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 28,
  },
  logoContainer: {
    alignItems: "center",
  },
  squircle: {
    width: 120,
    height: 120,
    backgroundColor: '#8ac751',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8ac751',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  squircleText: {
    fontSize: 60,
    fontWeight: '900',
    color: '#000',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 20,
    borderRadius: 22,
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "800",
  },
});
