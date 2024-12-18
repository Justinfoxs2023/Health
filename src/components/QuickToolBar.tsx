import React from 'react';

import DraggableFlatList from 'react-native-draggable-flatlist';
import { Surface, Text, Icon } from 'react-native-paper';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ToolType } from '@/types/tool-features';
import { useTheme } from '@/hooks/useTheme';

interface IQuickToolProps {
  /** tools 的描述 */
    tools: import("D:/Health/src/types/tool-features").ToolType.FOOD_SEARCH | import("D:/Health/src/types/tool-features").ToolType.FOOD_SCANNER | import("D:/Health/src/types/tool-features").ToolType.NUTRITION_CALC | import("D:/Health/src/types/tool-features").ToolType.MEAL_PLANNER | import("D:/Health/src/types/tool-features").ToolType.RECIPE_MAKER | import("D:/Health/src/types/tool-features").ToolType.DIET_ANALYSIS | import("D:/Health/src/types/tool-features").ToolType.FOOD_DIARY | import("D:/Health/src/types/tool-features").ToolType.RESTAURANT_GUIDE | import("D:/Health/src/types/tool-features").ToolType.SEASONAL_FOOD | import("D:/Health/src/types/tool-features").ToolType.DIET_RECOMMEND | import("D:/Health/src/types/tool-features").ToolType.VITAL_MONITOR | import("D:/Health/src/types/tool-features").ToolType.WEIGHT_TRACKER | import("D:/Health/src/types/tool-features").ToolType.SLEEP_MONITOR | import("D:/Health/src/types/tool-features").ToolType.MOOD_TRACKER | import("D:/Health/src/types/tool-features").ToolType.PERIOD_TRACKER | import("D:/Health/src/types/tool-features").ToolType.BLOOD_PRESSURE | import("D:/Health/src/types/tool-features").ToolType.GLUCOSE_MONITOR | import("D:/Health/src/types/tool-features").ToolType.SYMPTOM_CHECKER | import("D:/Health/src/types/tool-features").ToolType.MEDICINE_REMIND | import("D:/Health/src/types/tool-features").ToolType.HEALTH_REPORT | import("D:/Health/src/types/tool-features").ToolType.EXERCISE_PLAN | import("D:/Health/src/types/tool-features").ToolType.WORKOUT_TRACKER | import("D:/Health/src/types/tool-features").ToolType.STEP_COUNTER | import("D:/Health/src/types/tool-features").ToolType.POSTURE_CHECK | import("D:/Health/src/types/tool-features").ToolType.TRAINING_VIDEO | import("D:/Health/src/types/tool-features").ToolType.SPORTS_TIMER | import("D:/Health/src/types/tool-features").ToolType.MUSCLE_MAP | import("D:/Health/src/types/tool-features").ToolType.CALORIE_COUNTER | import("D:/Health/src/types/tool-features").ToolType.RECOVERY_GUIDE | import("D:/Health/src/types/tool-features").ToolType.FITNESS_TEST | import("D:/Health/src/types/tool-features").ToolType.TCM_DIAGNOSIS | import("D:/Health/src/types/tool-features").ToolType.MERIDIAN_GUIDE | import("D:/Health/src/types/tool-features").ToolType.ACUPOINT_MAP | import("D:/Health/src/types/tool-features").ToolType.MASSAGE_GUIDE | import("D:/Health/src/types/tool-features").ToolType.HERBAL_LIBRARY | import("D:/Health/src/types/tool-features").ToolType.HEALTH_PRESERVE | import("D:/Health/src/types/tool-features").ToolType.SEASON_HEALTH | import("D:/Health/src/types/tool-features").ToolType.MEDITATION_GUIDE | import("D:/Health/src/types/tool-features").ToolType.TCM_RECIPE | import("D:/Health/src/types/tool-features").ToolType.QIGONG_EXERCISE | import("D:/Health/src/types/tool-features").ToolType.POST_CREATOR | import("D:/Health/src/types/tool-features").ToolType.CHALLENGE_JOINER | import("D:/Health/src/types/tool-features").ToolType.GROUP_CHAT | import("D:/Health/src/types/tool-features").ToolType.EXPERT_QA | import("D:/Health/src/types/tool-features").ToolType.EXPERIENCE_SHARE | import("D:/Health/src/types/tool-features").ToolType.HEALTH_TOPIC | import("D:/Health/src/types/tool-features").ToolType.SUCCESS_STORY | import("D:/Health/src/types/tool-features").ToolType.SUPPORT_GROUP | import("D:/Health/src/types/tool-features").ToolType.LIVE_STREAM | import("D:/Health/src/types/tool-features").ToolType.COMMUNITY_EVENT | import("D:/Health/src/types/tool-features").ToolType.AI_COACH | import("D:/Health/src/types/tool-features").ToolType.EXPERT_CONSULT | import("D:/Health/src/types/tool-features").ToolType.VIP_CONTENT | import("D:/Health/src/types/tool-features").ToolType.PREMIUM_TOOLS | import("D:/Health/src/types/tool-features").ToolType.PERSONAL_TRAINER | import("D:/Health/src/types/tool-features").ToolType.DIET_CONSULTANT | import("D:/Health/src/types/tool-features").ToolType.TCM_CONSULTANT | import("D:/Health/src/types/tool-features").ToolType.HEALTH_COURSE | import("D:/Health/src/types/tool-features").ToolType.DATA_ANALYSIS | import("D:/Health/src/types/tool-features").ToolType.PREMIUM_PLAN;
  /** onToolPress 的描述 */
    onToolPress: tool: ToolType  void;
  onReorder: tools: ToolType  void;
  style: any;
}

export const QuickToolBar: React.FC<IQuickToolProps> = ({
  tools,
  onToolPress,
  onReorder,
  style,
}) => {
  const theme = useTheme();

  const renderTool = ({ item, drag, isActive }) => (
    <TouchableOpacity
      onLongPress={drag}
      onPress={() => onToolPress(item)}
      style={[
        styles.toolItem,
        isActive && styles.toolItemActive,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <Surface style={styles.iconContainer}>
        <Icon name={item.icon} size={24} color={theme.colors.primary} />
      </Surface>
      <Text style={stylestoolName} numberOfLines={1}>
        {itemname}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <DraggableFlatList
        data={tools}
        renderItem={renderTool}
        keyExtractor={item => item.type}
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
