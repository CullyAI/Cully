import { useState } from "react";
import { View, TextInput, Text, StyleSheet, Button } from "react-native";
import { generate_macros } from "@/lib/socket";
import { useAuth } from "@/context/authcontext";

export default function MacroScreen() {
    const { user } = useAuth();

    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [targetWeight, setTargetWeight] = useState("");

    const [response, setResponse] = useState("");
    const [finish, setFinish] = useState(false);

    const logError = (errMsg: string) => {
        console.error("❌ Macro generation error:", errMsg);
    };

    const submitMacros = () => {
        generate_macros({
                user,
                age,
                sex,
                height,
                weight,
                activityLevel,
                targetWeight,
            },
            handleChunk,
            handleFinish,
            logError,
        );
    };

    const handleChunk = (chunk: string) => {
        setResponse((prev) => prev + chunk);
        console.log("📦 New chunk:", chunk);
    };

    const handleFinish = (generation: string) => {
        setFinish(true);
    };


    return (
        <View style={styles.container}>

        <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} />
        <TextInput style={styles.input} placeholder="Sex (M/F)" value={sex} onChangeText={setSex} />
        <TextInput style={styles.input} placeholder="Height (in.)" value={height} onChangeText={setHeight} />
        <TextInput style={styles.input} placeholder="How much do you weigh? (lbs)" value={weight} onChangeText={setWeight} />
        <TextInput style={styles.input} placeholder="How many times do you work out weekly?" value={activityLevel} onChangeText={setActivityLevel} />
        <TextInput style={styles.input} placeholder="What is your weight targetWeight? (lbs)" value={targetWeight} onChangeText={setTargetWeight} />

        <Button title="Submit" onPress={submitMacros}/>

        { (
            <View style={styles.responseBox}>
                <Text style={styles.responseText}>{response}</Text>
            </View>
            )}
        </View>
    );
}

    const styles = StyleSheet.create({
      container: {
        position: "relative",
        top: 30,
        padding: 30,
        gap: 10,
      },
      input: {
        borderWidth: 1,
        borderColor: "#aaa",
        color: "#FFFBF4",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
      },
      responseBox: {
        marginTop: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#4CAF50",
        borderRadius: 12,
        backgroundColor: "#e6f5ec",
      },

      responseText: {
        fontSize: 16,
        color: "#2e7d32",
        lineHeight: 22,
      },
    });
