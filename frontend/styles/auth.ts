import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingBottom: 100,
    justifyContent: "center",
    backgroundColor: "#FFF5E3",
    //backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFBF4",
    backgroundColor: "#FFFBF4",
    borderRadius: 50,
    padding: 12,
    marginBottom: 16,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    color: "#1E2C3D",
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E477D",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 36,
    width: "40%",
    alignSelf: "center", // Center horizontally within the parent
    justifyContent: "space-evenly",
    flexDirection: "row", // Ensures the icon and text are side by side
    padding: 16, // Adds padding around the entire button

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonText: {
    color: "#FFFBF4",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adds space between icon and text
  },
});