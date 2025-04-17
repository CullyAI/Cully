import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
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
    header: {
      fontSize: 16,
      marginBottom: 16,
      fontWeight: "bold",
      textAlign: "left",
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
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
    },
    searchInput: {
        flex: 1,
        padding: 0,
    },
    dropdownList: {
        maxHeight: 200,
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 4,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        padding: 8,
        marginBottom: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    chipText: {
        marginRight: 4,
        fontSize: 14,
    },
    chipButton: {
        padding: 2,
    },
  });