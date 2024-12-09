import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';

interface ConsultType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Props {
  types: ConsultType[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const ConsultTypeSelector: React.FC<Props> = ({
  types,
  selectedId,
  onChange
}) => {
  return (
    <View style={styles.container}>
      {types.map(type => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeCard,
            selectedId === type.id && styles.selectedCard
          ]}
          onPress={() => onChange(type.id)}
        >
          <Icon
            name={type.icon}
            size={24}
            color={selectedId === type.id ? '#2E7D32' : '#666'}
          />
          <Text style={[
            styles.typeName,
            selectedId === type.id && styles.selectedText
          ]}>
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
    marginHorizontal: -8
  },
  typeCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  selectedCard: {
    backgroundColor: '#E8F5E9'
  },
  typeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    marginBottom: 4
  },
  selectedText: {
    color: '#2E7D32'
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  }
}); 