import { useState } from "react";
import { 
    View, 
    TextInput, 
    Text, 
    StyleSheet, 
    Button, 
    ScrollView, 
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { generate_macros } from "@/lib/socket";
import { set_profile } from "@/lib/api";
import { useAuth } from "@/context/authcontext";


export default function MacroScreen() {
    const { user } = useAuth();

    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [targetWeight, setTargetWeight] = useState("");
    const [otherInfo, setOtherInfo] = useState("");

    const [response, setResponse] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [mealsPerDay, setMealsPerDay] = useState("");


    const cleanAndParseJSON = (raw: string) => {
        try {
            // Remove any outer whitespace
            const trimmed = raw.trim();
        
            // Parse it — most models output valid JSON strings directly
            const parsed = JSON.parse(trimmed);
            return parsed;
        } catch (err) {
            console.error("❌ Failed to parse JSON:", err);
            return null;
        }
      };

    const logError = (errMsg: string) => {
        console.error("❌ Macro generation error:", errMsg);
    };


    const generateMacros = () => {
        generate_macros(
            {
                user,
                age,
                sex,
                height,
                weight,
                activityLevel,
                targetWeight,
                otherInfo,
            },
            handleFinish,
            logError,
        );
    };


    const updateMacros = async () => {
        try {
            const res = await set_profile({
                "user": user,
                "macros": {
                    "calories": calories,
                    "protein": protein,
                    "carbs": carbs,
                    "fat": fat,
                    "meals_per_day": mealsPerDay,
                }
            });
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };


    const handleFinish = (generation: string) => {
        let json = cleanAndParseJSON(generation);

        setCalories(json.calories?.toString() ?? "N/A")
        setProtein(json.macros?.protein_g?.toString() ?? "N/A")
        setCarbs(json.macros?.carbs_g?.toString() ?? "N/A")
        setFat(json.macros?.fat_g?.toString() ?? "N/A")
        setMealsPerDay(json.meals_per_day?.toString() ?? "N/A")
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>

            <View style={styles.container}>

            <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} />
            <TextInput style={styles.input} placeholder="Sex (M/F)" value={sex} onChangeText={setSex} />
            <TextInput style={styles.input} placeholder="Height (in.)" value={height} onChangeText={setHeight} />
            <TextInput style={styles.input} placeholder="How much do you weigh? (lbs)" value={weight} onChangeText={setWeight} />
            <TextInput style={styles.input} placeholder="How many times do you work out weekly?" value={activityLevel} onChangeText={setActivityLevel} />
            <TextInput style={styles.input} placeholder="What is your target weight? (lbs)" value={targetWeight} onChangeText={setTargetWeight} />
            <TextInput style={styles.input} placeholder="Any other information?" value={otherInfo} onChangeText={setOtherInfo} />

            <Button title="Generate Macros" onPress={generateMacros}/>

            <View style={styles.responseBox}>
                <Text style={styles.header}>Target Calories</Text>
                <TextInput style={styles.output} placeholder={"Your target calories will appear here."} value={calories} onChangeText={setCalories} />
                <Text style={styles.header}>Target Protein</Text>
                <TextInput style={styles.output} placeholder={"Your target protein will appear here."} value={protein} onChangeText={setProtein} />
                <Text style={styles.header}>Target Carbs</Text>
                <TextInput style={styles.output} placeholder={"Your target carbs will appear here."} value={carbs} onChangeText={setCarbs} />
                <Text style={styles.header}>Target Fat</Text>
                <TextInput style={styles.output} placeholder={"Your target fat will appear here."} value={fat} onChangeText={setFat} />
                <Text style={styles.header}>Target Meals Per Day</Text>
                <TextInput style={styles.output} placeholder={"Your target meals per day will appear here."} value={mealsPerDay} onChangeText={setMealsPerDay} />

                <Button title="Save Macros" onPress={updateMacros}/>
            </View>
        
            </View>

        </ScrollView>
        </TouchableWithoutFeedback>
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
        color: "#fff",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    output: {
        borderWidth: 1,
        borderColor: "#aaa",
        color: "#000",
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
      header: {
        fontSize: 16,
        marginBottom: 16,
        fontWeight: "bold",
        textAlign: "left",
      },
      
});
