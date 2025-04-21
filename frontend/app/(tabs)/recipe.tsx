import { useState, useRef, useEffect } from "react";
import {
	View,
	TextInput,
	Text,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Animated
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { Send } from "lucide-react-native";
import { generate_recipe, generate_recipe_details } from "@/lib/socket";
import { set_recipe } from "@/lib/api";
import { useAuth } from '@/context/authcontext';
import { chatStyles } from '@/styles/recipe'
import { cleanAndParseJSON } from "@/utils/basic_functions";

type Message = {
	role: "user" | "assistant" | "system";
	content: string;
};

export default function ChatScreen() {
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<Message[]>([]);
	const [isWaitingForFirstToken, setIsWaitingForFirstToken] = useState(false);
	const scrollRef = useRef<ScrollView>(null);
	const dotAnimation = useRef(new Animated.Value(0)).current;
	const { user } = useAuth();

	useEffect(() => {
		if (isWaitingForFirstToken) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(dotAnimation, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(dotAnimation, {
						toValue: 0,
						duration: 1000,
						useNativeDriver: true,
					}),
				])
			).start();
		} else {
			dotAnimation.setValue(0);
		}
	}, [isWaitingForFirstToken]);


	const updateMessages = (chunk: string) => {
		setIsWaitingForFirstToken(false);

		// Append each chunk to the assistant's message
		setHistory((prev) => {
			const updated = [...prev];
			const lastMessage = updated[updated.length - 1];
			if (lastMessage.role === "assistant") {
				updated[updated.length - 1] = {
					...lastMessage, // Set it to everything that lastMessage was
					content: lastMessage.content + chunk // Overwrite only the content part
				};
			} else {
				updated.push({ role: "assistant", content: chunk });
			}
			return updated;
		});
	};

	const goToBottom = () => {
		setTimeout(() => {
			scrollRef.current?.scrollToEnd({ animated: true });
		}, 50);
	};

	const logError = (errMsg: string) => {
		console.error("❌ Recipe generation error:", errMsg);
	};

	const handleInput = () => {
		if (!input.trim()) return;
	
		const userMessage: Message = { role: "user", content: input };

		setInput("");
		setHistory((prev) => [...prev, userMessage]);
		setIsWaitingForFirstToken(true);
	
		generate_recipe(
			{
				user,
				history: [...history, userMessage],
				input: input
			},
			updateMessages,
			goToBottom,
			logError,
		);
	};


	const addRecipe = (raw: string, steps: string) => {
		console.log(raw);
		if (raw.trim() === "False") return;

		let json = cleanAndParseJSON(raw);

		set_recipe({
			"user": user,
			"steps": steps,
			"title": json["title"],
			"description": json["description"],
			"preparation_time": json["preparation_time"],
			"cooking_time": json["cooking_time"],
			"difficulty_level": json["difficulty_level"],
			"calories": json["calories"],
			"protein": json["protein"],
			"fat": json["fat"],
		})
	}

	const handleSave = (recipe: string) => {
		generate_recipe_details(
			{
				user,
				history,
				recipe,
			},
			(details: string) => addRecipe(details, recipe)
		)
	}

	const LoadingDots = () => {
		const opacity = dotAnimation.interpolate({
			inputRange: [0, 1],
			outputRange: [0.3, 1],
		});

		return (
			<View style={chatStyles.messageBubble}>
				<Animated.Text style={[chatStyles.loadingDots, { opacity }]}>...</Animated.Text>
			</View>
		);
	};

	return (
		<SafeAreaView style={chatStyles.safeArea}>
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={chatStyles.container}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0: 0}
		>

			<View style={chatStyles.header}>
				<Text style={chatStyles.headerText}>Recipe Assistant</Text>
			</View>

			<ScrollView 
				style={chatStyles.messages} 
				ref={scrollRef}
				contentContainerStyle={chatStyles.messagesContent}
			>
				{history.map((msg, i) => (
					<View
						key={i}
						style={[
							chatStyles.messageBubble,
							msg.role === "user" ? chatStyles.userBubble : chatStyles.assistantBubble,
						]}
					>
						<Markdown>
							{msg.content}
						</Markdown>
						
						{msg.role == "assistant" && 
						<Pressable 
							style={[chatStyles.sendButton, !input.trim() && chatStyles.sendButtonDisabled]} 
							onPress={() => handleSave(msg.content)}
						>
							<Send size={20} color={input.trim() ? "#fff" : "#A0AEC0"} />
						</Pressable>}
					</View>
				))}
				{isWaitingForFirstToken && <LoadingDots />}
			</ScrollView>

			<View style={chatStyles.inputContainer}>
				<TextInput
					style={chatStyles.input}
					placeholder="Ask for a recipe..."
					value={input}
					onChangeText={setInput}
					multiline
					maxLength={1000}
					returnKeyType="send"
					onSubmitEditing={handleInput}
				/>
				<Pressable 
					style={[chatStyles.sendButton, !input.trim() && chatStyles.sendButtonDisabled]} 
					onPress={handleInput}
					disabled={!input.trim()}
				>
					<Send size={20} color={input.trim() ? "#fff" : "#A0AEC0"} />
				</Pressable>
			</View>

		</KeyboardAvoidingView>
		</SafeAreaView>
	);
}