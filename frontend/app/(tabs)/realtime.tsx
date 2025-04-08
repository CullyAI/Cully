import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function RealtimeScreen() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    // // Request permission on mount
    // useEffect(() => {
    //     if (!permissionResponse) {
    //         requestPermission();
    //     }
    // }, []);

    // // Start recording once permission is granted
    // useEffect(() => {
    //     if (permissionResponse?.granted && !recording) {
    //         startRecording();
    //     }
    // }, [permissionResponse]);

    // const startRecording = async () => {
    //     try {
    //         console.log('Setting audio mode...');
    //         await Audio.setAudioModeAsync({
    //             allowsRecordingIOS: true,
    //             playsInSilentModeIOS: true,
    //         });

    //         console.log('Starting recording...');
    //         const { recording } = await Audio.Recording.createAsync(
    //             Audio.RecordingOptionsPresets.HIGH_QUALITY
    //         );
    //         setRecording(recording);
    //         console.log('Recording started');
    //         } catch (err) {
    //             console.error('Failed to start recording', err);
    //         }
    // };

    return (
        <View>
        <Text>Recording:</Text>
        </View>
    );
}

