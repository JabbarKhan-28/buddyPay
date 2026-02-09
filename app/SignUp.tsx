import { createUserWithEmailAndPassword } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/firebase";

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [Password, setPassword] = useState('');
  const [confirmPassword, setCPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name) {
      return Alert.alert("Name Missing")
    }
    if (!email || !email.includes('@')) {
      return Alert.alert("Enter a valid email")
    }
    if (Password.length < 6) {
      return Alert.alert("Password must be at least 6 characters")
    }
    if (Password !== confirmPassword) {
      return Alert.alert("Passwords do not match")
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, Password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: name,
        email: email,
        avatar: name.substring(0, 2).toUpperCase(),
        joiningDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        monthlyBudget: 20000,
        currencyCode: 'en-PK',
        dateFormat: 'DD/MM/YYYY'
      });

      router.push('/Home')
    } catch (error: any) {
      Alert.alert("Signup Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} />
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Please enter your credentials</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#999"
            style={styles.input}
            value={name}
            onChangeText={setName}
            keyboardType="default"
          />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password (at least 6 character)"
            value={Password}
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TextInput
            value={confirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            onChangeText={setCPassword}
          />
        </View>
        <TouchableOpacity style={styles.signupTextContainer} activeOpacity={0.7} onPress={() => router.push("/Login")}>
          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.signupHighlight}>Sign in</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
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
    borderColor: "#2C2C2C",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 16,
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
    marginBottom: 24,
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
    marginTop: 16,
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