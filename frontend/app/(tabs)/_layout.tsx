import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
//import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Redirect } from "expo-router";

import { useAuth } from "@/context/authcontext";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isLoggedIn, loading, user } = useAuth();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        //tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 }, // pushes shadow upward
            shadowOpacity: 0.1,
            shadowRadius: 10,
            //backgroundColor: Colors[colorScheme ?? "light"].navBar,
            backgroundColor: Colors[colorScheme ?? "light"].background, // <-- Add this
          },

          default: {
            borderTopWidth: 0,
            elevation: 10, // Android shadow
            //backgroundColor: Colors[colorScheme ?? "light"].navBar,
            backgroundColor: Colors[colorScheme ?? "light"].background, // <-- Add this
          },
        }),
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipe"
        options={{
          title: "RecipeBot",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="macros"
        options={{
          title: "Macros",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="chevron.right" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="realtime"
        options={{
          title: "VoiceBot",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
