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
});