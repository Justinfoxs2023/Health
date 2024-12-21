import React from 'react';

import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ITab {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
}

interface IProps {
  /** tabs 的描述 */
  tabs: ITab[];
  /** selectedId 的描述 */
  selectedId: string;
  /** onChange 的描述 */
  onChange: (id: string) => void;
}

export const TabFilter: React.FC<IProps> = ({ tabs, selectedId, onChange }) => {
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
            style={[styles.tab, selectedId === tab.id && styles.selectedTab]}
            onPress={() => onChange(tab.id)}
          >
            <Text style={[styles.tabText, selectedId === tab.id && styles.selectedText]}>
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
    borderBottomColor: '#eee',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
});
