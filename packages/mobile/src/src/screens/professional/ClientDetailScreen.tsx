import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, Button, Avatar } from 'react-native-paper';
import { AppLayout } from '../../components/layout/AppLayout';
import { HealthMetrics } from '../../components/client/HealthMetrics';
import { ProgressChart } from '../../components/client/ProgressChart';
import { PlanOverview } from '../../components/client/PlanOverview';

export const ClientDetailScreen = () => {
  const theme = useTheme();

  return (
    <AppLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Avatar.Image size={80} source={{ uri: 'client-avatar-url' }} />
          <Text style={styles.name}>张三</Text>
          <Text style={styles.subtitle}>会员等级: VIP</Text>
        </View>

        <Card style={styles.metricsCard}>
          <Card.Content>
            <HealthMetrics />
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>进度追踪</Text>
          <ProgressChart />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>计划概览</Text>
          <PlanOverview />
        </View>

        <View style={styles.actions}>
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => {/* 导航到计划编辑页面 */}}
          >
            调整计划
          </Button>
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => {/* 导航到反馈页面 */}}
          >
            发送反馈
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
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  metricsCard: {
    margin: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 