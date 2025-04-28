import { useState, useRef, useEffect } from "react";

import {
	View,
	TextInput,
	Text,
	ScrollView,
	KeyboardAvoidingView,
	TouchableOpacity,
	Platform,
	Pressable,
	Animated,
	Image
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { Send } from "lucide-react-native";
import { generate_recipe, generate_recipe_details } from "@/lib/socket";
import { set_recipe, delete_recipe } from "@/lib/api";
import { useAuth } from '@/context/authcontext';
import { chatStyles, GradientBG } from '@/styles/recipe'
import { cleanAndParseJSON } from "@/utils/basic_functions";
import { IconSymbol } from "@/components/ui/IconSymbol"; 
//import { LinearGradient } from "react-native-linear-gradient";

type Message = {
	role: "user" | "assistant" | "system";
	content: string;
};

export default function ChatScreen() {
	const [input, setInput] = useState("");
	const [history, setHistory] = useState<Message[]>([]);
	const [isWaitingForFirstToken, setIsWaitingForFirstToken] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [messageMetadata, setMessageMetadata] = useState<Record<number, {
		recipeId?: string;
		isSaving?: boolean;
		isSaved?: boolean;
		doneGenerating?: boolean;
	}>>({});
	const scrollRef = useRef<ScrollView>(null);
	const dotAnimation = useRef(new Animated.Value(0)).current;
	const [scale] = useState(new Animated.Value(1));
	const { user } = useAuth();
	//const GradientBackground = LinearGradient as unknown as React.ComponentType<any>;


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


	const handleSubmitIn = () => {
		Animated.spring(scale, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handleSubmitOut = () => {
		Animated.spring(scale, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};


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

	const goToBottom = (index: number) => {
		setIsGenerating(false);
		setTimeout(() => {
			scrollRef.current?.scrollToEnd({ animated: true });
		}, 50);

		setMessageMetadata(prev => ({
			...prev,
			[index]: {
				isSaved: false,
				doneGenerating: true,
			}
		}));
	};

	const logError = (errMsg: string) => {
		console.error("❌ Recipe generation error:", errMsg);
	};


	const handleInput = () => {
		if (!input.trim() || isGenerating) return;
	
		const userMessage: Message = { role: "user", content: input };
		const newHistory = [...history, userMessage];
    	const nextIndex = newHistory.length;

		setInput("");
		setHistory((prev) => [...prev, userMessage]);
		setIsWaitingForFirstToken(true);
		setIsGenerating(true);
	
		generate_recipe(
			{
				user,
				history: newHistory,
				input: input
			},
			updateMessages,
			() => goToBottom(nextIndex),
			logError,
		);
	};


	function isRecipe(text: string) {
		const recipeKeywords = ["1.", ":"];
		return recipeKeywords.some(keyword => text.toLowerCase().includes(keyword));
	  }


	const addRecipe = async (raw: string, index: number) => {
		if (raw.trim() === "False") return;

		let json = cleanAndParseJSON(raw);

		const res = await set_recipe({
			"user": user,
			"title": json["title"],
			"description": json["description"],
			"steps": json["steps"],
			"preparation_time": json["preparation_time"],
			"cooking_time": json["cooking_time"],
			"difficulty_level": json["difficulty_level"],
			"calories": json["calories"],
			"protein": json["protein"],
			"fat": json["fat"],
		});

		const recipe_id = res["recipe_id"];

		setMessageMetadata(prev => ({
			...prev,
			[index]: {
				...(prev[index] || {}),
				isSaving: false,
				isSaved: true,
				recipeId: recipe_id,
			}
		}));
	}

	const handleDelete = async (recipe_id: string, index: number) => {
		const res = await delete_recipe({
			"user": user,
			"recipe_id": recipe_id,
		});

		setMessageMetadata(prev => ({
			...prev,
			[index]: {
				...(prev[index] || {}),
				isSaved: false,
				recipeId: recipe_id,
			}
		}));
	}	

	const handleSave = (recipe: string, index: number) => {
		setMessageMetadata(prev => ({
			...prev,
			[index]: {
				...(prev[index] || {}),
				isSaving: true,
			}
		}));

		generate_recipe_details(
			{ user, history, recipe },
			(raw: string) => addRecipe(raw, index),
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
    <View style={chatStyles.safeArea}>
      <Image
        source={GradientBG}
        style={[chatStyles.gradientbg]}
        resizeMode="cover"
      ></Image>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={chatStyles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? -35 : 0}
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
                msg.role === "user"
                  ? chatStyles.userBubble
                  : chatStyles.assistantBubble,
              ]}
            >
              <Markdown>{msg.content}</Markdown>

              {msg.role === "assistant" 
				&& messageMetadata[i]?.doneGenerating
				&& isRecipe(msg.content) && (
					messageMetadata[i]?.isSaving ? (
					<TouchableOpacity
						style={chatStyles.saveButton}
						onPressIn={handleSubmitIn}
						onPressOut={handleSubmitOut}
						onPress={async () => await handleDelete(messageMetadata[i]?.recipeId!, i)}
						activeOpacity={0.7}
					>
						<Animated.View style={[chatStyles.saveButtonContent, { transform: [{ scale }] }]}>
							<IconSymbol size={20} name="ellipsis" color="#FFFBF4" />
						</Animated.View>
					</TouchableOpacity>
					) : !messageMetadata[i]?.isSaved ? (
					<TouchableOpacity
						style={chatStyles.saveButton}
						onPressIn={handleSubmitIn}
						onPressOut={handleSubmitOut}
						onPress={() => handleSave(msg.content, i)}
						activeOpacity={0.7}
					>
						<Animated.View style={[chatStyles.saveButtonContent, { transform: [{ scale }] }]}>
							<IconSymbol size={20} name="bookmark" color="#FFFBF4" />
						</Animated.View>
					</TouchableOpacity>
					) : (
					<TouchableOpacity
						style={chatStyles.saveButton}
						onPressIn={handleSubmitIn}
						onPressOut={handleSubmitOut}
						onPress={async () => await handleDelete(messageMetadata[i]?.recipeId!, i)}
						activeOpacity={0.7}
					>
						<Animated.View style={[chatStyles.saveButtonContent, { transform: [{ scale }] }]}>
						<IconSymbol size={20} name="bookmark.fill" color="#FFFBF4" />
						</Animated.View>
					</TouchableOpacity>
					)
				)}

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
            placeholderTextColor={"#C0BBB2"}
          />
          <Pressable
            style={[
              chatStyles.sendButton,
              (!input.trim() || isGenerating) && chatStyles.sendButtonDisabled,
            ]}
            onPress={handleInput}
            disabled={!input.trim()}
          >
            <IconSymbol
              size={22}
              name="arrow.up"
              color={!input.trim() || isGenerating ? "#C0BBB2" : "#FFFBF4"} // light gray when disabled, light cream when active
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}