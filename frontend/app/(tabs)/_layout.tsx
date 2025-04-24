import { Tabs } from "expo-router";
import React from "react";
import { Animated, Platform } from "react-native";
import { useNav } from "../navcontext"; // ✅ useNav hook
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/authcontext";

export default function TabLayout() {
const colorScheme = useColorScheme();
const { isLoggedIn, loading } = useAuth();

const { bottomNavValue } = useNav(); // ✅ grab the animated value

if (loading) return null;
if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

return (
	<Tabs
		screenOptions={{
			tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
			tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
			headerShown: false,
			tabBarButton: HapticTab,
			tabBarStyle: {
			position: "absolute",
			borderTopWidth: 0,
			backgroundColor: Colors[colorScheme ?? "light"].background,
			transform: [
				{
					translateY: bottomNavValue, // ✅ animate the Y position
				},
			],
			},
		}}
	>
	{/* Your Screens */}
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
