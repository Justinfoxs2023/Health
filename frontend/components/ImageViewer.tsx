import React from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Icon } from './Icon';

interface Props {
  images: string[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
}

export const ImageViewer: React.FC<Props> = ({
  images,
  initialIndex = 0,
  visible,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{ uri: images[currentIndex] }}
          style={{
            width: screenWidth,
            height: screenHeight * 0.7,
            resizeMode: 'contain'
          }}
        />

        {images.length > 1 && (
          <View style={styles.navigation}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.disabled]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Icon name="chevron-left" size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, currentIndex === images.length - 1 && styles.disabled]}
              onPress={handleNext}
              disabled={currentIndex === images.length - 1}
            >
              <Icon name="chevron-right" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  disabled: {
    opacity: 0.5
  },
  counter: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  counterText: {
    color: '#fff',
    fontSize: 14
  }
}); 