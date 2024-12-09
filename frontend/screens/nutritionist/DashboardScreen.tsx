import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { getDashboardOverview } from '../../api/nutritionist';
import {
  DashboardCard,
  AppointmentList,
  ConsultationList,
  StatisticsChart,
  LoadingSpinner
} from '../../components';

export const DashboardScreen = () => {
  const { data, isLoading } = useQuery('dashboardOverview', getDashboardOverview);

  if (isLoading) return <LoadingSpinner />;

  const { todayAppointments, pendingConsultations, weekStats, incomeStats } = data?.data || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardRow}>
        <DashboardCard
          title="今日预约"
          value={todayAppointments?.length || 0}
          icon="calendar"
          color="#2E7D32"
        />
        <DashboardCard
          title="待处理咨询"
          value={pendingConsultations?.length || 0}
          icon="message-square"
          color="#1976D2"
        />
      </View>

      <StatisticsChart
        title="本周预约统计"
        data={weekStats}
        xAxisLabel="星期"
        yAxisLabel="预约数"
        style={styles.chart}
      />

      <StatisticsChart
        title="收入统计"
        data={incomeStats}
        xAxisLabel="月份"
        yAxisLabel="金额(元)"
        type="bar"
        style={styles.chart}
      />

      <View style={styles.listContainer}>
        <AppointmentList
          title="今日预约"
          appointments={todayAppointments}
          style={styles.list}
        />

        <ConsultationList
          title="待处理咨询"
          consultations={pendingConsultations}
          style={styles.list}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  chart: {
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15
  },
  listContainer: {
    padding: 15
  },
  list: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15
  }
}); 