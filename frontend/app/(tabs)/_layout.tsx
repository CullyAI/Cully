import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/authcontext";

import { NavProvider, useNav } from "./navcontext"; // <-- Add this

function InnerTabs() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, loading } = useAuth();
  const { navHidden } = useNav(); // <-- Hook for nav animation

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: [
          {
            transform: [{ translateY: navHidden ? 100 : 0 }],
            opacity: navHidden ? 0 : 1,
            transitionDuration: "300ms", // Smooth-ish transition
          },
          Platform.select({
            ios: {
              position: "absolute",
              borderTopWidth: 0,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
            default: {
              borderTopWidth: 0,
              elevation: 10,
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
          }),
        ],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipe"
        options={{
          title: "RecipeBot",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="pencil.and.outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="macros"
        options={{
          title: "Macros",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="chart.pie" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="realtime"
        options={{
          title: "VoiceBot",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="waveform.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// 🔄 Wrap the InnerTabs with NavProvider here
export default function TabLayoutWithNavContext() {
  return (
    <NavProvider>
      <InnerTabs />
    </NavProvider>
  );
}
