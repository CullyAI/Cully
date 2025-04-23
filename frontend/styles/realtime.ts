// styles/realtime.ts
import { StyleSheet } from "react-native";

export const CullyLogo = require("../assets/images/cully_logo.png");

export const realtimeStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E9F3FF",
		position: "relative",
	},
	recipeBar: {
		position: 'absolute',
		top: 50,
		left: 0,
		right: 0,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: '#FFFFFF',
		zIndex: 10,
	},
	recipeChip: {
		backgroundColor: "#FFF5E3",
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginHorizontal: 5,
	},
	selectedRecipeChip: {
		backgroundColor: "#000000",
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginHorizontal: 5,
	},
	recipeChipText: {
		fontWeight: "600",
		color: "#1E2C3D",
	},
	recipeContainer: {
		position: "absolute",
		bottom: 250,
		left: 20,
		right: 20,
		maxHeight: 800,
		backgroundColor: "#FFF5E3",
		borderRadius: 16,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	recipeTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1E2C3D",
		marginBottom: 8,
	},
	recipeSteps: {
		fontSize: 14,
		color: "#1E2C3D",
		lineHeight: 20,
	},
	  
	logoContainer: {
		position: "absolute",
		bottom: 300,
		width: 350,
		height: 350,
		borderRadius: 175,
		overflow: "hidden",
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
	},
	logoImage: {
		width: "100%",
		height: "100%",
		borderColor: "#fff",
	},
	cameraContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
	},
	camera: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	buttonGroup: {
		position: "absolute",
		bottom: 100,
		alignSelf: "center",
		zIndex: 2,
		//backgroundColor: "rgba(0, 0, 0, 0.5)",
		padding: 10,
		borderRadius: 10,
	},
	toggleButton: {
		position: "absolute",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		padding: 8,
		borderRadius: 100,
		bottom: 120,
		right: 20,
		zIndex: 2,
	},
	buttonContainer: {
		marginVertical: 20,
		width: "80%",
		borderRadius: 10,
		overflow: "hidden",
	},
	text: {
		fontSize: 18,
		color: "#333",
		marginTop: 10,
	},
	cameraButton: {},
	recordButton: {
		padding: 16,
		borderRadius: 100,
		marginVertical: 10,
		alignItems: "center",

		// iOS shadow
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	playingBorder: {
		borderWidth: 4,
		borderColor: "limegreen",
	},
	notPlayingBorder: {
		borderWidth: 4,
		borderColor: "grey",
	},
	thinkingBorder: {
		borderWidth: 4,
		borderColor: "blue",
	},
	recordingBorder: {
		borderWidth: 4,
		borderColor: "white",
		borderStyle: "solid",
	},
	recordButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	closeButton: {
		position: "absolute", // Position it absolutely within the parent
		top: 10, // Adjust the distance from the top
		right: 10, // Adjust the distance from the right
		padding: 8, // Add some padding for better touch area
		backgroundColor: "#FFF5E3", // Optional: Add a background color to match the box
		borderRadius: 20, // Optional: Make it circular
		zIndex: 2, // Ensure it appears above other elements
	},
});
