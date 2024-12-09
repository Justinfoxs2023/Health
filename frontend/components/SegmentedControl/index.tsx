import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl: React.FC<Props> = ({
  values,
  selectedIndex,
  onChange
}) => {
  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.segment,
            index === selectedIndex && styles.selectedSegment,
            index === 0 && styles.firstSegment,
            index === values.length - 1 && styles.lastSegment
          ]}
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              styles.text,
              index === selectedIndex && styles.selectedText
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 2
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center'
  },
  selectedSegment: {
    backgroundColor: '#fff',
    borderRadius: 6
  },
  firstSegment: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6
  },
  lastSegment: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6
  },
  text: {
    fontSize: 14,
    color: '#666'
  },
  selectedText: {
    color: '#2E7D32',
    fontWeight: '500'
  }
}); 