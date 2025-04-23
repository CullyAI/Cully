import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { useEffect, useState, useRef } from "react";
import { realtimeStyles, CullyLogo } from "@/styles/realtime";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { send_multimodal, send_audio, send_interruption } from "@/lib/socket";
import { get_recipes } from "@/lib/api";
import { useAuth } from "@/context/authcontext";
import { useNav } from "../navcontext"; // <-- ✅ add this
import { FontAwesome6 } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { MICRO_AUDIO } from "@/constants/audio_settings";
import { IconSymbol } from "@/components/ui/IconSymbol";

type Recipe = {
	title: string,
	steps: string,
};

export default function RealtimeScreen() {
	const [hasCamPermission, setHasCamPermission] = useState(false);
	const [camPermission, requestCamPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);
	const [facing, setFacing] = useState<CameraType>("back");

	const soundRef = useRef<Audio.Sound | null>(null);
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [isThinking, setIsThinking] = useState(false);
	const [cameraOn, setCameraOn] = useState(false);
	const [hasMicPermission, setHasMicPermission] = useState(false);
	const [micPermission, requestMicPermission] = Audio.usePermissions();
	const { user } = useAuth();
	const { hideNav, showNav } = useNav(); // <-- ✅ use nav context

	const [audioQueue, setAudioQueue] = useState<string[]>([]);
	const [isPlaying, setIsPlaying] = useState(false);

	const [showRecipeBar, setShowRecipeBar] = useState(false);
	const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
	const [recipeSelected, setRecipeSelected] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe>({
		title: "No Recipe Selected",
		steps: "Select a recipe above to view steps",
	});

	const addToQueue = (audio: string) => {
		setAudioQueue((prev) => [...prev, audio]);
	};

	const logError = (errMsg: string) => {
		console.error("❌ Realtime generation error:", errMsg);
	};

	const fetchRecipes = async () => {
		try {
			const res: Recipe[] = (await get_recipes(user));

			console.log(res)

			if (res.length === 0) {
				setSavedRecipes([]);
				return;
			}
			
			// Filter recipes to ensure unique titles
			const uniqueRecipes = res.filter(
				(recipe, index, self) =>
					index === self.findIndex((r) => r.title === recipe.title)
			);

			const formattedRecipes = uniqueRecipes.map((recipe) => ({
				title: recipe.title,
				steps: recipe.steps,
			}));

			setSavedRecipes(formattedRecipes);
		} catch (err) {
			console.error("Failed to get recipes", err);
		}
	};

	useEffect(() => {
		fetchRecipes();
	}, []);

	// Microphone and camera permissions //
	useEffect(() => {
		const checkPermissions = async () => {
		if (camPermission?.granted) {
			setHasCamPermission(true);
		} else {
			const permissionResponse = await requestCamPermission();
			setHasCamPermission(permissionResponse.granted);
		}
		};
		checkPermissions();
	}, [camPermission]);

	useEffect(() => {
		const checkPermissions = async () => {
		if (micPermission?.granted) {
			setHasMicPermission(true);
		} else {
			const permissionResponse = await requestMicPermission();
			setHasMicPermission(permissionResponse.granted);
		}
		};
		checkPermissions();
	}, []);

	useEffect(() => {
		if (isPlaying || !audioQueue.length) return;

		let [audio, ...rest] = audioQueue;
		setAudioQueue(rest);
		setIsPlaying(true);
		playAudio({ audio });
	}, [isPlaying, audioQueue]);

	useEffect(() => {
		return () => {
		showNav(); // ✅ Ensure nav bar shows again on unmount
		};
	}, []);

	if (!hasCamPermission || !hasMicPermission) {
		return (
		<View style={realtimeStyles.container}>
			<Text style={realtimeStyles.text}>
				Camera permission is required to use this feature.
			</Text>
			{!hasCamPermission && (
			<Pressable
				onPress={async () => {
				const permissionResponse = await requestCamPermission();
				setHasCamPermission(permissionResponse.granted);
				}}
			>
				<Text>Grant Camera Permission</Text>
			</Pressable>
			)}
			{!hasMicPermission && (
			<Pressable
				onPress={async () => {
				const permissionResponse = await requestMicPermission();
				setHasMicPermission(permissionResponse.granted);
				}}
			>
				<Text>Grant Microphone Permission</Text>
			</Pressable>
			)}
		</View>
		);
	}

	const takePicture = async () => {
		const photo = await cameraRef.current?.takePictureAsync({
		base64: true,
		quality: 0.3,
		skipProcessing: true,
		});
		return photo?.base64;
	};

	const toggleFacing = () => {
		setFacing((prev) => (prev === "back" ? "front" : "back"));
	};

	const startRecording = async () => {
		try {
			if (recording) {
				console.log("Stopping and unloading existing recording...");
				await recording.stopAndUnloadAsync();
				setRecording(null);
			}
	
			if (soundRef.current) {
				await soundRef.current.stopAsync();
				await soundRef.current.unloadAsync();
				soundRef.current = null;
				send_interruption(user);
			}
	
			hideNav(); // ✅ Hide nav bar
			setIsPlaying(false);
			setIsRecording(true);
			setIsThinking(false);
			setAudioQueue([]);
	
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
	
			// Assign the result to a temporary variable
			const recordingResult = await Audio.Recording.createAsync(MICRO_AUDIO);
			setRecording(recordingResult.recording); // Use the recording from the result
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	};

	const stopRecording = async () => {
		try {
		if (!recording) return;

		await recording.stopAndUnloadAsync();
		const audio_uri = recording.getURI();
		setRecording(null);

		let base64Image = null;
		if (cameraOn) {
			base64Image = await takePicture();
		}
		

		setIsRecording(false);
		setIsThinking(true);

		if (audio_uri) {
			const base64Audio = await FileSystem.readAsStringAsync(audio_uri, {
			encoding: FileSystem.EncodingType.Base64,
			});

			await FileSystem.deleteAsync(audio_uri);

			if (cameraOn) {
			send_multimodal(
				{ 
					user, 
					recipe: selectedRecipe, 
					audio: base64Audio, 
					image: base64Image 
				},
				addToQueue,
				logError
			);
			} else {
				send_audio({ 
						user, 
						recipe: selectedRecipe, 
						audio: base64Audio 
					}, 
					addToQueue, 
					logError
				);
			}
		}
		} catch (error) {
		console.error("Error during recording stop:", error);
		} finally {
		showNav(); // ✅ Always show nav bar again
		}
	};

	const playAudio = async ({ audio }: { audio: string }) => {
		setIsThinking(false);
		try {
		const path = `${FileSystem.documentDirectory}response_${Date.now()}.mp3`;
		await FileSystem.writeAsStringAsync(path, audio, {
			encoding: FileSystem.EncodingType.Base64,
		});

		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			playsInSilentModeIOS: true,
			staysActiveInBackground: true,
			shouldDuckAndroid: true,
			playThroughEarpieceAndroid: false,
		});

		const soundObject = new Audio.Sound();
		soundRef.current = soundObject;

		await soundObject.loadAsync({ uri: path });
		soundObject.setOnPlaybackStatusUpdate((status) => {
			if (status.isLoaded && status.didJustFinish) {
			setIsPlaying(false);
			}
		});

		await soundObject.playAsync();
		} catch (error) {
		console.error("Failed to play audio:", error);
		}
	};

	const handleSelection = (recipe: Recipe) => {
		if (recipe === selectedRecipe) removeRecipe();
		else {
			setSelectedRecipe(recipe);
			setRecipeSelected(true);
		}
	}

	const removeRecipe = () => {
		setRecipeSelected(false);
		setSelectedRecipe({
			title: "No Recipe Selected",
			steps: "Select a recipe above to view steps",
		});
	}

	return (
		<>
		{!cameraOn && (
			<View style={realtimeStyles.recipeBar}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<Pressable
					onPress={fetchRecipes} // ← reuse the fetch logic
					style={realtimeStyles.refreshButton}
				>
					<Text style={realtimeStyles.refreshButtonText}>↻</Text>
				</Pressable>

				{savedRecipes.map((recipe, index) => (
					<Pressable
					key={index}
					onPress={() => handleSelection(recipe)}
					style={
						selectedRecipe === recipe
						? realtimeStyles.selectedRecipeChip
						: realtimeStyles.recipeChip
					}
					>
					<Text style={realtimeStyles.recipeChipText}>{recipe.title}</Text>
					</Pressable>
				))}
				</ScrollView>
			</View>
			)}

					
		<Pressable

			onPressIn={startRecording}
			onPressOut={stopRecording}
			style={{ flex: 1 }}
			>
			<View style={realtimeStyles.container} pointerEvents="box-none">
				{cameraOn ? (
					<View
						style={[
						realtimeStyles.cameraContainer,
						isPlaying
							? realtimeStyles.playingBorder
							: realtimeStyles.notPlayingBorder,
						isThinking && realtimeStyles.thinkingBorder,
						]}
					>
						<CameraView
						ref={cameraRef}
						style={realtimeStyles.camera}
						facing={facing}
						animateShutter={false}
						>
						<Pressable
							onPress={toggleFacing}
							style={realtimeStyles.toggleButton}
							onPressIn={(e) => e.stopPropagation()}
							onPressOut={(e) => e.stopPropagation()}
						>
							<FontAwesome6 name="rotate-left" size={32} color="white" />
						</Pressable>
						</CameraView>
					</View>
					) : recipeSelected ? (
						<View style={realtimeStyles.recipeContainer} pointerEvents="box-none">
							<Pressable
								onPress={removeRecipe}
								style={realtimeStyles.closeButton}
								>
								<IconSymbol size={15} name="xmark" color="#C0BBB2" />
							</Pressable>
							<ScrollView>
								<Text style={realtimeStyles.recipeTitle}>
									{selectedRecipe.title}
								</Text>
								<Text style={realtimeStyles.recipeSteps}>
									{selectedRecipe.steps}
								</Text>
							</ScrollView>
						</View>
					  
						) : (
							<View
								style={[
								realtimeStyles.logoContainer,
								isPlaying
									? realtimeStyles.playingBorder
									: realtimeStyles.notPlayingBorder,
								isThinking && realtimeStyles.thinkingBorder,
								]}
							>
								<Image
									source={CullyLogo}
									style={realtimeStyles.logoImage}
									resizeMode="cover"
								/>
							</View>
						)
					}

				<View style={realtimeStyles.buttonGroup} pointerEvents="box-none">
				<Pressable
					onPressIn={(e) => {
					e.stopPropagation();
					setCameraOn((prev) => !prev);
					}}
					style={({ pressed }) => [
					realtimeStyles.recordButton,
					{ backgroundColor: pressed ? "#D2B378" : "#FFF5E3" },
					]}
				>
					<IconSymbol
						size={35}
						name={cameraOn ? "camera.fill" : "camera"}
						color="#1E2C3D"
					/>
				</Pressable>
				</View>
			</View>

		</Pressable>
		</>
	);
}
