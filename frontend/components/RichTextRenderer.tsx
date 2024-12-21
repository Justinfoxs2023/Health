import React from 'react';

import HTML from 'react-native-render-html';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

interface IProps {
  /** content 的描述 */
  content: string;
  /** baseStyle 的描述 */
  baseStyle?: object;
}

export const RichTextRenderer: React.FC<IProps> = ({ content, baseStyle = {} }) => {
  const windowWidth = Dimensions.get('window').width;

  const renderers = {
    img: (htmlAttribs: any) => {
      return (
        <Image
          source={{ uri: htmlAttribs.src }}
          style={[styles.image, { width: windowWidth - 32 }]}
          resizeMode="contain"
        />
      );
    },
  };

  const tagsStyles = {
    p: {
      ...styles.paragraph,
      ...baseStyle,
    },
    img: {
      marginVertical: 10,
    },
  };

  return (
    <HTML
      source={{ html: content }}
      renderers={renderers}
      tagsStyles={tagsStyles}
      contentWidth={windowWidth}
    />
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
  image: {
    height: 200,
    backgroundColor: '#f5f5f5',
  },
});
