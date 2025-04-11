// TODO 04/10/2025: Implement a faster response system using 
// voice activity detection and audio chunks
// It's really hard, but without challenges, what would
// there be to smile about?
// Don't be afraid to care. It does matter.

// import { Audio } from 'expo-av';
// import { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import { send_complete_audio } from '@/lib/socket';

// export default function RealtimeScreen() {
//     const [recording, setRecording] = useState<Audio.Recording | null>(null);
//     const [permissionResponse, requestPermission] = Audio.usePermissions();

//     // Request permission on mount
//     useEffect(() => {
//         if (!permissionResponse) {
//             requestPermission();
//         }
//     }, []);

//     // Start recording once permission is granted
//     useEffect(() => {
//         if (permissionResponse?.granted && !recording) {
//             captureLoop();
//         }
//     }, [permissionResponse]);

//     const startRecording = async () => {
//         try {
//             console.log('Setting audio mode...');
//             await Audio.setAudioModeAsync({
//                 allowsRecordingIOS: true,
//                 playsInSilentModeIOS: true,
//             });

//             console.log('Starting recording...');
//             const { recording } = await Audio.Recording.createAsync(
//                 Audio.RecordingOptionsPresets.HIGH_QUALITY
//             );
//             setRecording(recording);
//             console.log('Recording started');
//             } catch (err) {
//                 console.error('Failed to start recording', err);
//             }
//     };

//     const stopRecording = async () => {
//         console.log('Stopping recording...');
//         if (recording) {
//             await recording.stopAndUnloadAsync();
//             const uri = recording.getURI();
//             console.log('Recording stopped and stored at', uri);
//             setRecording(null);
//         }
//     };

//     const captureLoop = () => {
//         startRecording();

//         setTimeout(() => {
//             stopRecording();
//         }, 3000);
//     }

//     return (
//         <View>
//             <Text>Recording:</Text>
//         </View>
//     );
// }

