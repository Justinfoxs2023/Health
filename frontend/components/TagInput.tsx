import React from 'react';

import { Icon } from './Icon';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IProps {
  /** tags 的描述 */
  tags: string[];
  /** onTagsChange 的描述 */
  onTagsChange: (tags: string[]) => void;
  /** placeholder 的描述 */
  placeholder?: string;
  /** maxTags 的描述 */
  maxTags?: number;
}

export const TagInput: React.FC<IProps> = ({
  tags,
  onTagsChange,
  placeholder = '添加标签',
  maxTags = 5,
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleAddTag = () => {
    if (inputValue.trim() && tags.length < maxTags) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(index)} style={styles.removeButton}>
              <Icon name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {tags.length < maxTags && (
        <View style={styles.inputContainer}>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleAddTag}
            placeholder={placeholder}
            style={styles.input}
            returnKeyType="done"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
});
