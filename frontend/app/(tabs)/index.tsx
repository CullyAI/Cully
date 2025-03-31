// frontend/HomeScreen.tsx

import React, { useState, useRef } from 'react';
import { Image, StyleSheet, Button, View, Alert, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';

// ⚡ Setup Supabase client directly
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setImage(URL.createObjectURL(f));
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('No image selected');
      return;
    }
    setUploading(true);

    try {
      const fileName = `${Date.now()}.jpeg`;
      let uploadData;

      if (Platform.OS === 'web' && file) {
        uploadData = await supabase.storage
          .from('user-uploads')
          .upload(fileName, file, { contentType: file.type });
      } else {
        const response = await fetch(image);
        const blob = await response.blob();
        uploadData = await supabase.storage
          .from('user-uploads')
          .upload(fileName, blob, { contentType: 'image/jpeg' });
      }

      if (uploadData.error) {
        throw uploadData.error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName);

      Alert.alert('✅ Upload Successful', `Public URL: ${publicUrlData.publicUrl}`);
      console.log('Public URL:', publicUrlData.publicUrl);

    } catch (err: any) {
      console.error(err);
      Alert.alert('❌ Upload Error', err.message || 'Unexpected error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="📤 Choose or Capture Image" onPress={pickImage} />
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      {image && !uploading && <Button title="⬆️ Upload Image" onPress={uploadImage} />}
      {uploading && <ActivityIndicator size="large" color="#000" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
