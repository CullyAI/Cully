import { get_profile, set_profile } from "@/lib/api.js";
import { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  FlatList,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { profileStyles, macroStyles } from "@/styles/profile";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/authcontext";
import { diseaseData } from "@/assets/info/diseases";
import { generate_macros } from "@/lib/socket";
import { cleanAndParseJSON } from "@/utils/basic_functions";
import { logout } from "@/lib/supabase";

export default function MacrosPage() {
    const [profileAnim] = useState(new Animated.Value(0));
    const [macrosAnim] = useState(new Animated.Value(0));
    const [scale] = useState(new Animated.Value(1));

    const scrollRef = useRef<ScrollView>(null);

    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [targetWeight, setTargetWeight] = useState("");
    const [otherInfo, setOtherInfo] = useState("");

    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [mealsPerDay, setMealsPerDay] = useState("");

    const { user } = useAuth();

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

      useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await get_profile(user);
                // Set all the profile fields
                setAge(res["age"] || "");
                setSex(res["sex"] || "");
                setHeight(res["height"] || "");
                setWeight(res["weight"] || "");
                setActivityLevel(res["activity_level"] || "");
                setTargetWeight(res["target_weight"] || "");
                setOtherInfo(res["other_info"] || "");
        
                // Set macros
                if (res["macros"]) {
                setCalories(res["macros"]["calories"] || "");
                setProtein(res["macros"]["protein"] || "");
                setCarbs(res["macros"]["carbs"] || "");
                setFat(res["macros"]["fat"] || "");
                setMealsPerDay(res["macros"]["meals_per_day"] || "");
                }
            } catch (err) {
                console.error("Failed to get profile", err);
            }
        };
    
        fetchProfile();
      }, []);


    const updateProfile = async () => {
        try {
          await set_profile({
            user,
            macros: {
              calories,
              protein,
              carbs,
              fat,
              meals_per_day: mealsPerDay,
            },
          });
        } catch (err) {
          console.error("Failed to update profile", err);
        }
      };

    const handleFinish = (generation: string) => {
        let json = cleanAndParseJSON(generation);
        setCalories(json.calories?.toString() ?? "N/A");
        setProtein(json.macros?.protein_g?.toString() ?? "N/A");
        setCarbs(json.macros?.carbs_g?.toString() ?? "N/A");
        setFat(json.macros?.fat_g?.toString() ?? "N/A");
        setMealsPerDay(json.meals_per_day?.toString() ?? "N/A");
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
          logError
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ paddingBottom: 150, paddingTop: 50 }}
            style={{ backgroundColor: "#FFF5E3" }}
        >
        <View style={profileStyles.container}>

            <Text style={[
                profileStyles.daHeader, { 
                textAlign: "center",
                
            }]}>
                    Edit Macros{"\n"}OR
            </Text>
            <TouchableOpacity
                style={profileStyles.buttonMacros}
                onPressIn={handleSubmitIn}
                onPressOut={handleSubmitOut}
                onPress={generateMacros}
                activeOpacity={0.7}
            >
                <Animated.View
                    style={[
                    profileStyles.buttonContent,
                    { transform: [{ scale }] },
                    ]}
                >
                    <Text style={profileStyles.buttonText}>Generate Macros</Text>
                    <IconSymbol size={20} name="checkmark" color="#FFFBF4" />
                </Animated.View>
            </TouchableOpacity>

                <Text style={profileStyles.header}>Calories</Text>
                    <TextInput
                    style={[profileStyles.input, {marginBottom: 4}]}
                    placeholder="Set your target calories here..."
                    value={calories}
                    onChangeText={setCalories}
                    autoCapitalize="none"
                    placeholderTextColor={"#C0BBB2"}
                />
                <Text style={profileStyles.header}>Protein</Text>
                    <TextInput
                    style={[profileStyles.input, {marginBottom: 4}]}
                    placeholder="Set your target protein here..."
                    value={protein}
                    onChangeText={setProtein}
                    autoCapitalize="none"
                    placeholderTextColor={"#C0BBB2"}
                />
                <Text style={profileStyles.header}>Carbs</Text>
                    <TextInput
                    style={[profileStyles.input, {marginBottom: 4}]}
                    placeholder="Set your target carbs here..."
                    value={carbs}
                    onChangeText={setCarbs}
                    autoCapitalize="none"
                    placeholderTextColor={"#C0BBB2"}
                />
                <Text style={profileStyles.header}>Fat</Text>
                    <TextInput
                    style={[profileStyles.input, {marginBottom: 4}]}
                    placeholder="Set your target fat here..."
                    value={fat}
                    onChangeText={setFat}
                    autoCapitalize="none"
                    placeholderTextColor={"#C0BBB2"}
                />
                <Text style={profileStyles.header}>Target Meals Per Day</Text>
                    <TextInput
                    style={[profileStyles.input, {marginBottom: 4}]}
                    placeholder="Set your target meals per day here..."
                    value={mealsPerDay}
                    onChangeText={setMealsPerDay}
                    autoCapitalize="none"
                    placeholderTextColor={"#C0BBB2"}
                />

                <TouchableOpacity
                    style={profileStyles.buttonMacros}
                    onPressIn={handleSubmitIn}
                    onPressOut={handleSubmitOut}
                    onPress={updateProfile}
                    activeOpacity={0.7}
                >
                    <Animated.View
                        style={[
                        profileStyles.buttonContent,
                        { transform: [{ scale }] },
                        ]}
                    >
                        <Text style={profileStyles.buttonText}>Save Macros</Text>
                        <IconSymbol size={20} name="checkmark" color="#FFFBF4" />
                    </Animated.View>
                </TouchableOpacity>

        </View>
        </ScrollView>
        </TouchableWithoutFeedback>
      );
}
