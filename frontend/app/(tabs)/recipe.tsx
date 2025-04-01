import { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Markdown from 'react-native-markdown-display';
import { generate_recipe } from "@/lib/api";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const handleInput = async () => {
    // Add the user's prompt to the history and clear input
    const userMessage: Message = { role: "user", content: input };
    setHistory((prev) => [...prev, userMessage]);
    setInput("");

    try {
        const res = await generate_recipe({ history: [...history, userMessage], input });

        if (!res.body) throw new Error("Response body is null");

        setHistory((prev) => [...prev, { role: "assistant", content: "" }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullMessage = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullMessage += chunk;
          
          // Add latest chunk to new message
          setHistory((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: fullMessage };
              return updated;
          });
        }
      } 
      
      catch (err) {
        console.error("Recipe generation error:", err);
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Something went wrong." }
        ]);
      }

    // Scroll to bottom after new messages
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView style={styles.messages} ref={scrollRef}>
        {history.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.messageBubble,
              msg.role === "user" ? styles.userBubble : styles.assistantBubble,
            ]}
          >
              <Text style={styles.messageText}>
                  <Markdown>{msg.content}</Markdown>
              </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask for a recipe..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Send" onPress={handleInput} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    messages: {
      flex: 1,
      padding: 12,
    },
    messageBubble: {
      padding: 10,
      marginVertical: 6,
      maxWidth: "80%",
      borderRadius: 12,
    },
    userBubble: {
      backgroundColor: "#DCF8C6",
      alignSelf: "flex-end",
    },
    assistantBubble: {
      backgroundColor: "#EEE",
      alignSelf: "flex-start",
    },
    messageText: {
      fontSize: 16,
    },
    inputRow: {
      flexDirection: "row",
      padding: 8,
      borderTopWidth: 1,
      borderColor: "#ddd",
    },
    input: {
      flex: 1,
      padding: 10,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      marginRight: 8,
    },
  });
  