import React from 'react';

import ImageZoom from 'react-native-image-pan-zoom';
import { Dimensions } from 'react-native';
import { Image, TouchableOpacity, StyleSheet, Modal, View } from 'react-native';

interface IProps {
  /** uri 的描述 */
  uri: string;
  /** width 的描述 */
  width?: number;
  /** height 的描述 */
  height?: number;
}

export const ImageViewer: React.FC<IProps> = ({ uri, width = 200, height = 200 }) => {
  const [visible, setVisible] = React.useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image source={{ uri }} style={[styles.image, { width, height }]} resizeMode="cover" />
      </TouchableOpacity>

      <Modal visible={visible} transparent={true}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <ImageZoom
            cropWidth={screenWidth}
            cropHeight={screenHeight}
            imageWidth={screenWidth}
            imageHeight={screenHeight}
          >
            <Image
              source={{ uri }}
              style={{
                width: screenWidth,
                height: screenHeight,
              }}
              resizeMode="contain"
            />
          </ImageZoom>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '200',
  },
});
