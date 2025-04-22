import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingBottom: 100,
    justifyContent: "center",
    backgroundColor: "#FFF5E3",
    //backgroundColor: "#FFFBF4",
    //backgroundColor: "#fff",
  },
  daHeader: {
    marginTop: 40,
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    marginTop: 24,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#FFFBF4",

    color: "#1E2C3D",
  },

  titleContainer: {
    fontSize: 24,
    marginBottom: 24,
    marginTop: 24,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#FFFBF4",
    borderRadius: 40,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    color: "#1E2C3D",
  },

  logout: {
	marginTop: 60,
    color: "#FF0000",
    alignSelf: "center",
    fontSize: 15,
  },
  header: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "left",

    color: "#1E2C3D",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFBF4",
    backgroundColor: "#FFFBF4",
    //borderColor: "#ccc", borderColor: "#D2B378",
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
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 0,
  },
  dropdownList: {
    maxHeight: 200,
    width: "100%",
    backgroundColor: "#FFFBF4",
    //backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F2E9DA",
    borderRadius: 20,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBF4",
    //backgroundColor: '#f0f0f0',FFF5E3
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  chipText: {
    marginRight: 4,
    fontSize: 14,
    color: "#1E2C3D",
  },
  chipButton: {
    padding: 8,
  },
  button: {
    backgroundColor: "#1E477D",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 16,
    width: "50%",
    //minWidth: "",
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

  buttonMacros: {
    backgroundColor: "#1E477D",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 16,
    width: "55%",
    //minWidth: "",
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


export const macroStyles = StyleSheet.create({
  container: {
    position: "relative",
    top: 30,
    padding: 30,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  output: {
    borderWidth: 1,
    borderColor: "#aaa",
    color: "#000",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  responseBox: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 12,
    backgroundColor: "#D2B378",
  },
  responseText: {
    fontSize: 16,
    color: "#2e7d32",
    lineHeight: 22,
  },
  header: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
});