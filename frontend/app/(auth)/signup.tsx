import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { supabase } from "@/lib/supabase"
import { router } from "expo-router"
import { IconSymbol } from "@/components/ui/IconSymbol"; 
import { signup } from "@/lib/api"
import { authStyles } from "@/styles/auth"

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [scale] = useState(new Animated.Value(1)); // Initial scale value is 1 (normal size)

  const handlePressIn = () => {
    // Animate the button down when pressed
    Animated.spring(scale, {
      toValue: 0.95, // Scale down to 95% of original size
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Animate the button back up when released
    Animated.spring(scale, {
      toValue: 1, // Scale back to normal size
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    handleSignup();
  };

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
        placeholderTextColor={"#E8E0D3"}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={"#E8E0D3"}
      />
      <TextInput
        style={authStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={"#E8E0D3"}
      />

      <TouchableOpacity
              style={authStyles.button}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handlePress}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[authStyles.buttonContent, { transform: [{ scale }] }]}
              >
                <Text style={authStyles.buttonText}>Enter</Text>
                <IconSymbol size={20} name="arrow.right.circle" color="#FFFBF4" />
              </Animated.View>
            </TouchableOpacity>

      {message ? <Text style={authStyles.message}>{message}</Text> : null}
    </View>
  );
}
