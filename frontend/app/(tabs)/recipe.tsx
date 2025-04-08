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
import { generate_recipe } from "@/lib/socket";
import { useAuth } from '@/context/authcontext';
import { chatStyles } from '@/styles/recipe'

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
      (chunk: string) => {
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
      },
      () => {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 50);
      },
      (errMsg: string) => {
        console.error("❌ Recipe generation error:", errMsg);
        setIsWaitingForFirstToken(false);
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Something went wrong." }
        ]);
      }
    );
  };

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={chatStyles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
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