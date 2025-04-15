import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { send_complete_audio } from '@/lib/socket';
import { useAuth } from '@/context/authcontext';
import { FontAwesome6 } from "@expo/vector-icons";
import {
    CameraType,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import { MICRO_AUDIO } from '@/constants/audio_settings';


export default function RealtimeScreen() {
    const [hasCamPermission, setHasCamPermission] = useState(false);
    const [camPermission, requestCamPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState<CameraType>("back");

    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [hasMicPermission, setHasMicPermission] = useState(false);
    const [micPermission, requestMicPermission] = Audio.usePermissions();
    const { user } = useAuth()

    const [audioQueue, setAudioQueue] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);


    const addToQueue = (audio: string) => {
        setAudioQueue(prev => [...prev, audio]);
    };
      

    // Request camera permission on mount
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


    // Request microphone permission on mount
    useEffect(() => {
        const checkPermissions = async () => {
            console.log(micPermission)
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
        console.log("Play effect triggered");
        console.log("Audio queue:", audioQueue.length);
        if (isPlaying || !audioQueue.length) return;
        
        let [audio, ...rest] = audioQueue;
        setAudioQueue(rest);
        setIsPlaying(true);
        playAudio({ audio: audio });

    }, [isPlaying, audioQueue])

    // Plead for camera permission
    if (!hasCamPermission || !hasMicPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    Camera permission is required to use this feature.
                </Text>

                {!hasCamPermission && <Button
                    title="Grant Camera Permission"
                    onPress={async () => {
                        const permissionResponse = await requestCamPermission();
                        setHasCamPermission(permissionResponse.granted);
                    }}
                />}

                {!hasMicPermission && <Button
                    title="Grant Microphone Permission"
                    onPress={async () => {
                        const permissionResponse = await requestCamPermission();
                        setHasCamPermission(permissionResponse.granted);
                    }}
                />}
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
            console.log('Setting audio mode...');
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording...');
            const { recording } = await Audio.Recording.createAsync(MICRO_AUDIO);

            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        console.log('Stopping recording...');
        if (recording) {
            await recording.stopAndUnloadAsync();
            const audio_uri = recording.getURI();
            console.log('Recording stopped and stored at', audio_uri);
            setRecording(null);

            const fileInfo = await FileSystem.getInfoAsync(recording.getURI()!);
            if (fileInfo.exists) {
                console.log("Final audio size (KB):", fileInfo.size / 1024);
            } else {
                console.log("Audio file does not exist");
            }

            const base64Image = await takePicture();

            if (audio_uri) {
                // Convert to base64
                const base64Audio = await FileSystem.readAsStringAsync(audio_uri, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                await FileSystem.deleteAsync(audio_uri);

                send_complete_audio(
                    { 
                        user,
                        audio: base64Audio,
                        image: base64Image,
                    },
                    (audio: string) => {
                        console.log("Received audio");
                        addToQueue(audio);
                    },
                    (errMsg: string) => {
                        console.error("❌ Realtime generation error:", errMsg);
                    },
                );
            }
        }
    };

    const playAudio = async ({ audio }: { audio: string }) => {
        try {
            // Decode base64 to binary
            const soundObject = new Audio.Sound();
            const path = `${FileSystem.documentDirectory}response_${Date.now()}.mp3`;
        
            // Write audio to local file
            await FileSystem.writeAsStringAsync(path, audio, {
                encoding: FileSystem.EncodingType.Base64,
            });
            
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false
            });
    
            // Load and play audio
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

    const recordButton = () => {
        if (recording) {
            return <Button title="Stop Recording" onPress={stopRecording}/>;
        } else {
            return <Button title="Start Recording" onPress={startRecording}/>;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                    animateShutter={false}
                >
                    <Pressable onPress={toggleFacing} style={styles.toggleButton}>
                        <FontAwesome6 name="rotate-left" size={32} color="white" />
                    </Pressable>
                </CameraView>
            </View>
            {recordButton()}
            <Text style={styles.text}>Recording: {recording ? 'Yes' : 'No'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    cameraContainer: {
        width: 350, // Set the width of the camera box
        height: 550, // Set the height of the camera box
        borderRadius: 10, // Optional: Add rounded corners
        overflow: 'hidden', // Ensure the camera content respects the border radius
        backgroundColor: '#000', // Optional: Add a background color for better contrast
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: "100%",
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
});