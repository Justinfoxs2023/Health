import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';
import { AppLayout } from '../../components/layout/AppLayout';
import { GoalSetting } from '../../components/plan/GoalSetting';
import { MilestoneEditor } from '../../components/plan/MilestoneEditor';
import { ScheduleBuilder } from '../../components/plan/ScheduleBuilder';

export const PlanEditScreen = () => {
  const theme = useTheme();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 保存计划逻辑
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>编辑计划</Text>
        </View>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>目标设定</Text>
            <GoalSetting />
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>里程碑</Text>
            <MilestoneEditor />
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>日程安排</Text>
            <ScheduleBuilder />
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button 
            mode="contained"
            loading={saving}
            onPress={handleSave}
            style={styles.button}
          >
            保存计划
          </Button>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actions: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
}); 