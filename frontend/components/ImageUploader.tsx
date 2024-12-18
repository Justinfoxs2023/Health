import React from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Icon } from './Icon';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

interface IProps {
  /** images 的描述 */
  images: string[];
  /** onImagesChange 的描述 */
  onImagesChange: (images: string[]) => void;
  /** maxImages 的描述 */
  maxImages?: number;
}

export const ImageUploader: React.FC<IProps> = ({ images, onImagesChange, maxImages = 9 }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('需要访问相册权限才能上传图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImagesChange([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      {images.map((uri, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={{ uri }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
            <Icon name="close" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}

      {images.length < maxImages && (
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Icon name="add" size={24} color="#999" />
          <Text style={styles.addText}>添加图片</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  imageContainer: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
