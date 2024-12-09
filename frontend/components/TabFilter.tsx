import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Tab {
  id: string;
  name: string;
}

interface Props {
  tabs: Tab[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const TabFilter: React.FC<Props> = ({
  tabs,
  selectedId,
  onChange
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedId === tab.id && styles.selectedTab
            ]}
            onPress={() => onChange(tab.id)}
          >
            <Text style={[
              styles.tabText,
              selectedId === tab.id && styles.selectedText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  scrollContent: {
    paddingHorizontal: 16
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32'
  },
  tabText: {
    fontSize: 14,
    color: '#666'
  },
  selectedText: {
    color: '#2E7D32',
    fontWeight: '500'
  }
}); 