import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/app/(auth)/authcontext"
import { router } from "expo-router"

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setIsLoggedIn } = useAuth();

  const handleSignup = async () => {
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setMessage(`❌ Auth error: ${authError.message}`);
        return;
      }

      // Insert username into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user?.id, username }]);

      if (profileError) {
        setMessage(`❌ Profile error: ${profileError.message}`);
        return;
      }

      setMessage("✅ Signup successful!");
      setUsername("");
      setEmail("");
      setPassword("");
      setIsLoggedIn(true);
      router.navigate("/(auth)/login");

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
