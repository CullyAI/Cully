import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingBottom: 100,
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      marginBottom: 24,
      fontWeight: "bold",
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    message: {
      marginTop: 20,
      fontSize: 16,
      textAlign: "center",
    },
  });