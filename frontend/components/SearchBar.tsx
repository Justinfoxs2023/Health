import React from 'react';

import { Icon } from './Icon';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface IProps {
  /** value 的描述 */
  value: string;
  /** onChangeText 的描述 */
  onChangeText: (text: string) => void;
  /** placeholder 的描述 */
  placeholder?: string;
  /** onSubmit 的描述 */
  onSubmit?: () => void;
}

export const SearchBar: React.FC<IProps> = ({
  value,
  onChangeText,
  placeholder = '搜索',
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
          <Icon name="close" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
});
