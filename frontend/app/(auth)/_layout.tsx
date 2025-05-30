import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
//import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from "react-native";
import { StatusBar } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
          {/* ✅ Add this to control the status bar appearance */}
          <StatusBar barStyle="dark-content" />
          
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
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          default: {
            borderTopWidth: 0,
            elevation: 10, // Android shadow
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          title: "Log In",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "Sign Up",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.crop.circle.badge.plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
    </>
  );
}
