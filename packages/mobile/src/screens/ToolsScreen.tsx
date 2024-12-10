import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { 
  Text,
  Card,
  Icon,
  Button,
  Divider 
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ToolType, ToolCategory } from '@/types/tool-features';
import { fetchUserTools, updateToolUsage } from '@/store/actions/tools';
import { ToolCard } from '@/components/ToolCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { useTheme } from '@/hooks/useTheme';

export const ToolsScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { tools, loading } = useSelector(state => state.tools);
  const userProfile = useSelector(state => state.user.profile);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchUserTools());
    } finally {
      setRefreshing(false);
    }
  };

  const handleToolPress = async (tool: ToolFeature) => {
    try {
      // 记录工具使用
      await dispatch(updateToolUsage(tool.type));
      
      // 导航到对应工具页面
      navigation.navigate('ToolDetail', { tool });
    } catch (error) {
      console.error('Failed to use tool:', error);
    }
  };

  const filteredTools = selectedCategory
    ? tools.filter(tool => tool.category === selectedCategory)
    : tools;

  return (
    <View style={styles.container}>
      <CategoryFilter
        categories={Object.values(ToolCategory)}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadTools} />
        }
      >
        {filteredTools.map(tool => (
          <ToolCard
            key={tool.type}
            tool={tool}
            onPress={() => handleToolPress(tool)}
            style={styles.toolCard}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  toolCard: {
    margin: 8
  }
}); 