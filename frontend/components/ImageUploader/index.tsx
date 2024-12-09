import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ImagePicker } from '../ImagePicker';

interface Props {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<Props> = ({
  images,
  onImagesChange,
  maxImages = 9
}) => {
  const [pickerVisible, setPickerVisible] = React.useState(false);

  const handleSelect = (image: any) => {
    onImagesChange([...images, image.uri]);
    setPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      {images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.image} />
      ))}
      {images.length < maxImages && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setPickerVisible(true)}
        >
          <Text>+</Text>
        </TouchableOpacity>
      )}
      <ImagePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12
  },
  image: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8
  },
  addButton: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center'
  }
}); 