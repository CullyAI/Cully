import { get_profile, set_profile } from "@/lib/api.js";
import { useState, useEffect } from "react";
import { 
    View, 
    TextInput, 
    Button, 
    Text, 
    FlatList, 
    Pressable, 
    StyleSheet, 
    Keyboard, 
    TouchableWithoutFeedback, 
    ScrollView 
} from "react-native";
import { profileStyles } from "@/styles/profile";
import { useAuth } from '@/context/authcontext';
import { diseaseData } from '@/assets/info/diseases';
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';

export default function ProfilePage() {
    const [dietaryPreferences, setDietaryPreferences] = useState("");
    const [allergies, setAllergies] = useState("");
    const [nutritionalGoals, setNutritionalGoals] = useState("");
    const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDiseases, setFilteredDiseases] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await get_profile(user);
                setSelectedDiseases(res["diseases"] ? res["diseases"].split(',') : []);
                setAllergies(res["allergies"]);
                setNutritionalGoals(res["nutritional_goals"]);
                setDietaryPreferences(res["dietary_preferences"]);
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
                "diseases": selectedDiseases.join(', '),
                "allergies": allergies,
                "nutritional_goals": nutritionalGoals,
                "dietary_preferences": dietaryPreferences,
            });
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    useEffect(() => {
        if (!searchQuery) {
            setFilteredDiseases(Object.keys(diseaseData).filter(
                disease => !selectedDiseases.includes(disease)
            ));
        } else {
            const matches = Object.keys(diseaseData).filter(
                disease => 
                    disease.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !selectedDiseases.includes(disease)
            );
            setFilteredDiseases(matches);
        }
    }, [searchQuery, selectedDiseases]);

    const removeDisease = (disease: string) => {
        setSelectedDiseases(prev => prev.filter(d => d !== disease));
    };

    const addDisease = (disease: string) => {
        setSelectedDiseases(prev => [...prev, disease]);
        setSearchQuery("");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={profileStyles.container}>
            <Text style={profileStyles.title}>Edit Profile</Text>
            
            <Text style={profileStyles.header}>Diseases/Conditions</Text>
            <View style={profileStyles.selectedContainer}>
                {selectedDiseases.map((disease) => (
                    <View key={disease} style={profileStyles.chip}>
                        <Text style={profileStyles.chipText}>{disease}</Text>
                        <Pressable onPress={() => removeDisease(disease)} style={profileStyles.chipButton}>
                            <X size={16} color="#666" />
                        </Pressable>
                    </View>
                ))}
            </View>

            <Pressable
                onPress={() => setShowDropdown(!showDropdown)}
                style={[profileStyles.input, profileStyles.dropdown]}
            >
                <TextInput
                    style={profileStyles.searchInput}
                    placeholder="Search diseases..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setShowDropdown(true)}
                />
                {showDropdown ? (
                    <ChevronUp size={20} color="#666" />
                ) : (
                    <ChevronDown size={20} color="#666" />
                )}
            </Pressable>

            {showDropdown && (
                <View style={profileStyles.dropdownList}>
                    <FlatList
                        data={filteredDiseases}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    addDisease(item);
                                }}
                                style={profileStyles.dropdownItem}
                            >
                                <Text>{item}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}

            <Text style={profileStyles.header}>Allergies</Text>
            <TextInput
                style={profileStyles.input}
                placeholder="Enter any allergies you have..."
                value={allergies}
                onChangeText={setAllergies}
                autoCapitalize="none"
            />
            
            <Text style={profileStyles.header}>Nutritional Goals</Text>
            <TextInput
                style={profileStyles.input}
                placeholder="Enter any nutritional goals you have..."
                value={nutritionalGoals}
                onChangeText={setNutritionalGoals}
                autoCapitalize="none"
            />
            
            <Text style={profileStyles.header}>Dietary Preferences</Text>
            <TextInput
                style={profileStyles.input}
                placeholder="Enter any dietary preferences you have..."
                value={dietaryPreferences}
                onChangeText={setDietaryPreferences}
                autoCapitalize="none"
            />
            
            <Button title="Save Profile" onPress={updateProfile} />
        </View>

        </TouchableWithoutFeedback>
    );
}
    