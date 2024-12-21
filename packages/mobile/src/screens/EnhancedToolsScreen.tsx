import React, { useState, useEffect } from 'react';

import { Surface, Text, IconButton, Searchbar, Chip } from 'react-native-paper';
import { View, Animated, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import { CategoryTabs } from '@/components/CategoryTabs';
import { QuickToolBar } from '@/components/QuickToolBar';
import { SearchSuggestions } from '@/components/SearchSuggestions';
import { ToolGrid } from '@/components/ToolGrid';
import { VoiceSearch } from '@/components/VoiceSearch';
import { useLayout } from '@/hooks/useLayout';
import { useTheme } from '@/hooks/useTheme';

export const EnhancedToolsScreen = () => {
  const theme = useTheme();
  const layout = useLayout();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quickTools, setQuickTools] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);

  // 动画值
  const searchBarHeight = new Animated.Value(0);
  const contentOpacity = new Animated.Value(1);

  useEffect(() => {
    loadQuickTools();
  }, []);

  const loadQuickTools = async () => {
    // 加载用户的快捷工具
    const tools = await getUserQuickTools();
    setQuickTools(tools);
  };

  const toggleSearch = () => {
    Animated.parallel([
      Animated.timing(searchBarHeight, {
        toValue: searchVisible ? 0 : 60,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(contentOpacity, {
        toValue: searchVisible ? 1 : 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setSearchVisible(!searchVisible);
  };

  return (
    <View style={styles.container}>
      {/* 顶部搜索区 */}
      <Animated.View style={[styles.searchContainer, { height: searchBarHeight }]}>
        <Searchbar
          placeholder="搜索健康工具..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
          right={() => <VoiceSearch onResult={setSearchQuery} />}
        />
        <SearchSuggestions
          query={searchQuery}
          visible={searchQuery.length > 0}
          onSelect={tool => navigateToTool(tool)}
        />
      </Animated.View>

      {/* 快捷工具栏 */}
      <QuickToolBar
        tools={quickTools}
        onToolPress={tool => navigateToTool(tool)}
        onReorder={handleReorder}
        style={styles.quickTools}
      />

      {/* 分类标签 */}
      <CategoryTabs
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        style={styles.categories}
      />

      {/* 主要内容区 */}
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <ToolGrid
          category={selectedCategory}
          layout={layout.mainContent}
          onToolPress={tool => navigateToTool(tool)}
          onLongPress={tool => handleToolLongPress(tool)}
        />
      </Animated.View>

      {/* 快捷操作按钮 */}
      <TouchableOpacity style={styles.fab} onPress={toggleSearch}>
        <IconButton
          icon={searchVisible ? 'close' : 'magnify'}
          size={24}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#fff',
    elevation: 4,
    overflow: 'hidden',
  },
  searchBar: {
    margin: 8,
    elevation: 0,
  },
  quickTools: {
    height: 100,
    paddingHorizontal: 8,
  },
  categories: {
    height: 48,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#fff',
    borderRadius: 28,
    elevation: 4,
    zIndex: 99,
  },
});
