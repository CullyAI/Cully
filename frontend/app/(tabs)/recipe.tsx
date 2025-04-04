import { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { Send } from "lucide-react-native";
import { generate_recipe, signup } from "@/lib/api";
import { useAuth } from '@/app/(auth)/authcontext';

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const { user } = useAuth();

  const handleInput = () => {
    if (!input.trim()) return;
  
    const userMessage: Message = { role: "user", content: input };
    setHistory((prev) => [...prev, userMessage]);
    setInput("");
  
    // Show a placeholder assistant message that will be updated live
    setHistory((prev) => [...prev, { role: "assistant", content: "" }]);
  
    generate_recipe(
      {
        user,
        history: [...history, userMessage],
        input: input
      },
      (chunk: string) => {
        console.log(chunk);
        // Append each chunk to the assistant's message
        setHistory((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk
            };
          }
          return updated;
        });
      },
      () => {
        console.log("✅ Recipe stream complete");
        // Optional: scroll or trigger some effect
      },
      (errMsg: string) => {
        console.error("❌ Recipe generation error:", errMsg);
        setHistory((prev) => [
          ...prev.slice(0, -1), // Remove placeholder assistant message
          { role: "assistant", content: "❌ Something went wrong." }
        ]);
      }
    );
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Recipe Assistant</Text>
        </View>

        <ScrollView 
          style={styles.messages} 
          ref={scrollRef}
          contentContainerStyle={styles.messagesContent}
        >
          {history.map((msg, i) => (
            <View
              key={i}
              style={[
                styles.messageBubble,
                msg.role === "user" ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Markdown style={markdownStyles}>
                {msg.content}
              </Markdown>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask for a recipe..."
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={handleInput}
          />
          <Pressable 
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
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

const markdownStyles = {
  body: {
    color: '#000',
    fontSize: 16,
  },
  heading1: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  paragraph: {
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 4,
  },
  bullet_list: {
    marginBottom: 8,
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
  },
  messages: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    maxWidth: '85%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#4299E1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 0 : 60, // Add bottom margin on Android
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4299E1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#EDF2F7',
  },
});