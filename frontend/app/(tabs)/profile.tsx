import { get_profile, set_profile } from "@/lib/api.js";
import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { authStyles } from "@/styles/auth"
import { useAuth } from '@/context/authcontext';

export default function ProfilePage() {
    const [dietaryPreferences, setDietaryPreferences] = useState("");
    const [allergies, setAllergies] = useState("")
    const [nutritionalGoals, setNutritionalGoals] = useState("")
    const [diseases, setDiseases] = useState("")
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await get_profile(user);

                setDiseases(res["diseases"])
                setAllergies(res["allergies"])
                setNutritionalGoals(res["nutritional_goals"])
                setDietaryPreferences(res["dietary_preferences"])

                console.log("PROFILE RESPONSE:", res);
            } catch (err) {
                console.error("Failed to get profile", err);
            }
        };
      
        fetchProfile();
    }, []);
      
    
    const updateProfile = async () => {
        try {
            const res = await set_profile({
                "user": user,
                "diseases": diseases,
                "allergies": allergies,
                "nutritional_goals": nutritionalGoals,
                "dietary_preferences": dietaryPreferences,
            });

            console.log("PROFILE RESPONSE:", res);
        } catch (err) {
            console.error("Failed to get profile", err);
        }
    };
    
    return (
    <View style={authStyles.container}>
        <Text style={authStyles.title}>Edit Profile</Text>
        <Text style={authStyles.title}>Diseases/Conditions</Text>
        <TextInput
            style={authStyles.input}
            placeholder="Enter any diseases or conditions you have..."
            value={diseases}
            onChangeText={setDiseases}
            autoCapitalize="none"
        />
        <Text style={authStyles.title}>Allergies</Text>
        <TextInput
            style={authStyles.input}
            placeholder="Enter any allergies you have..."
            value={allergies}
            onChangeText={setAllergies}
            autoCapitalize="none"
        />
        <Text style={authStyles.title}>Nutritional Goals</Text>
        <TextInput
            style={authStyles.input}
            placeholder="Enter any nutritional goals you have..."
            value={nutritionalGoals}
            onChangeText={setNutritionalGoals}
            autoCapitalize="none"
        />
        <Text style={authStyles.title}>Dietary Preferences</Text>
        <TextInput
            style={authStyles.input}
            placeholder="Enter any dietary preferences you have..."
            value={dietaryPreferences}
            onChangeText={setDietaryPreferences}
            autoCapitalize="none"
        />
        <Button title="Save Profile" onPress={updateProfile} />
    </View>
    )
}