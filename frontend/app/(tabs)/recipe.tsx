import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { generate_recipe } from "@/lib/api";

export default function LoginScreen() {
    const [input, setInput] = useState("")
    const [response, setResponse] = useState("")

    const handleInput = async () => {
        try {
            const res = await generate_recipe(input)
            if (res.error) {
                setResponse(`❌ ${res.error}`);
            } else { setResponse(res) } 
        } catch (err) {
            console.error("Login error:", err);
            setResponse("❌ Something went wrong.");
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Generate a recipe</Text>

        <TextInput
            style={styles.input}
            placeholder="Ask for a recipe..."
            value={input}
            onChangeText={setInput}
            autoCapitalize="none"
        />

        <Button title="Generate" onPress={handleInput} />

        {response ? <Text style={styles.message}>{response}</Text> : null}
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        textAlign: "center",
    },
});