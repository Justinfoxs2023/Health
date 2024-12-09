import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface Tab {
  id: string;
  name: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
}

export const TabFilter: React.FC<Props> = ({
  tabs,
  activeTab,
  onChangeTab
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onChangeTab(tab.id)}
        >
          <Text
            style={[
              styles.text,
              activeTab === tab.id && styles.activeText
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff'
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8
  },
  activeTab: {
    backgroundColor: '#2E7D32'
  },
  text: {
    fontSize: 14,
    color: '#666'
  },
  activeText: {
    color: '#fff'
  }
}); 