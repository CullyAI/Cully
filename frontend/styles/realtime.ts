import { StyleSheet } from "react-native";

export const CullyLogo = require("../assets/images/cully_logo.png");

const element = document.getElementById("myElement");

if (element) {
  element.style.background = "linear-gradient(to right, red, blue)";
}


export const realtimeStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    logoContainer: {
        position: 'absolute',
        bottom: 300,
        width: 350,
        height: 350,
        borderRadius: 175,  
        overflow: 'hidden',
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    cameraContainer: {
        position: 'absolute',
        bottom: 250,
        width: 350,
        height: 525,
        borderRadius: 50,  
        overflow: 'hidden',
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    buttonGroup: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        alignItems: 'center',
    },    
    toggleButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
    },
    buttonContainer: {
        marginVertical: 20,
        width: '80%',
        borderRadius: 10,
        overflow: 'hidden', // Ensures the button respects the border radius
    },
    text: {
        fontSize: 18,
        color: '#333',
        marginTop: 10,
    },
    recordButton: {
        padding: 16,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    playingBorder: {
        borderWidth: 4,
        borderColor: 'limegreen',
    },
    notPlayingBorder: {
        borderWidth: 4,
        borderColor: 'grey',
    },
    thinkingBorder: {
        borderWidth: 4,
        borderColor: 'blue',
    },
    recordButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});