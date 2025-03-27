import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { signup } from "@/lib/api";
import { router } from "expo-router"

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await signup({ username, email, password });

      if (res.error) {
        setMessage(`❌ ${res.error}`);
      } else {
        setMessage("✅ Signup successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        router.navigate("/(tabs)/placeholder")
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleSignup} />

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});
