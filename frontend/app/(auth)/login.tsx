import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { authStyles } from "@/styles/auth"


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();

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
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Log In</Text>

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
      />

      <Button title="Log In" onPress={handleLogin} />

      {message ? <Text style={authStyles.message}>{message}</Text> : null}
    </View>
  );
}


