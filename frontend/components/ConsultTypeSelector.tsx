import React from 'react';

import { Icon } from './Icon';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IConsultType {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** icon 的描述 */
  icon: string;
  /** description 的描述 */
  description: string;
}

interface IProps {
  /** types 的描述 */
  types: IConsultType[];
  /** selectedId 的描述 */
  selectedId: string;
  /** onChange 的描述 */
  onChange: (id: string) => void;
}

export const ConsultTypeSelector: React.FC<IProps> = ({ types, selectedId, onChange }) => {
  return (
    <View style={styles.container}>
      {types.map(type => (
        <TouchableOpacity
          key={type.id}
          style={[styles.typeCard, selectedId === type.id && styles.selectedCard]}
          onPress={() => onChange(type.id)}
        >
          <Icon name={type.icon} size={24} color={selectedId === type.id ? '#2E7D32' : '#666'} />
          <Text style={[styles.typeName, selectedId === type.id && styles.selectedText]}>
            {type.name}
          </Text>
          <Text style={styles.description}>{type.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  typeCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#E8F5E9',
  },
  typeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  selectedText: {
    color: '#2E7D32',
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
