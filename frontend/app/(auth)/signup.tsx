import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase"
import { router } from "expo-router"
import { signup } from "@/lib/api"
import { authStyles } from "@/styles/auth"

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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

      const res = await signup({ user_id: data.user?.id, username, email, password });
      console.log("SIGN UP RESPONSE:", res)

      if (res.error) {
        setMessage(`❌ ${res.error}`);
      } else {
        setMessage("✅ Signup successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        router.navigate("/(auth)/login");
      }

    } catch (err) {
      console.error("Signup error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Sign Up</Text>

      <TextInput
        style={authStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={authStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={authStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={"#E8E0D3"}
      />

      <Button title="Sign Up" onPress={handleSignup} />

      {message ? <Text style={authStyles.message}>{message}</Text> : null}
    </View>
  );
}
