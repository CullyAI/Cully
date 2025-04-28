import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/authcontext";
import { useRouter, useNavigationContainerRef } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol"; 
import { useEffect } from "react";
import { authStyles } from "@/styles/auth"


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();

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
    handleLogin();
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Wait a tick to let router hydrate before navigating
      const timeout = setTimeout(() => {
        router.replace("/(tabs)/profile");
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={authStyles.container}>
      <Text style={authStyles.title}>Log In</Text>

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
    </TouchableWithoutFeedback>
  );
}


