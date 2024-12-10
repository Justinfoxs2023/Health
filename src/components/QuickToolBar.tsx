import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity 
} from 'react-native';
import { Surface, Text, Icon } from 'react-native-paper';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useTheme } from '@/hooks/useTheme';
import { ToolType } from '@/types/tool-features';

interface QuickToolProps {
  tools: ToolType[];
  onToolPress: (tool: ToolType) => void;
  onReorder: (tools: ToolType[]) => void;
  style?: any;
}

export const QuickToolBar: React.FC<QuickToolProps> = ({
  tools,
  onToolPress,
  onReorder,
  style
}) => {
  const theme = useTheme();

  const renderTool = ({ item, drag, isActive }) => (
    <TouchableOpacity
      onLongPress={drag}
      onPress={() => onToolPress(item)}
      style={[
        styles.toolItem,
        isActive && styles.toolItemActive,
        { backgroundColor: theme.colors.surface }
      ]}
    >
      <Surface style={styles.iconContainer}>
        <Icon 
          name={item.icon} 
          size={24} 
          color={theme.colors.primary} 
        />
      </Surface>
      <Text 
        style={styles.toolName}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <DraggableFlatList
        data={tools}
        renderItem={renderTool}
        keyExtractor={(item) => item.type}
        horizontal
        onDragEnd={({ data }) => onReorder(data)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  toolItem: {
    width: 80,
    height: 80,
    margin: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  toolItemActive: {
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  toolName: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 