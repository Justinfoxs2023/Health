import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useUser } from '../../hooks/useUser';
import { HealthStatus } from '../../components/HealthStatus';
import { UserStats } from '../../components/UserStats';

export const HomeScreen = () => {
  const { user, loading, refresh } = useUser();
  const theme = useTheme();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>欢迎回来, {user?.username}</Text>
        <HealthStatus />
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <UserStats userId={user?.id} />
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最近活动</Text>
        {/* 添加活动列表组件 */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsCard: {
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
}); 