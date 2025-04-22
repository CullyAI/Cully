// styles/realtime.ts
import { StyleSheet } from "react-native";

export const CullyLogo = require("../assets/images/cully_logo.png");

export const realtimeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F3FF",
    position: "relative",
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
    bottom: 115,
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
  recordButton: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
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
  recordButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
