import { StyleSheet } from "react-native";
  
export const chatStyles = StyleSheet.create({
  //the weird spot above the "realtime assistant" top bar
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  container: {
    marginBottom: 50,
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A202C",
  },
  messages: {
    flex: 1,
    //backgroundColor: "#F7FAFC",
    //backgroundColor: "linear-gradient(red, yellow)",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    maxWidth: "85%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: "#4299E1",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#1E477D",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 16,
    width: "50%",
    //minWidth: "",
    alignSelf: "center", // Center horizontally within the parent
    //justifyContent: "space-evenly",
    flexDirection: "row", // Ensures the icon and text are side by side
    padding: 16, // Adds padding around the entire button

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "#FFFBF4",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adds space between icon and text
  },
  sendButton: {
    backgroundColor: "#1E477D",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#EDF2F7",
  },
  loadingDots: {
    fontSize: 24,
    color: "#718096",
    fontWeight: "bold",
  },
});