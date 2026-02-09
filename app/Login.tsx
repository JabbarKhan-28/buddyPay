import { signInWithEmailAndPassword } from "@firebase/auth";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../config/firebase";

export default function Login() {
  const [email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      return Alert.alert("Enter Valid Email")
    }
    if (Password.length < 6) {
      return Alert.alert("Enter valid password")
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, Password)
      router.push('/Home')
    } catch (error: any) {
      Alert.alert("Login Error", error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please enter your credentials</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            value={Password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.signupTextContainer} activeOpacity={0.7} onPress={() => router.push("/SignUp")}>
          <Text style={styles.signupText}>
            Don't have an account?   <Text style={styles.signupHighlight}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1E1E1E",
    borderRadius: 28,
    padding: 32,
    borderWidth: 1,
    borderBottomColor: "#2C2C2C",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#8e8e93",
    marginTop: 6,
    textAlign: "center",
  },
  inputGroup: {
    gap: 16,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#2C2C2C",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  button: {
    backgroundColor: "#8ac751",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#8ac751",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  signupTextContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#8e8e93",
    fontSize: 14,
    fontWeight: "500",
  },
  signupHighlight: {
    color: "#8ac751",
    fontWeight: "700",
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#3A3A3A',
  },
  dividerText: {
    color: '#8e8e93',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});