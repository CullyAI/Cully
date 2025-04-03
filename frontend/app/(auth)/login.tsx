import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/(auth)/authcontext";
import { useRouter, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();
  const navRef = useNavigationContainerRef(); 

  useEffect(() => {
    if (isLoggedIn) {
      // Wait a tick to let router hydrate before navigating
      const timeout = setTimeout(() => {
        router.replace("/(tabs)/recipe");
      }, 50);
  
      return () => clearTimeout(timeout);
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    try { 
      const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
      });

      if (error) {
          setMessage(`❌ ${error.message}`);
      } else {
          setMessage("✅ Login successful!");
          setIsLoggedIn(true);
      }
    } catch (err) {
        console.error("Login error:", err);
        setMessage("❌ Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

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

      <Button title="Log In" onPress={handleLogin} />

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
