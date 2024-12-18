import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, TextInput, StyleSheet } from 'react-native';

interface IProps {
  /** value 的描述 */
  value: string;
  /** onChangeText 的描述 */
  onChangeText: (text: string) => void;
  /** placeholder 的描述 */
  placeholder?: string;
}

export const SearchBar: React.FC<IProps> = ({ value, onChangeText, placeholder = '搜索...' }) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="#999" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
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
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});
