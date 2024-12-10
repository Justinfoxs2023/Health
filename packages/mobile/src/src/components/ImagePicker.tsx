import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

interface ImagePickerProps {
  children: React.ReactNode;
  onImageSelected: (image: any) => void;
}

export const ImagePicker = ({ children, onImageSelected }: ImagePickerProps) => {
  const handlePress = async () => {
    const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('需要访问相册权限才能选择图片');
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onImageSelected(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 