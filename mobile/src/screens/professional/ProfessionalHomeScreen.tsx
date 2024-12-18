import React from 'react';

import { AppLayout } from '../../components/layout/AppLayout';
import { AppointmentCalendar } from '../../components/professional/AppointmentCalendar';
import { Card, Text, useTheme, Button } from 'react-native-paper';
import { ClientList } from '../../components/professional/ClientList';
import { MetricsOverview } from '../../components/professional/MetricsOverview';
import { ScrollView, StyleSheet, View } from 'react-native';

export const ProfessionalHomeScreen = () => {
  const theme = useTheme();

  return (
    <AppLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>专业工作台</Text>
        </View>

        <Card style={styles.metricsCard}>
          <Card.Content>
            <MetricsOverview />
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日预约</Text>
          <AppointmentCalendar />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的客户</Text>
          <ClientList />
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
});
