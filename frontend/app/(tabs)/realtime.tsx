import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { send_complete_audio } from '@/lib/socket';
import { useAuth } from '@/context/authcontext';
import { Camera } from 'expo-camera';

export default function RealtimeScreen() {
    const cameraRef = useRef<Camera | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const { user } = useAuth()

    // Request permission on mount
    useEffect(() => {
        if (!permissionResponse) {
            requestPermission();
        }
    }, []);

    const startRecording = async () => {
        try {
            console.log('Setting audio mode...');
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording...');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

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
            const uri = recording.getURI();
            console.log('Recording stopped and stored at', uri);
            setRecording(null);

            if (uri) {
                // Convert to base64
                const base64Audio = await FileSystem.readAsStringAsync(uri, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                send_complete_audio(
                    { 
                        user,
                        audio: base64Audio 
                    },
                    (audio: string) => {
                        handleAudioResponse({ audio });
                    }
                );
            }
        }
    };

    const handleAudioResponse = async ({ audio }: { audio: string }) => {
        try {
            // Decode base64 to binary
            const soundObject = new Audio.Sound();
            const path = `${FileSystem.documentDirectory}response.mp3`;
        
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
            await soundObject.setVolumeAsync(1.0);
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