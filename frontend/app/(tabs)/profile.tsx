import { get_profile, set_profile } from "@/lib/api.js";
import { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
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
import { authStyles } from "@/styles/auth";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/authcontext";
import { diseaseData } from "@/assets/info/diseases";
import { logout } from "@/lib/supabase";

export default function ProfilePage() {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showMacrosForm, setShowMacrosForm] = useState(false);

  const [profileAnim] = useState(new Animated.Value(0));
  const [macrosAnim] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(1));

  const scrollRef = useRef<ScrollView>(null);

  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [allergies, setAllergies] = useState("");
  const [nutritionalGoals, setNutritionalGoals] = useState("");
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDiseases, setFilteredDiseases] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

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
        setSelectedDiseases(res["diseases"] ? res["diseases"].split(",") : []);
        setAllergies(res["allergies"]);
        setNutritionalGoals(res["nutritional_goals"]);
        setDietaryPreferences(res["dietary_preferences"]);

        setAge(res["age"]);
        setSex(res["sex"]);
        setHeight(res["height"]);
        setWeight(res["weight"]);
        setActivityLevel(res["activity_level"]);
        setTargetWeight(res["target_weight"]);
        setOtherInfo(res["other_info"]);

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

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const toggleProfileForm = () => {
    if (showProfileForm) {
      Animated.timing(profileAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowProfileForm(false);
        scrollToTop();
      });
    } else {
      setShowProfileForm(true);
      Animated.timing(profileAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleMacrosForm = () => {
    if (showMacrosForm) {
      Animated.timing(macrosAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowMacrosForm(false);
        scrollToTop();
      });
    } else {
      setShowMacrosForm(true);
      Animated.timing(macrosAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const updateProfile = async () => {
    try {
      await set_profile({
        user,
        diseases: selectedDiseases.join(", "),
        allergies: allergies,
        nutritional_goals: nutritionalGoals,
        dietary_preferences: dietaryPreferences,
        age: age,
        sex: sex,
        height: height,
        weight: weight,
        activity_level: activityLevel,
        target_weight: targetWeight,
        other_info: otherInfo,
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

  const removeDisease = (disease: string) => {
    setSelectedDiseases((prev) => prev.filter((d) => d !== disease));
  };

  const addDisease = (disease: string) => {
    setSelectedDiseases((prev) => [...prev, disease]);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDiseases(
        Object.keys(diseaseData).filter(
          (disease) => !selectedDiseases.includes(disease)
        )
      );
    } else {
      const matches = Object.keys(diseaseData).filter(
        (disease) =>
          disease.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedDiseases.includes(disease)
      );
      setFilteredDiseases(matches);
    }
  }, [searchQuery, selectedDiseases]);


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 150, paddingTop: 50 }}
        style={{ backgroundColor: "#FFF5E3" }}
      >

        <View style={profileStyles.container}>
          <Text style={profileStyles.daHeader}>Profile</Text>

          <Pressable
            onPress={toggleProfileForm}
            style={profileStyles.titleContainer}
          >
            <Text style={profileStyles.title}>
              {showProfileForm ? "Hide Nutrition Info" : "Edit Nutrition Info"}
            </Text>
			{showProfileForm ? (
                    <IconSymbol style={profileStyles.titleIcon} size={40} name="chevron.up" color="#C0BBB2" />
                  ) : (
                    <IconSymbol style={profileStyles.titleIcon} size={40} name="chevron.down" color="#C0BBB2" />
                  )}
          </Pressable>

          <Animated.View
            pointerEvents={showProfileForm ? "auto" : "none"}
            style={{
              opacity: profileAnim,
              transform: [
                {
                  scale: profileAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            }}
          >
            {showProfileForm && (
              <>
                <Text style={profileStyles.header}>Diseases/Conditions</Text>
                <View style={profileStyles.selectedContainer}>
                  {selectedDiseases.map((disease) => (
                    <View key={disease} style={profileStyles.chip}>
                      <Text style={profileStyles.chipText}>{disease}</Text>
                      <Pressable
                        onPress={() => removeDisease(disease)}
                        style={profileStyles.chipButton}
                      >
                        <IconSymbol size={15} name="xmark" color="#C0BBB2" />
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
                    placeholderTextColor={"#C0BBB2"}
                  />
                  {showDropdown ? (
                    <IconSymbol size={15} name="chevron.up" color="#C0BBB2" />
                  ) : (
                    <IconSymbol size={15} name="chevron.down" color="#C0BBB2" />
                  )}
                </Pressable>

                {showDropdown && (
                  <View style={[profileStyles.dropdownList]}>
                    <ScrollView>
                      <FlatList
                        data={filteredDiseases}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                          <Pressable
                            onPress={() => addDisease(item)}
                            style={profileStyles.dropdownItem}
                          >
                            <Text>{item}</Text>
                          </Pressable>
                        )}
                      />
                    </ScrollView>
                  </View>
                )}

                <Text style={profileStyles.header}>Allergies</Text>
                <TextInput
                  style={profileStyles.input}
                  placeholder="Enter any allergies you have..."
                  value={allergies}
                  onChangeText={setAllergies}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />

                <Text style={profileStyles.header}>Nutritional Goals</Text>
                <TextInput
                  style={profileStyles.input}
                  placeholder="Enter any nutritional goals you have..."
                  value={nutritionalGoals}
                  onChangeText={setNutritionalGoals}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />

                <Text style={profileStyles.header}>Dietary Preferences</Text>
                <TextInput
                  style={profileStyles.input}
                  placeholder="Enter any dietary preferences you have..."
                  value={dietaryPreferences}
                  onChangeText={setDietaryPreferences}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />

                <TouchableOpacity
                  style={profileStyles.button}
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
                    <Text style={profileStyles.buttonText}>Save</Text>
                    <IconSymbol size={20} name="checkmark" color="#FFFBF4" />
                  </Animated.View>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          <Pressable
            onPress={toggleMacrosForm}
            style={profileStyles.titleContainer}
          >
            <Text style={profileStyles.title}>
              {showMacrosForm ? "Hide Body Metrics" : "Edit Body Metrics"}
            </Text>
			{showMacrosForm ? (
                    <IconSymbol style={profileStyles.titleIcon} size={40} name="chevron.up" color="#C0BBB2" />
                  ) : (
                    <IconSymbol style={profileStyles.titleIcon} size={40} name="chevron.down" color="#C0BBB2" />
                  )}
          </Pressable>

          <Animated.View
            pointerEvents={showMacrosForm ? "auto" : "none"}
            style={{
              opacity: macrosAnim,
              transform: [
                {
                  scale: macrosAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            }}
          >
            {showMacrosForm && (
              <>
                <TextInput
                  style={profileStyles.input}
                  placeholder="Enter your age..."
                  value={age}
                  onChangeText={setAge}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />
                <TextInput
                  style={profileStyles.input}
                  placeholder="Sex (M/F)"
                  value={sex}
                  onChangeText={setSex}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />
                <TextInput
                  style={profileStyles.input}
                  placeholder="Height (in.)"
                  value={height}
                  onChangeText={setHeight}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />
                <TextInput
                  style={profileStyles.input}
                  placeholder="How much do you weigh? (lbs)"
                  value={weight}
                  onChangeText={setWeight}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />
                <TextInput
                  style={profileStyles.input}
                  placeholder="How many times do you work out weekly?"
                  value={activityLevel}
                  onChangeText={setActivityLevel}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />
                <TextInput
                  style={profileStyles.input}
                  placeholder="What is your target weight? (lbs)"
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />
                <TextInput
                  style={profileStyles.input}
                  placeholder="Any other information?"
                  value={otherInfo}
                  onChangeText={setOtherInfo}
                  autoCapitalize="none"
                  placeholderTextColor={"#C0BBB2"}
                />

                <TouchableOpacity
                  style={profileStyles.button}
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
                    <Text style={profileStyles.buttonText}>Save</Text>
                    <IconSymbol size={20} name="checkmark" color="#FFFBF4" />
                  </Animated.View>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          <View style={authStyles.container}>
          <TouchableOpacity
                  style={[
                    profileStyles.button,
                    { backgroundColor: "#A03535" },
                  ]}
                  onPressIn={handleSubmitIn}
                  onPressOut={handleSubmitOut}
                  onPress={logout}
                  activeOpacity={0.7}
                >
                  <Animated.View
                    style={[
                      profileStyles.buttonContent,
                      { transform: [{ scale }] },
                    ]}
                  >
                    <Text style={profileStyles.buttonText}>Log Out</Text>
                    <IconSymbol size={20} name="checkmark" color="#FFFBF4" />
                  </Animated.View>
                </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}